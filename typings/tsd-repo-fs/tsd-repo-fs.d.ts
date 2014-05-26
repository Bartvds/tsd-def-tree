/// <reference path="../node/node.d.ts" />

declare module 'tsd-repo-fs' {
	class FSRepo {
		dir: string;

		constructor(dir: string);

		getTree(): NodeJS.ReadableStream;
		getBlob(file: string): NodeJS.ReadableStream;
		getHistory(file: string): NodeJS.ReadableStream;
	}
	export = FSRepo;
}
