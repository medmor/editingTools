import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import { ViewsRoutingModule } from './views-routing.module';

import { HomeComponent } from './home/home.component';
import { EditorCourseComponent } from './editor/course/course.component';
import { EditorCourseNodeComponent } from './editor/courseNode/courseNode.component';
import { EditableAreaComponent } from './editor/editableArea/editableArea.component';
import { FormsModule } from '@angular/forms';
import { Odt2HtmlHomeComponent } from './odt2html/home/odt2htmlHome.component';
import { Odt2HtmlViewerComponent } from './odt2html/htmlViewer/odt2htmlViewer.component';
import { FiguresExportComponent } from './figureExport/figruesExport.component';

@NgModule({
    declarations: [
        HomeComponent,
        EditorCourseComponent,
        EditorCourseNodeComponent,
        EditableAreaComponent,
        Odt2HtmlHomeComponent,
        Odt2HtmlViewerComponent,
        FiguresExportComponent
    ],
    imports: [CommonModule, ViewsRoutingModule, FormsModule, CKEditorModule]
})
export class ViewsModule { }
