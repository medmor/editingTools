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
// import { AngularFireModule } from '@angular/fire/compat';
// import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
// import { AngularFireStorageModule } from '@angular/fire/compat/storage';
// import { APP_CONFIG } from '../../../environments/environment';

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
    imports: [
        CommonModule,
        FormsModule,
        // AngularFireModule.initializeApp(APP_CONFIG.firebase),
        // AngularFireDatabaseModule,
        // AngularFireStorageModule,
    ],
})
export class Odt2SectionsModule {}
