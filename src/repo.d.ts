/// <reference path="../typings/tsd.d.ts" />

interface Repo {
	getTree(): NodeJS.ReadableStream;
	getBlob(file: string): NodeJS.ReadableStream;
	getHistory(file: string): NodeJS.ReadableStream;
}
export = Repo;
