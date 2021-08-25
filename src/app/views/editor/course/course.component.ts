import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { stringify, parse } from 'flatted';
import { CourseNodeModel } from '../../../core/models/courseNode.model';
import { EditorIOService } from '../../../core/services/editor/editor.io.service';

@Component({
    selector: 'app-editor-course',
    templateUrl: './course.component.html',
})
export class EditorCourseComponent {

    course: CourseNodeModel;
    selectedNode: CourseNodeModel;
    copiedNode: CourseNodeModel;

    constructor(private router: Router, private editorIO: EditorIOService) {
    }

    ngOnInit() {
        this.course = history.state.course;
        if (!this.course) {
            this.router.navigateByUrl("editor/home");
        }
    }

    saveCourse() {
        this.editorIO.saveCourse(this.course).subscribe((data) => {
            console.log('file saved in ' + data);
        }, err => console.log(err));
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
        if (this.selectedNode)
            this.copiedNode = this.selectedNode;
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
