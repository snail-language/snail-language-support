// this is EXTERNAL to vscode
// i.e. we do not have access to vscode apis, because this
// is running separately in node

import * as s from 'net';
import * as cp from 'node:child_process';


const PORT_NUM = 9999;

// start our "socket server" (nc -l, snail --debug)
var nc : cp.ChildProcess = cp.spawn('nc', ['-l', PORT_NUM.toString()], {
    stdio: [null, null, null]
});

nc.on('spawn', () => {
    console.log("Successfully spawned socket server!");
})

nc.stdout?.on('data', (buff) => {
    const content : String = buff.toString('utf-8');
    nc.stdin?.write(content + "from nc stdout\n");
});

nc.on('error', (err) => {
    console.log("Error! from netcat");
    console.log(err);
});

// start our socket client
var client = s.connect(PORT_NUM, 'localhost', () => {
    console.error("debugAdapter connected");    
});

client.on('data', (buff) => {
    const content : String = buff.toString('utf-8');
    console.log(content + "from tcp");
})

client.on('error', (err) => {
    console.log("Error! from client");
    console.log(err);
})


// register input from vscode
process.stdin.on('data', (buff) => {
    const content : String = buff.toString('utf-8');
    client.write(content + "from VSCode\n")
})
