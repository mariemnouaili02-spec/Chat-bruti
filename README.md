Funny Face Maker (in this repo)

A tiny, dependency-free web GUI that makes a silly face, tells jokes, dances, and throws confetti. Open `index.html` in your browser to try it.

Features
- `Random Face` — generate a silly expression.
- `Tell me a joke` — shows a short joke (two styles available).
- `Make it dance` — toggles a dancing animation.
- `Confetti!` — shows a lightweight confetti animation.
- `Dialect` — switch between `Standard` and an `Unprofessional` (playful/slang) dialect for messages and button labels.

How to run

- Open the file directly (double-click `index.html` or from PowerShell):

```powershell
start .\index.html
```

- Or run a simple local server (works well for some browsers):

```powershell
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

Notes
- No build step or external libs required — just static files.
- Tested on modern browsers (Chrome, Edge, Firefox).

Files
- `index.html` — main UI
- `styles.css` — styling and simple animations
- `script.js` — interactivity, sound effects, export-to-PNG, and recorded-sound rendering

Recorded sounds (new)
- Click `Generate & Download Sounds` to render the current synthesized sounds into short WAV files and automatically download them: `click.wav`, `drumroll.wav`, and `applause.wav`.
- After generating, the app will use the rendered WAV buffers for playback (they act like recorded effects). You can also keep the downloaded WAV files for reuse.
- If you prefer the live-synthesized sounds, just don't generate; the app will synthesize in real-time instead.

Notes about browser behavior
- Generating audio uses `OfflineAudioContext` and may require a reasonably modern browser (Chrome, Edge, Firefox). The browser may require a user gesture before creating/starting audio contexts.

AI Emoji Generator
- Use the `AI Emoji Generator` section in the app to create emoji representations for popular characters from films, series, and cartoons.
- Choose a `Category` (Films / Series / Cartoons) and click `Generate AI Emojis` — the UI will display emoji strings representing each character. Click an entry to copy the emoji to clipboard.
- Use `Download Emojis` to save a tab-separated text file with character names and emoji strings.

Notes
- The generator is a lightweight, rule-based 'AI' that chooses emoji motifs based on character names and common keywords. It doesn't call external APIs, so results are deterministic and run offline in your browser.

Custom lists, creative mode, and custom sounds
- **Custom list**: Paste your own list of character names into the "Custom character list" textarea (one per line), or upload a `.txt` file with one name per line. When present, the generator will use your list instead of the built-in examples.
- **Creative mode**: Toggle the "Creative mode" checkbox to produce more varied and randomized emoji combinations; the generator will add extra playful emoji and shuffle selections.
- **Custom sounds**: You can upload your own audio files (WAV/MP3/OGG) to replace the click, drumroll, and applause sounds. Use the three file inputs in the AI Emoji Generator section to load them — they decode in the browser and are used for subsequent playback.

LLM integration
- If you enable `Use LLM` and provide an OpenAI-compatible API key, you can click `Generate via LLM` to have the model return richer emoji outputs. The app expects the model to return a JSON array; the code attempts to parse the model's reply and falls back to the local generator when necessary.

Want changes? Tell me what silly features to add (more jokes, sound effects, emoji masks, etc.).