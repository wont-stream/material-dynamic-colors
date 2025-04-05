Bun.build({
  entrypoints: ["src/build.ts"],
  outdir: "dist",
  target: "browser",
  minify: true,
})