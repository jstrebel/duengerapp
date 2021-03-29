var editableLayersFields;
var drawControlFields;

var fieldcolor = '#bada55';
//var fieldcolor_error = 'red';
var field_strokeopacity = 0.5;
var field_opacity = 0.3;
var field_strokewidth = 4;
var fieldarea = 0;

var zonecolor = ['blue', 'red', 'green', 'blue', 'red'];
//var fieldcolor_error = 'red';
var zone_strokeopacity = 0.5;
var zone_opacity = 0.3;
var zone_strokewidth = 4;

var zone_perc = [0,0,0,0,0,0];
var zone_areas = [0,0,0,0,0,0];
var zone_weights = [0,0,0,0,0,0];
var valid_zones = [1,6];

/**
Funktion um die Parzelle zu zeichnen
**/
function AddDrawLayer_fields(){
	//https://github.com/Leaflet/Leaflet.draw
	editableLayersFields = new L.FeatureGroup();
  map.addLayer(editableLayersFields);

	var options = {
		position: 'topright',
    draw: {
			polyline: false,
			polygon: {
				allowIntersection: false, // Restricts shapes to simple polygons
				shapeOptions: {
					layer: 'field',
					color: fieldcolor,
					opacity: field_strokeopacity,
					fillOpacity: field_opacity,
					weight: field_strokewidth,
				}
			},
			circle: false, // Turns off this drawing tool
			rectangle: {
				allowIntersection: false, // Restricts shapes to simple polygons
				shapeOptions: {
					layer: 'field',
					color: fieldcolor,
					opacity: field_strokeopacity,
					fillOpacity: field_opacity,
					weight: field_strokewidth,
				}
			},
			marker: false
		},
		edit: {
			featureGroup: editableLayersFields, //REQUIRED!!
			edit: true,
			remove: true,
			poly: {
				allowIntersection: false,
			}
		}
	};

	drawControlFields = new L.Control.Draw(options);
	map.addControl(drawControlFields);

	map.on('draw:created', function (e) {
		var type = e.layerType,
		layer = e.layer;

		if (type === 'marker') {
			layer.bindPopup('A popup!');
		}

		if (layer.options.layer == 'field'){

			editableLayersFields.addLayer(layer);

			$('#cachingbutton').toggleClass('disabled');
			$('#nextbutton').toggleClass('disabled');

			var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]); //meters^2
			$('#op_size').val((Math.round(area/100)/100));
			$('#zone_ha_6').val((Math.round(area/100)/100));
			$('#zone_ha_7').val((Math.round(area/100)/100));

			fieldarea = area/10000;
			zone_areas[5] = fieldarea;

			map.removeControl(drawControlFields);
			var options = {
				position: 'topright',
			   draw: {
					polyline: false,
					polygon: false,
					circle: false, // Turns off this drawing tool
					rectangle: false,
					marker: false
				},
				edit: {
					featureGroup: editableLayersFields, //REQUIRED!!
					edit: true,
					remove: true,
					poly: {
						allowIntersection: false,
					}
				}
			};

			drawControlFields = new L.Control.Draw(options);
			map.addControl(drawControlFields);
		}
	});

	map.on('draw:deleted', function (e){
		var type = e.layerType,
		layers = e.layers;
		layer = Object.values(layers._layers)[0]

		if (layer.options.layer == 'field'){
			$('#cachingbutton').toggleClass('disabled');
			$('#nextbutton').toggleClass('disabled');

			$('#op_size').val('0')
			$('#zone_ha_6').val(0);
			$('#zone_ha_7').val(0);
			fieldarea = 0;
			zone_areas[5] = fieldarea;

			map.removeControl(drawControlFields);

			var options = {
				position: 'topright',
		    draw: {
					polyline: false,
					polygon: {
						allowIntersection: false, // Restricts shapes to simple polygons
						shapeOptions: {
							layer: 'field',
							color: fieldcolor,
							opacity: field_strokeopacity,
							fillOpacity: field_opacity,
							weight: field_strokewidth,
						}
					},
					circle: false, // Turns off this drawing tool
					rectangle: {
						allowIntersection: false, // Restricts shapes to simple polygons
						shapeOptions: {
							//clickable: false,
							layer: 'field',
							//showRadius: false,
							color: fieldcolor,
							opacity: field_strokeopacity,
							fillOpacity: field_opacity,
							weight: field_strokewidth,
						}
					},
					marker: false
				},
				edit: {
					featureGroup: editableLayersFields, //REQUIRED!!
					edit: true,
					remove: true,
					poly: {
						allowIntersection: false,
					}
				}
			};

			drawControlFields = new L.Control.Draw(options);
			map.addControl(drawControlFields);
		}
	});

	map.on('draw:edited', function (e){
		layers = e.layers;
		layer = Object.values(layers._layers)[0]

		if (layer.options.layer == 'field'){
			var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
			$('#op_size').val((area/10000) + ' ha');
			$('#zone_ha_6').val(0);
			$('#zone_ha_7').val(0);
			fieldarea = area;
			zone_areas[5] = fieldarea;
		}
	});
}

