# Darklight — TaleSpire Symbiote

A native [TaleSpire Symbiote](https://symbiote-docs.talespire.com/) — an animated countdown timer for torches and light spells in Shadowdark.

![Version](https://img.shields.io/badge/version-0.6.0-orange)
![Platform](https://img.shields.io/badge/platform-TaleSpire-blue)
![License](https://img.shields.io/badge/license-personal%20use-lightgrey)

## What It Does

Darklight tracks your torch or light spell duration with atmospheric animated visuals:

- **Light Torch** — animated flame with a CSS black-and-white scene; flame state machine: igniting → full → mid → low → dark (extinguished)
- **Cast Light Spell** — glowing staff orb; state machine: igniting → glowing → dim → dark
- Both modes run a 60-minute countdown timer
- Controls: ±1/±5 minute adjust, play/pause, stop (with confirmation)
- On extinguish: darkness overlay fades in, then reloads after 5 seconds

The symbiote opens as a popup window inside TaleSpire.

## Installation

### From mod.io (recommended)

Open TaleSpire → Community Mods → Symbiotes → search "Darklight" → Install.

### Manual

1. Download the latest zip from [mod.io](https://mod.io/g/talespire) or [Releases](../../releases)
2. Extract to your TaleSpire Symbiotes directory:
   - **macOS**: `~/Library/Application Support/com.bouncyrock.talespire/Symbiotes/torchlight-timer/`
   - **Windows**: `%AppData%\..\LocalLow\BouncyRock Entertainment\TaleSpire\Symbiotes\torchlight-timer\`
3. Open TaleSpire — the symbiote appears in your Symbiotes panel automatically

## Usage

Click Darklight in your Symbiotes panel to open it as a popup. Choose **Light Torch** or **Cast Light Spell** to start the timer. Click anywhere on screen to show/hide controls.

## Credits

Symbiote by **Jeremy Fabre**.

## Releasing to mod.io

```bash
./deploy-modio.sh              # auto-bump patch
./deploy-modio.sh --version 1.0.0   # explicit version
```
