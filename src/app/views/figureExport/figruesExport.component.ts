import { Component } from "@angular/core";
import { FigureExprotService } from "../../core/services/figuresExport/figureExport.service";

@Component(
    {
        selector: 'app-figure-export',
        templateUrl: 'figuresExport.component.html'
    })
export class FiguresExportComponent {

    constructor(private figuresExporter: FigureExprotService) { }

    simpleExport() {
        this.figuresExporter.saveFigures('simple').subscribe(
            msg => { console.log(msg); }
            , err => { console.log(err); }
        );
    }

    examExport() {
        this.figuresExporter.saveFigures('exam').subscribe(
            msg => { console.log(msg); }
            , err => { console.log(err); }
        );
    }
}
