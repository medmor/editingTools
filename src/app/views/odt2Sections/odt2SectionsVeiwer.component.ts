import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ISectionNode } from '../../models';

@Component({
    selector: 'app-odt2sections-viewer',
    template: `
        <div class="container-fluid">
            <app-coursesections-veiwer [course]="rootSection" [figures]="figures"></app-coursesections-veiwer>
        </div>
    `,
})
export class Odt2SectionsViewerComponent implements OnInit {
    rootSection: ISectionNode;
    figures: Map<string, string>;
    constructor(private router: Router) {}

    ngOnInit() {
        if (history.state.data) {
            this.rootSection = history.state.data.section;
            this.figures = history.state.data.figures;
        } else {
            this.router.navigateByUrl('/odt2sections/home');
        }
    }
}
