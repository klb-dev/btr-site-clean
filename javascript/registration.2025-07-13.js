// Load event date from events.json
let EVENT_DATE = null;
const toast = document.getElementById("toast");

function showToast(message = "Success!", type = "success") {
    if (!toast) {
      console.warn("Toast not found:", message);
      return;
    }
  toast.textContent = message;
  toast.className = `toast show ${type === "error" ? "error" : "success"}`; 
  toast.classList.remove("hidden");

  // hide after 3s if not hovering
  setTimeout(() => {
    if (!toast.matches(":hover")) {
      toast.classList.remove("show");
      toast.classList.add("hidden");
    }
  }, 3000);
}
// stay visible on hover
if (toast) {
  toast.addEventListener("mouseenter", () => {
    toast.classList.add("show");
  });
  
}
toast.addEventListener("mouseleave", () => {
  toast.classList.remove("show");
  toast.classList.add("hidden");
});

function hideToast() {
  toast.classList.remove("visible-toast");
  toast.classList.add("hidden");
}

async function injectRegisterButton() {
  let upcoming;
  try {
    const events = await fetch("/events.json").then(res => res.json());
    const monthMap = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events.forEach(e => {
      e.event_date = new Date(new Date().getFullYear(), monthMap[e.month], parseInt(e.date));
    });

    events.sort((a, b) => a.event_date - b.event_date);

    upcoming = events.find(e => {
      const eventDate = new Date(e.event_date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    });

     console.log("Upcoming event:", upcoming);

    if (!upcoming) {
      showToast("No upcoming event found. Please try again later.", false);
      console.log("No upcoming event found in events.json");
      return;
    }

    const eventDateInput = document.getElementById("event_date");
    if (eventDateInput) {
      eventDateInput.value = upcoming.event_date.toISOString().slice(0, 10);
      console.log("Event date set to:", eventDateInput.value);
    }

  } catch (err) {
    showToast("Failed to determine event date.", false);
    console.error("Event date fetch error:", err);
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventEndDate = new Date(upcoming.event_date);
    eventEndDate.setDate(eventEndDate.getDate() + 1);
    eventEndDate.setHours(0, 0, 0, 0);

    const isPastEvent = today >= eventEndDate;
    console.log("Today:", today, "Event End Date:", eventEndDate, "isPastEvent:", isPastEvent);

    if (isPastEvent) {
      showToast("Registration is closed. Please check back for future events.", false);
      console.log("Event has passed. Button will not be shown.");
      const submitBtn = document.querySelector('#registrationForm button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      return;
    }

      if (window.location.pathname.includes("registration-form")) {
        console.log("On registration form page — do not inject Register Now button.");
        return;
      }

    const diffDays = Math.ceil((upcoming.event_date - today) / (1000 * 60 * 60 * 24));
    console.log("diffDays:", diffDays);

    const registerBtn = document.createElement("button");
    registerBtn.className = "btn btn-primary";
    registerBtn.id = "registerNowBtn";
    registerBtn.textContent = "Register Now";

    if (diffDays > 5) {
      registerBtn.title = "Registration opens 5 days before the event.";
      registerBtn.classList.add("disabled-btn");
      registerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("Registration opens 5 days before the event.");
      });
      registerBtn.addEventListener("mouseenter", () => {
        showToast("Registration opens 5 days before the event.");
      });
      registerBtn.addEventListener("mouseleave", hideToast);
    } else {
      registerBtn.addEventListener("click", () => {
        window.location.href = "/registration-form.html";
      });
    }

    const registerContainer = document.createElement("div");
    registerContainer.className = "register-container";
    registerContainer.appendChild(registerBtn);

    // ✅ Fallback: use #events OR fallback to <main> OR <body>
    let eventsSection = document.getElementById("events");

    if (!eventsSection) {
      console.warn("#events container not found. Using <main> as fallback.");
      eventsSection = document.querySelector("main");
    }
    if (!eventsSection) {
      console.warn("<main> not found. Using <body> as last resort.");
      eventsSection = document.body;
    }

    console.log("Appending Register Now button to:", eventsSection);
    eventsSection.appendChild(registerContainer);

  } catch (err) {
    console.error("Failed to inject Register Now button:", err);
  }
}

window.addEventListener("DOMContentLoaded", injectRegisterButton);
