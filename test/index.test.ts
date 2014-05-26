/// <reference path="../typings/tsd.d.ts" />

import chai = require('chai');

var assert = chai.assert;

import path = require('path');
import findup = require('findup-sync');
import streamTo = require('stream-to-array');

import Tree = require('../src/index');
import FSRepo = require('tsd-repo-fs');

var baseDir = path.join(path.dirname(findup('package.json')), 'test', 'fixtures', 'dir');

describe('basics', () => {

	it('errors on bad repo', () => {
		assert.throw(() => {
			var tree = new Tree(null);
		}, /^pass a repo instance/);
	});

	it('streams tree', (done) => {
		var repo = new FSRepo(baseDir);
		var tree = new Tree(repo);
		var out = tree.getDefs();

		streamTo(out, (err: any, arr: any[]) => {
			if (err) {
				done(err);
				return;
			}
			arr = arr.sort((a: any, b: any) => {
				return a.path > b.path ? 1 : 0;
			});

			var expected = [
				{ path: 'bar/bar-v1.2.3-alpha.d.ts',
					size: 7,
					project: 'bar',
					name: 'bar',
					semver: '1.2.3-alpha' },
				{ path: 'bar/bar.d.ts', size: 7, project: 'bar', name: 'bar' },
				{ path: 'bar/bazz.d.ts', size: 8, project: 'bar', name: 'bazz' },
				{ path: 'foo/foo-0.1.23.d.ts',
					size: 12,
					project: 'foo',
					name: 'foo',
					semver: '0.1.23' },
				{ path: 'foo/foo.d.ts', size: 12, project: 'foo', name: 'foo' },
				{ path: 'hoge/hoge-ultra.fx.d.ts', size: 8, project: 'hoge', name: 'hoge-ultra.fx' }
			];

			assert.deepEqual(arr, expected);

			done();
		});
	});
});
