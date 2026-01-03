// Load event date from events.json
let EVENT_DATE = null;
const toast = document.getElementById("toast");

function showToast(message = "Success!", type = "success") {
  if (!toast) return;

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
  if (!toast) return;
  toast.classList.remove("show");
  toast.classList.add("hidden");
}

function parseMMDDYYYY(value) {
  const [m, d, y] = value.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

window.addEventListener("DOMContentLoaded", () => {
  if (!location.pathname.includes("registration-form")) return;

  const params = new URLSearchParams(location.search);
  const paramEvent = params.get("event"); // MM-DD-YYYY
  const eventInput = document.getElementById("event_date");
  const submitBtn = document.querySelector(
    '#registrationForm button[type="submit"]'
  );

  if (!paramEvent) {
    showToast(
      "Missing event information. Please register from the event card.",
      "error"
    );
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  eventInput.value = paramEvent;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = parseMMDDYYYY(paramEvent);

  if (isNaN(eventDate.getTime())) {
    showToast("Invalid event date.", "error");
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
  const afterEvent =
    today >=
    new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate() + 1
    );

  if (afterEvent) {
    showToast("Registration is closed for this event.", "error");
    if (submitBtn) submitBtn.disabled = true;
    return;
  }
});
