var fs = require('fs');
var path = require('path');

export function readFile(relativePath: string) {
    return fs.readFileSync(path.join(__dirname, relativePath), { encoding: 'utf8' });
}