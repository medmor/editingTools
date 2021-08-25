
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ElectronService } from '../electron/electron.service';
import { CourseNodeModel } from '../../models/courseNode.model';
import { Xml2HtmlConverter } from '../../models/odt2html/xml2htmlConverter';


@Injectable({
    providedIn: 'root'
})
export class Odt2htmlIOService {

    currentFilePath = '';
    currentFileName = '';

    xml2htmlConverter = new Xml2HtmlConverter();

    constructor(private electronService: ElectronService) { }

    openOdt(): Observable<{ content: string, figures: Map<string, string>; }> {

        return new Observable((observer) => {
            const dialogOptions = {
                filters: [
                    { name: 'ODT', extensions: ['odt'] }
                ]
            };
            const request = this.electronService.remote.dialog.showOpenDialogSync(undefined, dialogOptions);
            if (request) {

                this.currentFilePath = this.electronService.path.dirname(request[0]);
                this.currentFileName = this.electronService.path.basename(request[0]);

                this.electronService.remote.getCurrentWindow().setTitle(this.currentFileName);

                const zip = new this.electronService.streamZip({ file: request[0] });;

                zip.on('ready', () => {

                    const entries = zip.entries();

                    const content = zip.entryDataSync('content.xml').toString();
                    const figures: Map<string, string> = new Map();
                    for (let entrie in entries) {
                        if (entrie.startsWith("Pictures"))
                            figures.set(
                                this.electronService.path.basename(entrie),
                                "data:png;base64," + Buffer.from(zip.entryDataSync(entrie)).toString('base64'));
                    }

                    observer.next({ content, figures: figures });
                    zip.close();
                });
            }
            else
                observer.error("error" + " No File Choosen");
        });

    }

    saveCourse(file: string): Observable<string> {
        return new Observable((observer) => {
            const dialogOptions = {
                defaultPath: 'untitled',
                filters: [
                    { name: 'JSON', extensions: ['json'] }
                ]
            };
            const path = this.electronService.remote.dialog.showSaveDialogSync(undefined, dialogOptions);
            if (path) {
                this.electronService.fs.writeFile(path, file, (err) => console.log(err));
                this.currentFilePath = this.electronService.path.dirname(path);
                this.currentFileName = this.electronService.path.basename(path);
                observer.next(this.currentFilePath);
            }
            else
                observer.error("error file not saved");
        });
    }
}
