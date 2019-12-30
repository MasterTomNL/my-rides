import { Pipe, PipeTransform } from '@angular/core';
import { Ride } from './ride';

@Pipe({
  name: 'rideVehicle'
})
export class RideVehiclePipe implements PipeTransform {

  transform(rides: any[], filterVehicle: any, filterPrivate: boolean): any {
    // no rides?
    if (!rides)
      return rides;
        
    // filter by vehicle
    if (filterVehicle)
      rides = rides.filter(ride => ride.vehicle == filterVehicle);
    
    // show only private
    if (filterPrivate)
      rides = rides.filter(ride => ride.isPrivate);
    
    return rides;
  }
}