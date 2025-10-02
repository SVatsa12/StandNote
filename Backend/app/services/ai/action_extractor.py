import requests
import json

def extract_action_items(transcript: str) -> list:
    payload = {
        "model": "llama3",
        "prompt": f"Extract clear, actionable items from this transcript:\n\n{transcript}"
    }

    response = requests.post("http://localhost:11434/api/generate", json=payload, stream=False)

    if response.status_code == 200:
        try:
            # Handle multi-line JSON (Ollama might stream responses)
            lines = response.text.strip().splitlines()
            final = json.loads(lines[-1])  # Use last complete JSON object
            return final["response"].strip().split('\n')
        except Exception as e:
            raise RuntimeError(f"Error parsing Ollama response: {e}")
    else:
        raise RuntimeError(f"Ollama action extraction failed: {response.text}")
