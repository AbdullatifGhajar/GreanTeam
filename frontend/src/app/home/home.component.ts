import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {GlobalService} from "../global.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {HttpClient} from "@angular/common/http";
import {FormControl} from "@angular/forms";


type TravelData = {
  month: null | number,
  year: null | number,
  points: null | number,
  trips: {
    amount_car: number,
    amount_rail_bus_tram: number,
    amount_walk_bike_run: number,
    distance: number,
    end: string,
    nr_of_activities: number,
    points: number,
    saved_co2_in_g: number,
    start: string
  }[]
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly globalService = inject(GlobalService);
  private readonly router = inject(Router);
  private readonly isLoggedIn$ = this.globalService.isLoggedIn$;

  private httpClient = inject(HttpClient);


  availablePeriod: {
    firstMonth: number | null,
    firstYear: number | null,
    lastMonth: number | null,
    lastYear: number | null
  } = {
    firstMonth: null,
    firstYear: null,
    lastMonth: null,
    lastYear: null
  };

  travelData: TravelData = {
    month: null,
    year: null,
    points: null,
    trips: []
  }

  constructor() {


    this.isLoggedIn$.pipe(takeUntilDestroyed())
      .subscribe(isLoggedIn => this.onLoginStatusChange(isLoggedIn));

    const interval = this.httpClient.get('http://3.79.97.176/available_period');
    interval
      .pipe(takeUntilDestroyed())
      .subscribe((data) => {
        console.log(data);
        this.availablePeriod = data as
          {
            firstMonth: number,
            firstYear: number,
            lastMonth: number,
            lastYear: number
          };
        let month = this.availablePeriod.lastMonth! - 2;
        let year = this.availablePeriod.lastYear!;
        this.date = new Date(year, month)
        this.fetchData();
      });
  }

  private onLoginStatusChange(isLoggedIn: boolean) {
    if (!isLoggedIn) {
      this.router.navigate(['login']);
    }
  }

  fetchData() {
    if (this.date) {
      const url = `http://3.79.97.176/overview?month=${this.date.getMonth()}&year=${this.date.getFullYear()}`;
      this.httpClient.get(url).subscribe((data) => {
        console.log(data);
        this.travelData = data as TravelData;
      });
    }
  }

  date: Date | null = null;

  myFilter = (d: Date | null): boolean => {
    if (this.availablePeriod.firstYear) {
      const day = (d || new Date()).getDate();
      const month = (d || new Date()).getMonth();
      const year = (d || new Date()).getFullYear();
      const date = new Date(year, month, day);
      const start: Date = new Date(this.availablePeriod.firstYear!, this.availablePeriod.firstMonth!)
      const end: Date = new Date(this.availablePeriod.lastYear!, this.availablePeriod.lastMonth! - 1)
      return day === 1 && start <= date && date <= end;
    }
    return false;
  };

  onDateSelected() {
    this.fetchData();
  }
}
