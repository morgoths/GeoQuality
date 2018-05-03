import { Component, OnInit, NgZone, ElementRef, ViewChildren } from '@angular/core';
import { ViewChild } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { } from '@types/googlemaps';
import * as $ from 'jquery';
import * as topojson from "topojson-client";
import { Http, Response } from '@angular/http'
import { NouisliderModule } from 'ng2-nouislider';
import 'rxjs/add/operator/map'
import { StructuredType } from 'typescript';


enum States {
  Canton = 'Cantons',
  Districts = 'Districts',
  Communes = 'Communes'
}

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})



export class GmapComponent implements OnInit {
  revenue = 80000;
  revenueStart = 80000;
  serverUrl: String;
  state: States;
  entries = [];
  selectedEntry: { [key: string]: any } = {
    value: null,
    description: null
  };

  lockCanton: boolean;
  lockDistrict: boolean;
  lockCommune: boolean;
  canton: Canton;
  district: District;
  commune: Commune;
  canton_: Canton;
  district_: District;
  commune_: Commune;
  cantonInfo: string;
  districtInfo: string;
  communeInfo: string;

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(
    private ngZone: NgZone,
    private http: Http
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
    this.lockCanton = this.lockDistrict = this.lockCommune = true;
    this.serverUrl = 'https://geoqualityapi.herokuapp.com';
    this.state = States.Canton;

    this.canton = new Canton();
    this.district = new District();
    this.commune = new Commune();
    this.canton_ = new Canton();
    this.district_ = new District();
    this.commune_ = new Commune();

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
    this.map.data.addListener('rightclick', function (event) {
      self.ngZone.run(() => {
        self.http.get(self.serverUrl + '/population/' + self.state.toLowerCase() + '?name=' + event.feature.getProperty('name'))
          .map((res: Response) => res.json())
          .subscribe(res => {
            switch (self.state) {
              case States.Canton:
                $.getJSON("/assets/ch_" + event.feature.getProperty('name') + "_communes.json", function (data) {
                  self.map.data.forEach(function (feature) {
                    self.map.data.remove(feature);
                  });
                  geoJsonObject = topojson.feature(data, data.objects.municipalities)
                  self.map.data.addGeoJson(geoJsonObject)
                 
                  self.state = States.Communes;
                  (<HTMLInputElement>document.getElementById("3")).checked = true;
                }).always(function () { })
                  .fail(function (event, jqxhr, exception) { console.log('error') })
                break;
              case States.Communes:
                self.map.data.forEach(function (feature) {
                  self.map.data.remove(feature);
                });
                $.getJSON("/assets/ch_cantons.json", function (data) {
                  geoJsonObject = topojson.feature(data, data.objects.cantons)
                  self.map.data.addGeoJson(geoJsonObject)
                });
                self.state = States.Canton;
                (<HTMLInputElement>document.getElementById("1")).checked = true;
                break;
              case States.Districts:
                self.map.data.forEach(function (feature) {
                  self.map.data.remove(feature);
                });
                $.getJSON("/assets/ch_cantons.json", function (data) {
                  geoJsonObject = topojson.feature(data, data.objects.cantons)
                  self.map.data.addGeoJson(geoJsonObject)
                });
                self.state = States.Canton;
                (<HTMLInputElement>document.getElementById("1")).checked = true;
                break;
            }
          })
      });
    });

    this.map.data.addListener('click', function (event) {
      self.ngZone.run(() => {
        self.http.get(self.serverUrl + '/population/' + self.state.toLowerCase() + '?name=' + event.feature.getProperty('name'))
          .map((res: Response) => res.json())
          .subscribe(res => {
            switch (self.state) {
              case States.Canton:
                if (self.lockCanton) {
                  self.canton.name = event.feature.getProperty('name');
                  self.canton.populations = res.population;

                }
                else {
                  self.canton_.name = event.feature.getProperty('name');
                  self.canton_.populations = res.population;

                }
                break;
              case States.Communes:
                self.http.get(self.serverUrl + '/impositions/' + self.state.toLowerCase() + '?revenue=' + self.revenue + '&name=' + event.feature.getProperty('name'))
                  .map((resImpos: Response) => resImpos.json())
                  .subscribe(resImpos => {
                    if (self.lockCommune) {
                      self.commune.name = event.feature.getProperty('name');
                      self.commune.populations = res.population;
                      self.commune.impot = resImpos.charge;
                    }
                    else {
                      self.commune_.name = event.feature.getProperty('name');
                      self.commune_.populations = res.population;
                      self.commune_.impot = resImpos.charge;
                    }
                  })
                break;
              case States.Districts:
                self.http.get(self.serverUrl + '/crimes/' + self.state.toLowerCase() + '?name=' + event.feature.getProperty('name'))
                  .map((resCrimes: Response) => resCrimes.json())
                  .subscribe(resCrimes => {
                    if (self.lockDistrict) {
                      self.district.name = event.feature.getProperty('name');
                      self.district.populations = res.population;
                      self.district.crimes = resCrimes.nombre;

                    } else {
                      self.district_.name = event.feature.getProperty('name');
                      self.district_.populations = res.population;
                      self.district_.crimes = resCrimes.nombre;
                    }
                  })

                break;
            }
          })
      });
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

  lockC() {
    this.lockCanton = !this.lockCanton;
    console.log(this.lockCanton)
  }
  lockD() {
    this.lockDistrict = !this.lockDistrict;
  }
  lockCo() {
    this.lockCommune = !this.lockCommune;
  }

  //test
  test(event, map) {

    console.log(event.target.id)
    var geoJsonObject;
    map.data.forEach(function (feature) {
      map.data.remove(feature);
    });

    switch (event.target.id) {
      case "1":
        $.getJSON("/assets/ch_cantons.json", function (data) {
          geoJsonObject = topojson.feature(data, data.objects.cantons)
          map.data.addGeoJson(geoJsonObject)

        });

        this.state = States.Canton;
        break;
      case "2":
        $.getJSON("/assets/ch_districts.json", function (data) {
          geoJsonObject = topojson.feature(data, data.objects.districts)
          map.data.addGeoJson(geoJsonObject)
        });
        this.state = States.Districts;
        break;
      case "3":
        $.getJSON("/assets/ch_communes.json", function (data) {
          geoJsonObject = topojson.feature(data, data.objects.municipalities)
          map.data.addGeoJson(geoJsonObject)
        });
        this.state = States.Communes;
        break;
    }
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
        this.state = States.Canton;
        break;
      case 2:
        $.getJSON("/assets/ch_districts.json", function (data) {
          geoJsonObject = topojson.feature(data, data.objects.districts)
          map.data.addGeoJson(geoJsonObject)
        });
        this.state = States.Districts;
        break;
      case 3:
        $.getJSON("/assets/ch_communes.json", function (data) {
          geoJsonObject = topojson.feature(data, data.objects.municipalities)
          map.data.addGeoJson(geoJsonObject)
        });
        this.state = States.Communes;
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

  onChangeRevenu(e) {
    this.revenue = e;
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

class Canton {
  name: string;
  populations: number;
  constructor(name?: string, populations?: number) {
    this.name = name;
    this.populations = populations

  }
}

class Commune extends Canton {
  impot: number;
  constructor(name?: string, populations?: number, impot?: number) {
    super(name, populations)
    this.impot = impot;
  }

}

class District extends Canton {
  crimes: number;
  constructor(name?: string, populations?: number, crimes?: number) {
    super(name, populations)
    this.crimes = crimes;
  }


}

