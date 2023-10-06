import {Component, inject} from '@angular/core';
import {GlobalService} from "../global.service";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
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

  protected registerForm = this.fb.group({
    name: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, Validators.required),
  });

  protected onRegister() {
    if (this.registerForm.valid) {
      let res = this.globalService.register({
        name: this.registerForm.controls.name.value!,
        email: this.registerForm.controls.email.value!,
        password: this.registerForm.controls.password.value!
      });
      if (!res) {
        this.loginError = true;
      } else {
        this.loginError = false;
        this.router.navigate(['/home']);
      }
    }
  }
}
