const defaultCenter = [42, 64]
const defaultZoom = 8

let cad_num = location.search.split('districts=')[1]
if(!cad_num){
    cad_num = "17:10"
}
const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
const grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
const streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
const satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

const baseLayers = {
		'Grayscale': grayscale,
		'Streets': streets,
		'Satellite': satellite,
		'Satellite (google)': googleSat
}


const map = L.map('map',
    {
        center: defaultCenter,
        zoom: defaultZoom,
        layers: [satellite]
    })

var layerControl = L.control.layers(baseLayers).addTo(map);



const district = districts_data['features']

const findDistricts = district.find(d => {
  return d['properties']['cadastr_num'] == cad_num
})



let farmers = null
if (!cad_num || !findDistricts ) {
    const all_districts = L.geoJSON(districts, {
      style: districtStyle,
      onEachFeature: (feature, layer) =>{}
     })
    all_districts.addTo(map)
    map.fitBounds(all_districts.getBounds())

} else {
    const districtsLayer = L.geoJSON(findDistricts, {
      style: districtStyle,

    })
    districtsLayer.addTo(map).bindTooltip(findDistricts['properties']['name'],
      { permanent: true, direction: "center", className: "my-labels" }
    ).openTooltip()
    map.fitBounds(districtsLayer.getBounds())
    map.spin(true)

    $.ajax({
        url: 'https://api.agro.uz/gis_bridge/eijara?prefix='+cad_num,
        dataType: "json"
    }).always(response => {
        farmers = L.geoJSON(response, {
            style: farmerStyle,
            onEachFeature: function (feature, layer) {
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                });

                var popupContent = '<table>';
                for (var p in feature.properties) {
                    popupContent += '<tr><td>' + p + '</td><td>'+ feature.properties[p] + '</td></tr>';
                    }
                popupContent += '</table>';
                layer.bindPopup(popupContent);
   }
        })
        farmers.addTo(map)
        console.log(response[0]['features'].length)

        map.spin(false)
    })
}

function resetHighlight(e) {
    farmers.resetStyle(e.target);
}


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'blue',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function zoomToFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: 'white',
        dashArray: '',
        fillOpacity: 0.7
    });

    map.fitBounds(e.target.getBounds());
}
//map.on('popupopen', function(centerMarker) {
//    var cM = map.project(centerMarker.popup._latlng);
//    cM.y -= centerMarker.popup._container.clientHeight/2
//    map.setView(map.unproject(cM),16, {animate: true});
//});



var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend')
    div.innerHTML = `
        <div class="legent_item">
              <span style="padding:0 15px; border:1px solid blue; margin: 0 5px"></span> Fermer xo'jaligi
        </div>
        <div class="legent_item">
              <span style="padding:0 15px; border:1px solid red; margin: 0 5px"></span> Dehqon xo'jaligi
        </div>
        <div class="legent_item">
              <span style="padding:0 15px; border:1px solid yellow; margin: 0 5px"></span> Dehqon xo'jaligi (auksion)
        </div>
        <div class="legent_item">
              <span style="padding:0 15px; border:1px solid green; margin: 0 5px"></span> Korxonalarning qishloq xo‘jaligi yerlari
        </div>
    `

    return div;
};

legend.addTo(map);








