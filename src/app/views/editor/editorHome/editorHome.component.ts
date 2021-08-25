import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseNodeModel } from '../../../core/models/courseNode.model';
import { EditorIOService } from '../../../core/services/editor/editor.io.service';
import { ElectronService } from '../../../core/services/electron/electron.service';

@Component({
    selector: 'app-editor-home',
    templateUrl: './editorHome.component.html'
})
export class EditorHomeComponent implements OnInit {

    constructor(private router: Router, private editorIO: EditorIOService, private zone: NgZone, private electron: ElectronService) { }

    ngOnInit(): void {
        this.electron.remote.getCurrentWindow().setTitle("Editor");
    }

    newCourse() {
        const course = new CourseNodeModel(0, 'Section', '', undefined, [], '');
        this.router.navigate(['/editor/course'], { state: { course } });
    }

    openCourse() {
        this.editorIO.openCourse().subscribe((course) => {
            this.zone.run(() => {
                this.router.navigate(['/editor/course'], { state: { course } });
            });
        }, err => console.log(err));
    }
}