/**
Funktion um die einzelnen Zonen zu zeichnen
**/
function AddDrawLayer_zones(){
	//https://github.com/Leaflet/Leaflet.draw
	editableLayersZones = new L.FeatureGroup();
  map.addLayer(editableLayersZones);

	var options = {
		position: 'topright',
    draw: {
			polyline: false,
			polygon: {
				allowIntersection: false, // Restricts shapes to simple polygons
				shapeOptions: {
					layer: 'zone',
					opacity: zone_strokeopacity,
					fillOpacity: zone_opacity,
					weight: zone_strokewidth,
				}
			},
			circle: false, // Turns off this drawing tool
			rectangle: {
				allowIntersection: false, // Restricts shapes to simple polygons
				shapeOptions: {
					layer: 'zone',
					opacity: zone_strokeopacity,
					fillOpacity: zone_opacity,
					weight: zone_strokewidth,
				}
			},
			marker: false
		},
		edit: {
			featureGroup: editableLayersZones, //REQUIRED!!
			edit: true,
			remove: true,
			poly: {
				allowIntersection: false,
			}
		}
	};

	drawControlZones = new L.Control.Draw(options);
	map.addControl(drawControlZones);

	map.on('draw:created', function (e) {
		var type = e.layerType,
		layer = e.layer;

		if (type === 'marker') {
			layer.bindPopup('A popup!');
		}

		if (layer.options.layer == 'zone'){

			var zone = parseInt(prompt('Zonenr angeben (1,2,...).'));

			if (valid_zones.includes(zone)){

				var layer_field = Object.values(editableLayersFields._layers)[0];

				layer.options.color = zonecolor[zone-1];
				layer.options.zone = zone;

				if (turf.booleanWithin(layer.toGeoJSON(), layer_field.toGeoJSON())){
					console.log('IO')
				}
				else if (turf.booleanOverlap(layer.toGeoJSON(), layer_field.toGeoJSON()) == false){
					alert('Fehler: Zone nicht in Parzelle!');
					return
				}

				var baselayernames = Object.keys(editableLayersZones._layers);

				for (var layerid = 0; layerid < baselayernames.length; layerid++){
					var baselayer = editableLayersZones._layers[parseInt(baselayernames[layerid])];

					intersects(baselayer, layer)
				}

				reverse_intersects(layer, layer_field)

				calculate_area();
				calculate_weight();
				change_output();
			}
			else {
				alert('Keine gültige Zone ausgewählt.')
			}
		}
	});
	map.on('draw:deleted', function (e){
		var type = e.layerType,
		layers = e.layers;
		calculate_area();
		calculate_weight();
		change_output();

	})
	map.on('draw:edited', function (e){
		var type = e.layerType,
		layers = e.layers;
		layers = Object.values(layers._layers);

		for (var i = 0; i < layers.length; i++) {
			if (layers[i].options.layer == 'zone'){

				var layer_field = Object.values(editableLayersFields._layers)[0];

				if (turf.booleanWithin(layers[i].toGeoJSON(), layer_field.toGeoJSON())){
					console.log('IO')
				}
				else if (turf.booleanOverlap(layer.toGeoJSON(), layer_field.toGeoJSON()) == false){
					alert('Fehler: Zone nicht in Parzelle!');
					return
				}

				var baselayernames = Object.keys(editableLayersZones._layers);

				for (var layerid = 0; layerid < baselayernames.length; layerid++){
					var baselayer = editableLayersZones._layers[parseInt(baselayernames[layerid])];

					intersects(baselayer, layers[i]);

					editableLayersZones.addLayer(layers[i]);
				}

				reverse_intersects(layer, layer_field);

				calculate_area();
				calculate_weight();
				change_output();
			}
		}

		console.log(editableLayersZones._layers)

		calculate_area();
		calculate_weight();
		change_output();
	})
}

