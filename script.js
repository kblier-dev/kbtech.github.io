const airportsContainer = document.getElementById("airports-container");

// Fetch the Persian Gulf airports JSON
fetch("persian_gulf_airports.json")
  .then((response) => response.json())
  .then((airports) => {
    airports.forEach((airport) => {
      const card = document.createElement("div");
      card.className = "card";

      // Mini-map using Leaflet could go here later, for now we use placeholder
      card.innerHTML = `
        <img src="https://via.placeholder.com/150?text=${airport.iata_code || 'N/A'}" 
             alt="${airport.name}" class="airport-image">
        <p class="airport-detail"><span class="attribute">Name:</span> ${airport.name}</p>
        <p class="airport-detail"><span class="attribute">IATA:</span> ${airport.iata_code || 'N/A'}</p>
        <p class="airport-detail"><span class="attribute">Country:</span> ${airport.country}</p>
      `;
      airportsContainer.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching airports:", error));
