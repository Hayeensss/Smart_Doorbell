import subprocess
import time

def play_audio_on_device(wav_file, card, device):
    """调用 aplay 播放指定音频到指定设备"""
    cmd = [
        "aplay",
        "-D", f"plughw:{card},{device}",
        wav_file
    ]
    subprocess.run(cmd)

# 第一个音响：card 1, device 0
play_audio_on_device("audio1.wav", card=2, device=0)

# 停 3 秒
time.sleep(3)

# 第二个音响：card 2, device 0
play_audio_on_device("audio2.wav", card=3, device=0)
