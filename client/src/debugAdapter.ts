// this is EXTERNAL to vscode
// i.e. we do not have access to vscode apis, because this
// is running separately in node

import * as s from 'net';


const PORT_NUM = 9999;
var client = s.connect(PORT_NUM, 'localhost', () => {
    console.error("debugAdapter connected")
});

client.on('data', (buff) => {
    const content : String = buff.toString('utf-8');
    console.log(content, " from tcp\n");
})

client.on('error', (err) => {
    console.log("Error!");
    console.log(err);
})

process.stdin.on('data', (buff) => {
    const content : String = buff.toString('utf-8');
    client.write(content + " from VSCode\n")
})