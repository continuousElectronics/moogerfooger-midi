const inDev = process.env.NODE_ENV === "development";

if (inDev) { 
    require("electron-reload")(__dirname); 
}

// requiring easymidi in main process since it it not available in browser window
global.easymidi = require("easymidi");

const { app, BrowserWindow, Menu, powerSaveBlocker } = require("electron");

let mainWindow;

// powerSaveBlocker.start("prevent-app-suspension");

app.setName("Moogerfooger Midi");

app.on("ready", () => {

    mainWindow = new BrowserWindow({
        width: 1217,
        height: 768
    });

    mainWindow.webContents.on("will-navigate", (e) => {
        e.preventDefault();
    });
    
    Menu.setApplicationMenu(
        Menu.buildFromTemplate(template)
    );

    mainWindow.loadURL(`file://${__dirname}/build/index.html`);
});

const template = [
    {
        label: "File",
        submenu: [
            {
                label: "Open Setup",
                accelerator: process.platform === "darwin" ? "Cmd+O" : "Ctrl+O",
                click() {
                    mainWindow.webContents.send("open");
                }
            },
            {
                type: "separator"
            },
            {
                label: "Save Setup",
                accelerator: process.platform === "darwin" ? "Cmd+S" : "Ctrl+S",
                click() {
                    mainWindow.webContents.send("save");
                }
            },
            {
                label: "Save Setup As",
                accelerator: process.platform === "darwin" ? "Cmd+Shift+S" : "Ctrl+Shift+S",
                click() {
                    mainWindow.webContents.send("save-as");
                }
            },
            {
                type: "separator"
            },
            {
                label: "Close Setup",
                accelerator: process.platform === "darwin" ? "Cmd+W" : "Ctrl+W",
                click() {
                    mainWindow.webContents.send("close");
                }
            },
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
                label: "Quit" + " " + app.getName(),
                accelerator: "Cmd+Q",
                click() {
                    mainWindow.webContents.send("quit");
                }
            }
        ]
    });

    template[2].submenu = [
        {
            label: "Minimize",
            accelerator: "Cmd+M",
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
} else {
    template[0].submenu.push(
        {
            type: "separator"
        },
        {
            label: "Quit" + " " + app.getName(),
            accelerator: "Ctrl+Q",
            click() {
                mainWindow.webContents.send("quit");
            }
        }
    );
}

if (inDev) { 
    template.push(
        {
            label: "Dev Tools",
            submenu: [
                {
                    label: "open dev tools",
                    accelerator: process.platform === "darwin" ? "Cmd+Option+I" : "Ctrl+Option+I",
                    click() {
                        mainWindow.webContents.openDevTools();
                    }
                },
            ]
        }
    );
}