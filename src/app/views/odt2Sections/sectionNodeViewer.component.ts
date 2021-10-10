import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Section } from '../../models';
import { Odt2SectionsService } from '../../services';
@Component({
    selector: 'app-sectionnode-viewer',
    template: `
        <div class="card">
            <div class="card-header">
                <h2>{{ section.title }}</h2>
            </div>
            <div class="card-content">
                <ng-container *ngFor="let content of section.content">
                    <app-sectionnode-viewer *ngIf="content.type === 'section'" [section]="content"></app-sectionnode-viewer>
                    <app-textnode-viewer *ngIf="content.type === 'text'" [text]="content"></app-textnode-viewer>
                    <app-ulnode-viewer *ngIf="content.type === 'ul'" [ul]="content"></app-ulnode-viewer>
                    <div class="text-center" *ngIf="content.type === 'figure'">
                        <img class="img-fluid" [src]="getFigureSrc(content.content)" [alt]="content.content" />
                    </div>
                    <app-tablenode-viewer *ngIf="content.type === 'table'" [table]="content"></app-tablenode-viewer>
                </ng-container>
            </div>
        </div>
    `,
})
export class SectionNodeViewerComponent {
    @Input() section: Section;

    constructor(private odt2SectionsService: Odt2SectionsService, private sanitizer: DomSanitizer) {}

    getFigureSrc(figName: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(this.odt2SectionsService.converter.figures.get(figName));
    }
}
