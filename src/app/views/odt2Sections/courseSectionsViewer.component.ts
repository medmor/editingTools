import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Branches, Course, Levels, Numbers } from '../../models';
import { stringify } from 'flatted';
import { AngularFireStorage } from '@angular/fire/compat/storage';
@Component({
    selector: 'app-coursesections-veiwer',
    template: `
        <div class="card">
            <div class="card-header">
                <div class="form-group d-inline mr-3 border-right border-dark">
                    <label>Niveau : </label>
                    <select class="btn btn-outline-primary btn-sm mx-1">
                        <option *ngFor="let level of levels" (change)="addToArray(course.levels, $event.target.value)">{{ level }}</option>
                    </select>
                    <div class="btn-groupe d-inline">
                        <button
                            class="badge btn-primary"
                            *ngFor="let level of course.levels"
                            (click)="removeFromArray(course.levels, level)"
                        >
                            {{ level }}
                        </button>
                    </div>
                </div>
                <div class="form-group d-inline mr-3 border-right border-dark">
                    <label>Branche : </label>
                    <select class="btn  btn-outline-primary btn-sm mx-1" (change)="addToArray(course.branches, $event.target.value)">
                        <option *ngFor="let branch of branches">{{ branch }}</option>
                    </select>
                    <div class="btn-groupe d-inline">
                        <button
                            class="badge btn-primary"
                            *ngFor="let branch of course.branches"
                            (click)="removeFromArray(course.branches, branch)"
                        >
                            {{ branch }}
                        </button>
                    </div>
                </div>
                <div class="form-group d-inline mr-3 border-right border-dark">
                    <label>Unité : </label>
                    <select class="btn  btn-outline-primary btn-sm mx-1" (change)="addToArray(course.units, $event.target.value)">
                        <option *ngFor="let number of numbers">{{ number }}</option>
                    </select>
                    <div class="btn-groupe d-inline">
                        <button class="badge btn-primary" *ngFor="let unit of course.units" (click)="removeFromArray(course.units, unit)">
                            {{ unit }}
                        </button>
                    </div>
                </div>
                <div class="form-group d-inline mr-3 border-right border-dark">
                    <label>Chapitre : </label>
                    <select class="btn btn-outline-primary btn-sm mx-1" [(ngModel)]="course.chapter">
                        <option *ngFor="let number of numbers">{{ number }}</option>
                    </select>
                </div>

                <button class="btn close" (click)="pushToDatabase()">Push to database</button>
                <div
                    contenteditable="true"
                    [textContent]="course.title"
                    (input)="course.title = $event.target.textContent"
                    class="text-center"
                    style="font-size: 2em; font-weight: bold;"
                ></div>
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
    @Input() figures: Map<string, string>;

    levels: Levels[] = ['tc', '1bac', '2bac'];
    branches: Branches[] = ['l', 's', 'se', 'sm', 'sp', 'svt'];
    numbers: Numbers[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    constructor(private fireDb: AngularFireDatabase, private fireStorage: AngularFireStorage) {}

    addToArray(array: any[], item: any) {
        if (!array.includes(item)) {
            array.push(item);
            array.sort();
        }
    }
    removeFromArray(array: any[], item: any) {
        const index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    pushToDatabase() {
        this.fireDb
            .list('courses')
            .push(stringify(this.course))
            .then((data) => {
                this.figures.forEach((val, key) => {
                    const ref = this.fireStorage.ref('/courses' + '/' + data.key + '/' + key);
                    ref.putString(val)
                        .then((res) => console.log(res))
                        .catch((err) => console.log(err));
                });
            })
            .catch((err) => console.log(err));
    }
}
