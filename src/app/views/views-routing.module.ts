import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EditorHomeComponent } from './editor/editorHome.component';
import { EditorCourseComponent } from './editor/course.component';
import { Odt2HtmlHomeComponent } from './odt2html/odt2htmlHome.component';
import { Odt2HtmlViewerComponent } from './odt2html/odt2htmlViewer.component';
import { FiguresExportComponent } from './figureExport/figruesExport.component';
import { Odt2SectionsHomeComponent } from './odt2Sections/odt2SectionsHome.component';
import { Odt2SectionsViewerComponent } from './odt2Sections/odt2SectionsVeiwer.component';
import { M3uComponent } from './m3u/m3u.component';

const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'editor/home', component: EditorHomeComponent },
    { path: 'editor/course', component: EditorCourseComponent },
    { path: 'odt2html/home', component: Odt2HtmlHomeComponent },
    { path: 'odt2html/html-viewer', component: Odt2HtmlViewerComponent },
    { path: 'odt2sections/home', component: Odt2SectionsHomeComponent },
    { path: 'odt2sections/viewer', component: Odt2SectionsViewerComponent },
    { path: 'figure-export', component: FiguresExportComponent },
    { path: 'm3u', component: M3uComponent },
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ViewsRoutingModule {}
