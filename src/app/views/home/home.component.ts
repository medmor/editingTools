import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../../services';

@Component({
    selector: 'app-home',
    template: `
        <div class="container d-flex flex-column justify-content-center" style="height:100%;">
            <div class="card bg-dark text-white text-center">
                <div class="card-body">
                    <button type="button" class="btn btn-secondary btn-block my-5" routerLink="/editor/home">
                        <h3>Editor</h3>
                    </button>

                    <button type="button" class="btn btn-secondary btn-block my-5" routerLink="/odt2html/home">
                        <h3>ODT to HTML</h3>
                    </button>

                    <button type="button" class="btn btn-secondary btn-block my-5" routerLink="/odt2sections/home">
                        <h3>ODT to Sections</h3>
                    </button>

                    <button type="button" class="btn btn-secondary btn-block my-5" routerLink="/figure-export">
                        <h3>Figures Export</h3>
                    </button>
                    <button type="button" class="btn btn-secondary btn-block my-5" routerLink="/m3u">
                        <h3>M3U Editor</h3>
                    </button>
                </div>
            </div>
        </div>
    `,
})
export class HomeComponent implements OnInit {
    constructor(private router: Router, private electron: ElectronService) {}

    ngOnInit(): void {
        this.electron.remote.getCurrentWindow().setTitle('Editing Tools');
    }
}
