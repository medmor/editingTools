import { Component, Input } from '@angular/core';
import { Branches, Course, Levels } from '../../models';
@Component({
    selector: 'app-coursesections-veiwer',
    template: `
        <div class="card">
            <div class="card-header">
                <div class="btn-groupe">
                    <select class="btn  btn-primary" [(ngModel)]="course.level">
                        <option *ngFor="let level of levels">{{ level }}</option>
                    </select>
                    <select class="btn  btn-primary" (change)="addBranch($event.target.value)">
                        <option *ngFor="let branch of branches">{{ branch }}</option>
                    </select>
                    <button class="badge btn-primary" *ngFor="let branch of course.branches" (click)="removeBranch(branch)">
                        {{ branch }}
                    </button>
                </div>
                <div contenteditable="true" class="text-center" style="font-size: 2em; font-weight: bold;">{{ course.title }}</div>
            </div>
            <div class="card-content pl-1">
                <ng-container *ngFor="let section of course.content">
                    <app-sectionnode-viewer [section]="section"></app-sectionnode-viewer>
                </ng-container>
            </div>
        </div>
    `,
})
export class CourseSectionsViewerComponent {
    @Input() course: Course;

    levels: Levels[] = ['tc', '1bac', '2bac'];
    branches: Branches[] = ['l', 's', 'se', 'sm', 'sp', 'svt'];

    addBranch(branch: Branches) {
        if (!this.course.branches.includes(branch)) {
            this.course.branches.push(branch);
            this.course.branches.sort();
        }
    }
    removeBranch(branch: Branches) {
        const index = this.course.branches.indexOf(branch);
        if (index > -1) {
            this.course.branches.splice(index, 1);
        }
    }
}
