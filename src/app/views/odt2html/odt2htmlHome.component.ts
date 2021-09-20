import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Odt2htmlService } from '../../services';

@Component({
    selector: 'app-html2odt-home',
    template: `
        <div class="container d-flex flex-column justify-content-center" style="height:100%;">
            <div class="card bg-dark text-white text-center">
                <div class="card-body">
                    <button type="button" class="btn btn-secondary btn-block my-5" (click)="openOdtFile()">
                        <h3>Open Odt File</h3>
                    </button>
                </div>
            </div>
        </div>
    `,
})
export class Odt2HtmlHomeComponent {
    constructor(private odt2htmlService: Odt2htmlService, private zone: NgZone, private router: Router) {}

    openOdtFile() {
        this.odt2htmlService.openOdt().subscribe(
            (data) => {
                this.zone.run(() => {
                    this.router.navigate(['/odt2html/html-viewer'], { state: { data } });
                });
            },
            (err) => console.log(err),
        );
    }
}
