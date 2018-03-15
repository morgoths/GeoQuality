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
  marker = null;
  markersRestaurant = [];
  markersHopitaux = [];
  markersTransport = [];

  ngOnInit() {
    var mapProp = {
      center: new google.maps.LatLng(46.546360, 6.649013),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

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

        // reset marker
        if(this.marker !== null){
          this.marker.setMap(null);
        }
        for (var i = 0; i < this.markersRestaurant.length; ++i) {
          this.markersRestaurant[i].setMap(null);
          this.markersRestaurant.splice(i, 1);
        }
        for (var i = 0; i < this.markersHopitaux.length; ++i) {
          this.markersHopitaux[i].setMap(null);
          this.markersHopitaux.splice(i, 1);
        }
        for (var i = 0; i < this.markersTransport.length; ++i) {
          this.markersTransport[i].setMap(null);
          this.markersTransport.splice(i, 1);
        }




        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.latitude, this.longitude),
          map: this.map,
          title: "home"
        });

        var request = {
          location: new google.maps.LatLng(this.latitude, this.longitude),
          radius: 100,
          query: 'restaurant'
        };
        var requestHopital = {
          location: new google.maps.LatLng(this.latitude, this.longitude),
          radius: 100,
          query: 'hospital'
        };
        var requestTransport = {
          location: new google.maps.LatLng(this.latitude, this.longitude),
          radius: 100,
          query: 'subway_station'
        };

        var service = new google.maps.places.PlacesService(this.map);
        service.textSearch(request, callback.bind(this));
        service.textSearch(requestHopital, callbackHopital.bind(this));
        service.textSearch(requestTransport, callbackTransport.bind(this));

        function callback(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i], this.map, this.markersRestaurant, "restaurant");
            }
          }
        }
        function callbackHopital(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i], this.map, this.markersHopitaux, "hopital");
            }
          }
        }
        function callbackTransport(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarker(results[i], this.map, this.markersTransport, "transport");
            }
          }
        }

        function createMarker(place, map, markers, type) {
          var infoWindow = new google.maps.InfoWindow();
          
          var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location,
            icon: "/assets/images/" + type + ".png",
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

        this.marker = marker;
        
      });
    });
  }

  changeCheck(e){
    console.log(e.target.id);
    console.log(e.target.checked)
    console.log(this.markersRestaurant)
    for (var i = 0; i < this.markersRestaurant.length; i++) {
      var marker = this.markersRestaurant[i];
      if (!marker.getVisible()) {
        marker.setVisible(true);
      } else {
        marker.setVisible(false);
      }
    }
        
  }



  setMapType(mapTypeId: string) {
    this.map.setMapTypeId(mapTypeId)
  }

  setCenter(e: any) {
    e.preventDefault();
    this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
  }
}