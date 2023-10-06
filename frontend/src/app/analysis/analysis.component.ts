import {Component, inject} from '@angular/core';
import {GlobalService} from "../global.service";
import {Router} from "@angular/router";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent {
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
