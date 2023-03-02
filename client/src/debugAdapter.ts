// this is EXTERNAL to vscode
// i.e. we do not have access to vscode apis, because this
// is running separately in node

import * as s from 'net';
import * as f from 'fs';

// FIXME debugging
const file = '/Users/kangstadt/git/snail-language-support/stderr.txt'
const file2 = '/Users/kangstadt/git/snail-language-support/stdin.txt'
f.writeFileSync(file, 'Debug Output\n');
f.writeFileSync(file2, 'Debug Input\n');


const PORT_NUM = 9999;
// start our socket client
var client = s.connect(PORT_NUM, 'localhost', () => {
    f.appendFileSync(file, "debugAdapter connected\n")
});

client.on('data', (buff) => {
    const content : String = buff.toString('utf-8');
    console.log(content);
    f.appendFileSync(file, content.toString());
})

client.on('error', (err) => {
    f.writeFileSync(file, "Error!\n");
    f.writeFileSync(file, err.toString());
})


// register input from vscode
process.stdin.on('data', (buff) => {
    const content : String = buff.toString('utf-8');
    client.write(content + " from VSCode\n")
    f.writeFileSync(file2, content.toString());
})
