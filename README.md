# 💖 HAPPY ANNIVERSARY — INTERACTIVE ROMANTIC SCRAPBOOK & WEBSITE

A romantic, vintage-inspired interactive anniversary website for your girlfriend, inspired by the viral Instagram reel anniversary experience. Featuring a **romantic red and cream aesthetic**, an **interactive password keypad**, **scrapbook Polaroid photo frames**, an **interactive vintage calendar ("The Day It Became Us")**, **21 Reasons Why I Love You flip cards**, an **interactive wax-sealed love letter**, and an **emotional grand finale surprise**.

---

## 🎨 Theme & Design System

- **Palette**:
  - Deep Romantic Red: `#B5122A`
  - Dark Crimson: `#8C1023`
  - Vintage Cream Paper: `#FFF6E9`
  - Soft Blush Pink: `#F8D8E0`
  - Shimmering Gold: `#D8A657`
  - Crisp Polaroid White: `#FFFFFF`
- **Typography**: Playfair Display, Great Vibes, Cormorant Garamond, Poppins
- **Elements**: Scattered background hearts, washi tape stickers, gold wax seals, Polaroid frames with natural tilts, 3D card flips, typewriter reveals.

---

## 🌟 Interactive Features & Sections

### 1. 🔐 Interactive Password Keypad Screen (`PasswordScreen.jsx`)
- Centered vintage card with cream background and floating hearts.
- Custom numeric keypad (1 to 9, Clear, 0, Backspace).
- 4 password slots filled with pulsing red hearts as numbers are entered.
- **Configurable Passcode**: Set in `src/data/config.js` (Default: `2211` for November 22).
- Wrong pin triggers gentle card shake animation with hint.
- Correct pin triggers confetti burst, cinematic flash, sound chime, and smoothly unlocks the website!

### 2. 💌 Main Anniversary Home (`Home.jsx`)
- Title: *"Happy Anniversary, My Love ❤️"*
- Subtitle: *"Every moment with you is a little piece of forever."*
- Floating centerpiece Polaroid photo with gold washi tape.
- 5 quick navigation cards jumping smoothly to any section:
  - 📅 **The Day It Became Us**
  - 💌 **Our Love Letter**
  - 📸 **Our Memories**
  - 💖 **21 Reasons Why I Love You**
  - 🎁 **My Surprise for You**

### 3. 📅 The Day It Became Us — Vintage Scrapbook Calendar (`AnniversaryCalendar.jsx`)
- Beautiful vintage calendar sheet displaying November 2022.
- The special anniversary date (the 22nd) is marked with a glowing, pulsing red heart sticker!
- **Clicking the 22nd reveals**:
  - Confetti blast!
  - Romantic photo memory from that day.
  - Heartwarming message: *"The exact moment you held my hand and whispered forever."*
  - Counter: *"4 Years • 1,461 Days • Countless Smiles • 1 Beautiful Love"*.

### 4. 💌 Our Love Letter & Long Love Letter (`LoveLetter.jsx` & `LongLoveLetterModal.jsx`)
- Wax-sealed interactive envelope.
- Click to break the gold seal: flap opens in 3D perspective and the letter slides out.
- Button: **"Read My Full Letter ❤️"** opens a dedicated full-page letter modal on textured cream paper with red filigree borders, heartfelt multi-paragraph love confession, and one-click copy button.

### 5. 📸 Our Memories Scrapbook (`MemoryGallery.jsx`)
- Polaroid gallery with washi tape accents and subtle random scrapbook tilts.
- Captions, dates, and location stamps.
- Fullscreen slideshow lightbox viewer with next/previous controls.
- **Add Your Own Photos**: Click "Add Your Own Photo 📷" to upload personal photos locally with instant preview!

### 6. 💖 21 Reasons Why I Love You (`ReasonsSection.jsx`)
- Deep romantic red background with cream cards.
- 21 individual 3D flip cards:
  - **Front**: Card number (`#01` to `#21`), cute emoji, "Tap to reveal".
  - **Back**: Handcrafted romantic reason and personal handwritten note!
- Live progress tracker: *"Uncovered: X / 21"*.
- Unlocking all 21 reasons triggers a special celebration confetti blast!

### 7. 🎁 Final Surprise Section (`FinalSurprise.jsx`)
- Giant animated beating heart.
- Emotion typography: *"You're my favorite story, my favorite person and my forever."*
- **"One More Surprise ❤️"** button that reveals an everlasting romantic promise, virtual promise ring, and love vow.
- Option to "Relive From Start ↺" which smoothly resets to the password screen.

### 8. 🎵 Sound Studio & Romantic Audio (`audioEngine.js`)
- Built-in Web Audio API romantic ambient synthesizer that plays gentle acoustic chords with zero external network dependencies.
- Sound toggle on the floating navigation bar to mute/unmute anytime.

---

## ✏️ How to Customize with Your Own Details

All text, passwords, dates, and memories are cleanly organized in `src/data/`:

| File | What to Customize |
|------|-------------------|
| `src/data/config.js` | Change passcode (`password: "2211"`), partner names, anniversary date, and subtitle |
| `src/data/reasons.js` | Edit any of the 21 reasons, sweet notes, or emojis |
| `src/data/memories.js`| Edit dates, titles, locations, and photo URLs for your scrapbook timeline |
| `src/data/letter.js` | Edit the love letter paragraphs, signature, and postscript |

---

## 🚀 How to Run Locally

```bash
cd "c:\Users\Akshaj\Desktop\ai bundle\anniversary 1"
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.  
*(Enter passcode `2211` on the keypad to unlock).*

---

## 📦 Push to GitHub

```bash
cd "c:\Users\Akshaj\Desktop\ai bundle\anniversary 1"
git add .
git commit -m "Create interactive anniversary website inspired by reference reel"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

---

## 🌐 Deploy to Vercel

1. Push your repository to GitHub.
2. Go to **[vercel.com](https://vercel.com)** and click **"Add New Project"**.
3. Import your GitHub repository.
4. Set **Root Directory** to `anniversary 1` (or `./` if repository root).
5. Framework Preset: **Vite** (auto-detected).
6. Click **"Deploy"**. Your live URL will be ready in under 60 seconds!
