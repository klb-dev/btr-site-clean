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
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events.forEach((event) => {
      // Build a real Date for each event
      const monthName = String(event.month || "")
        .trim()
        .toLowerCase();
      const monthIndex = monthMap[monthName];
      const dayNum = parseInt(event.date, 10);
      if (typeof monthIndex === "undefined" || Number.isNaN(dayNum)) {
        console.warn("Skipping event with invalid month/date:", event);
        return;
      }
      // determine year: if the event month/day is earlier than today, assume next year
      const currentYear = new Date().getFullYear();
      const todayMonth = today.getMonth();
      const todayDate = today.getDate();
      let year = currentYear;
      if (
        monthIndex < todayMonth ||
        (monthIndex === todayMonth && dayNum < todayDate)
      ) {
        year = currentYear + 1;
      }

      const eventDate = new Date(year, monthIndex, dayNum);
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

      console.log({ event, eventDate, isPast, diffDays });

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
        btnHtml = `<a class="btn btn-primary" href="/registration-form.html?event=${encodeURIComponent(
          formatted
        )}">Register Now</a>`;
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
