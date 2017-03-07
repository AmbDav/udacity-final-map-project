var map; 
var markers = [];
     
function initMap() {
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

  var locations = [
    {title: "Fountain Square Cultural District", location: {lat: 39.752023, lng: -86.139582}},
    {title: "Broad Ripple Village", location: {lat: 39.868685, lng: -86.134069}},
    {title: "Downtown Market", location: {lat: 39.768802, lng: -86.153448}},
    {title: "Canal & White River State Park", location: {lat: 39.766546, lng: -86.170786}},
    {title: "Indianapolis Museum of Art", location: {lat: 39.752023, lng: -86.184802}},
  ];
  
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

