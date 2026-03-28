// script.js
const airportsContainer = document.getElementById("airports-container");

fetch("./persian_gulf_airports.json")
  .then((response) => response.json())
  .then((airports) => {
    airports.forEach((airport) => {
      if (!airport.latitude || !airport.longitude) return;

      const card = document.createElement("div");
      card.className = "card";

      // Leaflet div for mini-map
      const mapDiv = document.createElement("div");
      mapDiv.className = "airport-map-div"; // <-- NEW CLASS
      card.appendChild(mapDiv);

      // Mini-map
      const miniMap = L.map(mapDiv, {
        center: [airport.latitude, airport.longitude],
        zoom: 16,
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
      ).addTo(miniMap);

      L.marker([airport.latitude, airport.longitude]).addTo(miniMap);

      // Airport details
      const detailsHTML = `
        <p class="airport-detail"><span class="attribute">Name:</span> ${airport.name}</p>
        <p class="airport-detail"><span class="attribute">IATA:</span> ${airport.iata_code || "N/A"}</p>
        <p class="airport-detail"><span class="attribute">Country:</span> ${airport.country}</p>
      `;
      card.insertAdjacentHTML("beforeend", detailsHTML);

      // Click to open full-screen map
      mapDiv.addEventListener("click", () => {
        const modal = document.createElement("div");
        modal.className = "map-modal";

        const fullMapDiv = document.createElement("div");
        fullMapDiv.className = "map-modal-content";
        modal.appendChild(fullMapDiv);

        const closeBtn = document.createElement("div");
        closeBtn.className = "map-modal-close";
        closeBtn.innerHTML = "&times;";
        modal.appendChild(closeBtn);

        document.body.appendChild(modal);

        const fullMap = L.map(fullMapDiv).setView([airport.latitude, airport.longitude], 16);
        L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Tiles © Esri" }
        ).addTo(fullMap);
        L.marker([airport.latitude, airport.longitude]).addTo(fullMap);

        closeBtn.addEventListener("click", () => document.body.removeChild(modal));
        modal.addEventListener("click", (e) => {
          if (e.target === modal) document.body.removeChild(modal);
        });
      });

      airportsContainer.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching airports:", error));
