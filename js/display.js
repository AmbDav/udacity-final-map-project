var map; 
var markers = [];

function initMap(locations) {
  if (!locations) {
    locations = [];
  }
  var styles = [
    {
      "elementType": "geometry",
      "stylers": [
        {"hue": "#ff4400"},
        {"saturation": -68},
        {"lightness": -4},
        {"gamma": 0.72}
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon"
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry",
      "stylers": [
        {"hue": "#0077ff"},
        {"gamma": 3.1}
      ]
    },
    {
      "featureType": "water",
      "stylers": [
        {"hue": "#00ccff"},
        {"gamma": 0.44},
        {"saturation": -33}
      ]
    },
    {
      "featureType": "poi.park",
      "stylers": [
        {"hue": "#44ff00"},
        {"saturation": -23}
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
          {"hue": "#007fff"},
          {"gamma": 0.77},
          {"saturation": 65},
          {"lightness": 99
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {"gamma": 0.11},
        {"weight": 5.6},
        {"saturation": 99},
        {"hue": "#0091ff"},
        {"lightness": -86}
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {"lightness": -48},
        {"hue": "#ff5e00"},
        {"gamma": 1.2},
        {"saturation": -23}
      ]
    },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
      "stylers": [
      {"saturation": -64},
      {"hue": "#ff9100"},
      {"lightness": 16},
      {"gamma": 0.47},
    {"weight": 2.7}
    ]
  }
  ]

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.768403, lng: -86.158068},
    styles: styles,
    zoom: 13,
    mapTypeControl: false
  });

  var infoWindow = new google.maps.InfoWindow();
  var boundaries = new google.maps.LatLngBounds();
  var markerIcon = "img/starmarker_blue_smaller.svg";
  var highlightedIcon = "img/starmarker_green_small.svg";

  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: markerIcon,
      id: i
    });

    markers.push(marker);
    marker.addListener('click', function() {
      populateInfoWindow(this, infoWindow);
    });
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(markerIcon);
    });
    boundaries.extend(markers[i].position);
  }
  map.fitBounds(boundaries);
};

function populateInfoWindow(marker, infoWindow) {
  if (infoWindow.marker != marker) {
    infoWindow.marker = marker;
    infoWindow.setContent("<div>" + marker.title + "</div>");
    infoWindow.open(map, marker);
    infoWindow.addListener('closeclick', function() {
      infoWindow.setMarker = null;
    });
  }
}

$(function() {
  var initBinding = function(locations) {
      function AppViewModel() {
        var self = this;

        self.locations = ko.observable(locations);
        self.location = ko.observable("");

      }
    // Activates knockout.js
    ko.applyBindings(new AppViewModel());
    initMap(locations);
  };

  $.ajax({
    crossDomain: true,
    url: "http://beermapping.com/webservice/locquery/7373f5790e4ef0675288068b4059045f/indianapolis&s=json",
    method: 'GET',
  })
  .done(function(result) {
    var beerListing = result || [];
    console.log(beerListing);
    var beersWithLocation = [];
    var doneWhenBeersAre = beerListing.length;

    result.forEach(function(beerLocation) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {address: beerLocation.street + " " + beerLocation.city + ", " 
                  + beerLocation.state}, 
        function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            beerLocation.location = results[0].geometry.location;
            beersWithLocation.push(beerLocation);

            if (beersWithLocation.length == doneWhenBeersAre) {
              mappable = beersWithLocation.map(function(located) {
                return {
                  "title": located.name,
                  "location": located.location
                }
              });

              initBinding(mappable);
            }
          } else {
            window.alert('We could not find that location - try entering a more' +
              ' specific place.');
          }
        });
    })
  })
  .fail(function(err) {
    var failMessage = $("#nytimes-header");
    failMessage.text ("New York Times Articles Could Not Be Loaded");
  });
});

