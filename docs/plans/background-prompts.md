# Background clips and startup film — prompts (Google Flow or Adobe Firefly)

## Which model (Firefly's list)
- **Scroll background (the paper clips below): Kling 3.0.** Scrubbing smoothness depends on how many frames there are.
  Kling 3.0 can do 4K at 60 fps for up to 15 s (900 frames). Veo 3.1 tops out at 8 s at 24 fps (about 190 frames), so
  scrubbing a long page shows steps. In Kling 3.0, set **4K · 60 fps · 10–15 s · Frames: first + last**. If Kling won't
  take both frames, use Veo 3.1 at 4K instead.
- **Startup film: Veo 3.1 at 4K.** It has the best grasp of cinematic direction, light and physical realism, and it
  takes first and last frames. Set **4K · 24 fps · 8 s · Audio off**.
- Ray3.14 HDR (Luma) is the runner-up for both. Its HDR output gives the most room to grade to the site's exact paper
  colours. Runway Gen-4.5 and Seedance 2.5 are also strong, but neither beats the two above for these shots.
- In any model: choose the highest resolution and fps it offers, and always supply both the first and last frame.

---

## Startup film (replaces the current 3D intro)
Meaning: everything you've learnt in the four units, drawn as ink threads by one amber light, converges and settles
onto the page. The film's last frame is **Still 1**, the same sheet of paper the scroll background starts on, so the
intro hands off into the site with no visible cut.

### Still 5 — film opening frame (`intro-first.png`)
```
Near-black 16:9 frame of deep warm umber shadow (#17140F), never pure black. In the exact centre a single small, soft amber point of light (#E6873F) glows like a distant desk-lamp filament seen through faint haze, with a gentle bloom around it and a few out-of-focus dust motes catching its glow. Photorealistic, 35mm-equivalent lens, very shallow depth of field, fine film grain, subtle vignette. Empty, quiet, expectant.
```

### Film A — ends light (`intro-light.mp4`) — Veo 3.1, 4K, 8 s, audio off. Frames: first = Still 5, last = Still 1
```
One continuous shot with no cuts, 35mm-equivalent lens, slow and steady camera.
[00:00-00:02] Near darkness. A single warm amber point of light glows at the centre of the frame like a desk-lamp filament seen through haze; tiny dust motes drift slowly through its soft beam.
[00:02-00:04] The camera begins a slow, gentle dolly forward. Hair-thin lines of dark ink appear in the air around the light and draw themselves like threads, linking softly glowing points into four loose constellations that float at different depths with gentle parallax.
[00:04-00:06] The four constellations drift together and slowly settle downward. The amber glow broadens and warms into soft late-afternoon window light, and the ink threads come to rest on a surface below.
[00:06-00:08] The camera eases into a locked-off overhead view of a single sheet of warm cream cotton paper filling the frame, lit by soft window light from the upper left. The ink threads dissolve into the paper's faint fibres until the sheet is completely empty and still.
Photorealistic and cinematic: shallow depth of field, a gentle bloom on the amber light only, fine film grain, a subtle vignette, a muted palette of ink, cream and amber. The mood is quiet resolve: the calm, hopeful moment when everything you have learned finally connects. No text, no people, no hands. Silence.
```

### Film B — ends dark, optional (`intro-dark.mp4`) — same settings. Frames: first = Still 5, last = Still 3
Use Film A's prompt, but replace the `[00:04-00:06]` and `[00:06-00:08]` lines with:
```
[00:04-00:06] The four constellations drift together and slowly settle downward. The amber glow lowers and pools like a small desk lamp just off the lower left, and the ink threads come to rest on a surface below.
[00:06-00:08] The camera eases into a locked-off overhead view of a single sheet of dark warm-brown handmade paper filling the frame at night, a soft pool of amber lamplight at its lower left fading into deep umber shadow. The ink threads dissolve into the paper's fibres until the sheet is completely empty and still.
```
If you skip Film B, the dark theme plays Film A and crossfades its last second into the dark paper.

Put these in the same folder as the others: `intro-first.png`, `intro-light.mp4`, and optionally `intro-dark.mp4`.
Size: I make 1080p, 1440p and 4K versions, and each screen loads only the one it needs. The film plays once a day,
can be skipped with Esc or a click, shows its last frame on Motion: Calm, and is skipped entirely on Motion: Off or
reduced motion.

---

# Background clips — Google Flow prompts

Goal: a calm paper-and-light background that moves only as you scroll. Scrolling down plays the clip
forward and scrolling up plays it backward, so the motion has to be slow, even and one-way. That's why
each clip starts and ends on a still you make first.

