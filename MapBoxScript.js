var zoomLevel = 12;



mapboxgl.accessToken = 'pk.eyJ1IjoiaW5pZGV3aW4iLCJhIjoiY2w3MGo5ZGdwMGV6NDN4czl6NW41NGI0YyJ9.j7Bdi3mRI3ADKM9AJDB-wg';

navigator.geolocation.getCurrentPosition(successLocation, errorLocation,{ enableHighAccuracy: true });

//
function successLocation(position) {
    console.log(position);
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

    // add markers to map
    for (const feature of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        //new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map);

        //set up User Marker
        new mapboxgl.Marker(el).setLngLat(center)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
            )
            .addTo(map);
    }
}


const geojson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-77.032, 38.913]
            },
            properties: {
                title: 'Mapbox',
                description: 'Washington, D.C.'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [-122.414, 37.776]
            },
            properties: {
                title: 'Mapbox',
                description: 'San Francisco, California'
            }
        }
    ]
};


onwheel = (event) => { 
    console.log("zooom");
};

/*
Android zoom level:
int currentZoomLevel = mapboxMap.getCameraPosition().zoom;

*/

