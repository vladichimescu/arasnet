import esbuild from "esbuild"
import esbuildPluginNoexternal from "esbuild-plugin-noexternal"

const define = {}
for (const env in process.env) {
  define[`process.env.${env}`] = JSON.stringify(process.env[env])
}

esbuild.build({
  entryPoints: ["src/index.js"],
  outfile: "dist/server.js",
  platform: "node",
  format: "esm",
  bundle: true,
  minify: true,
  plugins: [
    esbuildPluginNoexternal([
      "@arasnet/functions",
      "@arasnet/i18n",
      "@arasnet/types",
    ]),
  ],
  define,
})
