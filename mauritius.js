// map sources
var mbAttr = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
		mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXcyMDE3IiwiYSI6ImNqMTRiZ3U1azAwNzgyd216bTI5dXowdWsifQ.EbMwwE9jj5OmgHOW8FOvzA';

// baselayers
var grayscale = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr});
var districts = L.geoJson(districts, {style: style_base, onEachFeature: onEachFeature_base});
var map = L.map('mapid', {
	center: [-20.38, 57.67],
	zoom: 9.5,
	layers: [grayscale]
});

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

function getColor(d) {
  return d > 5000  ? '#a50f15' :
      d > 3000  ? '#de2d26' :
      d > 1000   ? '#fb6a4a' :
      d > 500   ? '#fcae91' :
            '#fee5d9';
}
function getRadius(d) {
  return d > 5000  ? 2500 :
      d > 3000  ? 2000 :
      d > 1000   ? 1500 :
      d > 500   ? 1000 :
            500;
}

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

function onEachFeature_base(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight_base,
    click: zoomToFeature
  });
}

function resetHighlight_base(e) {
    districts.resetStyle(e.target);
		info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

var avg_totmonincgrp = [];
var avg_totfueltype = [];

for (var i=0; i<srm.length; i++) {
	  var coords = srm[i]['mvca_coords'];
	  var avg = srm[i]['totalmonthlyincome'] / srm[i]['num_records'];
		//http://stackoverflow.com/questions/1726630/formatting-a-number-with-exactly-two-decimals-in-javascript
		avg = (Math.round(avg*100)/100).toFixed(2)
		res = coords.split(", ")

		var circle = L.circle([parseFloat(res[0]), parseFloat(res[1])], {
	    color: getColor(avg),
	    fillColor: getColor(avg),
	    fillOpacity: 0.5,
	    radius: getRadius(avg)
	  });
	  circle.bindTooltip('Average monthly income: ' + avg);
	  avg_totmonincgrp.push(circle);

		var avg_fueltype = srm[i]['fuel_type'] / srm[i]['num_records'];
		avg_fueltype = Math.floor(avg_fueltype)
		var fuelIcon = L.Icon.extend({
			options: {
				iconSize:     [24, 24], // size of the icon
			  iconAnchor:   [10, 10], // point of the icon which will correspond to marker's location
			  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
			}
		});
		var gasIcon = new fuelIcon({iconUrl: 'gas.png'}),
    		woodIcon = new fuelIcon({iconUrl: 'wood.png'}),
    		electricityIcon = new fuelIcon({iconUrl: 'electricity.png'});
		if (avg_fueltype == 1) {
			var marker = L.marker([parseFloat(res[0]), parseFloat(res[1])], {icon: gasIcon});
		}
		else if (avg_fueltype == 3) {
			var marker = L.marker([parseFloat(res[0]), parseFloat(res[1])], {icon: woodIcon});
		}
		else {
			var marker = L.marker([parseFloat(res[0]), parseFloat(res[1])], {icon: electricityIcon});
		}
		// marker.bindTooltip('Average fuel type: ')
		avg_totfueltype.push(marker);
}

var income = L.layerGroup(avg_totmonincgrp);
var fuel = L.layerGroup(avg_totfueltype);

var baseLayers = {
	"Grayscale": grayscale,
	"Districts": districts,
};

var overlays = {
	"Income": income,
	"Fuel": fuel,
};

L.control.layers(baseLayers, overlays).addTo(map);

// var districts;



// districts = L.geoJson(districts, {
// 	style: style_base,
// 	onEachFeature: onEachFeature_base
// }).addTo(map);
