import subprocess
import time

def play_audio_on_device(wav_file, card, device):
    """use aplay to play audio on a specific sound card and device."""
    cmd = [
        "aplay",
        "-D", f"plughw:{card},{device}",
        wav_file
    ]
    subprocess.run(cmd)

# first speaker：card 1, device 0
play_audio_on_device("audio1.wav", card=2, device=0)

# stop for 3 seconds
time.sleep(3)

# second speaker：card 2, device 0
play_audio_on_device("audio2.wav", card=3, device=0)
