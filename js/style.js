var districtStyle = {
    fillColor: "transparent",
    color: "blue",
    weight: 2,
    dashArray: '3',
    opacity: 1,
    fillOpacity: 0.8
};



function farmerStyle(feature) {
    return {
    fillColor: "transparent",
    color: farmColor(feature.properties.baunit_type),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
    }
};

//bu_type_land_dehkan_auction

// bu_type_agricultural_enterprises - Korxonalarning qishloq xo‘jaligi yerlari

//bu_type_land_private --Yakka tartibda bog‘dorchilik, sabzavotchilik, issiqxona va chorvachilikni yurituvchi fuqarolarning yerlari

//bu_type_land_reserve Zaxiradagi qishloq xo‘jaligiga mo‘ljallangan yer uchastkasi

function farmColor(d){
    if (d == 'bu_type_land_farm') {
        return "blue"
    }
    if (d == 'bu_type_land_dehkan_auction') {
        return "yellow"
    }
    if (d == 'bu_type_agricultural_enterprises') {
        return "green"
    }
    if (d == 'bu_type_land_private') {
        return "green"
    }
    if (d == 'bu_type_land_dehkan') {
        return "red"
    }else {
        return "pink"
    }

}