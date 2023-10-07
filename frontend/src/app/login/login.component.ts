import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {GlobalService} from "../global.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private globalService = inject(GlobalService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  protected hide = true;
  protected loginError = false;

  constructor() {
    if (this.globalService.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  protected loginForm = this.fb.group<{ email: FormControl<string | null>, password: FormControl<string | null> }>({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, Validators.required),
  });

  protected onLogin() {
    if (this.loginForm.valid) {
      let res = this.globalService.login({email: this.loginForm.controls.email.value!, password: this.loginForm.controls.password.value!});
      if (!res) {
        this.loginError = true;
      } else {
        this.loginError = false;
        this.router.navigate(['/home']);
      }
    }
  }
}
