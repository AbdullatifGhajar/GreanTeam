import {Component, inject} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {GlobalService} from "../global.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  private document = inject(DOCUMENT);

  private globalService = inject(GlobalService);
  protected isLoggedIn$ = this.globalService.isLoggedIn$;
  protected readonly title = this.globalService.title;
  protected readonly shortTitle = this.globalService.shortTitle;
  protected readonly like$ = this.globalService.like$;

  protected readonly likeString = `Like`;
  protected readonly dislikeString = `Dislike`;

  protected readonly isXSmall$ = this.globalService.isXSmall$;
  protected readonly isHandset$ = this.globalService.isHandset$;

  protected onShare() {
    navigator?.share({
      title: this.title,
      text: `Check out Greeny! Your way to a more sustainable future!`,
      url: this.document.baseURI,
    }).then(() => console.log('Shared...'));
  }

  protected onLikeDislike() {
    this.globalService.toggleLikeDislike();
  }

  protected onLogout() {
    this.globalService.logout();
  }
}
