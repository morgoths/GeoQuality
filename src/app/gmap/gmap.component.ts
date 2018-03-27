import { Component, OnInit, NgZone, ElementRef, ViewChildren } from '@angular/core';
import { ViewChild } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { } from '@types/googlemaps';
import * as $ from 'jquery';
import * as topojson from "topojson-client";


@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})

export class GmapComponent implements OnInit {
  entries = [];
  selectedEntry: { [key: string]: any } = {
    value: null,
    description: null
  };
  textValue: string;

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
  dataCantons;
  dataDistricts;

  ngOnInit() {
    this.entries = [
      {
        description: 'Cantons',
        id: 1
      },
      {
        description: 'Districts',
        id: 2
      },
      {
        description: 'Communes',
        id: 3
      }
    ];

    var geoJsonObject;
    var mapProp = {
      center: new google.maps.LatLng(46.546360, 7.649013),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var self = this;
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);

    if (this.entries) {
      this.onSelectionChange(this.entries[0], this.map, self);
    }

    //test geoJSON
    /*
    
    $.getJSON("/assets/ch_districts.json", function (data) {
      geoJsonObject = topojson.feature(data, data.objects.districts)
      self.map.data.addGeoJson(geoJsonObject)
    });
 */
    this.map.data.addListener('click', function (event) {
      self.ngZone.run(() => {
        self.textValue = event.feature.getProperty('name');
      });

      console.log(self.textValue)
    });
   

    //end test

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
        if (this.marker !== null) {
          this.marker.setMap(null);
        }
        for (var i = 0; i < this.markersRestaurant.length; ++i) {
          this.markersRestaurant[i].setMap(null);
        }
        this.markersRestaurant = [];
        for (var i = 0; i < this.markersHopitaux.length; ++i) {
          this.markersHopitaux[i].setMap(null);
        }
        this.markersHopitaux = [];
        for (var i = 0; i < this.markersTransport.length; ++i) {
          this.markersTransport[i].setMap(null);
        }
        this.markersTransport = []

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
          query: 'station'
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


  // Changement d'un radio bouton
  onSelectionChange(entry, map, self) {
    var geoJsonObject;
    map.data.forEach(function (feature) {
      map.data.remove(feature);
    });

    switch (entry.id) {
      case 1:
        $.getJSON("/assets/ch_cantons.json", function (data) {
          geoJsonObject = topojson.feature(data, data.objects.cantons)
          map.data.addGeoJson(geoJsonObject)
        });
        break;
      case 2:
        $.getJSON("/assets/ch_districts.json", function (data) {
          geoJsonObject = topojson.feature(data, data.objects.districts)
          map.data.addGeoJson(geoJsonObject)
        });
        break;
      case 3:
        break;
    }
    
    /*
    map.data.addListener('click', function (event) {
      self.ngZone.run(() => {
        self.textValue = event.feature.getProperty('name');
      });
        

      console.log(self.textValue)
    });
    */

  }

  changeCheck(e) {
    switch (e.target.id) {
      case "Restaurant":
        for (var i = 0; i < this.markersRestaurant.length; i++) {
          var marker = this.markersRestaurant[i];
          if (!marker.getVisible()) {
            marker.setVisible(true);
          } else {
            marker.setVisible(false);
          }
        }
        break;
      case "Hopital":
        for (var i = 0; i < this.markersHopitaux.length; i++) {
          var marker = this.markersHopitaux[i];
          if (!marker.getVisible()) {
            marker.setVisible(true);
          } else {
            marker.setVisible(false);
          }
        }
        break;
      case "Transport":
        for (var i = 0; i < this.markersTransport.length; i++) {
          var marker = this.markersTransport[i];
          if (!marker.getVisible()) {
            marker.setVisible(true);
          } else {
            marker.setVisible(false);
          }
        }
        break;
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