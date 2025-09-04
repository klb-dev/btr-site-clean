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

    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events.forEach((event) => {
      // Build a real Date for each event
      const eventDate = new Date(
        new Date().getFullYear(),
        monthMap[event.month],
        parseInt(event.date, 10)
      );
      const eventEnd = new Date(eventDate);
      eventEnd.setDate(eventEnd.getDate() + 1);
      eventEnd.setHours(0, 0, 0, 0);

      const isPast = today >= eventEnd;
      const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

      function formatMMDDYYYY(date) {
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${mm}-${dd}-${yyyy}`;
      }

      const card = document.createElement("div");
      card.className = "event-card";

      // Button states
      let btnHtml = "";
      const formatted = formatMMDDYYYY(eventDate);

      if (isPast) {
        btnHtml = `<button class="btn btn-secondary disabled-btn" disabled title="Registration closed">Registration Closed</button>`;
      } else if (diffDays > 5) {
        btnHtml = `<button class="btn btn-secondary disabled-btn" disabled title="Registration opens 5 days before the event.">Register Now</button>`;
      } else {
        btnHtml = `<a class="btn btn-primary" href="/registration-form.html?event=${encodeURIComponent(formatted)}">Register Now</a>`;
      }


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

          <div class="event-actions">
            ${btnHtml}
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load events:", error);
  }
}

// Auto-run when page loads
window.addEventListener("load", loadEvents);
