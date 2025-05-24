# Hardware Setup

This document outlines the hardware setup and behavior of the smart doorbell system.

The smart doorbell system is designed for **automatic, headless operation**. Once powered and connected to Wi-Fi during initial setup, the device will boot up, connect to the network, and run its core services **entirely on its own** without user intervention. It automatically recovers from power loss and handles common exceptions like upload failures gracefully. This makes the system highly reliable and ideal for unattended, long-term use in real-world environments.


## 1. Initial Wi-Fi Configuration

Before deployment, the device must be connected to a Wi-Fi network.

- **Method**: Connect a monitor via **HDMI**, and attach a **USB keyboard and mouse** to the Raspberry Pi.
- On boot, access the desktop or terminal.
- Use the GUI or the command line to configure the Wi-Fi (e.g., via `raspi-config` or `nmcli`).
- Once connected, the network credentials will be saved for future automatic reconnection.

After initial setup, HDMI and input devices can be removed.

## 2. Power and Boot Behavior

The system is designed for **fully automatic operation** after the initial setup.

- When powered on, it **automatically boots**, connects to Wi-Fi, and starts required services (e.g., `myproject.service` and `autostart.sh`).
- No user interaction is needed after power-up.
- The system is robust to **power interruptions**:
  - If unplugged or loses power, it will **reboot and resume all operations** once power is restored.

## 3. File Upload and Error Handling

Captured files (photos or videos) are uploaded to the cloud. If an upload fails:

- The system **retries up to 5 times automatically**.
- If all retries fail, the file is saved **locally** to the `Record/` directory on the SD card.
- These files can be manually retrieved later.

## 4. Manual Program Execution

To manually run the program (e.g., for debugging), you must first stop the automatic service to avoid conflicts, especially with the camera module.

```bash
sudo systemctl stop myproject.service
