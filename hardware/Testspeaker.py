import subprocess
import time
import threading

INDOOR_SPEAKER_CARD = 3
OUTDOOR_SPEAKER_CARD = 4
AUDIO_DEVICE = 0

def play_audio(file, card, device=AUDIO_DEVICE):
    subprocess.run(["aplay", "-D", f"plughw:{card},{device}", file])

def play_dual_audio(file):
    t1 = threading.Thread(target=play_audio, args=(file, INDOOR_SPEAKER_CARD))
    t2 = threading.Thread(target=play_audio, args=(file, OUTDOOR_SPEAKER_CARD))
    t1.start()
    t2.start()
    t1.join()
    t2.join()

print("🔊 测试室内音响...")
play_audio("Audios/doorbell.wav", INDOOR_SPEAKER_CARD)
time.sleep(1)

print("🔊 测试室外音响...")
play_audio("Audios/doorbell.wav", OUTDOOR_SPEAKER_CARD)
time.sleep(1)

print("🔊 测试两个音响同时播放...")
play_dual_audio("Audios/doorbell.wav")
