import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import { string } from "rollup-plugin-string";
import path from "node:path";
import url from "node:url";

const isWatching = !!process.env.ROLLUP_WATCH;
const sdPlugin = "com.ramnivas.breathe.sdPlugin";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
	input: "src/plugin.ts",
	external: ["speaker", "wav-decoder"],
	output: {
		file: `${sdPlugin}/bin/plugin.js`,
		sourcemap: isWatching,
		sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
			return url.pathToFileURL(path.resolve(path.dirname(sourcemapPath), relativeSourcePath)).href;
		}
	},
	plugins: [
		{
			name: "watch-externals",
			buildStart: function () {
				this.addWatchFile(`${sdPlugin}/manifest.json`);
				this.addWatchFile(`${sdPlugin}/imgs/logo.svg`);
			},
		},
		alias({
			entries: [
				{ find: '@assets', replacement: path.resolve(sdPlugin) },
				{ find: '@sounds', replacement: path.resolve(sdPlugin, 'sounds') },
				{ find: '@imgs', replacement: path.resolve(sdPlugin, 'imgs') }
			]
		}),
		string({
			include: "**/*.svg"
		}),
		typescript({
			mapRoot: isWatching ? "./" : undefined
		}),
		nodeResolve({
			browser: false,
			exportConditions: ["node"],
			preferBuiltins: true
		}),
		commonjs(),
		!isWatching && terser(),
		{
			name: "emit-module-package-file",
			generateBundle() {
				this.emitFile({ fileName: "package.json", source: `{ "type": "module" }`, type: "asset" });
			}
		}
	]
};

export default config;
