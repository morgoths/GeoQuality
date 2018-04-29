import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { NbMenuItem } from '@nebular/theme';
const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'fas fa-clipboard',
    link: '/dashboard',
    home: true,
  },
  {
    title: 'Sources de données',
    icon: 'fas fa-database',
    link: '/data',
    children: [
      {
        title: 'Google map',
        link: '/data/googlemap',
      },
      {
        title: 'OFS',
        link: '/data/ofs',
      },
      {
        title: 'Swiss Open Data',
        link: '/data/swissopendata',
      },
    ],
  },
  {
    title: 'API',
    icon: 'fas fa-server',
    link: '/API',
    home: true,
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GeoQuality - Swiss';
  subTitle = " Check the quality of your futur place with your very own criteria !";
  menu = MENU_ITEMS;
}