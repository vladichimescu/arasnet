import esbuild from "esbuild"

const define = {}
for (const env in process.env) {
  define[`process.env.${env}`] = JSON.stringify(process.env[env])
}

esbuild.build({
  entryPoints: ["src/server.js"],
  outfile: "dist/index.mjs",
  platform: "node",
  format: "esm",
  bundle: true,
  minify: true,
  define,
})
