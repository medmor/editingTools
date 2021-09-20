import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NODE_NAMES } from '../../models';
import { Odt2htmlService } from '../../services';

@Component({
    selector: 'app-odt2html-viewer',
    template: '<div [innerHtml]="html"></div>',
})
export class Odt2HtmlViewerComponent implements OnInit {
    data: { content: string; figures: Map<string, string> };
    html: SafeHtml;

    constructor(private router: Router, private odt2htmlServie: Odt2htmlService, private sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.data = history.state.data;
        if (this.data) {
            const doc = new DOMParser().parseFromString(this.data.content, 'text/xml');

            const content = doc.getElementsByTagName(NODE_NAMES.body)[0].children[0].childNodes;
            const styles = doc.getElementsByTagName(NODE_NAMES.styles)[0];

            this.odt2htmlServie.xml2htmlConverter.converte(content, styles, this.data.figures);

            this.html = this.sanitizer.bypassSecurityTrustHtml(this.odt2htmlServie.xml2htmlConverter.$.html());
            let id = 1;
            console.log(
                this.odt2htmlServie.xml2htmlConverter.$.html().replace(
                    /src="(?:[^"\/]*\/)*([^"]+)"/g,
                    () =>
                        'src="' +
                        this.odt2htmlServie.currentFileName.substring(0, this.odt2htmlServie.currentFileName.length - 4) +
                        '-figure' +
                        id++ +
                        '.png"',
                ),
            );
        } else {
            this.router.navigateByUrl('odt2html/home');
        }
    }
}
