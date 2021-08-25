import { app, Menu, } from 'electron';
import { BrowserWindow } from 'electron/main';

export function createMenu(win: BrowserWindow) {

  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: '<--',
          click: () => { app.emit('menu-back'); }
        },
        {
          label: 'Reload',
          click() {
            win.reload();
          }
        },
        {
          label: 'Exit',
          click() {
            app.quit();
          }
        }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
}
