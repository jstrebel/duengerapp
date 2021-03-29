var marker;
function search(){
	search2();
	search2();
}

function search2(){
	var place = $('#ip_place');
	var field = $('#ip_fieldname');
	var coordinates = $('#ip_coordinates');

	try {
		map.removeLayer(marker);
	} catch {
		console.log('no markers available.')
	}

	if (coordinates.val().length != 0){
		var coord = coordinates.val().split(',');
	} else {
		coord = [];
	}

	if (coord.length==2){
		if ((parseFloat(coord[0]) > 2485000 && parseFloat(coord[0]) < 2828600) && (parseFloat(coord[1]) > 1075300 && parseFloat(coord[1]) < 1230000)){
			var y = parseFloat(coord[0]);
			var x = parseFloat(coord[1]);
		}
	}

	if (typeof(x) !== 'undefined'){

		map.panTo(L.CRS.EPSG2056.unproject(L.point(y, x)));
		map.setZoom(20);

		marker = L.marker(L.CRS.EPSG2056.unproject(L.point(y, x)));
		map.addLayer(marker);//.addTo(map);
	} else {
		$.getJSON('https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=' + place.val() + ',' + field.val() + '&type=locations&sr=2056', function(result){
			if (result.results.length != 0){
				$('#contourbutton').removeClass('disabled');

				var y = result.results[0].attrs.y;
				var x = result.results[0].attrs.x;

				map.panTo(L.CRS.EPSG2056.unproject(L.point(y, x)));
				map.setZoom(20);

				marker = L.marker(L.CRS.EPSG2056.unproject(L.point(y, x)));
				map.addLayer(marker);//.addTo(map);
			} else {
				alert('Diese Lokation ist leider nicht bekannt.')
			}
		});
	}
}

function post() {
	var zoom = map.getZoom();
	var center = map.getCenter();
	$.post('/fields', {lat: center.lat, lng: center.lng, zoom: zoom});
}
