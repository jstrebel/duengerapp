var map;

function createSwisstopoMap(coords){
	//from https://github.com/rkaravia/Leaflet.TileLayer.Swiss/blob/master/examples/multiple-layers.js
	// Create map and attach id to element with id "mapid"
	map = L.map('map', {
  	// Use LV95 (EPSG:2056) projection
  	crs: L.CRS.EPSG2056,
	});

	// Add Swiss layer with default options
	var swisstopomapLayer = L.tileLayer.swiss().addTo(map);
	//SatelliteLayer
	var satelliteLayer = L.tileLayer.swiss({
  	layer: 'ch.swisstopo.swissimage',
  	maxNativeZoom: 28
	});
	//OSM Layer
	/*var osmmapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});*/

	//AV Karte
	var noscale = L.tileLayer.swiss({
  	layer: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
  	maxNativeZoom: 28
	});

	// Center the map on Switzerland
	console.log(coords);
	if (coords == 'None'){
		map.fitSwitzerland();
	} else {
		encoded_coords = $('<div/>').html(coords).text()
		decoded_coords = $.parseJSON(encoded_coords)

		map.setView([decoded_coords.lat, decoded_coords.lng], decoded_coords.zoom);

	}

	//baseMaps
	var baseMaps = {
  	'Map': swisstopomapLayer,
  	'Satellite (Swissimage)': satelliteLayer,
		'Pixelkarte nicht skalliert': noscale,
		//'OSM': osmmapLayer,
	};

	L.control.layers(baseMaps, {}).addTo(map);

	map.on("moveend", function(){
		post();
	})
}
