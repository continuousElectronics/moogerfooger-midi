const { app, BrowserWindow, Menu } = require("electron");

// Let electron reloads by itself when webpack watches changes in ./app/
require("electron-reload")(__dirname);

// To avoid being garbage collected
let mainWindow;

app.on("ready", () => {

    mainWindow = new BrowserWindow({ 
        width: 1200, 
        height: 768 
    });

    const menu = Menu.buildFromTemplate(template);

    // Menu.setApplicationMenu(menu);
    mainWindow.loadURL(`file://${__dirname}/dist/index.html`);

});

let template = [
    {
        label: "File",
        submenu: [
            {
                label: "Save",
                click() {
                    console.log("clicked");
                }
            },
            {
                label: "Save As",
                click() {
                    console.log("clicked");
                }
            },
            {
                type: "separator"
            },
            {
                label: "Quit",
                click() {
                    app.quit();
                },
            }
        ]
    },
    {
        label: "Window",
        submenu: [
            {
                role: "minimize"
            },
            {
                role: "close"
            }
        ]
    }
];

if (process.platform === "darwin") {

    template.unshift({
        label: app.getName(),
        submenu: [
            {
                role: "about"
            },
            {
                type: "separator"
            },
            {
                role: "services",
                submenu: []
            },
            {
                type: "separator"
            },
            {
                role: "hide"
            },
            {
                role: "hideothers"
            },
            {
                role: "unhide"
            },
            {
                type: "separator"
            },
            {
                role: "quit"
            }
        ]
    });
    // template.push({
    //     label: "Window"
    // });
    template[2].submenu = [
        {
            label: "Minimize",
            accelerator: "CmdOrCtrl+M",
            role: "minimize"
        },
        {
            label: "Zoom",
            role: "zoom"
        },
        {
            type: "separator"
        },
        {
            label: "Bring All to Front",
            role: "front"
        }
    ];
}