import { Component, Input } from '@angular/core';
import { Text } from '../../models';
@Component({
    selector: 'app-textnode-viewer',
    template: `
        <span *ngIf="isString(text.content)" [class.font-weight-bold]="isBold()">{{ text.content }}</span>
        <p *ngIf="!isString(text.content)" [class.font-weight-bold]="isBold()">
            <app-textnode-viewer *ngFor="let content of text.content" [text]="content"></app-textnode-viewer>
        </p>
    `,
})
export class TextNodeViewerComponent {
    @Input() text: Text;

    isString(c: any) {
        return typeof c === 'string';
    }
    isBold() {
        return this.text.styles.includes('bold');
    }
}
