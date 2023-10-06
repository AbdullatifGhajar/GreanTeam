import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GlobalService} from "../global.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private globalService = inject(GlobalService);
  private fb = inject(FormBuilder);

  protected hide = true;

  protected loginForm= this.fb.group<{email: FormControl<string | null>, password: FormControl<string | null>}>({
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    password: new FormControl<string | null>(null, Validators.required),
  });

  protected onLogin() {
    this.globalService.login({email: this.loginForm.controls.email.value!, password: this.loginForm.controls.password.value!});
  }
}
