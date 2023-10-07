import {Component, inject} from '@angular/core';
import {GlobalService} from "../global.service";
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-sustainability',
  templateUrl: './sustainability.component.html',
  styleUrls: ['./sustainability.component.scss']
})
export class SustainabilityComponent {
  private readonly globalService = inject(GlobalService);
  private readonly router = inject(Router);
  private readonly isLoggedIn$ = this.globalService.isLoggedIn$;

  constructor() {
    this.isLoggedIn$.pipe(takeUntilDestroyed())
      .subscribe(isLoggedIn => this.onLoginStatusChange(isLoggedIn));
  }

  private onLoginStatusChange(isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate(['login']);
    }
  }
}
