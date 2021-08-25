import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { NODE_NAMES } from "../../../core/models/odt2html/nodeNames";
import { Odt2htmlIOService } from "../../../core/services/odt2html/odt2html.service";

@Component({
    selector: 'app-odt2html-viewer',
    templateUrl: 'odt2htmlViewer.component.html'
})
export class Odt2HtmlViewerComponent {

    data: { content: string, figures: Map<string, string>; };
    html: any;

    constructor(private router: Router, private odt2htmlServie: Odt2htmlIOService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.data = history.state.data;
        if (this.data) {
            console.log(this.data);
            var doc = new DOMParser().parseFromString(this.data.content, 'text/xml');

            var content = doc.getElementsByTagName(NODE_NAMES.BODY)[0].children[0].childNodes;
            var styles = doc.getElementsByTagName(NODE_NAMES.STYLES)[0];

            this.odt2htmlServie.xml2htmlConverter.converte(content, styles, this.data.figures);

            this.html = this.sanitizer.bypassSecurityTrustHtml(this.odt2htmlServie.xml2htmlConverter.$.html());
        } else {
            this.router.navigateByUrl('odt2html/home');
        }
    }
}
