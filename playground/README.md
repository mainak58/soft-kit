# soft-kit playground

A throwaway Vite app for previewing components live while you edit them. It
imports component **source** straight from `../src/components`, so every save
hot-reloads instantly — no CLI build or registry regeneration needed.

## Use

```bash
cd playground
npm install      # first time only
npm run dev      # open the printed http://localhost:5173 URL
```

Now edit anything under `src/components/<name>/` in the repo and the browser
updates on save. Wire components into `src/App.tsx` to see them.

## Note — this is a *preview*, not the real output

This path skips the registry generator (which rewrites imports and hoists
`"use client";`). It's perfect for visual iteration, but before publishing,
verify the real generated output with the CLI:

```bash
# from the repo root
npm run build:cli
node cli/dist/index.js update sidebar   # in a sandbox app created with `init`
```
