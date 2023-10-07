import {Component, inject} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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
