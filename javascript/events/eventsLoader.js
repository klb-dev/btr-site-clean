/**
 * Load and render upcoming events from events.json
 * Creates DOM elements for each event and appends them to the container
 */
export async function loadEvents() {
  try {
  const res = await fetch("events.json");
  const events = await res.json();

  const container = document.querySelector(".events-container");
  if (!container) return;
  container.innerHTML = "";

  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";

    // Inject HTML for each event
    card.innerHTML = `
      <div class="event-date">
        <div class="day">${event.date}</div>
        <div class="month">${event.month}</div>
      </div>
      <div class="event-content">
        <img src="${event.image}" alt="${event.date} ${event.month} event">
        <div class="event-details">
          <i class="fas fa-map-marker-alt"></i>
          <p>${event.location}</p>
        </div>
        <div class="event-details">
          <i class="fas fa-clock"></i>
          <p>${event.time}</p>
        </div>
      </div>`;
    container.appendChild(card);
  });
    } catch (error) {
    console.error("Failed to load events:", error);
  }
}

// Auto-run when page loads
window.addEventListener("load", loadEvents);