## Settings in Flow
- Model: **Kling 3.0 at 4K · 60 fps · 10–15 s** in Firefly (smoothest scrubbing, see "Which model" above). In Flow, or
  if Kling won't take two frames: **Veo 3.1 – Quality** (or **Veo 3.1 – Fast**), 16:9, 8 seconds, 1–2 outputs.
  "Over the eight seconds" in the clip prompts below then becomes the clip's actual length.
- Video mode: **Frames to video**, with the two stills below as the first and last frame.
- Stills: make them in Flow's image tool (Nano Banana Pro). Make the "end" still by **editing** the start still,
  so it's the same sheet of paper.
- Download the videos at **1080p** (upscale) and the stills as PNG. Audio doesn't matter; I strip it.
- If an output has flicker, a camera move, or anything appearing, pick the other one or regenerate.

## Where to put them
`~/Downloads/studysite-bg/`, with these exact names:

| File | What |
| --- | --- |
| `bg-light-start.png` | Still 1 |
| `bg-light-end.png` | Still 2 |
| `bg-light.mp4` | Clip 1 |
| `bg-dark-start.png` | Still 3 |
| `bg-dark-end.png` | Still 4 |
| `bg-dark.mp4` | Clip 2 |

---

## Still 1 — light, start (`bg-light-start.png`)
```
Overhead macro photograph of a single sheet of warm cream cotton rag paper filling the entire 16:9 frame edge to edge; no paper edges, desk or background visible. Soft, diffuse late-afternoon window light falls from the upper left, and a very soft, wide shadow gradient gently darkens the right third of the sheet. Subtle laid-paper texture, faint natural fibres and tiny inclusions, extremely low contrast. Colour palette: cream #FBF7F0, oat #F4EEE3 and linen #EAE2D3, with only a whisper of pale amber in the brightest area. Completely empty paper with nothing on it. Photorealistic, medium-format camera, 100mm macro lens, f/8, everything in soft even focus.
```

## Still 2 — light, end (`bg-light-end.png`) — edit Still 1
```
Keep this exact sheet of paper, its texture, fibres, colour and framing identical. Only move the light: the soft window light now falls from the upper right, and the gentle, wide shadow gradient now sits on the left third of the sheet. Everything else stays the same.
```

## Clip 1 — light (`bg-light.mp4`) — Frames to video: first = Still 1, last = Still 2
```
Locked-off overhead macro shot of the same sheet of warm cream cotton paper filling the frame; the camera stays perfectly still. Over the eight seconds the soft window light glides slowly and evenly from the left side of the paper to the right, like a thin cloud drifting past the sun, and the wide shadow edge stays soft the whole time. Paper fibres catch the light faintly as it passes. The motion is slow, constant and smooth from start to finish, with steady exposure and the paper completely empty. Calm, quiet, meditative mood. Silence.
```

## Still 3 — dark, start (`bg-dark-start.png`)
```
Overhead macro photograph of a single sheet of dark, warm-brown handmade paper filling the entire 16:9 frame edge to edge; no paper edges, desk or background visible. It is night, and a single small amber desk lamp just off-frame at the lower left casts a soft, wide pool of warm amber light that fades gently into deep umber shadow across the rest of the sheet. Colour palette: deep umber #17140F, dark walnut #1F1B15 and #2A241C, with a low, muted amber glow #E6873F only in the lit area; the shadows stay rich brown. Fine paper fibres and a subtle handmade texture catch the lamplight. Completely empty paper with nothing on it. Photorealistic, medium-format camera, 100mm macro lens, f/8, everything in soft even focus.
```

## Still 4 — dark, end (`bg-dark-end.png`) — edit Still 3
```
Keep this exact sheet of paper, its texture, fibres, colour and framing identical. Only move the light: the soft amber pool of lamplight now sits at the lower right of the sheet, fading gently into deep umber shadow everywhere else. Everything else stays the same.
```

## Clip 2 — dark (`bg-dark.mp4`) — Frames to video: first = Still 3, last = Still 4
```
Locked-off overhead macro shot of the same sheet of dark warm-brown paper at night; the camera stays perfectly still. Over the eight seconds the soft pool of amber lamplight drifts slowly and evenly from the lower left of the paper to the lower right, its edge staying soft and wide, while the deep umber shadows stay calm and steady. Fine fibres glint faintly as the light passes. The motion is slow, constant and smooth from start to finish, with steady exposure and the paper completely empty. Quiet, lamp-lit, meditative mood. Silence.
```

---

## What I do with them
I re-encode each clip so every frame can be jumped to instantly (that's what makes scroll-scrubbing smooth
rather than choppy), grade it to the site's exact paper colours, keep it under ~1.5 MB, and lay a paper
layer over it so text contrast never drops. It loads after the page text and pauses when the tab is hidden.
Motion Calm shows the still with no scrubbing, Motion Off shows plain paper, and so does reduced motion.
Until your files arrive, the site uses a still paper background with no gradient rings.
