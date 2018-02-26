import { Component, OnInit, NgZone, ElementRef } from '@angular/core';
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

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(

    private ngZone: NgZone
  ) {}

  latitude:number;
  longitude:number;

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(46.546360, 6.649013),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

      google.maps.event.addListener(this.map, 'click', function(event) {
        var marker = new google.maps.Marker({
            position: event.latLng, 
            map: this.map,
            title : "home"
        });
        console.log("marker added")
     });


        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["address"]
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    
            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            
            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
          });
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