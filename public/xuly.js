//var socket = io("https://demotracking.herokuapp.com");

var socket = io("http://localhost:3000/");
var socketid = "";
socket.on("sever-connect", function(cc) {
    socketid = cc;
});
const markers = [];
var mymap;
$(document).ready(function() {
    mymap = L.map("mapIss").setView([0, 0], 1);
    const icons = [];
    var LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: "leaf-shadow.png",
            iconSize: [38, 95],
            shadowSize: [50, 64],
            iconAnchor: [22, 94],
            shadowAnchor: [4, 62],
            popupAnchor: [-3, -76],
        },
    });
    var greenIcon = new LeafIcon({ iconUrl: "leaf-green.png" }),
        redIcon = new LeafIcon({ iconUrl: "leaf-red.png" }),
        orangeIcon = new LeafIcon({ iconUrl: "leaf-orange.png" });
    icons.push(greenIcon, redIcon, orangeIcon);

    // L.marker([10.6299392, 107.0792704], { icon: icons[1] }).addTo(mymap);
    L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: "mapbox/streets-v11",
            tileSize: 512,
            zoomOffset: -1,
            accessToken: "pk.eyJ1Ijoic3VwdXN5ZGEiLCJhIjoiY2t1bmgzdm8xMHRtdzMwdGh1bWVqZDVsbiJ9.wsUOqnBzWqqo1_krY2fOzg",
        }
    ).addTo(mymap);

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            async function draw(options) {
                const response = await fetch("/ ", options);
                const location = await response.json();
                location.map(function(e) {
                    const flag = markers
                        .map(function(e) {
                            return e.user;
                        })
                        .indexOf(e.username);
                    if (flag < 0) {
                        const colorNum = Math.floor(Math.random() * 3);
                        const marker = L.marker(
                                [e.lat, e.long],

                                {
                                    icon: icons[colorNum],
                                }
                            )
                            .addTo(mymap)
                            .bindPopup(`<b>Hello world!</b><br>I am ${e.username}).`)
                            .openPopup();
                        markers.push({ user: e.username, mark: marker });
                    } else {
                        markers[flag].mark.setLatLng([e.lat, e.long]);
                    }
                });
                console.log(markers);
            }
            $("#submit").click(function() {
                $("#show").show()
                const username = $("#username").val();
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                $("#lat").val(latitude);
                $("#lon").val(longitude);
                const data = { latitude, longitude, username, socketid };
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                };
                draw(options);
                $("#content").show();
                $("#userInput").hide();

                setInterval(() => {
                    draw(options);
                }, 2000);
            });
        });
    }
});
socket.on("close", function(data) {
    const dele = markers
        .map(function(e) {
            return e.user;
        })
        .indexOf(data);

    const removed = markers.splice(dele);
    console.log(data);
    mymap.removeLayer(removed[0].mark);
});