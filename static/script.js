var map;

$(function() {
	$("#menu label").click(function(e) {
		var tabId = this.getAttribute("data-tab");
		$(".tab").hide();
		$("#tab-" + tabId + ".tab").show();
	});
	
	$("button#calc").click(function(e) {
		var gdd = parseInt($("input[name='gdd']").val(), 10);
		var prec = parseInt($("input[name='prec']").val(), 10);
		var currentMonth = new Date().getMonth() + 1;
		
		if (currentMonth >= 5 && currentMonth <= 9) {
			if (gdd >= 2250 && prec < 400) {
				// There be bugs
				$("#bug-report").css("color", "red").html("Conditions for Calliptamus italicus are optimal.");
			} else {
				$("#bug-report").css("color", "green").html("Conditions for Calliptamus italicus are not optimal.");
			}
		} else {
			// No bugs
			$("#bug-report").css("color", "green").html("Conditions for Calliptamus italicus are not optimal.");
		}
		
	});
});

function initForm() {
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
			    	  console.log('No results found');
			      }
			    } else {
			    	console.log('Geocoder failed due to: ' + status);
			    }
			});
			
			map.panTo(latLong);
			
			$latInput.val(latitude);
			$longInput.val(longitude);
		});
	}
}

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

function getSavedItems(callback) {
	$.ajax({
		url: "http://localhost:3000/listMap",
		method: "GET",
		dataType: "json",
		success: function(data) {
			return callback(data);
		},
		error: function() {
			return callback([]);
		}
	});
}

function listMapItems(map, infowindow) {
	getSavedItems(function(data) {
		for (var i = 0, len = data.length; i < len; i++) {
			var o = data[i];
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(o.latitude, o.longitude),
				map: map,
				title: o.pestName
			});
			
			var content = "<ul>" +
							"<li>" + o.location + " (" + o.latitude + " / " + o.longitude + ")" + "</li>" + 
							"<li>Pest/disease: " + o.pestName + "</li>" + 
							"<li>Disease started: " + o.pestStartDate + "</li>" + 
							"<li>Area affected: " + (o.areaAffected ? o.areaAffected : "0") + "%</li>" + 
							"<li>Pesticide application: <span style='white-space: pre;'>" + (o.pesticide ? o.pesticide : "-") + "</span></li>" + 
						  "</ul>";
			if (o.fileName) {
				content += "<img src='http://localhost:3000/" + o.fileName + "' class='pest-img'/>";
			}
				
			
			bindInfoWindow(marker, map, infowindow, content);
		}
	});
}

function renderList() {
	getSavedItems(function(data) {
		var $container = $("#listing");
		var content = "";
		for (var i = 0, len = data.length; i < len; i++) {
			var o = data[i];
			content += "<div class='col-md-12'>" +
						"<div class='col-md-4'><ul>" +
							"<li>" + o.location + " (" + o.latitude + " / " + o.longitude + ")" + "</li>" + 
							"<li>Pest/disease: " + o.pestName + "</li>" + 
							"<li>Disease started: " + o.pestStartDate + "</li>" + 
							"<li>Area affected: " + (o.areaAffected ? o.areaAffected : "0") + "%</li>" + 
							"<li>Pesticide application: <span style='white-space: pre;'>" + (o.pesticide ? o.pesticide : "-") + "</span></li>" + 
						  "</ul>" +
						"</div>";
			if (o.fileName) {
				content += "<div class='col-md-4'><img src='http://localhost:3000/" + o.fileName + "' class='pest-img'/></div>";
			}
			
			content += "<div class='col-md-12'><hr/></div></div>";
		}
		$container.append(content);
	});
}

function bindInfoWindow(marker, map, infowindow, content) {
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(content);
        infowindow.open(map, marker);
    });
}