/**
Vom Parzellendef. Template zum Zonendef. Templatewechseln
**/
function next(){
	var templ2 = $('#template1_1').toggleClass('invisible');
	var templ3 = $('#template2').toggleClass('invisible');
	map.removeControl(drawControlFields);
	//map.removeLayer(editableLayersFields);
	AddDrawLayer_zones();
}

/**
Zonen auswählen
**/
function change_zone(){
	var zones = $('#ip_numbers').val();
	if (zones > 5){
		zones = 5;
		$('#ip_numbers').val(5);
	} else if (zone_areas[4] != 0){
		zones = 5;
		$('#ip_numbers').val(5);
	} else if (zone_areas[3] != 0 && zones < 4){
		zones = 4;
		$('#ip_numbers').val(4);
	} else if (zone_areas[2] != 0 && zones < 3){
		zones = 3;
		$('#ip_numbers').val(3);
	}
	else if (zone_areas[1] != 0 && zones < 2){
		zones = 2;
		$('#ip_numbers').val(2);
	}
	else if (zones < 1){
		zones = 1;
		$('#ip_numbers').val(1);
	}

	var zonerows = $('.zone');

	for (var i = 0; i < zonerows.length; i++){
		zone_perc[i] = zonerows[i].querySelector('input').value;
	}

	zonerows.remove();

	var zonetable = $('#zones');

	valid_zones = []

	var sum_ha = 0;
	var sum_kg = 0;

	for (var i = 0; i < zones; i++){
		valid_zones.push(i+1);
		var zonerow = zonetable.append("<tr class='zone'><td>Zone " + (i+1) + "</td><td><input id='zone_perc_" + (i+1) + "' type='number' min='0' max='100' value='0' onchange='change_weight()'></input></td><td><input id='zone_ha_" + (i+1) + "' type='number' value='0' readonly></input></td><td><input id='zone_kg_" + (i+1) + "' type='number' value='0' readonly></input></td></tr>");
	}

	valid_zones.push(6)

	zonetable.append("<tr class='zone'><td>Rest</td><td><input id='zone_perc_6' type='number' min='0' max='100' value='0' onchange='change_weight()'></input></td><td><input id='zone_ha_6' type='number' value='0' readonly></input></td><td><input id='zone_kg_6' type='number' value='0' readonly></input></td></tr>")

	zonetable.append("<tr class='zone'><td>Total</td><td><input id='zone_perc_7' type='number' min='0' max='100' value='' readonly></input></td><td><input id='zone_ha_7' type='number' value='0' readonly></input></td><td><input id='zone_kg_7' type='number' value='0' readonly></input></td></tr>");

	change_output();
}

/**
Düngergewicht kalkulieren
**/
function calculate_weight(){
	for (i=0; i<valid_zones.length; i++){
		var x = valid_zones[i];
		//console.log(x);
		zone_perc[x-1] = $('#zone_perc_' + (x)).val();
		//zone_areas[x-1] = $('zone_ha_' + (x)).val()
		var weight = zone_perc[x-1] * $('#ip_weight').val() * zone_areas[x-1];
		zone_weights[x] = weight;
	}
}

/**
changeweight input onchange Funktion
**/
function change_weight(){
	calculate_weight();
	change_output();
}

/**
Outputfelder anpassen
**/
function change_output(){
	var sum_ha = 0;
	var sum_kg = 0;
	for (i=0; i<valid_zones.length; i++){
		var x = valid_zones[i];

		var weight = zone_perc[x-1] * $('#ip_weight').val() * zone_areas[x-1];
		$('#zone_kg_' + (x)).val(Math.round(weight*100)/100);

		var ha = zone_areas[x-1];
		$('#zone_ha_' + (x)).val(Math.round(ha*100)/100);

		var perc = zone_perc[x-1];
		$('#zone_perc_' + (x)).val(Math.round(perc*100)/100);

		sum_ha += Math.round(ha*100)/100;
		sum_kg += Math.round(weight*100)/100;
	}

	$('#zone_ha_7').val(sum_ha);
	$('#zone_kg_7').val(sum_kg);
}

