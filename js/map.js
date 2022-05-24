const defaultCenter = [42, 64]
const defaultZoom = 8

const cad_num = location.search.split('regions=')[1]

const map = L.map('map').setView(defaultCenter, defaultZoom);

const osm = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {

})
osm.addTo(map)


const regions = regions_data['features']


const findRegions = regions.find(d => {
  return d['properties']['cadastr_num'] == cad_num
})

var zoom_info = 0

//map.on("zoom", (e) =>{
//    zoom_info = map.getZoom()
////    console.log(zoom_info)
//})

if (!cad_num || !findRegions ) {
    const alL_regions = L.geoJSON(regions, {
      style: districtStyle,
      onEachFeature: (feature, layer) =>{
            map.on("zoom", (e) =>{
                zoom_info = map.getZoom()
                console.log(zoom_info)
                if(zoom_info > 10){
                     layer.bindTooltip(feature['properties']['name'], { permanent: true, direction: "center", className: "my-labels" }).openTooltip()

                    }
        })
      }
    })




    alL_regions.addTo(map)
    map.fitBounds(alL_regions.getBounds())
} else {
    const regionsLayer = L.geoJSON(findRegions, {
      style: districtStyle
    })
    regionsLayer.addTo(map).bindTooltip(findRegions['properties']['name'],
      { permanent: true, direction: "center", className: "my-labels" }
    ).openTooltip()
    map.fitBounds(regionsLayer.getBounds())

}

map.spin(true)

$.ajax({
    url: 'https://api.agro.uz/gis_bridge/eijara?prefix='+cad_num,
    dataType: "json"
}).always(response => {
    L.geoJSON(response).addTo(map)
          map.spin(false);
})

//setTimeout(function () {
//       fetch('https://api.agro.uz/gis_bridge/eijara?prefix='+cad_num)
//            .then(res => res.json())
//            .then(data =>{
//                L.geoJSON(data).addTo(map)
//                console.log(cad_num)
//            })
//
//          map.spin(false);
//      }, 10000);







