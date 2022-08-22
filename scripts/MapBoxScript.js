var initZoomLevel = 12;
MarkerPositions = [];
Waypoints = [];
var myPosX = null;
var myPosY = null;
var updateDelay = 50;
var positionCheck = true;



mapboxgl.accessToken = 'pk.eyJ1IjoiaW5pZGV3aW4iLCJhIjoiY2w3MGo5ZGdwMGV6NDN4czl6NW41NGI0YyJ9.j7Bdi3mRI3ADKM9AJDB-wg';

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });


function successLocation(position) {
    myPosX = position.coords.longitude;
    myPosY = position.coords.latitude;

    setUpMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
    setUpMap([0, 0])
}

function setUpMap(center) {
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/inidewin/cl73a2tzf000g14mkpcjk9wyr',
        center: center,
        zoom: initZoomLevel,
    });


    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    const el = document.createElement('div');
    el.className = 'marker';



    map.on('click', function (e) {
        addMarkerToMap(e);
        function addMarkerToMap(e) {
            var coordinates = e.lngLat;
            const el = document.createElement('div');
            el.className = 'waypointMarker';

            new mapboxgl.Marker(el)
                .setLngLat(coordinates)
                .addTo(map);

            Waypoints.push(coordinates);


        }

    });


    // add markers to map
    for (const feature of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');



        if (feature.properties.title == "ME") {
            el.className = 'marker';
            //add USER Marker to map
            new mapboxgl.Marker(el).setLngLat(center)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(
                            `
                            <h3>${feature.properties.title}</h3>
                            <p>${feature.properties.description}</p>
                            
                            `
                        )
                )
                .addTo(map);
        } else {
            el.className = 'waypointMarker';
            // add WAYPOINT Markers on the Map
            new mapboxgl.Marker(el)
                .setLngLat(feature.geometry.coordinates)
                .addTo(map);
        }

        map.on('render', (function () {
            function intersectRect(r1, r2) {
                return !(r2.left > r1.right ||
                    r2.right < r1.left ||
                    r2.top > r1.bottom ||
                    r2.bottom < r1.top);
            }

            //
            function getVisibleMarkers() {
                var cc = map.getContainer();
                var els = cc.getElementsByClassName('waypointMarker');
                var ccRect = cc.getBoundingClientRect();
                var visibles = [];


                for (var i = 0; i < els.length; i++) {
                    var el = els.item(i);
                    var elRect = el.getBoundingClientRect();
                    intersectRect(ccRect, elRect) && visibles.push(el);
                }

                if (visibles.length > 0) {

                    //get every visible marker...
                    for (let visibleMarker = 0; visibleMarker < visibles.length; visibleMarker++) {
                        const el = visibles[visibleMarker];

                        //...save their position on the screen...
                        var xPos = el.getBoundingClientRect().x;
                        var yPos = el.getBoundingClientRect().y;
                        const screenPos = [xPos, yPos];

                        //.. and add these to an array of visible markers.
                        MarkerPositions.push(screenPos);

                        //get zoom level to adjust dot size
                        var zoom = map.getZoom();

                        //Clear mask, Add dots for the visible markers and rerender it (drawingTest.js)
                        AddNewPointToMask(MarkerPositions, zoom);
                    }


                    //clear Array of all points after rendering them on the new mask
                    MarkerPositions = [];
                }
            }

            //defines how often it re-fetchess visible markers
            var tm;
            return function () {
                clearTimeout(tm);
                tm = setTimeout(getVisibleMarkers, updateDelay);
            }
        }()))


        //Update map super fast when moved or zoomed
        map.on('movestart', () => {
            updateDelay = 0;
            positionCheck = false;
        });
        //and very slow when not interacted
        map.on('moveend', () => {
            updateDelay = 100;
            positionCheck = true;
        });
    }
}


const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [52.51308688158921, 13.47508773643184]
            },
            properties: {
                title: 'ME',
                description: 'Leave a photo or a message'
            }
        },

        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [13.46255929661108, 52.514011112345024]
            },
            properties: {
                title: 'YOU',
                description: 'Leave a photo or a message'
            }
        }
    ]
};



/////LOAD AND SAVE WIP

function saveAllMarkers() {

    //waypoints = e.longLat
    console.log("saving: " + Waypoints);
    for (i = 0; i < Waypoints.length; i++) {
        var key = "Wayp" + [i].toString();
        window.localStorage.setItem(key, Waypoints[i]);
    }
}

function loadAllMarkers() {
    var values = [], 
    keys = Object.keys(localStorage), 
    i = keys.length;

    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }
   

    for(i = 1; i<values.length; i++){

        longit = [values[i].longitude,values[i].latitude ];
        //WP = {values[i].LngLat}
        console.log(longit);


        //add a marker to the map again for every stored coordinate
        const el = document.createElement('div');
        el.className = 'waypointMarker';
    
        new mapboxgl.Marker(el)
            .setLngLat(coordinates) //???????
            .addTo(map);
    
        Waypoints.push(values[i]);
    
        console.log(Waypoints);
    }

}


/*Next step:
- Map extremly lags with more than 5 Waypoints. Find different (render?) solution
- Check min distance btween current Positon and every other visible marker, only place it if min distance is reached
- instead of clicking, check the distance every 5 seconds and add a new point then
- Maybe clamp zoom, or look into Marker clustering to get around rendering 100000000000 Markers at the same time (or creating polygons ?)
- Save Waypoints you added by clicking (in local storage? api??)
- maybe Menue ? eg. (change map style, change DotRadius/merge distance )
- adjust dot size based on zoom (smaller when zoomed out)

- make Android app instead :)
*/

/*
var intervalId = window.setInterval(function () {
    /// call your function here ,stop the loop:  clearInterval(intervalId) 
    console.log("check if position has changed");

    getDistanceFromLatLonInKm();
}, 5000);
*/

function getDistanceFromLatLonInKm(myPosX, myPosY, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}


/*
Android zoom level:
int currentZoomLevel = mapboxMap.getCameraPosition().zoom;

*/

