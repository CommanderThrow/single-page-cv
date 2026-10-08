## Welcome

My CV/Resume as a single static page, generated from one data file.
Live at [Aaron's CV/Resume](https://commanderthrow.github.io/single-page-cv/).

## Updating the resume

All content lives in [`resume.json`](resume.json). Edit it, then:

```sh
npm run build
```

and open `dist/index.html` in a browser. Use `npm run dev` to rebuild automatically on every save.

Removing a section (or leaving its list empty) removes it from the page.

There are no dependencies to install; it only needs Node 20.11 or newer.

## How it fits together

- `resume.json` - the content
- `src/render.mjs` - turns the content into HTML
- `src/styles.css` - screen and print styles (prints on one A4 page)
- `build.mjs` - writes the finished site to `dist/`

## Publishing

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and deploys it to GitHub Pages.
The repository's Pages source must be set to "GitHub Actions" (Settings -> Pages).
