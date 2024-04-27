var name = "muying-rollupvue";
var version = "1.0.0";
var description = "muying components rollupvue";
var main = "index.js";
var scripts = {
	dev: "rollup -wc rollup.config.dev.js",
	build: "rollup -c rollup.config.dev.js",
	"build:prod": "rollup -c rollup.config.prod.js"
};
var keywords = [
];
var author = "muying <2479377049@qq.com>";
var license = "ISC";
var devDependencies = {
	"@babel/core": "^7.24.4",
	"@babel/node": "^7.23.9",
	"@babel/preset-env": "^7.24.4",
	"@rollup/plugin-babel": "^6.0.4",
	"@rollup/plugin-commonjs": "^25.0.7",
	"@rollup/plugin-json": "^6.1.0",
	"@rollup/plugin-node-resolve": "^15.2.3",
	"rollup-plugin-terser": "^7.0.2",
	rollup: "^2.35.1"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	scripts: scripts,
	keywords: keywords,
	author: author,
	license: license,
	devDependencies: devDependencies
};

console.log(pkg, 'pkg');
