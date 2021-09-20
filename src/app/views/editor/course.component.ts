import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { stringify, parse } from 'flatted';
import { CourseNodeModel } from '../../models';
import { EditorService } from '../../services';

@Component({
    selector: 'app-editor-course',
    template: `
        <nav class="navbar fixed-top navbar-light bg-dark  p-1">
            <button class="btn btn-light btn-sm" (click)="saveCourse()">save</button>
            <div *ngIf="selectedNode">
                <div class="btn-group mr-2">
                    <button class="btn btn-light btn-sm" (click)="copyNode()">copy</button>
                    <button *ngIf="copiedNode" class="btn btn-light btn-sm" (click)="pastNode()">past</button>
                </div>
                <div class="btn-group" *ngIf="selectedNode.parent">
                    <button class="btn btn-sm btn-light" (click)="downNode()" style="width:40px;">&#8595;</button>
                    <button class="btn btn-sm btn-light" (click)="upNode()" style="width:40px;">&#8593;</button>
                </div>
            </div>
        </nav>
        <div class="bg-light" style="padding-bottom:400px; margin-top:40px;">
            <div *ngIf="course">
                <editor-course-node (nodeSelectd)="onNodeSelected($event)" [node]="course"></editor-course-node>
            </div>
        </div>
    `,
})
export class EditorCourseComponent implements OnInit {
    course: CourseNodeModel;
    selectedNode: CourseNodeModel;
    copiedNode: CourseNodeModel;

    constructor(private router: Router, private editorIO: EditorService) {}

    ngOnInit() {
        this.course = history.state.course;
        if (!this.course) {
            this.router.navigateByUrl('editor/home');
        }
    }

    saveCourse() {
        this.editorIO.saveCourse(this.course).subscribe(
            (data) => {
                console.log('file saved in ' + data);
            },
            (err) => console.log(err),
        );
    }

    onNodeSelected(e) {
        this.selectedNode = e;
    }

    downNode() {
        const index = this.selectedNode.index;

        if (index < this.selectedNode.parent.children.length - 1) {
            const temp = this.selectedNode.parent.children[index + 1];
            this.selectedNode.parent.children[index + 1] = this.selectedNode.parent.children[index];
            this.selectedNode.parent.children[index + 1].index = index + 1;
            this.selectedNode.parent.children[index] = temp;
            this.selectedNode.parent.children[index].index = index;
        }
    }

    upNode() {
        const index = this.selectedNode.index;

        if (index - 1 >= 0) {
            const temp = this.selectedNode.parent.children[index - 1];
            this.selectedNode.parent.children[index - 1] = this.selectedNode.parent.children[index];
            this.selectedNode.parent.children[index - 1].index = index - 1;
            this.selectedNode.parent.children[index] = temp;
            this.selectedNode.parent.children[index].index = index;
        }
    }

    copyNode() {
        if (this.selectedNode) {
            this.copiedNode = this.selectedNode;
        }
    }

    pastNode() {
        if (this.selectedNode && this.copiedNode) {
            const node = parse(stringify(this.copiedNode));
            node.parent = this.selectedNode;
            node.index = this.selectedNode.children.length;
            this.selectedNode.children.push(node);
        }
    }
}
