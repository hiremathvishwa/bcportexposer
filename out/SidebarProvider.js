"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarProvider = void 0;
const vscode = require("vscode");
const bcTunnel_1 = require("./bcTunnel");
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
let portMapping = new Map();
let portErrorTable = new Map();
//javascript .map function -> takes a list -> iterates list.map() , 
//let portUrlMap = new Map()
//portUrlMap.set() +1,.....n
//portUrlMap.map((kv) => {return ( <li> kv.key , kv.valu <button> X</button> </li>)})
class SidebarProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        this.isAssigning = false;
        this.addPortBtnText = 'Add Port';
        this.addPortBtnState = '';
        setTimeout(() => { (0, bcTunnel_1.getAllPorts)(); }, 2000);
    }
    resolveWebviewView(webviewView) {
        this._view = webviewView;
        let flag = true;
        //port isAssigning port false
        //create enum{200:success,400:server error,111:processing}
        (0, bcTunnel_1.onAllPorts)((data) => {
            flag = true;
            for (let i = 0; i < data.ports.length; i++) {
                let current = data.ports[i];
                portMapping.set(current.port, current.httpUrl);
            }
            this.updateWebviewContent(webviewView.webview, true); //here flag should be true
        });
        (0, bcTunnel_1.onUrlSet)((data) => {
            portMapping.set(data.port, data.httpUrl);
            //isAssigning port is false
            this.isAssigning = false;
            vscode.window.showInformationMessage(`Port Mapping Success: ${data.port}`);
            this.updateWebviewContent(webviewView.webview, true);
        });
        (0, bcTunnel_1.onUrlSetError)((data) => {
            portMapping.set(data.port, "x");
            portErrorTable.set(data.port, data.type);
            vscode.window.showErrorMessage(`Port Mapping Failure: ${data.port},Reason:${data.reason}`);
            this.isAssigning = false;
            this.updateWebviewContent(webviewView.webview, true);
        });
        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        // webviewView.webview.html = this.getWebviewContent(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                //change userInput to addPort and storedInput to portToAdd--------Done
                //if(portMapping.has(portToAdd) then show warning message)--------Done
                //try and learn httpget and httppost in JavaScript
                //icon------------------------------------------------------------Done
                case 'addPort': {
                    //portMapping.set(storedInput,"12123");
                    let portToAdd = message.value; // Store the received user input, value comes in message.value
                    if (portMapping.has(portToAdd)) {
                        console.log(' Warning Message sent to extension that port is already added:', portToAdd); // Log the message
                        vscode.window.showWarningMessage(`Warning:Port already added ${portToAdd}`);
                        break;
                    }
                    this.isAssigning = true;
                    (0, bcTunnel_1.addPort)(portToAdd);
                    //isAssigning port=true
                    this.isAssigning = true;
                    this.updateWebviewContent(webviewView.webview, true);
                    break;
                }
                case 'removePort': {
                    const portToRemove = Number(message.value);
                    /*   if(!portMapping.has(portToRemove))
                       {
                          console.log('Warning-Port not found:',portToRemove);
                          vscode.window.showMessage(`Port not found:${portToRemove}`);
                       }*/
                    (0, bcTunnel_1.removePort)(portToRemove);
                    portMapping.delete(portToRemove);
                    vscode.window.showInformationMessage(`Port Removed:${portToRemove}`);
                    this.updateWebviewContent(webviewView.webview, true);
                    break;
                }
                case 'handleLinkClick': {
                    const { key, value } = message;
                    try {
                        vscode.window.showErrorMessage(`Error while handling link: ${key}`);
                    }
                    catch (error) {
                        vscode.window.showErrorMessage(`Error while handling link: ${error}`);
                    }
                    break;
                }
            }
        });
        //webviewView.webview.html = this.getWebviewContent(webviewView.webview);
        this.updateWebviewContent(webviewView.webview, false); //here flag should be false
    }
    //flag that tells loaded or not--->put this flag in updateContentView parameters
    updateWebviewContent(webview, loadState) {
        let newHtml = '';
        if (loadState) {
            newHtml = this.getWebviewContent(webview);
        }
        //`<p> Loading ... >/p>`
        else {
            newHtml = `<p> Loading...</p>`;
        }
        webview.html = newHtml;
    }
    revive(panel) {
        this._view = panel;
    }
    generateListItems() {
        let listItems = '';
        for (const [key, value] of portMapping.entries()) {
            listItems += ` <li>
        <div class="list-item-container">
        <div>${key}:${value === "x" ?
                `<p>${portErrorTable.get(key)}</p>`
                :
                    `<a href="${value}" onclick="handleLinkClick(event, '${key}', '${value}')">${value}</a>`}
          </div>
        <button onClick="removePort('${key}')" style="min-width:25px;width:25px;"> X</button>
        </div>
      </li>`;
            console.log(listItems);
        }
        return listItems;
    }
    getWebviewContent(webview) {
        /* const styleResetUri = webview.asWebviewUri(
           vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
         );*/
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        const styleCssPath = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css'));
        const vsCssPath = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        /*const styleMainUri = webview.asWebviewUri(
          vscode.Uri.joinPath(this._extensionUri, "out", "compiled/sidebar.css")
        );*/
        const listItems = this.generateListItems();
        let addPortBtnHtml = '';
        this.addPortBtnText = this.isAssigning ? 'Assigning Port...' : 'Add Port';
        this.addPortBtnState = this.isAssigning ? 'disabled' : '';
        addPortBtnHtml += `
    <div class="list-item-container">
        <button id="submitBtn" ${this.addPortBtnState}>${this.addPortBtnText}</button>
        <input type="text" id="addPort" ${this.addPortBtnState} placeholder="Enter a value"/>
    </div>
`;
        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();
        return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .list-item-container {
                display: flex;
                align-items: center; /* Center items vertically */
                justify-content: space-between; 
                margin-bottom: 10px;
              }

              .list-item-container button {
                margin-left: 10px; 
              }

        </style>
        <link href="${styleCssPath}" rel="stylesheet">
        <link href="${vsCssPath}" rel="stylesheet">
    </head>
    <body>
        <h3>Exposed Ports</h3>

        <ul> 
        

       ${listItems}
        
        </ul>
       ${addPortBtnHtml}

        <script nonce="${nonce}" src="${scriptUri}">
      
        </script>
    </body>
    </html>
`;
    }
}
exports.SidebarProvider = SidebarProvider;
//# sourceMappingURL=SidebarProvider.js.map