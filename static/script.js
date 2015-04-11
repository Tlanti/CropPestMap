var map;

$(function() {
	initializeMap();
	
	var date = new Date();
	$("[name='currentDate']").val(date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear());
	
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var $latInput = $("#lat");
			var $longInput = $("#long");
			
			var latitude = position.coords.latitude;
			var longitude = position.coords.longitude;
			
			map.panTo(new google.maps.LatLng(latitude,longitude));
			
			$latInput.val(latitude);
			$longInput.val(longitude);
		});
	}
});

function initializeMap() {
	var mapOptions = {
		zoom: 8
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	listMapItems(map);
}

function listMapItems(map) {
	$.ajax({
		url: "http://localhost:3000/listMap",
		method: "GET",
		dataType: "json",
		success: function(data) {
			for (var i = 0, len = data.length; i < len; i++) {
				var o = data[i];
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(o.latitude, o.longitude),
					map: map,
					title: o.pestName
				});
			}
		}, 
		error: function() {
			
		}
	});
}