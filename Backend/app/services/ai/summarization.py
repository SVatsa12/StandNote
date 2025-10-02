import requests
import json

def summarize_transcript(transcript: str) -> str:
    if not transcript.strip():
        return "[No content found in the uploaded file.]"

    MAX_LENGTH = 2000  # Limit characters sent to LLM to prevent timeout
    trimmed_transcript = transcript[:MAX_LENGTH]

    prompt = f"Summarize this meeting transcript:\n\n{trimmed_transcript}"

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "llama3", "prompt": prompt},
        stream=True
    )

    summary = ""
    for line in response.iter_lines():
        if line:
            try:
                data = json.loads(line.decode("utf-8"))
                summary += data.get("response", "")
            except json.JSONDecodeError:
                continue

    print("[DEBUG] Final generated summary:", summary)
    return summary
