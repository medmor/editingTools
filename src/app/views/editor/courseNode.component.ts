import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';

import { CourseNodeModel, courseNodeTypes } from '../../models';

@Component({
    selector: 'app-editor-course-node',
    template: `
        <div class="card m-1">
            <div class="card-header m-0 p-0">
                <ng-container *ngTemplateOutlet="Bouttons"></ng-container>
            </div>
            <div class="car-body px-2">
                <editable_area *ngIf="addingTitle || node.title" [text]="node.title" (textEvent)="node.title = $event" [label]="'Title'">
                </editable_area>

                <ng-container *ngIf="!hideContent && node.type !== 'Figure'">
                    <editable_area
                        *ngIf="addingContent || node.content"
                        (textEvent)="node.content = $event"
                        [text]="node.content"
                        [label]="'Content'"
                    ></editable_area>
                    <div *ngIf="node.children.length > 0">
                        <div *ngFor="let thisNode of node.children">
                            <editor-course-node (nodeSelectd)="OnSelectNode($event)" [node]="thisNode"></editor-course-node>
                        </div>
                    </div>
                </ng-container>

                <ng-container *ngIf="node.type === 'Figure' && !hideContent">
                    <img *ngIf="figureSrc" [src]="figureSrc" alt="bac-svt-ma.blogspot.com figure" />
                </ng-container>
            </div>
        </div>

        <ng-template #Bouttons>
            <div class="btn-group">
                <select class="btn btn-sm btn-primary" [(ngModel)]="node.type">
                    <option *ngFor="let type of nodeTypes">
                        {{ type }}
                    </option>
                </select>
                <button class="btn btn-sm btn-success" *ngIf="node.type === 'Section' && !node.title" (click)="addingTitle = true">
                    title
                </button>
                <button
                    class="btn btn-sm btn-success"
                    *ngIf="node.type !== 'SimpleContent' && node.type !== 'Figure'"
                    (click)="addChildNode()"
                >
                    childe
                </button>
                <button
                    class="btn btn-sm btn-success"
                    *ngIf="node.type === 'SimpleContent' && !node.content"
                    (click)="addingContent = true; hideContent = false"
                >
                    content
                </button>
                <button class="btn btn-sm btn-success" *ngIf="node.type === 'Figure'" (click)="readImageFromClipboard()">figure</button>
            </div>
            <div class="btn-group mx-2">
                <button
                    class="btn btn-sm btn-secondary"
                    *ngIf="node.content || node.children.length"
                    (click)="hideContent = !hideContent"
                    style="width:40px;"
                >
                    {{ hideContent ? '+' : '-' }}
                </button>
                <button class="btn btn-sm btn-danger" (click)="removeNode(node.index)" style="width:40px;">x</button>
            </div>

            <input class="input" type="radio" name="nodeChekBox" (change)="OnSelectNode(node)" />
        </ng-template>
    `,
})
export class EditorCourseNodeComponent implements OnInit {
    @Input() node: CourseNodeModel;
    @Output() nodeSelectd = new EventEmitter<CourseNodeModel>();

    nodeTypes = courseNodeTypes;

    addingTitle = false;
    addingContent = false;
    hideContent = true;
    figureSrc = '';

    constructor(private zone: NgZone) {
        document.onpaste = this.handlePasteEvent.bind(this);
    }
    ngOnInit() {
        if (this.node.type === 'Figure') {
            this.figureSrc = this.node.content;
        }
    }
    handlePasteEvent(event) {
        const items = event.clipboardData.items;
        const blob = items[0].getAsFile();
        const reader = new FileReader();
        reader.onload = this.handleReadEvent.bind(this);
        reader.readAsDataURL(blob);
    }
    handleReadEvent(event) {
        this.zone.run(() => {
            this.figureSrc = event.target.result;
            this.node.content = this.figureSrc;
        });
    }
    addChildNode() {
        this.node.children.push(new CourseNodeModel(this.node.children.length, 'Section', '', this.node, [], ''));
        this.hideContent = false;
    }

    removeNode(index: number) {
        this.node.parent.children.splice(index, 1);
        for (let i = 0; i < this.node.parent.children.length; i++) {
            this.node.parent.children[i].index = i;
        }
    }

    onSelectNode(node) {
        this.nodeSelectd.emit(node);
    }

    readImageFromClipboard() {
        document.execCommand('paste');
    }
}
