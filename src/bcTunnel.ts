
import { Server,Socket } from "socket.io";
interface IUrlSet{
    port:Number,
    httpUrl:string
}

interface IUrlSetError{
    type:string,
    port:Number,
    reason:string
}

interface IUrlGetAll{
    ports:IUrlSet[]
}

let interval:NodeJS.Timer
const io = new Server({ /* options */ });
let tmoleSocket:Socket;
function addPort(port:Number){
    tmoleSocket.emit("addPort", { "port": port})

}

function getAllPorts()
{
    tmoleSocket.emit("getAllPorts", null);
}

function removePort(port:Number)
{
    tmoleSocket.emit("removePort", { "port": port})
}

type onUrlSetCallback= (data:IUrlSet) => void
let onUrlSetFunc:onUrlSetCallback

type onUrlSetErrorCallback=(data:IUrlSetError) => void
let onUrlSetErrorFunc:onUrlSetErrorCallback

type onAllPortsCallback=(data:IUrlGetAll)=> void
let onGetAllPortsFunc:onAllPortsCallback



//function 
 function onUrlSet(func:onUrlSetCallback)
 {
    onUrlSetFunc=func
 }

 function onUrlSetError(func:onUrlSetErrorCallback)
 {
    onUrlSetErrorFunc=func
 }

 function onAllPorts(func:onAllPortsCallback)
 {
    onGetAllPortsFunc=func
 }

 
io.on("connection", (socket) => {
    // ...
    tmoleSocket = socket;
    tmoleSocket.on("urlSet", (data:IUrlSet) => {
        if (data.httpUrl) {
            console.log("urlSet", data);
            onUrlSetFunc(data);
        }
    });

    tmoleSocket.on("urlSetError", (data:IUrlSetError) => {
        onUrlSetErrorFunc(data)
        switch (data.type) {
            case "urlFetchFailed":
                console.log("reason ", data.reason);
                break;
        }
    });

    tmoleSocket.on("allPorts", (data:IUrlGetAll) => {
        console.log("All ports", data);
        onGetAllPortsFunc(data)
    });

    tmoleSocket.on("error",(data)=>{
        console.log("ERROR");
    });
    

    interval = setInterval(() => {
        if (tmoleSocket.connected)
            tmoleSocket.emit("ping", "");
        else
            clearInterval(interval);
    }, 3000);
    getAllPorts()
});


io.listen(101);
export {addPort,getAllPorts,removePort,onUrlSet,onUrlSetError,onAllPorts}