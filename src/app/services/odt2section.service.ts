import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course, Figure, ISectionNode, Li, NODE_NAMES, Section, Table, Td, Text, Tr, Ul } from '../models';

import { ElectronService } from '.';

@Injectable({
    providedIn: 'root',
})
export class Odt2SectionsService {
    currentFilePath = '';
    currentFileName = '';

    converter = new Converter();
    constructor(private electronService: ElectronService) {}

    openOdt(): Observable<{ section: Section; figures: Map<string, string> }> {
        return new Observable((observer) => {
            const dialogOptions = {
                filters: [{ name: 'ODT', extensions: ['odt'] }],
            };
            const request = this.electronService.remote.dialog.showOpenDialogSync(undefined, dialogOptions);
            if (request) {
                this.currentFilePath = this.electronService.path.dirname(request[0]);
                this.currentFileName = this.electronService.path.basename(request[0]);

                this.electronService.remote.getCurrentWindow().setTitle(this.currentFileName);

                const zip = new this.electronService.streamZip({
                    file: request[0],
                });

                zip.on('ready', () => {
                    const entries = zip.entries();

                    const content = zip.entryDataSync('content.xml').toString();
                    const figures: Map<string, string> = new Map();
                    for (const entrie in entries) {
                        if (entrie.startsWith('Pictures')) {
                            figures.set(
                                this.electronService.path.basename(entrie),
                                'data:png;base64,' + Buffer.from(zip.entryDataSync(entrie)).toString('base64'),
                            );
                        }
                    }
                    const doc = new DOMParser().parseFromString(content, 'text/xml');

                    const body = doc.getElementsByTagName(NODE_NAMES.body)[0].children[0].childNodes;
                    const styles = doc.getElementsByTagName(NODE_NAMES.styles)[0];

                    observer.next({ section: this.converter.converte(body, styles, figures), figures });
                    zip.close();
                });
            } else {
                observer.error('error' + ' No File Choosen');
            }
        });
    }

