"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAllPorts = exports.onUrlSetError = exports.onUrlSet = exports.removePort = exports.getAllPorts = exports.addPort = void 0;
const socket_io_1 = require("socket.io");
let interval;
const io = new socket_io_1.Server({ /* options */});
let tmoleSocket;
function addPort(port) {
    tmoleSocket.emit("addPort", { "port": port });
}
exports.addPort = addPort;
function getAllPorts() {
    tmoleSocket.emit("getAllPorts", null);
}
exports.getAllPorts = getAllPorts;
function removePort(port) {
    tmoleSocket.emit("removePort", { "port": port });
}
exports.removePort = removePort;
let onUrlSetFunc;
let onUrlSetErrorFunc;
let onGetAllPortsFunc;
//function 
function onUrlSet(func) {
    onUrlSetFunc = func;
}
exports.onUrlSet = onUrlSet;
function onUrlSetError(func) {
    onUrlSetErrorFunc = func;
}
exports.onUrlSetError = onUrlSetError;
function onAllPorts(func) {
    onGetAllPortsFunc = func;
}
exports.onAllPorts = onAllPorts;
io.on("connection", (socket) => {
    // ...
    tmoleSocket = socket;
    tmoleSocket.on("urlSet", (data) => {
        if (data.httpUrl) {
            console.log("urlSet", data);
            onUrlSetFunc(data);
        }
    });
    tmoleSocket.on("urlSetError", (data) => {
        onUrlSetErrorFunc(data);
        switch (data.type) {
            case "urlFetchFailed":
                console.log("reason ", data.reason);
                break;
        }
    });
    tmoleSocket.on("allPorts", (data) => {
        console.log("All ports", data);
        onGetAllPortsFunc(data);
    });
    tmoleSocket.on("error", (data) => {
        console.log("ERROR");
    });
    interval = setInterval(() => {
        if (tmoleSocket.connected)
            tmoleSocket.emit("ping", "");
        else
            clearInterval(interval);
    }, 3000);
    getAllPorts();
});
io.listen(101);
//# sourceMappingURL=bcTunnel.js.map