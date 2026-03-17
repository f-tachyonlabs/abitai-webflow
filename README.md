# AbitAI Landing Page

Static Webflow-exported landing page for AbitAI, a WhatsApp-first real estate guidance experience focused on helping buyers find apartments with more clarity and less pressure.

## Project Overview

This repository contains the exported front-end for the AbitAI marketing site, including:

- Hero section with background video and brand messaging
- Simulated chat experience presenting AbitAI as an "Especialista Imobiliario"
- Problem and solution sections explaining the buyer journey
- Feature/value proposition cards
- Footer with company contact information

The site is implemented as a static export and does not require a build step.

## Structure

- `index.html`: main landing page
- `css/`: Webflow and project stylesheets
- `js/`: Webflow runtime script
- `images/`: responsive image assets and branding
- `fonts/`: local font files
- `videos/`: hero background video assets

## Local Preview

Because this is a static site, you can preview it with any simple local server.

Example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

The repository includes a GitHub Actions workflow for GitHub Pages. After pushing this repository to GitHub:

1. Open the repository settings.
2. Go to `Pages`.
3. Set the source to `GitHub Actions`.
4. Push to `main`.

The workflow will publish the static site automatically.

## Notes

- This is a Webflow export, so most layout and interaction code is generated.
- External assets/scripts are loaded from Google Fonts, Webflow CDN, jQuery CDN, and GSAP CDN.
