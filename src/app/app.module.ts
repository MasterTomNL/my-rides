import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { enableProdMode } from '@angular/core';

import { MatIconModule, MatInputModule, MatListModule, MatSelectModule, MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MessageService } from './message.service';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { RideListComponent } from './ride-list/ride-list.component';
import { LocationListComponent } from './location-list/location-list.component';

import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { RideEditComponent } from './ride-list/ride-edit/ride-edit.component';
import { RideVehiclePipe } from './ride-list/ride-vehicle.pipe';

import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireAuthModule } from '@angular/fire/auth';
import { firebaseConfig } from './firebase-config.ts';

import { RideService } from './services/ride.service';
import { LocationService } from './services/location.service';
import { VehicleService } from './services/vehicle.service';
import { StatisticsComponent } from './statistics/statistics.component';
import { SettingsComponent } from './settings/settings.component';
import { FutoshikiComponent } from './futoshiki/futoshiki.component';
import { JigsawComponent } from './jigsaw/jigsaw.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MahjongComponent } from './mahjong/mahjong.component';


const appRoutes: Routes = [
  { path: 'vehicles', component: VehicleListComponent },
  { path: 'locations', component: LocationListComponent },
  { path: 'statistics', component: StatisticsComponent },
  //{ path: 'settings', component: SettingsComponent },
  { path: 'futoshiki', component: FutoshikiComponent },
  { path: '', component: RideListComponent },
  { path: 'jigsaw', component: JigsawComponent },
  { path: 'mahjong', component: MahjongComponent },
  { path: 'rides',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatExpansionModule,
    HttpClientModule,
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    DragDropModule,

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    RideListComponent,
    LocationListComponent,
    VehicleListComponent,
    RideEditComponent,
    RideVehiclePipe,
    StatisticsComponent,
    SettingsComponent,
    FutoshikiComponent,
    JigsawComponent,
    MahjongComponent,
  ],
  bootstrap: [ AppComponent ],
  providers: [
    RideService,
    MessageService,
    LocationService,
    VehicleService,
  ],
  entryComponents: [RideEditComponent]
})
export class AppModule {}
