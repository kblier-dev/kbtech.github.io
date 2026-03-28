const airportsContainer = document.getElementById("airports-container");

// Fetch the Persian Gulf airports JSON
fetch("persian_gulf_airports.json")
  .then((response) => response.json())
  .then((airports) => {
    airports.forEach((airport) => {
      if (!airport.latitude || !airport.longitude) return;

      // Create airport card
      const card = document.createElement("div");
      card.className = "card";

      // Create a div for mini-map thumbnail
      const mapDiv = document.createElement("div");
      card.appendChild(mapDiv);

      // Initialize mini-map (satellite)
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

      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles © Esri" }
      ).addTo(map);

      L.marker([airport.latitude, airport.longitude]).addTo(map);

      // Airport details
      const detailsHTML = `
        <p class="airport-detail"><span class="attribute">Name:</span> ${airport.name}</p>
        <p class="airport-detail"><span class="attribute">IATA:</span> ${airport.iata_code || "N/A"}</p>
        <p class="airport-detail"><span class="attribute">Country:</span> ${airport.country}</p>
      `;
      card.insertAdjacentHTML("beforeend", detailsHTML);

      // Click to open full-screen modal map
      mapDiv.style.cursor = "pointer";
      mapDiv.addEventListener("click", () => {
        // Create modal
        const modal = document.createElement("div");
        modal.className = "map-modal";

        // Full map container
        const fullMapDiv = document.createElement("div");
        fullMapDiv.className = "map-modal-content";
        modal.appendChild(fullMapDiv);

        // Close button
        const closeBtn = document.createElement("div");
        closeBtn.className = "map-modal-close";
        closeBtn.innerHTML = "&times;";
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);

        // Initialize full map
        const fullMap = L.map(fullMapDiv).setView([airport.latitude, airport.longitude], 16);
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Tiles © Esri" }
        ).addTo(fullMap);
        L.marker([airport.latitude, airport.longitude]).addTo(fullMap);

        // Close modal
        closeBtn.addEventListener("click", () => document.body.removeChild(modal));
        // Also close if click outside the map content
        modal.addEventListener("click", (e) => {
          if (e.target === modal) document.body.removeChild(modal);
        });
      });

      // Append card to container
      airportsContainer.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching airports:", error));
