/// <reference path="../typings/tsd.d.ts" />

import fs = require('fs');
import path = require('path');
import assert = require('assert');

import through2 = require('through2');
import semver = require('semver');
import Repo = require('./repo');

var defExtExp = /\.d\.ts$/;
var semverExp = /(.+?)(?:-v?)(\d+(?:\.\d+)*(?:-[a-z]+)?)$/i;
var twoNumsExp = /^\d+\.\d+$/;

interface Blob {
	path: string;
	size: number;
}

interface Def extends Blob {
	project: string;
	name: string;
	semver?: string;
}

class Tree {

	private source: Repo;

	constructor(repo: Repo) {
		assert(!!repo, 'pass a repo instance');
		this.source = repo;
	}

	getDefs(): NodeJS.ReadableStream {
		return this.source.getTree().pipe(through2.obj(function (blob: Blob, enc: string, callback: () => void) {
			if (defExtExp.test(blob.path)) {
				var base = path.basename(blob.path).replace(defExtExp, '');
				var parts = blob.path.split(/\/|\\/g);
				if (parts.length === 1) {
					parts[0] = parts[0].replace(defExtExp, '');
				}

				var def: Def = {
					path: blob.path,
					size: blob.size,
					project: parts[0],
					name: base
				};

				semverExp.lastIndex = 0;
				var semMatch = semverExp.exec(base);
				if (semMatch) {
					var sem = semMatch[2];
					if (twoNumsExp.test(sem)) {
						sem += '.0';
					}
					if (semMatch.length > 2) {
						sem += semMatch[2];
					}

					var valid = semver.valid(sem, true);
					if (valid) {
						def.name = semMatch[1];
						def.semver = semMatch[2];
					}
				}
				this.push(def);
			}
			callback();
		}));
	}
}

export = Tree;
