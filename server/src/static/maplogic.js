// Ez a kod a Leaflet.js (https://leafletjs.com/) nevu konyvtarat hasznalja a terkep megjelenitesere

// Inicializaljuk a terkepet. Az index.hml-ben talalhato 'mapid' id-vel rendelkezo div-be agyazzuk bele.
const mymap = L.map('mapid').locate({
    setView: true
});

// Hozzarendeljuk a tilelayert a terkephez, ez felelos az utcarajz megjelentiseert.
// Az open street maps tilelayer implementaciojat hasznaljuk mert az ingyenes.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(mymap);

// ezekben a valtozokban taroljuk majd a markereket es a vonalat
let polyline = null;
let markers = null;

function onMapClick(e) {
    // ez a fuggveny akkor lesz meghivva mikor a terkepbe kattintunk.
    if (polyline == null) {
        // ha meg nincs vonal a terkepen, akkor inicializaljuk, es hozzarendeljuk a koordinatat,
        // majd rahelyezzuk a terkepre
        polyline = L.polyline([e.latlng]);
        polyline.addTo(mymap);
    } else {
        // ha mar van vonal, akkor csak hozzaadjuk az uj pontot ahova kell vonalat huzni.
        polyline.addLatLng(e.latlng);
    }
    if (markers == null) {
        // ha meg nincs marker inicializalva, akkor inicializaluk egy layer csoportot ahova a
        // markereket adjuk majd es ezt a csoportot rahelyezzuk a terkepre.
        markers = L.featureGroup();
        markers.addTo(mymap);
    }
    // belehelyezzuk az uj markert a csoportba
    markers.addLayer(L.marker(e.latlng));
}
function onSendClick() {
    // ez a fuggveny akkor lesz meghivva mikor a "Send coordinates" gomb kerul megnyomasra
    if (polyline != null) {
        // ha a terkepen van vonal, ezek koordinatait elkuldjuk a szerverre:
        // egy HTTP POST request-et hajtunk vegre a koordinatakkal a "coordinates" endpoint-re
        const geo_json = polyline.toGeoJSON();
        $.ajax("coordinates", {
            data: JSON.stringify(geo_json),
            contentType: 'application/json',
            type: 'POST',
            success: function (data) {
                alert("Coordinates are sent! Clearing the map!");
                console.log(data);
                // ha sikeres a koordinatak kuldese eltavolitjuk a terkeprol a markereket es a vonalat
                clearMap();
            },
            error: function (data) {
                alert("Failed to send the data, see the console for more info!");
                console.log(data);
            }
        });
    }
}

function onClearCoordinatesClick() {
    // ez a fuggveny akkor lesz meghivva mikor a "Clear coordinates" gombra kattintunk
    // egy HTTP DELETE requestet hajt vegre ami torli a szerveren tarolt koordinatakat
    alert("Going to clear the coordinates on the server!");
    $.ajax("coordinates", {
        type: 'DELETE',
        success: function (data) {
            alert("Coordinates are cleared on the server!")
        },
        error: function (data) {
            alert("Failed to clear the coordinates on the server!")
        }
    })
}

function onClearClick() {
    // ez a fuggveny akkor lesz meghivva amikor a "Clear map" gombra kattintunk
    // torli a vonalat es a markereket a terkepen
    alert("I'm going to clear the map!");
    clearMap();
}

function clearMap() {
    // ez a fuggveny torli a vonalat es amarkereket a terkepen
    if (polyline != null) {
        mymap.removeLayer(polyline);
        polyline = null;
    }
    if (markers != null) {
        mymap.removeLayer(markers);
        markers = null;
    }
}

// hozzarendeljuk a click esemenyt a terkepunkhoz, igy tudja hogy melyik fuggvenyt kell meghivnia ha belekattintunk
mymap.on('click', onMapClick);
