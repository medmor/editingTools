import { Component, Input } from '@angular/core';
import { Ul } from '../../models';
@Component({
    selector: 'app-ulnode-viewer',
    template: `
        <ul>
            <ng-container *ngFor="let li of ul.content">
                <li *ngIf="li.type === 'li'">
                    <app-textnode-viewer *ngFor="let text of li.content" [text]="text"></app-textnode-viewer>
                </li>
                <app-ulnode-viewer *ngIf="li.type === 'ul'" [ul]="li"></app-ulnode-viewer>
            </ng-container>
        </ul>
    `,
})
export class UlNodeViewerComponent {
    @Input() ul: Ul;
}
