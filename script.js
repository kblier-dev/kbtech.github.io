const airportsContainer = document.getElementById("airports-container");

// Fetch the Persian Gulf airports JSON
fetch("persian_gulf_airports.json")
  .then((response) => response.json())
  .then((airports) => {
    airports.forEach((airport) => {
      // Skip if coordinates are missing
      if (!airport.latitude || !airport.longitude) return;

      // Create airport card
      const card = document.createElement("div");
      card.className = "card";

      // Create a div for Leaflet mini-map
      const mapDiv = document.createElement("div");
      mapDiv.style.width = "200px";
      mapDiv.style.height = "120px";
      mapDiv.style.borderRadius = "8px";
      mapDiv.style.marginBottom = "10px";
      card.appendChild(mapDiv);

      // Initialize Leaflet map
      const map = L.map(mapDiv, {
        center: [airport.latitude, airport.longitude],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
      });

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map);

      // Add marker for airport location
      L.marker([airport.latitude, airport.longitude]).addTo(map);

      // Add airport text details
      const detailsHTML = `
        <p class="airport-detail"><span class="attribute">Name:</span> ${airport.name}</p>
        <p class="airport-detail"><span class="attribute">IATA:</span> ${airport.iata_code || 'N/A'}</p>
        <p class="airport-detail"><span class="attribute">Country:</span> ${airport.country}</p>
      `;
      card.insertAdjacentHTML("beforeend", detailsHTML);

      // Append card to container
      airportsContainer.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching airports:", error));