/**
Zwischenspeichern des GeoJsons
**/
function caching(){
	//https://bl.ocks.org/danswick/d30c44b081be31aea483
	// Extract GeoJson from featureGroup
  var data = editableLayersFields.toGeoJSON();

	var customer = $('#ip_customer').val();
	var fieldname = $('#ip_fieldname').val();

	data.customer = customer;
	data.fieldname = fieldname;

  // Stringify the GeoJson
  var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

	// Create export
	var filename = prompt('Filenamen eingeben', 'download.json');

	if (filename != null || filename != ""){
		document.getElementById('cachingbutton').setAttribute('href', 'data:' + convertedData);
  	document.getElementById('cachingbutton').setAttribute('download',filename);

		//document.getElementById('cachingbutton').removeAttribute('href');
  	//document.getElementById('cachingbutton').removeAttribute('download');
	}
}

/**
Speichern des GeoJsons
**/
function save(){
	var field = editableLayersFields.toGeoJSON().features[0];
	var poly1 = [];
	var poly2 = [];
	var poly3 = [];
	var poly4 = [];
	var poly5 = [];

	var multipolygons = []

	layers = Object.values(editableLayersZones._layers)

	for (var l = 0; l < layers.length; l++){
		if (layers[l].options.zone==1){
			var this_layer = layers[l].toGeoJSON();
			try {
				for (object in this_layer){
					this_layer[object].properties = {
						amount: 0.0,
						area_ha: zone_areas[0],
						avgValues: 0.0,
						rate_ha: zone_perc[0]/100
					}
				}
			}
			catch {
				console.log('only one element')
				this_layer.properties = {
					amount: 0.0,
					area_ha: zone_areas[0],
					avgValues: 0.0,
					rate_ha: zone_perc[0]/100
				}
			}
			poly1.push(this_layer)
		} else if (layers[l].options.zone==2){
			var this_layer = layers[l].toGeoJSON();
			try {
				for (object in this_layer){
					this_layer[object].properties = {
						amount: 0.0,
						area_ha: zone_areas[1],
						avgValues: 0.0,
						rate_ha: zone_perc[1]/100
					}
				}
			}
			catch {
				console.log('only one element')
				this_layer.properties = {
					amount: 0.0,
					area_ha: zone_areas[1],
					avgValues: 0.0,
					rate_ha: zone_perc[1]/100
				}
			}
			poly2.push(this_layer)
		} else if (layers[l].options.zone==3){
			var this_layer = layers[l].toGeoJSON();
			try {
				for (object in this_layer){
					this_layer[object].properties = {
						amount: 0.0,
						area_ha: zone_areas[2],
						avgValues: 0.0,
						rate_ha: zone_perc[2]/100
					}
				}
			}
			catch {
				console.log('only one element')
				this_layer.properties = {
					amount: 0.0,
					area_ha: zone_areas[2],
					avgValues: 0.0,
					rate_ha: zone_perc[2]/100
				}
			}
			poly3.push(this_layer)
		} else if (layers[l].options.zone==4){
			var this_layer = layers[l].toGeoJSON();
			try {
				for (object in this_layer){
					this_layer[object].properties = {
						amount: 0.0,
						area_ha: zone_areas[3],
						avgValues: 0.0,
						rate_ha: zone_perc[3]/100
					}
				}
			}
			catch {
				console.log('only one element')
				this_layer.properties = {
					amount: 0.0,
					area_ha: zone_areas[3],
					avgValues: 0.0,
					rate_ha: zone_perc[3]/100
				}
			}
			poly4.push(this_layer)
		} else if (layers[l].options.zone==5){
			var this_layer = layers[l].toGeoJSON();
			try {
				for (object in this_layer){
					this_layer[object].properties = {
						amount: 0.0,
						area_ha: zone_areas[4],
						avgValues: 0.0,
						rate_ha: zone_perc[4]/100
					}
				}
			}
			catch {
				console.log('only one element')
				this_layer.properties = {
					amount: 0.0,
					area_ha: zone_areas[4],
					avgValues: 0.0,
					rate_ha: zone_perc[4]/100
				}
			}
			poly5.push(this_layer)
		}
	}
	
	console.log(poly1)
	console.log(poly2)
	console.log(poly3)
	console.log(poly4)
	console.log(poly5)

	if (poly1.length >= 1){
		if (poly1.length == 1){
			poly1.push(turf.bboxPolygon([0, 0, 0, 0]))
		}
		var poly1_multi = turf.union.apply(null, poly1);
		field = turf.difference(field, poly1_multi);

		poly1_multi.properties = {
			amount: 0.0,
			area_ha: zone_areas[0],
			avgValues: 0.0,
			rate_ha: zone_perc[0]/100
		}
		multipolygons.push(poly1_multi);
	} else {
		var poly1_multi = poly1;
	}

	if (poly2.length >= 1){
		if (poly2.length == 1){
			poly2.push(turf.bboxPolygon([0, 0, 0, 0]))
		}
		var poly2_multi = turf.union.apply(null, poly2);
		field = turf.difference(field, poly2_multi);

		poly2_multi.properties = {
			amount: 0.0,
			area_ha: zone_areas[1],
			avgValues: 0.0,
			rate_ha: zone_perc[1]/100
		}
		multipolygons.push(poly2_multi);
	} else {
		var poly2_multi = poly2;
	}

	if (poly3.length >= 1){
		if (poly3.length == 1){
			poly3.push(turf.bboxPolygon([0, 0, 0, 0]))
		}
		var poly3_multi = turf.union.apply(null, poly3);
		field = turf.difference(field, poly3_multi);

		poly3_multi.properties = {
			amount: 0.0,
			area_ha: zone_areas[2],
			avgValues: 0.0,
			rate_ha: zone_perc[2]/100
		}
		multipolygons.push(poly3_multi);
	} else {
		var poly3_multi = poly3;
	}

	if (poly4.length >= 1){
		if (poly4.length == 1){
			poly4.push(turf.bboxPolygon([0, 0, 0, 0]))
		}
		var poly4_multi = turf.union.apply(null, poly4);
		field = turf.difference(field, poly4_multi);

		poly4_multi.properties = {
			amount: 0.0,
			area_ha: zone_areas[3],
			avgValues: 0.0,
			rate_ha: zone_perc[3]/100
		}
		multipolygons.push(poly4_multi);
	} else {
		var poly4_multi = poly4;
	}

	if (poly5.length >= 1){
		if (poly5.length == 1){
			poly5.push(turf.bboxPolygon([0, 0, 0, 0]))
		}
		var poly5_multi = turf.union.apply(null, poly5);
		field = turf.difference(field, poly5_multi);

		poly5_multi.properties = {
			amount: 0.0,
			area_ha: zone_areas[4],
			avgValues: 0.0,
			rate_ha: zone_perc[4]/100
		}
		multipolygons.push(poly5_multi);
	} else {
		var poly5_multi = poly5;
	}

	if (Array.isArray(field) == false && field != null){
		//console.log(field);
		field.properties = {
			amount: 0.0,
			area_ha: zone_areas[5],
			avgValues: 0.0,
			rate_ha: zone_perc[5]/100
		}
		multipolygons.push(field);
	}

	var collection = turf.featureCollection(multipolygons);

	var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(collection));

	// Create export
	var filename = prompt('Filenamen eingeben', 'download.json');

	if (filename != null || filename != ""){
		document.getElementById('savebutton').setAttribute('href', 'data:' + convertedData);
  	document.getElementById('savebutton').setAttribute('download',filename);
	}
}

