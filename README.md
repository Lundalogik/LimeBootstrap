# Lime Bootstrap

For usage docs, please visit [lime-bootstrap.com](https://www.lime-bootstrap.com)

## Development
```bash
npm install
npm run serve
```

We are using Babel to transpile and [brunch.io](https://brunch.io) to bundle.

[Jest](https://facebook.github.io/jest/) is used for tests: `npm run test`

[Eslint](https://eslint.org) is our linter overlord. We are using a slightly modified version of [Airbnbs style](https://github.com/airbnb/javascript/).

Using VSCode with eslint (dbaeumer.vscode-eslint) and jest (Orta.vscode-jest) extensions are recommended.


## Creating a release
1. Create a build
```bash
npm install
npm run build
```
2. Upload the dist folder to github as a release with semantic versioning as the tag.

3. Manually update download link in `docs/theme/partials/tabs.html`
4. Upload the docs `npm run publish-docs`

## Docs
The docs are built with [Mkdocs](https://www.mkdocs.org) with the [material theme](https://squidfunk.github.io/mkdocs-material/). Mkdocs requires Python and we are using 3.6 to build


Install into a venv or not
```bash
$ pip install -r docs/requirement.txt
```

Serving the docs locally with `npm run docs`

Publishing docs to Github-pages (requires push access to repo) `npm run publish-docs`

