const airportsContainer = document.getElementById("airports-container");

fetch("./persian_gulf_airports.json")
  .then(res => res.json())
  .then(airports => {
    airports.forEach(airport => {
      if (!airport.latitude || !airport.longitude) return;

      const card = document.createElement("div");
      card.className = "card";

      // Thumbnail: static placeholder image (safe and reliable)
      const thumbnail = document.createElement("img");
      thumbnail.className = "airport-thumbnail";
      thumbnail.alt = airport.name;
      thumbnail.src = `https://via.placeholder.com/300x180?text=${airport.iata_code || "N/A"}`;
      card.appendChild(thumbnail);

      // Airport details
      card.insertAdjacentHTML("beforeend", `
        <p class="airport-detail"><span class="attribute">Name:</span> ${airport.name}</p>
        <p class="airport-detail"><span class="attribute">IATA:</span> ${airport.iata_code || "N/A"}</p>
        <p class="airport-detail"><span class="attribute">Country:</span> ${airport.country}</p>
      `);

      // Click thumbnail → open full aerial map in modal
      thumbnail.addEventListener("click", () => {
        const modal = document.createElement("div");
        modal.className = "map-modal";

        const mapDiv = document.createElement("div");
        mapDiv.className = "map-modal-content";
        modal.appendChild(mapDiv);

        const closeBtn = document.createElement("div");
        closeBtn.className = "map-modal-close";
        closeBtn.innerHTML = "&times;";
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);

        // Full map
        const map = L.map(mapDiv).setView([airport.latitude, airport.longitude], 16);
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Tiles © Esri" }
        ).addTo(map);
        L.marker([airport.latitude, airport.longitude]).addTo(map);

        // Close modal
        closeBtn.addEventListener("click", () => document.body.removeChild(modal));
        modal.addEventListener("click", e => {
          if (e.target === modal) document.body.removeChild(modal);
        });
      });

      airportsContainer.appendChild(card);
    });
  })
  .catch(error => console.error("Error fetching airports:", error));