    saveCourse(file: string): Observable<string> {
        return new Observable((observer) => {
            const dialogOptions = {
                defaultPath: 'untitled',
                filters: [{ name: 'JSON', extensions: ['json'] }],
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

class Converter {
    rootSection: Course;
    currentNode: ChildNode;
    currentSectionLevel: string;
    sections: ISectionNode[] = [];
    styles: Element;
    figures: Map<string, string>;
    figureCount = 0;

    converte(content: NodeListOf<ChildNode>, styles: Element, figures: Map<string, string>): Section {
        this.figureCount = 0;
        this.rootSection = new Course(['tc'], ['s'], ['1'], '1', '', [], null);
        this.styles = styles;
        this.figures = figures;
        this.currentSectionLevel = '';
        this.parseChildrenNodes(content);
        return this.rootSection;
    }

    parseChildrenNodes(children: NodeListOf<ChildNode>) {
        let child = children[0];
        while (child) {
            this.currentNode = child;

            if (this.currentNode.nodeName === NODE_NAMES.p) {
                this.parseParagraphe();
            } else if (this.currentNode.nodeName === NODE_NAMES.h) {
                this.parseHeading();
            } else if (this.currentNode.nodeName === NODE_NAMES.list) {
                this.parseList();
            } else if (this.currentNode.nodeName === NODE_NAMES.table) {
                this.parseTable();
            } else {
                console.log('not handled yet: ' + this.currentNode.nodeName);
            }
            child = child.nextSibling as Element;
        }
    }
    parseParagraphe() {
        const p = new Text([], [], this.sections[this.currentSectionLevel]);
        const bold = this.getStyle((this.currentNode as any).getAttribute('text:style-name'));
        if (bold) {
            p.styles.push('bold');
        }
        this.parseParagrapheContent(this.currentNode.childNodes, p);
        this.sections[this.currentSectionLevel].content.push(p);
    }
    parseHeading() {
        this.currentSectionLevel = (this.currentNode as any).getAttribute('text:outline-level');
        const parentLevel = (parseInt(this.currentSectionLevel, 10) - 1).toString();
        if (this.currentSectionLevel === '1') {
            this.rootSection.title = this.currentNode.textContent;
            return;
        }

        const parentSection = this.sections[parentLevel];

        if (parentSection) {
            this.sections[this.currentSectionLevel] = new Section(
                this.currentNode.textContent,
                this.currentSectionLevel,
                [],
                parentSection,
            );
            parentSection.content.push(this.sections[this.currentSectionLevel]);
        } else {
            this.sections[this.currentSectionLevel] = new Section(
                this.currentNode.textContent,
                this.currentSectionLevel,
                [],
                this.rootSection,
            );
            (this.rootSection.content as any).push(this.sections[this.currentSectionLevel]);
        }
    }
    parseList() {
        const ul = new Ul([], this.sections[this.currentSectionLevel]);
        for (const node of (this.currentNode as any).childNodes) {
            const li = new Li([], ul);
            (ul.content as ISectionNode[]).push(li);
            this.parseListItemContent(node.childNodes, li);
        }
        this.sections[this.currentSectionLevel].content.push(ul);
    }
    parseTable() {
        const table = new Table([], this.sections[this.currentSectionLevel]);
        this.parseTableContent(this.currentNode.childNodes, table);
        this.sections[this.currentSectionLevel].content.push(table);
    }
    parseParagrapheContent(nodeChildren: NodeListOf<ChildNode>, paragraphe: Text | Td) {
        for (const node of nodeChildren as any) {
            if (node.nodeName === NODE_NAMES.frame) {
                const previousFigureName = (node.childNodes[0] as Element).getAttribute('xlink:href').substr(9);
                const currentFigureName = 'figure' + this.figureCount++;
                this.figures.set(currentFigureName, this.figures.get(previousFigureName));
                this.figures.delete(previousFigureName);
                const figure = new Figure(currentFigureName, this.sections[this.currentSectionLevel]);
                this.sections[this.currentSectionLevel].content.push(figure);
            } else if (node.nodeName === NODE_NAMES.span) {
                const span = new Text(node.textContent, [], paragraphe);
                const name = (node as Element).getAttribute('text:style-name');
                if (this.getStyle(name)) {
                    span.styles.push('bold');
                }
                (paragraphe.content as ISectionNode[]).push(span);
            } else {
                (paragraphe.content as ISectionNode[]).push(new Text(node.textContent, [], paragraphe));
            }
        }
    }
    parseListItemContent(nodeChildren: NodeListOf<ChildNode>, li: Li) {
        for (const node of nodeChildren as any) {
            if (node.nodeName === NODE_NAMES.p) {
                const p = new Text([], [], li);
                (li.content as ISectionNode[]).push(p);
                this.parseParagrapheContent(node.childNodes, p);
            } else if (node.nodeName === NODE_NAMES.list) {
                const ul = new Ul([], li.parent);
                (li.parent.content as ISectionNode[]).push(ul);
                for (const nodeChile of node.childNodes) {
                    const liChild = new Li([], ul);
                    (ul.content as ISectionNode[]).push(liChild);
                    this.parseListItemContent(nodeChile.childNodes, liChild);
                }
            }
        }
    }
    parseTableContent(nodeChildren: NodeListOf<ChildNode>, table: Table) {
        for (const node of nodeChildren as any) {
            if (node.nodeName === NODE_NAMES.tr) {
                this.parseTableRow(node.childNodes, table);
            }
        }
    }
    parseTableRow(nodeChildren: NodeListOf<ChildNode>, table: Table) {
        const tr = new Tr([], table);
        (table.content as ISectionNode[]).push(tr);
        for (const node of nodeChildren as any) {
            if (node.nodeName === NODE_NAMES.td) {
                this.parseTableCell(node.childNodes, tr);
            } else {
                //(tr.content as ISectionNode[]).push(new Td([], tr));
            }
        }
    }
    parseTableCell(nodeChildren: NodeListOf<ChildNode>, tr: Tr) {
        const td = new Td([], tr);
        (tr.content as ISectionNode[]).push(td);
        for (const node of nodeChildren as any) {
            if (node.nodeName === NODE_NAMES.p) {
                this.parseParagrapheInCell(node, td);
            }
        }
    }
    parseParagrapheInCell(node, td) {
        const p = new Text([], [], td);
        const bold = this.getStyle(node.getAttribute('text:style-name'));

        if (bold) {
            p.styles.push('bold');
        }
        this.parseParagrapheContent(node.childNodes, p);
        td.content.push(p);
    }
    getStyle(name: string) {
        for (const child of this.styles.children as any) {
            if (child.getAttribute('style:name') === name) {
                //const firstC = child.firstChild as Element;

                for (const style of child.children) {
                    if (
                        style.getAttribute('fo:font-weight') === 'bold' ||
                        style.getAttribute('style:font-weight-asian') === 'bold' ||
                        style.getAttribute('style:font-weight-complex') === 'bold'
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
