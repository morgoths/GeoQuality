import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
import { NbMenuItem } from '@nebular/theme';
const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Mention légale',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },

  {
    title: 'Sources de données',
    icon: 'nb-keypad',
    link: '/pages/ui-features',
    children: [
      {
        title: 'Google map',
        link: '/pages/ui-features/buttons',
      },
      {
        title: 'OFS',
        link: '/pages/ui-features/grid',
      },
      {
        title: 'Swiss Open Data',
        link: '/pages/ui-features/grid',
      },
    ],
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GeoQuality';
  subTitle = " Check the quality of your futur place with your very own criteria !";
  menu = MENU_ITEMS;
}