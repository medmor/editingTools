import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Odt2SectionsHomeComponent } from './odt2SectionsHome.component';
import { Odt2SectionsViewerComponent } from './odt2SectionsVeiwer.component';
import { CourseSectionsViewerComponent } from './courseSectionsViewer.component';
import { SectionNodeViewerComponent } from './sectionNodeViewer.component';
import { TableNodeViewerComponent } from './tableNodeViewer.component';
import { TextNodeViewerComponent } from './textNodeViewer.component';
import { UlNodeViewerComponent } from './ulNodeVewer.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        Odt2SectionsHomeComponent,
        Odt2SectionsViewerComponent,
        CourseSectionsViewerComponent,
        SectionNodeViewerComponent,
        TableNodeViewerComponent,
        TextNodeViewerComponent,
        UlNodeViewerComponent,
    ],
    imports: [CommonModule, FormsModule],
})
export class Odt2SectionsModule {}
