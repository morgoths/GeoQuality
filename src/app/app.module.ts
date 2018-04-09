import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { GmapComponent } from './gmap/gmap.component';
import { HttpModule } from '@angular/http';
import { NouisliderModule } from 'ng2-nouislider';


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
    NouisliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
