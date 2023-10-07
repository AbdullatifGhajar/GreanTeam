import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {inject} from '@angular/core';
import {GlobalService} from "../global.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  private readonly globalService = inject(GlobalService);
  private readonly router = inject(Router);
  private readonly isLoggedIn$ = this.globalService.isLoggedIn$;

  constructor() {
    this.isLoggedIn$.subscribe(isLoggedIn => this.onLoginStatusChange(isLoggedIn));
  }

  private onLoginStatusChange(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.router.navigate(['home']);
    }
  }
}
