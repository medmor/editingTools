import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Odt2SectionsService } from '../../services';

@Component({
    selector: 'app-odt2sections-home',
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
export class Odt2SectionsHomeComponent {
    constructor(private odt2SectionsService: Odt2SectionsService, private zone: NgZone, private router: Router) {}

    openOdtFile() {
        this.odt2SectionsService.openOdt().subscribe(
            (data) => {
                this.zone.run(() => {
                    this.router.navigate(['/odt2sections/viewer'], { state: { data } });
                });
            },
            (err) => console.log(err),
        );
    }
}
