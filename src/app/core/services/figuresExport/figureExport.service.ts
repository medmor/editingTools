import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { NODE_NAMES } from "../../models/odt2html/nodeNames";
import { ElectronService } from "../electron/electron.service";



@Injectable({
    providedIn: "root"
})
export class FigureExprotService {

    currentFilePath: string;
    currentFileName: string;
    heading1: number;
    figuresCount: number;
    answersCount: number;


    constructor(private electronService: ElectronService) {
        //console.log(AdmZip);
    }

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

    saveFigures(mode: 'simple' | 'exam') {

        return new Observable((observer) => {
            this.openOdt().subscribe((data) => {

                this.figuresCount = 0;
                this.answersCount = 0;
                this.heading1 = 0;

                const content = new DOMParser()
                    .parseFromString(data.content, 'text/xml')
                    .getElementsByTagName(NODE_NAMES.BODY)[0] //geting the content body
                    .children[0]; //the body always have a text child that contains other children nodes

                if (mode == 'simple') {
                    this.countFiguresSimple(content, data.figures);
                } else {
                    this.countFiguresExam(content, data.figures);
                }

                const dialogOptions: any = {
                    properties: ['openDirectory']

                };
                const path = this.electronService.remote.dialog.showOpenDialogSync(undefined, dialogOptions);
                if (path[0]) {
                    this.currentFilePath = path[0];
                    let count = 0;
                    data.figures.forEach((value, key) => {
                        value = value.replace('data:png;base64,', "");
                        this.electronService.fs.writeFile(this.currentFilePath + '/' + key, value, 'base64', (err) => {
                            count++;
                            if (count == data.figures.size)
                                observer.next(this.currentFilePath);
                        });
                    });
                }
                else
                    observer.error("error file not saved");
            });

        });
    }


    countFiguresSimple(node: ChildNode, figures: Map<string, string>) {

        for (let child of (node as any).childNodes) {
            if (child.nodeName === NODE_NAMES.IMAGE) {

                this.figuresCount++;
                const previousKey = this.electronService.path.basename((child as Element).getAttribute('xlink:href'));
                const pngData = figures.get(previousKey);

                figures.set('figure' + this.figuresCount + '.png', pngData);
                figures.delete(previousKey);

            } else {
                this.countFiguresSimple(child, figures);
            }
        }

    }

    countFiguresExam(node: Element, figures: Map<string, string>) {
        for (let child of (node as any).children) {
            if (child.tagName === NODE_NAMES.H && child.attributes['text:outline-level'] === '1')
                this.heading1++;

            else if (child.tagName === NODE_NAMES.IMAGE) {

                const previousKey = this.electronService.path.basename(child.getAttribute('xlink:href'));
                const pngData = figures.get(previousKey);

                if (this.heading1 < 2) {

                    this.figuresCount++;

                    figures.set('figure' + this.figuresCount + '.png', pngData);

                } else {

                    this.answersCount++;

                    figures.set('answer' + this.answersCount + '.png', pngData);
                }

                figures.delete(previousKey);
            } else {
                this.countFiguresExam(child, figures);
            }
        }
    }
}
