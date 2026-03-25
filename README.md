# Prashant Walunj — Resume Website

A modern, animated personal resume website built with Python/Flask for local development and compiled to a static site for GitHub Pages hosting.

---

## Project Structure

```
prashant_resume_site/
├── app.py              # Flask dev server
├── build.py            # Generates static site into docs/
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html      # Jinja2 template (single source of truth)
├── static/
│   ├── css/style.css
│   └── js/main.js
└── docs/               # GitHub Pages output (generated — do not edit manually)
    ├── index.html
    ├── static/
    └── .nojekyll
```

---

## Run Locally (Flask)

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Start dev server
python app.py
```

Open `http://127.0.0.1:5000` in your browser.

---

## Deploy to GitHub Pages

### Step 1 — Build the static site

```bash
python build.py
```

This renders the Flask template to plain HTML, rewrites all paths to be relative, copies assets, and outputs everything into `docs/`.

### Step 2 — Commit and push

```bash
git add docs/
git commit -m "Build static site for GitHub Pages"
git push
```

### Step 3 — Enable GitHub Pages

1. Go to your GitHub repository
2. Click **Settings** > **Pages** (left sidebar)
3. Under **Source**, select:
   - Branch: `main`
   - Folder: `/docs`
4. Click **Save**

Your site will be live at:
```
https://<your-github-username>.github.io/<repository-name>/
```

> **Note:** Every time you update the site content, re-run `python build.py` and push the updated `docs/` folder.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Dev server | Python / Flask 3 |
| Template engine | Jinja2 |
| Static build | Custom `build.py` script |
| Hosting | GitHub Pages (static) |
| Fonts | Google Fonts — Inter |
| Animations | Vanilla CSS & JS |
