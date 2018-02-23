import { effectsMap } from "./js/effect.js";

const 
    { ipcRenderer, remote } = require("electron"),
    fs      = require("fs"),
    path    = require("path"),
    appName = remote.app.getName();

const clearEfxArr = function (vm) {
    for (let effect of vm.effects) {
        effect.component.$destroy();
        effect.component.$el.remove();
    }
    vm.effects = [];
};

const parseIfValidFile = function (data) {
    let effectsArray;

    try {
        effectsArray = JSON.parse(data);
    } catch(e) {
        return false;
    }

    if (!Array.isArray(effectsArray)) {
        return false;
    }

    const effectNames = Array.from(effectsMap.keys());

    for (let effect of effectsArray) {
        if (
            !effectNames.includes(effect.name) ||
            typeof effect.current !== "object" ||
            !Number.isInteger(effect.channel)  ||
            effect.channel < 1                 ||
            effect.channel > 16
        ) {
            return false;
        }
    }

    return effectsArray;
};

const packageEfxForSave = function (effects) {
    let arrayToSave = [];

    for (let effect of effects) {
        arrayToSave.push(
            {
                name:    effect.name,
                current: effect.current,
                channel: effect.channel
            }
        );
    }
    return arrayToSave;
};

const appendFileName = function (filepath = "") {
    remote
        .getCurrentWindow()
        .setTitle(appName + " - " + path.basename(filepath));
};

const openFile = function(vm) {
    remote.dialog.showOpenDialog(files => {
        if (files === undefined) {
            return;
        }
        
        const filepath = files[0];

        fs.readFile(filepath, "utf8", (err, data) => {
            if (err) {
                return remote.dialog.showErrorBox("error", err);
            }
            
            const effects = parseIfValidFile(data);

            if (!effects) {
                return remote.dialog.showErrorBox("error", "invalid or corrupted file");
            }

            clearEfxArr(vm);
            vm.filepath = filepath;
            vm.fileChanged = false;
            appendFileName(filepath);
            

            for (let effect of effects) {
                vm.createEffect(effect.name, effect.current, effect.channel, "fileopen");
            }
        });
    });
};

const saveFile = function (vm, cb) {
    let json = JSON.stringify(packageEfxForSave(vm.effects));

    fs.writeFile(vm.filepath, json, "utf8", (err) => {
        if (err) {
            return remote.dialog.showErrorBox("error", err);
        }
        vm.fileChanged = false;
        if (typeof cb === "function") {
            cb(vm);
        }
    });
};

const saveFileAs = function (vm, cb) {
    remote.dialog.showSaveDialog(filepath => {
        if (filepath === undefined) {
            return;
        }
        
        if (path.extname(filepath) !== ".json") {
            filepath += ".json";
        }
        
        let json = JSON.stringify(packageEfxForSave(vm.effects));

        fs.writeFile(filepath, json, "utf8", (err) => {
            if (err) {
                return remote.dialog.showErrorBox("error", err);
            }
            vm.fileChanged = false;
            if (typeof cb === "function") {
                cb(vm);
            } else if (cb === "keepOpen") {
                vm.filepath = filepath;
                appendFileName(filepath);
            }
        });
    });
};

const askToSave = function (vm, o) {
    remote.dialog.showMessageBox(
        {
            message: "do you want to save the current setup?",
            buttons: ["yes", "no"],
        },
        response => {
            if (response === 0 && typeof o.yes === "function") {
                o.yes(vm, o.after);
            } else {
                o.after(vm);
            }
        }
    );
};

const freshSetup = function (vm) {
    clearEfxArr(vm);
    vm.filepath = undefined;
    vm.fileChanged = false;
    remote.getCurrentWindow().setTitle(appName);
};

const setupMenuListeners = function (vm) {
    ipcRenderer.on("open", e => {
        if (vm.filepath && vm.fileChanged) {
            askToSave(vm, {
                yes:   saveFile,
                after: openFile
            });
        } else if (!vm.filepath && vm.effects.length > 0) {
            askToSave(vm, {
                yes:   saveFileAs,
                after: openFile
            });
        } else {
            openFile(vm);
        }
    });
    
    ipcRenderer.on("save", e => {
        if (vm.filepath) {
            saveFile(vm);
        } else {
            saveFileAs(vm, "keepOpen");
        }
    });
    
    ipcRenderer.on("save-as", e => {
        saveFileAs(vm, "keepOpen");
    });

    ipcRenderer.on("close", e => {
        if (vm.filepath && vm.fileChanged) {
            askToSave(vm, {
                yes:   saveFile,
                after: freshSetup
            });
        } else if (!vm.filepath && vm.effects.length > 0) {
            askToSave(vm, {
                yes:   saveFileAs,
                after: freshSetup
            });
        } else {
            freshSetup(vm);
        }
    });

    ipcRenderer.on("quit", e => {
        if (vm.filepath && vm.fileChanged) {
            askToSave(vm, {
                yes:   saveFile,
                after: () => remote.app.quit()
            });
        } else if (!vm.filepath && vm.effects.length > 0) {
            askToSave(vm, {
                yes:   saveFileAs,
                after: () => remote.app.quit()
            });
        } else {
            remote.app.quit();
        }
    });
};

export { setupMenuListeners };