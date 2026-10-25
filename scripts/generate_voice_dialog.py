import os
import subprocess
import json
import wave

OUTPUT_DIR = '/Users/angrove/.gemini/antigravity/scratch/angrove-landing/public/audio'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Snappy 20-25s high-converting dialog
DIALOG = [
    {
        "id": 1,
        "speaker": "robot",
        "name": "AI-администратор",
        "roleBadge": "Робот",
        "text": "Здравствуйте, Алексей! Клиника Дента. Вы оставляли заявку на профгигиену. Подскажите, вам сейчас удобно?",
        "voice": "ru-RU-SvetlanaNeural",
        "pitch": "+0Hz",
        "rate": "+10%"
    },
    {
        "id": 2,
        "speaker": "client",
        "name": "Клиент (Алексей)",
        "roleBadge": "Клиент",
        "text": "Да, здравствуйте! А сколько стоит и когда можно прийти?",
        "voice": "ru-RU-SvetlanaNeural",
        "pitch": "-30Hz",
        "rate": "+0%"
    },
    {
        "id": 3,
        "speaker": "robot",
        "name": "AI-администратор",
        "roleBadge": "Робот",
        "text": "По акции три тысячи пятьсот рублей. Есть свободное окно в эту субботу в одиннадцать тридцать. Записать вас?",
        "voice": "ru-RU-SvetlanaNeural",
        "pitch": "+0Hz",
        "rate": "+10%"
    },
    {
        "id": 4,
        "speaker": "client",
        "name": "Клиент (Алексей)",
        "roleBadge": "Клиент",
        "text": "Да, отлично, давайте в субботу в одиннадцать тридцать!",
        "voice": "ru-RU-SvetlanaNeural",
        "pitch": "-30Hz",
        "rate": "+0%"
    },
    {
        "id": 5,
        "speaker": "robot",
        "name": "AI-администратор",
        "roleBadge": "Робот",
        "text": "Супер, записала! Доктор Смирнова, суббота в одиннадцать тридцать. Подтверждение уже в вашем WhatsApp. Ждем вас!",
        "voice": "ru-RU-SvetlanaNeural",
        "pitch": "+0Hz",
        "rate": "+10%"
    }
]

EDGE_TTS_BIN = '/Users/angrove/Library/Python/3.14/bin/edge-tts'

def generate():
    transcripts = []
    current_time = 0.0
    pause_sec = 0.4 # 400ms conversational response latency (< 0.4s!)

    sr = 24000
    silence_samples = int(sr * pause_sec)
    silence_bytes = b'\x00\x00' * silence_samples

    all_pcm_bytes = bytearray()

    for item in DIALOG:
        mp3_path = f"/tmp/line_{item['id']}.mp3"
        wav_path = f"/tmp/line_{item['id']}.wav"
        
        cmd = [
            EDGE_TTS_BIN,
            '--voice', item['voice'],
            '--pitch', item['pitch'],
            '--rate', item['rate'],
            '--text', item['text'],
            '--write-media', mp3_path
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error on line {item['id']}:", res.stderr)
            return

        subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16@24000', '-c', '1', mp3_path, wav_path], check=True)

        with wave.open(wav_path, 'rb') as w:
            n_frames = w.getnframes()
            dur = n_frames / sr
            pcm = w.readframes(n_frames)

        start_time = round(current_time, 2)
        end_time = round(current_time + dur, 2)

        transcripts.append({
            "id": item["id"],
            "speaker": item["speaker"],
            "name": item["name"],
            "roleBadge": item["roleBadge"],
            "text": item["text"],
            "startTime": start_time,
            "endTime": end_time
        })

        all_pcm_bytes.extend(pcm)
        all_pcm_bytes.extend(silence_bytes)
        current_time = end_time + pause_sec

    # Write combined WAV
    master_wav = '/tmp/master_dialog.wav'
    with wave.open(master_wav, 'wb') as mw:
        mw.setnchannels(1)
        mw.setsampwidth(2)
        mw.setframerate(sr)
        mw.writeframes(bytes(all_pcm_bytes))

    # Convert to M4A (universal browser AAC) and WAV
    final_m4a = os.path.join(OUTPUT_DIR, 'ai_call_dialog.m4a')
    final_wav = os.path.join(OUTPUT_DIR, 'ai_call_dialog.wav')
    
    subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', master_wav, final_m4a], check=True)
    subprocess.run(['cp', master_wav, final_wav], check=True)

    # Save transcripts metadata
    json_path = '/Users/angrove/.gemini/antigravity/scratch/angrove-landing/src/data/voice_call_transcript.json'
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({
            "duration": round(current_time, 2),
            "dialog": transcripts
        }, f, ensure_ascii=False, indent=2)

    print("Success! Created snappy 5-replica dialog:")
    print(" - Total Duration:", round(current_time, 1), "seconds")
    print(" - Files:", final_m4a, final_wav)
    print(" - Metadata:", json_path)

if __name__ == '__main__':
    generate()
