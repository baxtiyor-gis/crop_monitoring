const defaultCenter = [42, 64]
const defaultZoom = 8

let cad_num = location.search.split('districts=')[1]
if(!cad_num){
    cad_num = "17:10"
}

const map = L.map('map').setView(defaultCenter, defaultZoom);

const osm = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {

})
osm.addTo(map)

const district = districts_data['features']

const findDistricts = district.find(d => {
  return d['properties']['cadastr_num'] == cad_num
})

var zoom_info = 0

let farmers = null
if (!cad_num || !findDistricts ) {
    const all_districts = L.geoJSON(districts, {
      style: districtStyle,
      onEachFeature: (feature, layer) =>{
//             layer.bindTooltip(feature['properties']['name'], { permanent: true, direction: "center", className: "my-labels" }).openTooltip()
        }
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
        color: 'blue',
        dashArray: '',
        fillOpacity: 0.7
    });

    map.fitBounds(e.target.getBounds());
}
map.on('popupopen', function(centerMarker) {
    var cM = map.project(centerMarker.popup._latlng);
    cM.y -= centerMarker.popup._container.clientHeight/2
    map.setView(map.unproject(cM),16, {animate: true});
});











