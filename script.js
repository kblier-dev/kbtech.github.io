const airportsContainer = document.getElementById("airports-container");

// Fetch the Persian Gulf airports JSON
fetch("./persian_gulf_airports.json")
  .then((response) => response.json())
  .then((airports) => {
    airports.forEach((airport) => {
      if (!airport.latitude || !airport.longitude) return;

      // Create airport card
      const card = document.createElement("div");
      card.className = "card";

      // Create thumbnail image (static satellite)
      const thumbnail = document.createElement("img");
      thumbnail.className = "airport-thumbnail"; // new class for CSS
      thumbnail.alt = airport.name;
      thumbnail.src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${airport.longitude-0.01},${airport.latitude-0.01},${airport.longitude+0.01},${airport.latitude+0.01}&size=200,120&format=png&f=image`;

      card.appendChild(thumbnail);

      // Airport details
      const detailsHTML = `
        <p class="airport-detail"><span class="attribute">Name:</span> ${airport.name}</p>
        <p class="airport-detail"><span class="attribute">IATA:</span> ${airport.iata_code || "N/A"}</p>
        <p class="airport-detail"><span class="attribute">Country:</span> ${airport.country}</p>
      `;
      card.insertAdjacentHTML("beforeend", detailsHTML);

      // Click thumbnail to open full-screen modal Leaflet map
      thumbnail.addEventListener("click", () => {
        const modal = document.createElement("div");
        modal.className = "map-modal";

        const fullMapDiv = document.createElement("div");
        fullMapDiv.className = "map-modal-content";
        modal.appendChild(fullMapDiv);

        // Close button
        const closeBtn = document.createElement("div");
        closeBtn.className = "map-modal-close";
        closeBtn.innerHTML = "&times;";
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);

        // Initialize interactive Leaflet map
        const fullMap = L.map(fullMapDiv).setView([airport.latitude, airport.longitude], 16);
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Tiles © Esri" }
        ).addTo(fullMap);
        L.marker([airport.latitude, airport.longitude]).addTo(fullMap);

        // Close modal
        closeBtn.addEventListener("click", () => document.body.removeChild(modal));
        modal.addEventListener("click", (e) => {
          if (e.target === modal) document.body.removeChild(modal);
        });
      });

      // Append card to container
      airportsContainer.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching airports:", error));
