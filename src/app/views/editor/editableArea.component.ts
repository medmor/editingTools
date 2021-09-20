import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
    selector: 'app-editable-area',
    template: `
        <div (click)="startEditing()" style="position:relative;margin-bottom:5px;min-height:40px;">
            <label *ngIf="!text">{{ label }}</label>
            <ckeditor *ngIf="editing" #editorComponent [editor]="Editor" [(ngModel)]="text" (focusout)="onEditingEnds($event)"> </ckeditor>
            <div *ngIf="!editing" [innerHTML]="text" style="display: inline;"></div>
        </div>
    `,
})
export class EditableAreaComponent implements OnInit {
    @ViewChild('editorComponent') editorComponent: CKEditorComponent;

    @Input() label: string;
    @Input() text: string;
    @Output() textEvent = new EventEmitter<string>();

    public editor = ClassicEditor;
    editing = false;

    ngOnInit(): void {}

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
