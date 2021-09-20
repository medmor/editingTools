import { Component, Input, OnInit } from '@angular/core';
import { Course, ISectionNode, Li, Section, Table, Text, Ul } from '../../models';
@Component({
    selector: 'app-tablenode-viewer',
    template: `
        <table class="table">
            <tr *ngFor="let tr of table.content">
                <td *ngFor="let td of tr.content">
                    <app-textnode-viewer *ngFor="let text of td.content" [text]="text"> </app-textnode-viewer>
                </td>
            </tr>
        </table>
    `,
})
export class TableNodeViewerComponent {
    @Input() table: Table;
}
