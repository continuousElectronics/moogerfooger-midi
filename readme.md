# Moogerfooger MIDI

This application (built with Electron) provides an interface to send midi messages to
[Moogfooger pedals](https://www.moogmusic.com/products/Moogerfoogers)
 that can receive them. You can also save and open setups which provides a method for having presets for certain contexts.

## Install

### Mac

Download dmg [here](https://github.com/continuousElectronics/moogerfooger-midi/raw/master/releases/Moogerfooger%20Midi.dmg)

Other platforms coming soon...

### Usage

* for continuous controls (level, time, feedback etc...) you can adjust by the most granular amount by selecting the range control and using the up / down or forward / back keys

* "Send All Messages" button will send all of the selected settings on your current setup.

* When the Delay Clock Sync is on, the continuous time control is disabled

* When the LFO Clock Sync is on, the continuous LFO Rate control is disabled

* You can open, close and save file setups. The setups will save with .json extension automatically

* You can use the built in MIDI clock or an external source. (ex: if you have a DAW open and this app you can just setup your DAW clock to send to the same MIDI output the app is sending to)

* Moog instruction manuals (in this repo under /_misc) give full details on what each setting does