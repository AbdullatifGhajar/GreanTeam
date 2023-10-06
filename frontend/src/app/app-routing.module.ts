import {inject, Injectable, NgModule} from '@angular/core';
import {RouterModule, RouterStateSnapshot, Routes, TitleStrategy} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {SustainabilityComponent} from "./sustainability/sustainability.component";
import {HomeComponent} from "./home/home.component";
import {Title} from "@angular/platform-browser";
import {GlobalService} from "./global.service";
import {AnalysisComponent} from "./analysis/analysis.component";
import {AwardsComponent} from "./awards/awards.component";

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  private readonly titleService = inject(Title);
  private readonly baseTitle = inject(GlobalService).title;

  constructor() {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title) {
      this.titleService.setTitle(`${title} | ${this.baseTitle}`);
    } else {
      this.titleService.setTitle(`${this.baseTitle}`);
    }
  }
}

const routes: Routes = [
  {path: 'home', component: HomeComponent, title: ''},
  {path: 'login', component: LoginComponent, title: 'Login'},
  {path: 'register', component: RegisterComponent, title: 'Register'},
  {path: 'awards', component: AwardsComponent, title: 'Awards'},
  {path: 'analysis', component: AnalysisComponent, title: 'Analysis'},
  {path: 'sustainability', component: SustainabilityComponent, title: 'Sustainability'},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {bindToComponentInputs: true})],
  exports: [RouterModule],
  providers: [{
    provide: TitleStrategy,
    useClass: TemplatePageTitleStrategy
  }],
})
export class AppRoutingModule {
}
