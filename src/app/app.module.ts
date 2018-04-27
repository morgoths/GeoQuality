import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { GmapComponent } from './gmap/gmap.component';
import { HttpModule } from '@angular/http';
import { NouisliderModule } from 'ng2-nouislider';
import { NbThemeModule } from '@nebular/theme';
import { RouterModule, Routes } from '@angular/router'; // we also need angular router for Nebular to function properly
import { NbSidebarModule, NbLayoutModule, NbSidebarService, NbCardModule, NbMenuModule, NbMenuService} from '@nebular/theme';

const appRoutes: Routes = [
  { path: 'crisis-center', component: GmapComponent },
  { path: 'hero/:id',      component: GmapComponent },
  {
    path: 'heroes',
    component: GmapComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  { path: '**', component: GmapComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GmapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    NouisliderModule,
    NbThemeModule.forRoot({ name: 'default' }),
    RouterModule.forRoot(appRoutes, { useHash: true }),
    NbLayoutModule,
    NbSidebarModule,
    NbCardModule,
    NbMenuModule
  ],
  providers: [NbSidebarService, NbMenuModule.forRoot().providers],
  bootstrap: [AppComponent]
})
export class AppModule { }
