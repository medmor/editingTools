import { Component } from '@angular/core';
import { FigureExprotService } from '../../services';

@Component({
    selector: 'app-figure-export',
    template: `
        <div class="container d-flex flex-column justify-content-center" style="height:100%;">
            <div class="card bg-dark text-white text-center">
                <div class="card-body">
                    <button type="button" class="btn btn-secondary btn-block my-5" (click)="simpleExport()">
                        <h3>Simple Export</h3>
                    </button>

                    <button type="button" class="btn btn-secondary btn-block my-5" title="figures and answers" (click)="examExport()">
                        <h3>Exam Export</h3>
                    </button>
                </div>
            </div>
        </div>
    `,
})
export class FiguresExportComponent {
    constructor(private figuresExporter: FigureExprotService) {}

    simpleExport() {
        this.figuresExporter.saveFigures('simple').subscribe(
            (msg) => {
                console.log(msg);
            },
            (err) => {
                console.log(err);
            },
        );
    }

    examExport() {
        this.figuresExporter.saveFigures('exam').subscribe(
            (msg) => {
                console.log(msg);
            },
            (err) => {
                console.log(err);
            },
        );
    }
}
