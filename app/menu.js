"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMenu = void 0;
var electron_1 = require("electron");
function createMenu(win) {
    var menu = electron_1.Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                {
                    label: '<--',
                    click: function () { electron_1.app.emit('menu-back'); }
                },
                {
                    label: 'Reload',
                    click: function () {
                        win.reload();
                    }
                },
                {
                    label: 'Exit',
                    click: function () {
                        electron_1.app.quit();
                    }
                }
            ]
        }
    ]);
    electron_1.Menu.setApplicationMenu(menu);
}
exports.createMenu = createMenu;
//# sourceMappingURL=menu.js.map