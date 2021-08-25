import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditorHomeComponent } from './editor/editorHome/editorHome.component';
import { EditorCourseComponent } from './editor/course/course.component';
import { Odt2HtmlHomeComponent } from './odt2html/home/odt2htmlHome.component';
import { Odt2HtmlViewerComponent } from './odt2html/htmlViewer/odt2htmlViewer.component';
import { FiguresExportComponent } from './figureExport/figruesExport.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'editor/home', component: EditorHomeComponent },
    { path: 'editor/course', component: EditorCourseComponent },
    { path: "odt2html/home", component: Odt2HtmlHomeComponent },
    { path: "odt2html/html-viewer", component: Odt2HtmlViewerComponent },
    { path: "figure-export", component: FiguresExportComponent },
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewsRoutingModule { }
