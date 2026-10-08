## Welcome

My CV/Resume as a single static page, generated from one data file.
Live at [Aaron's CV/Resume](https://commanderthrow.github.io/single-page-cv/).

## How it fits together

- `resume.json` - the content
- `src/render.mjs` - turns the content into HTML
- `src/styles.css` - screen and print styles (prints on one A4 page)
- `build.mjs` - writes the finished site to `dist/`

Run `npm run build` to generate the site, or `npm run dev` to rebuild on every save. It needs Node 20.11 or newer and has no dependencies to install.

## Saving as PDF

Open the page in a browser and print it to PDF. The print styles fit everything on one A4 page.

## Publishing

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages.
The repository's Pages source must be set to "GitHub Actions" (Settings -> Pages).

## Reuse

Feel free to fork this and use the code as a template for your own CV.
The content in `resume.json` is my own, so please replace it with yours.
