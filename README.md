# Torchlight Timer — TaleSpire Symbiote

A [TaleSpire Symbiote](https://symbiote-docs.talespire.com/) that wraps the [Torchlight Timer](https://torchlighttimer.com) — an animated countdown timer for torches and light spells in TTRPGs.

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![Platform](https://img.shields.io/badge/platform-TaleSpire-blue)
![License](https://img.shields.io/badge/license-personal%20use-lightgrey)

## What It Does

Torchlight Timer tracks your torch or light spell duration with atmospheric animated visuals:

- **Light Torch** — animated flame burns yellow → orange → red as time runs out, then extinguishes
- **Cast Light Spell** — glowing staff with ambient sound
- Pause, stop, ±1/±5 minute adjustments
- **Hardcore Mode** — hides the timer; only the flame color tells you how much time is left
- Mute/unmute ambient audio

The symbiote opens as a popup window inside TaleSpire, running the full torchlighttimer.com experience.

## Installation

### From mod.io (recommended)

Open TaleSpire → Community Mods → Symbiotes → search "Torchlight Timer" → Install.

### Manual

1. Download the latest zip from [mod.io](https://mod.io/g/talespire) or [Releases](../../releases)
2. Extract to your TaleSpire Symbiotes directory:
   - **macOS**: `~/Library/Application Support/com.bouncyrock.talespire/Symbiotes/torchlight-timer/`
   - **Windows**: `%AppData%\..\LocalLow\BouncyRock Entertainment\TaleSpire\Symbiotes\torchlight-timer\`
3. Open TaleSpire — the symbiote appears in your Symbiotes panel automatically

## Usage

Click the Torchlight Timer in your Symbiotes panel to open it as a popup. Choose **Light Torch** or **Cast Light Spell** to start the timer. Click anywhere on screen to show/hide controls.

## Credits

Timer and visuals by [Torchlight Timer](https://torchlighttimer.com), presented by the [Creative Adventure Tables Facebook group](https://facebook.com/groups/170975073841254).

Symbiote wrapper by **Jeremy Fabre**.

## Releasing to mod.io

```bash
./deploy-modio.sh              # auto-bump patch
./deploy-modio.sh --version 1.0.0   # explicit version
```
