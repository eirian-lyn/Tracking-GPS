//myLoc.js
//window.onload = getMyLocation;
//Note that map has been globally declared.
var map;

function getMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(displayLocation)
        alert("Oops, no geolocation support");
    }
}

//This function is inokved asynchronously by the HTML5 geolocation API.
function displayLocation(position) {
    //The latitude and longitude values obtained from HTML 5 API.
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    //Creating a new object for using latitude and longitude values with Google map.
    var latLng = new google.maps.LatLng(latitude, longitude);
    // document.getElementById("layvt").style.display = "none";
    showMap(latLng);
    createMarker(latLng);

    //Also setting the latitude and longitude values in another div.
    var div = document.getElementById("location");
    div.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude;
}

function showMap(latLng) {
    //Setting up the map options like zoom level, map type.
    var mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //Creating the Map instance and assigning the HTML div element to render it in.
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

function createMarker(latLng) {
    //Setting up the marker object to mark the location on the map canvas.

    var content = "You are here: " + latLng.lat() + ", " + latLng.lng();
    var markerOptions = {
        position: latLng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: content,
        clickable: true
    }
    var marker = new google.maps.Marker(markerOptions);

    addInfoWindow(marker, latLng, content);

}

function addInfoWindow(marker, latLng, content) {
    var infoWindowOptions = {
        content: content,
        position: latLng
    };

    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);

    google.maps.event.addListener(marker, "click", function() {
        infoWindow.open(map);
    });
}