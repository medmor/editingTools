import { Injectable } from '@angular/core';

import { ipcRenderer, webFrame } from 'electron';
import * as remote from '@electron/remote';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as StreamZip from "node-stream-zip";

@Injectable({
    providedIn: 'root'
})
export class ElectronService {
    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    remote: typeof remote;
    childProcess: typeof childProcess;
    fs: typeof fs;
    path: typeof path;
    streamZip: typeof StreamZip;


    get isElectron(): boolean {
        return !!(window && window.process && window.process.type);
    }

    constructor() {

        if (this.isElectron) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
            this.path = window.require('path');
            this.streamZip = window.require('node-stream-zip');

            this.remote = window.require('@electron/remote');
        }


    }
}
