import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseNodeModel } from '../../models/courseNode.model';
import { EditorService } from '../../services';
import { ElectronService } from '../../services';

@Component({
    selector: 'app-editor-home',
    template: `
        <div class="container d-flex flex-column justify-content-center" style="height:100%;">
            <div class="card bg-dark text-white text-center">
                <div class="card-body">
                    <button type="button" class="btn btn-secondary btn-block my-5" (click)="newCourse()">
                        <h3>New</h3>
                    </button>

                    <button type="button" class="btn btn-secondary btn-block my-5" (click)="openCourse()">
                        <h3>Open</h3>
                    </button>
                </div>
            </div>
        </div>
    `,
})
export class EditorHomeComponent implements OnInit {
    constructor(private router: Router, private editorIO: EditorService, private zone: NgZone, private electron: ElectronService) {}

    ngOnInit(): void {
        this.electron.remote.getCurrentWindow().setTitle('Editor');
    }

    newCourse() {
        const course = new CourseNodeModel(0, 'Section', '', undefined, [], '');
        this.router.navigate(['/editor/course'], { state: { course } });
    }

    openCourse() {
        this.editorIO.openCourse().subscribe(
            (course) => {
                this.zone.run(() => {
                    this.router.navigate(['/editor/course'], { state: { course } });
                });
            },
            (err) => console.log(err),
        );
    }
}
