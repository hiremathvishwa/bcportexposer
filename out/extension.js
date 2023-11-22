"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const SidebarProvider_1 = require("./SidebarProvider");
// @ts-ignore
const ConfigParser = require("@webantic/nginx-config-parser");
function activate(context) {
    const sidebarProvider = new SidebarProvider_1.SidebarProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("bcportexp-sidebar", sidebarProvider));
    vscode.commands.registerCommand('newbcsunday.helloWorld', () => {
        // Read and parse the .bcport file
        ///  const filePath = path.join(context.extensionPath, 'dummy.bcport');
        //const fileContent = fs.readFileSync(filePath, 'utf-8');
        //const keyValuePairs = fileContent.split('\n').map(line => line.trim());
    });
    // console.log(`${}`);
    var parser = new ConfigParser();
    console.log(`${parser}`);
    // parse straight from file. by default, will try to resolve includes
    var config = parser.readConfigFile('C:\\Users\\Vishwanath B Hiremat\\Downloads\\Accenture for 2024 Batch\\Accenture 2023\\newbcport\\newbcsunday\\example.conf');
    let configNew = parser.parse(config);
    console.log(`${configNew}`);
    vscode.window.showInformationMessage(`${configNew}`);
    // to keep deterministic behaviour, set parseIncludes = false in the options
    // var configWithoutIncludes = parser.readConfigFile('/C:\\Users\\Vishwanath B Hiremat\\Downloads\\Accenture for 2024 Batch\\Accenture 2023\\newbcport\\newbcsunday\\example.conf', { parseIncludes: false })
    // console.log(`${configWithoutIncludes}`);
    // write direct to file (overwriting existing one)
    // parser.writeConfigFile('/C:\\Users\\Vishwanath B Hiremat\\Downloads\\Accenture for 2024 Batch\\Accenture 2023\\newbcport\\newbcsunday\\example.conf', config, true)
    var sampleConfig = {
        "server": {
            "server_name": "_",
            "location /": {
                "try_files": "*.html"
            }
        }
    };
    // to multi-line config string
    var configString = parser.toConf(sampleConfig);
    // and back again
    var configJson = parser.toJSON(configString);
    // shorthand (will change object --> string and string --> object)
    parser.parse(configString);
}
exports.activate = activate;
// Activating extension 'undefined_publisher.newbcsunday' failed: Cannot find module '@webantic/nginx-config-parser' Require stack: - c:\Users\Vishwanath B Hiremat\Downloads\Accenture for 2024 Batch\Accenture 2023\newbcport\newbcsunday\out\extension.js - c:\Users\Vishwanath B Hiremat\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\loader.js - c:\Users\Vishwanath B Hiremat\AppData\Local\Programs\Microsoft VS Code\resources\app\out\bootstrap-amd.js - c:\Users\Vishwanath B Hiremat\AppData\Local\Programs\Microsoft VS Code\resources\app\out\bootstrap-fork.js - .
//server { listen 4000; listen [::]:4000; location /static/ { proxy_pass http://127.0.0.1:3000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection 'upgrade'; proxy_set_header Host $host; proxy_cache_bypass $http_upgrade; } location / { proxy_pass http://127.0.0.1:3000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection 'upgrade'; proxy_set_header Host $host; proxy_cache_bypass $http_upgrade; } location /listen_6000/ { proxy_pass http://127.0.0.1:6000; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection 'upgrade'; proxy_set_header ..
//# sourceMappingURL=extension.js.map