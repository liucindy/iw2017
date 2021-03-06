// basic map (just mapbox.light)
// var map = L.map('mapid').setView([5, 27], 3);

// L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXcyMDE3IiwiYSI6ImNqMTRiZ3U1azAwNzgyd216bTI5dXowdWsifQ.EbMwwE9jj5OmgHOW8FOvzA', {
//     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox.light',
//     // accessToken: 'pk.eyJ1IjoiaXcyMDE3IiwiYSI6ImNqMTRiZ3U1azAwNzgyd216bTI5dXowdWsifQ.EbMwwE9jj5OmgHOW8FOvzA'
// }).addTo(map);

// cities markers
// var cities = new L.LayerGroup();
//
// 	L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities),
// 	L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities),
// 	L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities),
// 	L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);


var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXcyMDE3IiwiYSI6ImNqMTRiZ3U1azAwNzgyd216bTI5dXowdWsifQ.EbMwwE9jj5OmgHOW8FOvzA';

function style_base(feature) {
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: 'white',
  };
}

function style_mobile(feature) {
	var indicator = "HC_HEFF_H_MPH2010";
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor(feature.properties[indicator])
  };
}

function style_fertility(feature) {
	var indicator = "FE_FRTR_W_GFR2010";
  return {
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: getColor_fertility(feature.properties[indicator])
  };
}

function onEachFeature_mobile(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight_mobile,
    click: zoomToFeature
  });
}

function onEachFeature_base(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight_base,
    click: zoomToFeature
  });
}

function onEachFeature_fertility(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight_fertility,
    click: zoomToFeature
  });
}

function getColor(d) {
  return d == 0 ? 'gainsboro' :
			d > 100  ? '#a50f15' :
      d > 80   ? '#de2d26' :
      d > 40   ? '#fb6a4a' :
      d > 20   ? '#fcae91' :
            		'#fee5d9';
}

function getColor_fertility(d) {
  return d == 0 ? 'gainsboro' :
			d > 100  ? '#08519c' :
      d > 80  ? '#3182bd' :
      d > 40   ? '#6baed6' :
      d > 20   ? '#bdd7e7' :
            '#eff3ff';
}

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
		streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr});
    satellite  = L.tileLayer(mbUrl, {id: 'mapbox.satellite',   attribution: mbAttr});
		fertility = L.geoJson(FE_FRTR_W_GFR, {style: style_fertility, onEachFeature: onEachFeature_fertility});
		country_names = L.geoJson(districts, {style: style_base, onEachFeature: onEachFeature_base});
		mobile = L.geoJson(HC_HEFF_H_MPH, {style: style_mobile, onEachFeature: onEachFeature_mobile})

var map = L.map('mapid', {
	center: [-20.38, 57.67],
	zoom: 9.5,
	layers: [grayscale, country_names]  // I think these are the layers that automatically get loaded
});

var baseLayers = {
	"Grayscale": grayscale,
	// "Fertility": fertility,
	// "Mobile": mobile,
	"Streets": streets,
	"Satellite": satellite,
};

var overlays = {
	"Fertility": fertility,
	"Mobile": mobile,
	// "Cities": cities
};

L.control.layers(baseLayers, overlays).addTo(map);


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
		info.update(layer.feature.properties);
}

var geojson, fertility;

function resetHighlight(e) {
    geojson.resetStyle(e.target);
		info.update();
}
function resetHighlight_fertility(e) {
    fertility.resetStyle(e.target);
		info.update();
}
function resetHighlight_base(e) {
    country_names.resetStyle(e.target);
		info.update();
}
function resetHighlight_mobile(e) {
    mobile.resetStyle(e.target);
		info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

// geojson = L.geoJson(mobile, {style: style, onEachFeature: onEachFeature}).addTo(map);
// fertility = L.geoJson(fertility, {style: style2, onEachFeature: onEachFeature2}).addTo(map);

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h4>Percent of households with mobile phones</h4>' +  (props ?
		'<b>' + props.name + '</b><br />' + props.HC_HEFF_H_MPH2008 + ' percent'
		: 'Hover over a country');
};

info.addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 20, 40, 80, 100],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i> ' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

// legend.addTo(map);

// var legend2 = L.control({position: 'bottomright'});
//
// legend2.onAdd = function (map) {
//
// 	var div = L.DomUtil.create('div', 'info legend'),
// 		grades = [0, 50, 100, 150, 200],
// 		labels = [],
// 		from, to;
//
// 	for (var i = 0; i < grades.length; i++) {
// 		from = grades[i];
// 		to = grades[i + 1];
//
// 		labels.push(
// 			'<i style="background:' + getColor(from + 1) + '"></i> ' +
// 			from + (to ? '&ndash;' + to : '+'));
// 	}
//
// 	div.innerHTML = labels.join('<br>');
// 	return div;
// };
//
// 	legend2.addTo(map);





// var geojson = L.geoJson(dhsData, {style: style}).addTo(map);
// L.geoJson(statesData, {style: style}).addTo(map);

// L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
//     subdomains: ['a','b','c']
// }).addTo( map );

// var marker = L.marker([-20, 47]).addTo(map);
// marker.bindPopup("<b>Households possessing a mobile telephone:</b><br>25.2").openPopup();