function import_fields(){

	map.removeControl(drawControlFields);
	var options = {
		position: 'topright',
		draw: {
			polyline: false,
			polygon: false,
			circle: false, // Turns off this drawing tool
			rectangle: false,
			marker: false
		},
		edit: {
			featureGroup: editableLayersFields, //REQUIRED!!
			edit: true,
			remove: true,
			poly: {
				allowIntersection: false,
			}
		}
	};

	drawControlFields = new L.Control.Draw(options);
	map.addControl(drawControlFields);

	//https://www.html5rocks.com/en/tutorials/file/dndfiles/
	var files = document.getElementById('fields_ip').files;
  if (!files.length) {
    alert('Please select a file!');
    return;
  }

  var file = files[0];
	var start = 0;
  var stop = file.size - 1;

	var reader = new FileReader();

	// If we use onloadend, we need to check the readyState.
  reader.onloadend = function() {
		var json = JSON.parse(reader.result);

		//editableLayersFields.addLayer(json);
		new L.geoJSON(json, {onEachFeature: function(feature, layer){
				layer.options.layer = 'field';
				layer.options.color = fieldcolor,
		    layer.options.fillOpacity = field_opacity,
		    layer.options.opacity = field_strokeopacity,
				layer.options.weight = field_strokewidth,
        editableLayersFields.addLayer(layer);
			}
		}).addTo(map);

		$('#template1_2').toggleClass('invisible');
		$('#template1_1').toggleClass('disabled');
		$('#map').toggleClass('disabled');

		$('#cachingbutton').toggleClass('disabled');
		$('#nextbutton').toggleClass('disabled');
	}

  reader.readAsBinaryString(file);
}

