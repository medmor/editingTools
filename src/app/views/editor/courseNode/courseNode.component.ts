import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';

import { CourseNodeModel, courseNodeTypes } from '../../../core/models/courseNode.model';
import { EditorIOService } from '../../../core/services/editor/editor.io.service';
//import { CourseService } from '../../services/course.service';


@Component({
    selector: 'editor-course-node',
    templateUrl: './courseNode.component.html',
})
export class EditorCourseNodeComponent {

    nodeTypes = courseNodeTypes;

    addingTitle = false;
    addingContent = false;
    hideContent = true;

    @Input() node: CourseNodeModel;
    @Output() nodeSelectd = new EventEmitter<CourseNodeModel>();

    figureSrc = '';

    constructor(private editorIO: EditorIOService, private zone: NgZone) {
        document.onpaste = this.handlePasteEvent.bind(this);
    }
    ngOnInit() {
        if (this.node.type == 'Figure')
            this.figureSrc = this.node.content;
    }
    handlePasteEvent(event) {
        var items = event.clipboardData.items;
        var blob = items[0].getAsFile();
        var reader = new FileReader();
        reader.onload = this.handleReadEvent.bind(this);
        reader.readAsDataURL(blob);
    };
    handleReadEvent(event) {
        this.zone.run(() => {
            this.figureSrc = event.target.result;
            this.node.content = this.figureSrc;
        });
    }
    addChildNode() {
        this.node.children.push(new CourseNodeModel(this.node.children.length, "Section", "", this.node, [], ""));
        this.hideContent = false;
    }

    removeNode(index: number) {
        this.node.parent.children.splice(index, 1);
        for (let i = 0; i < this.node.parent.children.length; i++) {
            this.node.parent.children[i].index = i;
        }
    }

    OnSelectNode(node) {
        this.nodeSelectd.emit(node);

    }


    readImageFromClipboard() {
        document.execCommand("paste");

    }
}
