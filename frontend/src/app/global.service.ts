import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";

type User = {name: string, email: string, password: string};


@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  readonly version: string = 'v1.0.0';
  readonly title: string = `GREENY`;
  readonly shortTitle: string = `GREENY`;

  get combinedTitle(): string {
    return `${this.title} (${this.version})`;
  }


  private users: {[email: string]: User} = {
    'lorenz@mail.de': {
      name: 'Lorenz',
      email: 'lorenz@mail.de',
      password: 'password',
    }};

  private likeStorageKey: string = 'greeny-like';
  private likeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.loadLikeDislike());
  readonly like$ = this.likeSubject.asObservable();

  private loginStatusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly isLoggedIn$ = this.loginStatusSubject.asObservable();

  private loggedInUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(this.loadLoggedInUser());
  readonly loggedInUser$ = this.loggedInUserSubject.asObservable();

  constructor() {
    this.likeSubject.subscribe(like => this.saveLikeDislike(like));
    this.loggedInUserSubject.subscribe(user => {
      if (user) {
        this.saveToLocalStorage('greeny-user', JSON.stringify(user));
        this.loginStatusSubject.next(true);
      } else {
        this.removeFromLocalStorage('greeny-user');
      }
    });
  }

  // Login functions
  get isLoggedIn(): boolean {
    if (!this.loginStatusSubject.value)
      this.loginStatusSubject.next(this.loadLoggedInUser() !== null);
    return this.loginStatusSubject.value;
  }

  private loadLoggedInUser() {
    const user = this.getFromLocalStorage('greeny-user');
    if (user) {
      const userObj = JSON.parse(user) as User;
      if (this.users.hasOwnProperty(userObj.email)) {
        const user = this.users[userObj.email];
        if (user.password === userObj.password) {
          this.loginStatusSubject.next(true);
          return user;
        }
      } else {
        this.users[userObj.email] = userObj;
        this.loginStatusSubject.next(true);
        return userObj;
      }
    }
    return null;
  }

  login(data: { password: any; email: string }) {
    if (data.email && data.password)
      if (this.users.hasOwnProperty(data.email)) {
        const user = this.users[data.email];
        if (user.password === data.password) {
          this.loginStatusSubject.next(true);
          this.loggedInUserSubject.next(user);
          return true;
        }
      }
    return false;
  }

  logout() {
    this.loginStatusSubject.next(false);
    this.loggedInUserSubject.next(null);
  }

  register(data: { name: string; password: any; email: string }) {
    if (data.email && data.password && data.name)
      if (!this.users.hasOwnProperty(data.email)) {
        this.users[data.email] = {
          name: data.name,
          email: data.email,
          password: data.password,
        };
        return this.login(data);
      }
    return false;
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
