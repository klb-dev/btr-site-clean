// map.js
window.initMap = function () {
  const atascosaPark = { lat: 28.97175, lng: -98.48225 };

  const map = new google.maps.Map(document.getElementById("map"), {
    center: atascosaPark,
    zoom: 15,
    mapId: "17f55c56acc3dc3761b1dee4"
  });

  const marker = new google.maps.marker.AdvancedMarkerElement({
    position: atascosaPark,
    map,
    title: "Atascosa River Park - Skatepark",
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
      <div style="font-family:sans-serif; max-width: 200px;">
        <strong>Pleasanton Skatepark</strong><br>
        River Park Rd<br>
        Pleasanton, TX 78064<br><br>
        <a href="https://www.google.com/maps/dir/?api=1&destination=28.95413,-98.48142" target="_blank" style="color:#1E88E5; text-decoration:underline;">
          🚗 Get Directions
        </a>
      </div>
    `,
  });

  marker.addListener("click", () => infoWindow.open(map, marker));
}

function loadGoogleMapsScript() {
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyCEM2AadWPq40e513thsFYXp8ShBVVEWmI&callback=initMap&libraries=marker";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}


loadGoogleMapsScript();
