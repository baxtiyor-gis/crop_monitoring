const defaultCenter = [42, 64]
const defaultZoom = 8

const cad_num = location.search.split('district=')[1]

const map = L.map('map').setView(defaultCenter, defaultZoom);

const osm = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {

})
osm.addTo(map)


const districts = district_data['features']


const findDistrict = districts.find(d => {
  return d['properties']['kadastr'] == cad_num
})

var zoom_info = 0

//map.on("zoom", (e) =>{
//    zoom_info = map.getZoom()
////    console.log(zoom_info)
//})

if (!cad_num || !findDistrict ) {
    const alL_district = L.geoJSON(district_data, {
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




    alL_district.addTo(map)
    map.fitBounds(alL_district.getBounds())
} else {
    const districtLayer = L.geoJSON(findDistrict, {
      style: districtStyle
    })
    districtLayer.addTo(map).bindTooltip(findDistrict['properties']['name'],
      { permanent: true, direction: "center", className: "my-labels" }
    ).openTooltip()
    map.fitBounds(districtLayer.getBounds())

}





