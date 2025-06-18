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
  try {
    const events = await fetch("/events.json").then(res => res.json());
    const monthMap = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };
    console.log("Fetching events.json...");
    console.log("Fetched events:", events);

    events.forEach(e => {
      e.event_date = new Date(new Date().getFullYear(), monthMap[e.month], parseInt(e.date));
    });

    const upcoming = events.find(e => e.event_date >= new Date());

    if (!upcoming) {
      showToast("No upcoming event found. Please try again later.", false);
      return;
    }
    // Update hidden input if on registration form page
    const eventDateInput = document.getElementById("event_date");
    if (eventDateInput) {
      eventDateInput.value = upcoming.event_date.toISOString().slice(0, 10);
       console.log("event_date set to:", eventDateInput.value);
    }
  } catch (err) {
    showToast("Failed to determine event date.", false);
    console.error("Event date fetch error:", err);
    return;
  }


  try {
    const response = await fetch("/events.json");
    const events = await response.json();

    const monthMap = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };

    events.forEach(e => {
      e.event_date = new Date(new Date().getFullYear(), monthMap[e.month], parseInt(e.date));
    });

    events.sort((a, b) => a.event_date - b.event_date);
    const upcoming = events.find(e => e.event_date >= new Date());

    if (!upcoming) return;

    const today = new Date();
    const diffDays = Math.floor((upcoming.event_date - today) / (1000 * 60 * 60 * 24));
    const pastCutoff = Math.floor((today - upcoming.event_date) / (1000 * 60 * 60 * 24));

    const registerBtn = document.createElement("button");
    registerBtn.className = "btn btn-primary";
    registerBtn.id = "registerNowBtn";
    registerBtn.textContent = "Register Now";

    if (diffDays > 5 || pastCutoff > 1) {
      registerBtn.title = "Registration opens 5 days before the event.";
      registerBtn.classList.add("disabled-btn");
      registerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("Registration opens 5 days before the event.");
      });
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

    const eventsSection = document.getElementById("events");
    if (eventsSection) eventsSection.appendChild(registerContainer);

  } catch (err) {
    console.error("Failed to inject Register Now button:", err);
  }
}

window.addEventListener("DOMContentLoaded", injectRegisterButton);