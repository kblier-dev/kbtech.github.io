const airportsContainer = document.getElementById("airports-container");

// Fetch the Persian Gulf airports JSON
fetch("persian_gulf_airports.json")
  .then((response) => response.json())
  .then((airports) => {
    airports.forEach((airport) => {
      const card = document.createElement("div");
      card.className = "card";

      // Create a static map image URL centered on the airport
      const mapImageURL = `https://staticmap.openstreetmap.de/staticmap.php?center=${airport.latitude},${airport.longitude}&zoom=14&size=200x120&markers=${airport.latitude},${airport.longitude},red-pushpin`;

      // Set inner HTML with map image and airport details
      card.innerHTML = `
        <img src="${mapImageURL}" 
             alt="${airport.name}" class="airport-image">
        <p class="airport-detail"><span class="attribute">Name:</span> ${airport.name}</p>
        <p class="airport-detail"><span class="attribute">IATA:</span> ${airport.iata_code || 'N/A'}</p>
        <p class="airport-detail"><span class="attribute">Country:</span> ${airport.country}</p>
      `;

      airportsContainer.appendChild(card);
    });
  })
  .catch((error) => console.error("Error fetching airports:", error));
