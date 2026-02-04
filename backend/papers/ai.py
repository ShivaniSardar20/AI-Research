import json
import requests
from django.conf import settings


def call_openrouter(prompt: str, system: str = "") -> str:
    """
    Send a prompt to OpenRouter and return the assistant's text reply.
    Raises on HTTP / parse errors.
    """
    headers = {
        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ai-research.local",
        "X-Title": "AI Research",
    }

    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": messages,
        "temperature": 0.4,
        "max_tokens": 2048,
    }

    res = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload, timeout=60)
    res.raise_for_status()

    data = res.json()
    return data["choices"][0]["message"]["content"]
