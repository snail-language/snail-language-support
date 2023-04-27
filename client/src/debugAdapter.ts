// this is EXTERNAL to vscode
// i.e. we do not have access to vscode apis, because this
// is running separately in node

import * as f from 'fs';
import * as s from 'net';
import * as path from 'path';

// FIXME debugging
const base = path.join(__dirname, "../../");
const response_file = `${base}/stderr.txt`;
const sent_file = `${base}/stdin.txt`;
f.writeFileSync(response_file, 'Debug Output\n');
f.writeFileSync(sent_file, 'Debug Input\n');


const PORT_NUM = 9999;
// start our socket client
var client = s.connect(PORT_NUM, 'localhost', () => {
    f.appendFileSync(response_file, "debugAdapter connected\n")
});

client.on('data', (buff) => {
    const content : String = buff.toString('utf-8');
    console.log(content);
    f.appendFileSync(response_file, content.toString() + "\n");
})

client.on('error', (err) => {
    f.appendFileSync(response_file, "Error!\n");
    f.appendFileSync(response_file, err.toString() + "\n");
})


// register input from vscode
process.stdin.on('data', (buff) => {
    const content : String = buff.toString('utf-8');
    client.write(content.toString());
    f.appendFileSync(sent_file, content.toString() + "\n");
})
