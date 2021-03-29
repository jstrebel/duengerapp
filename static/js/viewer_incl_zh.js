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
	//Landsat WMS
	var landsat = L.tileLayer.wms('https://wms.geo.admin.ch/?', {
		layers: 'ch.swisstopo.images-landsat25',//'ch.swisstopo.pixelkarte-farbe-pk500.noscale',
		maxZoom: 28
	})
	//OSM Layer
	/*var osmmapLayer = L.tileLayer('http://tile.osm.ch/2056/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	});
	osmmapLayer.options.crs = L.CRS.EPSG2056;*/
	/*var osmmapLayer = L.tileLayer.wms('https://wms.geo.bs.ch/wmsBS?', {
		layers: 'BS.HP.Historische_Stadtplaene.Stadtplan_1946',
		//maxZoom: lv95.resolutions.length,
		attribution: '<a href="http://geo.bs.ch">Kanton Basel-Stadt</a>'
	});*/
	var upUrl	=	'http://wms.zh.ch/upwms',	upLayers	=	'upwms';
	var zhUpLayer	=	L.tileLayer.wms(upUrl,	{
		layers:	upLayers,
		format:	'image/jpeg',
		version:	'1.3.0',
		maxZoom: 28,
		attributation:	"<a	href='http://gis.zh.ch' target='_blank'>GISZH</a>"
	});

	var avUrl	=	'http://wms.zh.ch/OGDAVfarbigZH',	avLayers	=	'ogdavfarbigzh';
	var zhAvLayer	=	L.tileLayer.wms(avUrl,	{
		layers:	avLayers,
		format:	'image/jpeg',
		version:	'1.3.0',
		maxZoom: 28,
		attributation:	"<a	href='http://gis.zh.ch' target='_blank'>GISZH</a>"
	});

	var orthoUrl	=	'http://wms.zh.ch/OGDOrthoZH',	orthoLayers	=	'ogdorthozh';
	var zhOrthoLayer	=	L.tileLayer.wms(orthoUrl,	{
		layers:	orthoLayers,
		format:	'image/jpeg',
		version:	'1.3.0',
		maxZoom: 28,
		attributation:	"<a	href='http://gis.zh.ch' target='_blank'>GISZH</a>"
	});

	//Karte WMS
	var noscale = L.tileLayer.wms('https://wms.geo.admin.ch/?', {
		layers: 'ch.swisstopo.pixelkarte-farbe-pk500.noscale',
		maxZoom: 28
	})

	// Center the map on Switzerland
	console.log(coords);
	if (coords == 'None'){
		map.fitSwitzerland();
		//map.setView([47.37688,	8.53668],	9);
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
		'Landsat Satellitenbilder': landsat,
		'ZH UP': zhUpLayer,
		'ZH AV': zhAvLayer,
		'ZH Ortho': zhOrthoLayer,
	};

	L.control.layers(baseMaps, {}).addTo(map);

	map.on("moveend", function(){
		post();
	})
}
