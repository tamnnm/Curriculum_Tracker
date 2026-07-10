# Google Site Setup Guide
### PhD Learning Dashboard — for teacher visibility

---

## What you're building

A single Google Site with 4 sections:
- **Home** — overview / welcome for the teacher
- **Calendar & Deadlines** — embedded Google Calendar showing your schedule and Classroom deadlines
- **Curriculum Progress** — visual tracker (embeddable widget or manual update)
- **Feedback** — a Google Form so the teacher can leave comments

---

## Step 1 — Create the Google Site

1. Go to [sites.google.com](https://sites.google.com) and sign in with your Google account
2. Click the **+** (New site) button (bottom right)
3. Choose **Blank** template
4. Click "Untitled Site" at the top and rename it — e.g. `Tam's PhD Progress`
5. Click the page title (it says "Home" by default) and edit it to something like `Welcome`

---

## Step 2 — Set up your site pages

In the right panel, click the **Pages** tab (looks like a document icon).

Add 3 more pages:
- Click **+ New page** → name it `Calendar & Deadlines`
- Click **+ New page** → name it `Curriculum Progress`
- Click **+ New page** → name it `Teacher Feedback`

You can drag pages to reorder them.

---

## Step 3 — Embed Google Calendar

> This shows your calendar + Google Classroom deadlines in one place (Classroom auto-syncs due dates to Google Calendar).

1. First, make sure **Google Classroom due dates sync to Calendar**:
   - Open Google Classroom → click any class → Settings (gear icon) → scroll to "Show in Google Calendar" and make sure it's ON
   - This syncs all deadlines automatically

2. Go to [calendar.google.com](https://calendar.google.com)
   - Click the **⋮ (three dots)** next to the calendar you want to share → **Settings and sharing**
   - Scroll to **Integrate calendar** → copy the **Embed code** (it's an `<iframe>` tag)

3. In your Google Site, go to the **Calendar & Deadlines** page
   - Click **Insert** (+ icon in the right panel) → **Embed** → **Embed code**
   - Paste the iframe code → click **Next** → **Insert**
   - Resize the embed block to fill the page width

4. To also add a Google Classroom link:
   - Click **Insert** → **Button** → label it `Open Google Classroom` → paste your Classroom URL

---

## Step 4 — Add the Curriculum Progress Tracker

You have two options — pick one or both:

### Option A: Embed the HTML Widget (Claude-built)
> Use the file `curriculum_tracker.html` Claude created for you.

1. Upload `curriculum_tracker.html` to your **Google Drive**
2. Open the file in Drive → click the **⋮ menu** → **Open with** → **Google Sites** won't work directly
   
   **Better method:**
   - Go to [script.google.com](https://script.google.com) → **New project**
   - Delete all existing code and paste the entire content of `curriculum_tracker.html`
   - Click **Deploy** → **New deployment** → Type: **Web app**
   - Set "Who has access" to **Anyone** → click **Deploy**
   - Copy the **Web app URL**
   - In your Google Site → Insert → Embed → **By URL** → paste that URL

### Option B: Use a Google Sheet (easiest for manual editing)
1. Go to [sheets.google.com](https://sheets.google.com) → create a new sheet called `Curriculum Tracker`
2. Set up columns: `Topic | Status | Notes | Last Updated`
   - For Status, use a dropdown: Data → Data validation → List of items: `Not started, In progress, Complete`
3. File → **Share** → copy the shareable link (set to "Anyone with link can view")
4. In your Google Site → Insert → **Sheets** → select your sheet → Insert
5. Resize to fit

**Recommended: do both** — embed the visual HTML widget for the teacher to see nicely, and use a Sheet for your own data entry. The Sheet stays private for editing while the widget is the public-facing view.

---

## Step 5 — Add Teacher Feedback Form

1. Go to [forms.google.com](https://forms.google.com) → **Blank form**
2. Title it: `Feedback for Tam`
3. Add questions like:
   - `What's your feedback on this week's progress?` (Paragraph)
   - `Any concerns or suggestions?` (Paragraph)
   - `Overall, how is progress tracking?` (Linear scale: 1–5)
4. Click **Send** → copy the embed link (`< >` icon) → copy the HTML embed code
5. In your Google Site → **Teacher Feedback** page → Insert → Embed → paste the form embed code

---

## Step 6 — Control who can see your site

1. In Google Sites, click the **Share** button (top right)
2. Under "Published site" settings → choose:
   - **Specific people** → add your teacher's email (they can view but not edit)
   - OR **Anyone with the link** if you're comfortable with that
3. Click **Publish** (top right) → choose a URL slug (e.g. `tams-phd-progress`) → **Publish**
4. Share the published URL with your teacher

---

## Step 7 — Keeping it updated

| What to update | How |
|---|---|
| Curriculum progress | Edit the HTML file (re-deploy) OR update the Google Sheet |
| Calendar deadlines | Auto-syncs from Google Classroom — nothing to do |
| Site layout | Go to sites.google.com and edit anytime |
| Teacher sees changes | Immediately after you save/publish — no action needed |

---

## Tips

- **Navigation bar** is added automatically based on your pages — teachers can click between sections easily
- You can add a **header image** on each page (click the header area → "Change image") to make it feel more personal
- Use **Themes** (Themes tab in right panel) to change colors — pick something clean and readable
- If you want the tracker to be more interactive (teacher can tick boxes), let Claude know and we can build a Google Apps Script version

---

*Guide created by Claude · June 2026*
