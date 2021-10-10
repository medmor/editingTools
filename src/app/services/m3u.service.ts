import { Injectable } from '@angular/core';
import { ElectronService } from '.';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class M3uService {
    currentFilePath = '';
    currentFileName = '';

    constructor(private electronService: ElectronService) {}

    openM3uFile(): Observable<any> {
        return new Observable((observer) => {
            const dialogOptions = {
                filters: [{ name: 'M3U', extensions: ['m3u'] }],
            };
            const request = this.electronService.remote.dialog.showOpenDialogSync(undefined, dialogOptions);
            if (request) {
                this.currentFilePath = this.electronService.path.dirname(request[0]);
                const fileName = this.electronService.path.basename(request[0]);
                this.electronService.remote.getCurrentWindow().setTitle(fileName);
                this.electronService.fs.readFile(request[0], (err, file) => {
                    if (err) {
                        observer.error(err);
                    }
                    observer.next(file);
                });
            } else {
                observer.error('error' + ' No File Choosen');
            }
        });
    }

    saveM3uFile(file: any): Observable<string> {
        return new Observable((observer) => {
            const dialogOptions = {
                defaultPath: 'untitled',
                filters: [{ name: 'M3U', extensions: ['m3u'] }],
            };
            const path = this.electronService.remote.dialog.showSaveDialogSync(undefined, dialogOptions);
            if (path) {
                this.electronService.fs.writeFile(path, file, (err) => console.log(err));
                this.currentFilePath = this.electronService.path.dirname(path);
                this.currentFileName = this.electronService.path.basename(path);
                observer.next(this.currentFilePath);
            } else {
                observer.error('error file not saved');
            }
        });
    }
}
