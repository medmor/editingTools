import { Injectable } from '@angular/core';
import { ElectronService } from '.';
import { CourseNodeModel } from '../models';
import { stringify, parse } from 'flatted';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class EditorService {
    currentFilePath = '';
    currentFileName = '';

    constructor(private electronService: ElectronService) {}

    openCourse(): Observable<CourseNodeModel> {
        return new Observable((observer) => {
            const dialogOptions = {
                filters: [{ name: 'JSON', extensions: ['json'] }],
            };
            const request = this.electronService.remote.dialog.showOpenDialogSync(undefined, dialogOptions);
            if (request) {
                this.currentFilePath = this.electronService.path.dirname(request[0]);
                const fileName = this.electronService.path.basename(request[0]);
                this.electronService.remote.getCurrentWindow().setTitle(fileName);
                this.electronService.fs.readFile(request[0], (err, jsonCourse) => {
                    if (err) {
                        observer.error(err);
                    }
                    observer.next(parse(jsonCourse.toString()));
                });
            } else {
                observer.error('error' + ' No File Choosen');
            }
        });
    }

    saveCourse(course: CourseNodeModel): Observable<string> {
        return new Observable((observer) => {
            const dialogOptions = {
                defaultPath: 'untitled',
                filters: [{ name: 'JSON', extensions: ['json'] }],
            };
            const path = this.electronService.remote.dialog.showSaveDialogSync(undefined, dialogOptions);
            if (path) {
                this.electronService.fs.writeFile(path, stringify(course), (err) => console.log(err));
                this.currentFilePath = this.electronService.path.dirname(path);
                this.currentFileName = this.electronService.path.basename(path);
                observer.next(this.currentFilePath);
            } else {
                observer.error('error file not saved');
            }
        });
    }
}
