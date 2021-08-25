import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";
import { CKEditorComponent } from "@ckeditor/ckeditor5-angular";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
    selector: "editable_area",
    templateUrl: "./editableArea.component.html"
})
export class EditableAreaComponent {

    public Editor = ClassicEditor;
    editing = false;

    @ViewChild("editorComponent") editorComponent: CKEditorComponent;

    @Input() label: string;
    @Input() text: string;
    @Output() textEvent = new EventEmitter<string>();


    ngOnInit(): void { }


    startEditing() {
        this.editing = true;
        setTimeout(() => {
            this.editorComponent.editorInstance.editing.view.focus();
        }, 0);
    }

    onEditingEnds(event: any) {
        if (!event.relatedTarget) {
            this.textEvent.emit(this.text);
            this.editing = false;
        }
    }
}
