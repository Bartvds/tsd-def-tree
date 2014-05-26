/// <reference path="../typings/tsd.d.ts" />
var path = require('path');

var through2 = require('through2');
var semver = require('semver');

var defExtExp = /\.d\.ts$/;
var semverExp = /(.+?)(?:-v?)(\d+(?:\.\d+)*(?:-[a-z]+)?)$/i;
var twoNumsExp = /^\d+\.\d+$/;

function getDefs() {
    return through2.obj(function (blob, enc, callback) {
        if (defExtExp.test(blob.path)) {
            var base = path.basename(blob.path).replace(defExtExp, '');
            var parts = blob.path.split(/\/|\\/g);
            if (parts.length === 1) {
                parts[0] = parts[0].replace(defExtExp, '');
            }

            var def = {
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

            // seriously cool
            Object.freeze(def);

            this.push(def);
        }
        callback();
    });
}

module.exports = getDefs;
//# sourceMappingURL=index.js.map
