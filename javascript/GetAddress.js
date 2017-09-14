
      var testPositions = [];
      var enteredAddresses = [];
      var startPosition = [];
      var markerPositions = [];
      var map;

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: {lat: 39.67, lng: -101.39}
        });
        var geocoder = new google.maps.Geocoder();

        document.getElementById('submit').addEventListener('click', function() {
          geocodeAddress(geocoder, map);
        });

        document.getElementById('nextStep').addEventListener('click', function(){
          updateOptions();
        });
      }

      function updateList(){
        document.getElementById('listOfItems').innerHTML = "";
        if (enteredAddresses.length > 0){
          document.getElementById('listOfItems').innerHTML = "<b>Entered Addresses</b><br>";
          for (var i = 0; i < enteredAddresses.length; i++)
          {
            document.getElementById('listOfItems').innerHTML += "<LI class='testPos'>" + enteredAddresses[i]
          }
          document.getElementById('listOfItems').innerHTML += "<br>"
        }
        if (startPosition.length > 0){
          document.getElementById('listOfItems').innerHTML += "<b>Start Address</b><br>";
          for (var i = 0; i < startPosition.length; i++)
          {
            document.getElementById('listOfItems').innerHTML += "<LI>" + startPosition[i]
          }
        }
        var listItems = document.getElementsByTagName("li"); // or document.querySelectorAll("li");
        for (var i = 0; i < listItems.length; i++) {
          listItems[i].onclick = function() {
            removeFromLists(this, i);
            this.parentNode.removeChild(this);

          }
        }
      }

      function removeFromLists(i, arrayPos){
        console.log(typeof(i));
      }

      function updateOptions(){
        var nextStepValue = document.getElementById('nextStep').value;
        if (nextStepValue == "Next"){
          document.getElementById('nextStep').value = "Run";
          document.getElementById('submit').value = "Add Start Location";
        } else {
          var marker = getShortestDistance();
          map.setCenter(marker);

        }
      }

      function getShortestDistance(){
        var shortestDistance = Number.MAX_VALUE;
        var targetMarker;
        var radiusOfEarth = 6371e3;
        for (var i = 0; i < testPositions.length; i++)
        {
          var start = startPosition[0];
          var distance = calcDistance(start, testPositions[i]);
          if (distance < shortestDistance){
            shortestDistance = distance;
            targetMarker = testPositions[i];
          }
        }
        return targetMarker;
      }

      var rad = function(x) {
        return x * Math.PI / 180;
      };

      function calcDistance(p1,p2){
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat() - p1.lat());
        var dLong = rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
          Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
      }

      function geocodeAddress(geocoder, resultsMap) {
        var address = document.getElementById('address').value;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });
            if (document.getElementById('submit').value == "Add Location"){
              testPositions.push(results[0].geometry.location);
              markerPositions.push(marker)
              enteredAddresses.push(address);
            } else {
              startPosition.push(results[0].geometry.location);
            }
            updateList();
            var bounds = new google.maps.LatLngBounds();
            if (markerPositions.length >= 2){
              for (var i = 0; i < markerPositions.length; i++) {
               bounds.extend(markerPositions[i].getPosition());
              }

              map.fitBounds(bounds);
            }
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
