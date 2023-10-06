import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  readonly version: string = 'v1.0.0';
  readonly title: string = `Greeny`;
  readonly shortTitle: string = `Greeny`;

  get combinedTitle(): string {
    return `${this.title} (${this.version})`;
  }

  private likeStorageKey: string = 'greeny-like';
  private likeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.loadLikeDislike());
  readonly like$ = this.likeSubject.asObservable();

  constructor() {
    this.likeSubject.subscribe(like => this.saveLikeDislike(like));
  }

   // Like/Dislike functions
  get like(): boolean {
    if (!this.likeSubject.value)
      this.likeSubject.next(this.loadLikeDislike());
    return this.likeSubject.value;
  }

  toggleLikeDislike() {
    this.likeSubject.next(!this.like);
  }
  private saveLikeDislike(like: boolean) {
    this.saveToLocalStorage(this.likeStorageKey, String(like));
  }

  private loadLikeDislike(): boolean {
    const like = this.getFromLocalStorage(this.likeStorageKey);
    if (like) {
      return like === 'true';
    } else {
      return false;
    }
  }

    // General localStorage functions
  private saveToLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private getFromLocalStorage(key: string): string | null {
    return localStorage.getItem(key);
  }

  private removeFromLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  private clearLocalStorage() {
    localStorage.clear();
  }

  // Misc functions
  readonly isXSmall$: Observable<boolean> = inject(BreakpointObserver)
      .observe([Breakpoints.XSmall])
      .pipe(
          map(result => result.matches),
          shareReplay()
      );

  readonly isHandset$: Observable<boolean> = inject(BreakpointObserver)
      .observe([Breakpoints.Handset])
      .pipe(
          map(result => result.matches),
          shareReplay()
      );

  readonly isTablet$: Observable<boolean> = inject(BreakpointObserver)
      .observe([Breakpoints.Tablet])
      .pipe(
          map(result => result.matches),
          shareReplay()
      );

  readonly isTabletPortrait$: Observable<boolean> = inject(BreakpointObserver)
      .observe([Breakpoints.TabletPortrait])
      .pipe(
          map(result => result.matches),
          shareReplay()
      );
}
