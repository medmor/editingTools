import { Component, Input } from '@angular/core';
import { Section } from '../../models';
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
                    <div *ngIf="content.type === 'figure'">
                        <img [src]="content.content" [alt]="content.content" />
                    </div>
                    <app-tablenode-viewer *ngIf="content.type === 'table'" [table]="content"></app-tablenode-viewer>
                </ng-container>
            </div>
        </div>
    `,
})
export class SectionNodeViewerComponent {
    @Input() section: Section;
}
