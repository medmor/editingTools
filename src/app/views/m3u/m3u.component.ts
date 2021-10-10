import { Component, NgZone, OnInit } from '@angular/core';
import { M3uService } from '../../services/m3u.service';

@Component({
    selector: 'app-m3u',
    template: `
        <div class="container-fluid">
            <div class="mb-2">
                <button class="btn btn-primary float-right" (click)="save()">Save</button>
                <button class="btn btn-danger float-right" (click)="deleteGroup()">x</button>
                <h3>Groups :</h3>
            </div>

            <div style="height: 90vh;">
                <select multiple class="list-group" [(ngModel)]="selection" *ngIf="groups.length" style="width: 100%; height: 100%;">
                    <option class="list-group-item" *ngFor="let group of groups">
                        {{ group }}
                    </option>
                </select>
            </div>
        </div>
    `,
})
export class M3uComponent implements OnInit {
    lines: string[];
    groups: string[] = [];
    selection = [];
    constructor(private m3uService: M3uService, private ngZone: NgZone) {}
    ngOnInit() {
        this.m3uService.openM3uFile().subscribe((file) => {
            this.ngZone.run(() => {
                this.parseFile(file.toString());
            });
        });
    }

    parseFile(file: string) {
        this.lines = file.split('#EXTINF');
        for (let i = 1; i < this.lines.length; i++) {
            const currentGroupe = this.lines[i].match(/group-title="(.*)"/)[1];
            if (this.groups.length === 0 || this.groups[this.groups.length - 1] !== currentGroupe) {
                this.groups.push(currentGroupe);
            }
        }
        this.groups = this.groups;
    }

    deleteGroup() {
        this.selection.forEach((group: string) => {
            group = group.replace(/ /g, '');
            this.groups = this.groups.filter((g) => g.replace(/ /g, '') !== group);
            this.lines = this.lines.filter((line) => !line.replace(/ /g, '').includes(group));
        });
    }
    save() {
        this.m3uService.saveM3uFile(this.lines.join('#EXTINF')).subscribe((file) => {
            console.log(file);
        });
    }
    log() {
        console.log(this.selection);
    }
}
