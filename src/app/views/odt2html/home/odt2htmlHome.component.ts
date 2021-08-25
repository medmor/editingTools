import { Component, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { Odt2htmlIOService } from "../../../core/services/odt2html/odt2html.service";

@Component({
    selector: 'app-html2odt-home',
    templateUrl: 'odt2htmlHome.component.html'
})
export class Odt2HtmlHomeComponent {

    constructor(private odt2htmlService: Odt2htmlIOService, private zone: NgZone, private router: Router) {

    }

    openOdtFile() {
        this.odt2htmlService.openOdt().subscribe((data) => {
            this.zone.run(() => {
                this.router.navigate(['/odt2html/html-viewer'], { state: { data } });
            });
        }, err => console.log(err));
    }
}
