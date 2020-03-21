import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { LocationService } from '../services/location.service';
import { Location } from '../interfaces/location';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.css']
})
export class LocationListComponent implements OnInit {
  isAuthenticated = false;
  reloading = false;
  locations: Location[];
  loadStartedAt;
  loadInSeconds;
  savingId = 0;
  types = [
    ['home', 'home'],
    ['business', 'office'],
    ['restaurant', 'restaurant'],
    ['local_parking', 'parking'],
    ['local_gas_station', 'gas station'],
    ['local_play', 'entertainment'],
    ['person_pin', 'someone\'s home'],
    ['local_hotel', 'hotel'],
    ['local_airport', 'airport'],
    ['train', 'train'],
  ];

  constructor(
    private auth: AngularFireAuth,
    private _cdr: ChangeDetectorRef,
    private locationService: LocationService) {
      this.auth.authState.subscribe(res => {
      if (res)
        this.isAuthenticated = true;
      });
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    if (this.isAuthenticated && !this.reloading)
      this.getLocations();
    else
      setTimeout(() => this.refresh(), 2500);
  }

  getLocations(): void {
    this.loadStartedAt = Date.now();
    this.reloading = true;
    this.locationService.get()
      .subscribe(res => {
        this.locations = res;
        this.reloading = false;
        this.loadInSeconds = (Date.now() - this.loadStartedAt) / 1000;
        setTimeout(() => { this.loadInSeconds = 0; }, 2500);
        this._cdr.detectChanges();
      });
  }

  add(): void {
    this.locations.unshift({});
  }

  save(location: Location): any {
    this.savingId = location.id;
    if (!location.name) {
      console.log('need atleast a name for a location');
      return false;
    }

    const l = {
      name: _get(location.name),
      type: _get(location.type, 'business'),
      street: _get(location.street),
      houseNumber: Number(_get(location.houseNumber)),
      zip: _get(location.zip),
      city: _get(location.city),
      countryCode: _get(location.countryCode, 'NL'),
      hasPriority: _getBool(location.hasPriority),
    };
    if (location.id) {
      console.log('update a location');
      this.savingId = location.id;
      this.locationService
        .update(location.id, l)
        .then(result => { this.savingId = 0; });
    } else {
      console.log('save a NEW location');
      this.locationService
        .add(l)
        .then(result => { this.savingId = 0; });
    }
  }

  import () {
    this.locationService.import(this.locations);
  }
}

function _get(val, def?) {
  return val ? val : def ? def : '';
}
function _getBool(val, def?) {
  return val ? val : false;
}