function calculate_area(){
	zone_areas = [0,0,0,0,0];

	var layers = Object.values(editableLayersZones._layers);
	var sum_ha = 0;

	for (l=0; l < layers.length; l++){
		var layer = layers[l];
		var zone = layer.options.zone;
		console.log(zone);
		console.log(layer.options)

		var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]); //meters^2
		zone_areas[zone-1] = zone_areas[zone-1] + (area/10000);

		sum_ha += area/10000

		//$('#zone_ha_'+zone).val(zone_areas[zone-1]);
	}

	console.log(sum_ha)

	zone_areas.push(fieldarea-sum_ha)
}

/*function setStyle_fields() {
  return {
    color: fieldcolor,
    fillOpacity: field_opacity,
    opacity: field_strokeopacity,
		weight: field_strokewidth,
  };
}*/

/**
Intersection der einzelnen Felder
**/
//https://turfjs.org/docs/#intersect
function intersects(baseLayer, drawLayer){

	var oldoptions = baseLayer.options;

	var basepoly = baseLayer.toGeoJSON(),
			drawpoly = drawLayer.toGeoJSON();

	if (turf.booleanWithin(basepoly, drawpoly) == false){
		var intersection = turf.difference(basepoly, drawpoly);
		if (intersection == null){
			return
		}

		editableLayersZones.removeLayer(baseLayer)

		intersection_polygons = []

		if (intersection.geometry.type == 'MultiPolygon'){
			for (var i = 0; i < intersection.geometry.coordinates.length; i++){
				intersection_polygons.push(turf.polygon(intersection.geometry.coordinates[i]))
			}
		} else {
			intersection_polygons.push(intersection)
		}

		//console.log(intersection_polygons);

		for (var i = 0; i < intersection_polygons.length; i++){
			var newLayers = new L.geoJSON(intersection_polygons[i], {onEachFeature: function(feature, layer){
					layer.options = oldoptions,
				editableLayersZones.addLayer(layer);
				}
			}).addTo(map);
		}
	} else {
		editableLayersZones.removeLayer(baseLayer);
	}
}

/**
Intersection der Felder mit der Parzelle
**/
//https://turfjs.org/docs/#intersect
function reverse_intersects(baseLayer, drawLayer){

	var oldoptions = baseLayer.options;

	var basepoly = baseLayer.toGeoJSON(),
			drawpoly = drawLayer.toGeoJSON();

	console.log(turf.booleanWithin(basepoly, drawpoly))

	if (turf.booleanWithin(basepoly, drawpoly) == false){
		var intersection = turf.difference(basepoly, drawpoly);
		intersection = turf.difference(basepoly, intersection);

		if (intersection == null){
			return
		}

		editableLayersZones.removeLayer(baseLayer)

		intersection_polygons = []

		if (intersection.geometry.type == 'MultiPolygon'){
			for (var i = 0; i < intersection.geometry.coordinates.length; i++){
				intersection_polygons.push(turf.polygon(intersection.geometry.coordinates[i]))
			}
		} else {
			intersection_polygons.push(intersection)
		}

		for (var i = 0; i < intersection_polygons.length; i++){
			var newLayers = new L.geoJSON(intersection_polygons[i], {onEachFeature: function(feature, layer){
					layer.options = oldoptions,
				editableLayersZones.addLayer(layer);
				}
			}).addTo(map);
		}
	} else {
		editableLayersZones.addLayer(baseLayer);
	}
}

/**
Wert des Inputfields ändern
**/
function change_value_fieldname(){
	$('#ip_fieldname2').val($('#ip_fieldname').val())
}

function post(){
	console.log('None postfunction defined.')
}
