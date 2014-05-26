/// <reference path="../node/node.d.ts" />

declare module 'tsd-def-tree' {
	import Repo = require('tsd-repo');

	class DefTree {
		repo: Repo;
		constructor(repo: Repo);
		getTree(): NodeJS.ReadableStream;
	}

	export = DefTree;
}
