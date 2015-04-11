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
			var latLong = new google.maps.LatLng(latitude,longitude);
			var geocoder = new google.maps.Geocoder();
			
			geocoder.geocode({'latLng': latLong}, function(results, status) {
			    if (status == google.maps.GeocoderStatus.OK) {
			      if (results[1]) {
			    	  $("[name='location']").val(results[1].address_components[1].long_name);
			      } else {
			        alert('No results found');
			      }
			    } else {
			      alert('Geocoder failed due to: ' + status);
			    }
			});
			
			map.panTo(latLong);
			
			$latInput.val(latitude);
			$longInput.val(longitude);
		});
	}
	
	$("#menu label").click(function(e) {
		var tabId = this.getAttribute("data-tab");
		$(".tab").hide();
		$("#tab-" + tabId + ".tab").show();
		
		if (tabId == 3) {
			if ($("#tab-" + tabId + ".tab").find("iframe").length == 0) {
				$("#tab-" + tabId + ".tab").append("<iframe src='https://www.google.com/maps/d/embed?mid=zh2Rn1Asl0Sw.k7cdtVE8NUvA' width='640' height='480'></iframe>");
			}
		}
		
	});
});

function initializeMap() {
	var infowindow =  new google.maps.InfoWindow({
        content: ""
    });
	
	var mapOptions = {
		zoom: 8
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	listMapItems(map, infowindow);
}

function listMapItems(map, infowindow) {
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
				
				var content = "<ul>" +
								"<li>" + o.location + " (" + o.latitude + " / " + o.longitude + ")" + "</li>" + 
								"<li>Pest/disease" + o.pestName + "</li>" + 
								"<li>Disease started: " + o.pestStartDate + "</li>" + 
								"<li>Area affected: " + (o.areaAffected ? o.areaAffected : "0") + "%</li>" + 
								"<li>Pesticide application: <span style='white-space: pre;'>" + (o.pesticide ? o.pesticide : "-") + "</span></li>" + 
							  "</ul>";
				if (o.fileName) {
					content += "<img src='http://localhost:3000/" + o.fileName + "' class='pest-img'/>";
				}
					
				
				bindInfoWindow(marker, map, infowindow, content);
			}
		},
		error: function() {
			
		}
	});
}

function bindInfoWindow(marker, map, infowindow, content) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(content);
        infowindow.open(map, marker);
    });
}