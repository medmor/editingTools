import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../../core/services/electron/electron.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    constructor(private router: Router, private electron: ElectronService) { }

    ngOnInit(): void {
        this.electron.remote.getCurrentWindow().setTitle("Editing Utils");
    }

}
