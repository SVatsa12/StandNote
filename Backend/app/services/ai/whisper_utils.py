import whisper
import os
import librosa
import numpy as np
from resemblyzer import VoiceEncoder
from resemblyzer.hparams import sampling_rate
from sklearn.cluster import KMeans

model = whisper.load_model("base")
encoder = VoiceEncoder()

def transcribe_audio(file_path: str) -> dict:
    print(f"[DEBUG] Transcribing file: {file_path}")

    if not os.path.exists(file_path):
        raise FileNotFoundError("Audio file not found")

    try:
        # Step 1: Transcribe with Whisper
        result = model.transcribe(file_path, word_timestamps=True)
        segments = result.get("segments", [])
        if not segments:
            raise Exception("No speech segments found")

        # Step 2: Load audio
        wav, _ = librosa.load(file_path, sr=sampling_rate)

        # Step 3: Get speaker embeddings
        speaker_embeds = []
        valid_indices = []
        for i, seg in enumerate(segments):
            start_sample = int(seg["start"] * sampling_rate)
            end_sample = int(seg["end"] * sampling_rate)
            audio_chunk = wav[start_sample:end_sample]

            if len(audio_chunk) < sampling_rate // 2:
                continue  # skip very short chunks

            embed = encoder.embed_utterance(audio_chunk)
            speaker_embeds.append(embed)
            valid_indices.append(i)

        if len(speaker_embeds) < 2:
            raise Exception("Not enough valid segments for diarization")

        # Step 4: Cluster with KMeans (2 speakers)
        kmeans = KMeans(n_clusters=2, random_state=42).fit(speaker_embeds)
        labels = kmeans.labels_

        # Step 5: Annotate segments with speaker labels
        structured_segments = []
        for j, seg_idx in enumerate(valid_indices):
            seg = segments[seg_idx]
            speaker = f"Person {labels[j] + 1}"
            structured_segments.append({
                "start": f"{seg['start']:.2f}",
                "end": f"{seg['end']:.2f}",
                "speaker": speaker,
                "text": seg["text"].strip()
            })

        # ✅ Use structured segments to construct full_text
        full_text = " ".join([s["text"] for s in structured_segments])

        return {
            "text": full_text,
            "segments": structured_segments
        }

    except Exception as e:
        print("[ERROR] Whisper transcription failed:", str(e))
        raise RuntimeError(f"Transcription failed: {e}")
