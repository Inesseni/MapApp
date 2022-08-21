var zoomLevel = 15;
MarkerPositions = [];
var myPosX = null;
var myPosY = null;



mapboxgl.accessToken = 'pk.eyJ1IjoiaW5pZGV3aW4iLCJhIjoiY2w3MGo5ZGdwMGV6NDN4czl6NW41NGI0YyJ9.j7Bdi3mRI3ADKM9AJDB-wg';

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, { enableHighAccuracy: true });

//
function successLocation(position) {
    //console.log(position);
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
        style: 'mapbox://styles/inidewin/cl70kiejf004j14o2iyxe4mqi',
        center: center,
        zoom: zoomLevel,
    });


    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    const el = document.createElement('div');
    el.className = 'marker';


    // add markers to map
    for (const feature of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';


        //add USER Marker to map
        if (feature.properties.title == "ME") {

            new mapboxgl.Marker(el).setLngLat(center)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(
                            `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                        )
                )
                .addTo(map);
        } else {
            // add WAYPOINT Markers ont eh Map
            new mapboxgl.Marker(el)
                .setLngLat(feature.geometry.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 }) // add popups
                        .setHTML(
                            `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                        )
                )
                .addTo(map);
        }







        map.on('render', (function () {
            function intersectRect(r1, r2) {
                return !(r2.left > r1.right ||
                    r2.right < r1.left ||
                    r2.top > r1.bottom ||
                    r2.bottom < r1.top);
            }

            function getVisibleMarkers() {
                var cc = map.getContainer();
                var els = cc.getElementsByClassName('marker');
                var ccRect = cc.getBoundingClientRect();
                var visibles = [];


                for (var i = 0; i < els.length; i++) {

                    var el = els.item(i);
                    var elRect = el.getBoundingClientRect();
                    intersectRect(ccRect, elRect) && visibles.push(el);
                }

                if (visibles.length > 0) {

                    for (let visibleMarker = 0; visibleMarker < visibles.length; visibleMarker++) {
                        const el = visibles[visibleMarker];

                        var xPos = el.getBoundingClientRect().x;
                        var yPos = el.getBoundingClientRect().y;

                        const screenPos = [xPos, yPos];
                        MarkerPositions.push(screenPos);

                        AddNewPointToMask(MarkerPositions);
                    }


                    //console.log(visibles);
                }
            }

            var tm;
            return function () {
                clearTimeout(tm);
                tm = setTimeout(getVisibleMarkers, 50);
            }
        }()))
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




onwheel = (event) => {
    //console.log("zooom");
};




/*
Android zoom level:
int currentZoomLevel = mapboxMap.getCameraPosition().zoom;

*/

