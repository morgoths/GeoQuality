import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { GmapComponent } from './gmap/gmap.component';
import { ApiComponent } from './api/api.component';
import { DatagmapComponent } from './data/gmap/datagmap.component';
import { OfsComponent } from './data/ofs/ofs.component';
import { SwissdataComponent } from './data/swissdata/swissdata.component';
import { HttpModule } from '@angular/http';
import { NouisliderModule } from 'ng2-nouislider';
import { NbThemeModule } from '@nebular/theme';
import { RouterModule, Routes } from '@angular/router'; // we also need angular router for Nebular to function properly
import { NbSidebarModule, NbLayoutModule, NbSidebarService, NbCardModule, NbMenuModule, NbMenuService} from '@nebular/theme';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  { path: 'dashboard', component: GmapComponent },
  { path: 'data/googlemap',      component: DatagmapComponent },
  { path: 'data/ofs',      component: OfsComponent },
  { path: 'data/swissopendata',      component: SwissdataComponent },
  { path: 'API',      component: ApiComponent },
  { path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: '**', component: GmapComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GmapComponent,
    ApiComponent,
    DatagmapComponent,
    OfsComponent,
    SwissdataComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NouisliderModule,
    NbThemeModule.forRoot({ name: 'default' }),
    RouterModule.forRoot(appRoutes, { useHash: true }),
    NgbModule.forRoot(),
    NbLayoutModule,
    NbSidebarModule,
    NbCardModule,
    NbMenuModule
  ],
  providers: [NbSidebarService, NbMenuModule.forRoot().providers],
  bootstrap: [AppComponent]
})
export class AppModule { }
