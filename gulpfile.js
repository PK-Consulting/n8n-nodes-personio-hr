const { src, dest } = require('gulp');

function buildIcons() {
	return src('src/**/*.svg').pipe(dest('dist'));
}

function buildJson() {
	return src('src/**/*.json').pipe(dest('dist'));
}

exports['build:icons'] = buildIcons;
exports['build:json'] = buildJson;
exports.default = async function () {
	await buildIcons();
	await buildJson();
};
