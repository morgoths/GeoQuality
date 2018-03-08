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
  ) { }

  latitude: number;
  longitude: number;
  markers = [];

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(46.546360, 6.649013),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    google.maps.event.addListener(this.map, 'click', function (event) {
      // Map clic
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

        for (var i = 0; i < this.markers.length; ++i) {
          this.markers[i].setMap(null);
          this.markers.splice(i, 1);
        }

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.latitude, this.longitude),
          map: this.map,
          title: "home"
        });

        var request = {
          location: new google.maps.LatLng(this.latitude, this.longitude),
          radius: 500,
          query: 'restaurant'
        };

        var service = new google.maps.places.PlacesService(this.map);
        service.textSearch(request, callback.bind(this));

        function callback(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i], this.map, this.markers);
            }
          }
        }

        function createMarker(place, map, markers) {
          var infoWindow = new google.maps.InfoWindow();
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            title: "Restaurant",
            icon: "/assets/images/restaurant.png",
          });
          marker.addListener('click', function () {
            var request = { placeId: place.place_id };

            service.getDetails(request, function (result, status) {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                console.error(status);
                return;
              }
              infoWindow.setContent(result.name);
              infoWindow.open(map, marker);
            });
          });
          markers.push(marker)
        }

        this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));

        this.markers.push(marker);
      });
    });
  }



  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)
  }

  setCenter(e: any) {
    e.preventDefault();
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
  }
}