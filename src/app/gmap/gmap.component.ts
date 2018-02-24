import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {
  
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  latitude:number;
  longitude:number;

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(46.546360, 6.649013),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(46.546360, 6.649013),
        map: this.map,
        title: 'Click to zoom'
      });

    marker.addListener('click', function() {
    this.map.setZoom(8);
    this.map.setCenter(marker.getPosition());
    });

  }

  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)    
  }

  setCenter(e:any){
    e.preventDefault();
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
  }
}