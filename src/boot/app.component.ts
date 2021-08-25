import { Component, NgZone } from '@angular/core';
import { ElectronService } from '../app/core/services/electron/electron.service';
import { APP_CONFIG } from '../environments/environment';
import { setTheme } from 'ngx-bootstrap/utils';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    previousUrls: string[] = [];

    constructor(private electronService: ElectronService, private zone: NgZone, private router: Router) {

        setTheme('bs4'); // or 'bs3'

        if (electronService.isElectron) {

        } else {
            console.log('Run in browser');
        }

        this.handleMenuBackButton();

    }

    handleMenuBackButton() {
        this.electronService.ipcRenderer.on('menu-back', () => {
            this.zone.run(() => {
                this.previousUrls.pop();
                const url = this.previousUrls.pop();
                if (!url)
                    this.router.navigateByUrl('/');
                else this.router.navigateByUrl(url);

            });
        });
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.previousUrls.push(event.url);
            });
    }
}
