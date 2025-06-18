import { auth, onAuthStateChanged } from "../javascript/firebase.js";


onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;

  if (email === "info@borntoridepleasantontx.org") {
    const controls = document.getElementById("admin-controls");
    if (controls) controls.style.display = "block";
  }else if (email === "event_user@borntoridepleasantontx.org") {
      // Restrict to just registration view
      window.location.href = "admin-registration.html";
    } else {
      // Not authorized — boot them out
      auth.signOut();
      window.location.href = "admin-login.html";
    }
  } else {
    window.location.href = "admin-login.html";
  }
});


let EVENT_DATE = "";
const returnBtn = document.getElementById('btn-return');

if (returnBtn) {
  returnBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 500); 
  });
}

async function fetchEventDate() {
  try {
    const res = await fetch("/events.json");
    const events = await res.json();

    const monthMap = {
      January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
      July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
    };

    events.forEach(e => {
      e.event_date = new Date(new Date().getFullYear(), monthMap[e.month], parseInt(e.date));
    });

    events.sort((a, b) => a.event_date - b.event_date);
    const upcoming = events.find(e => e.event_date >= new Date());

    if (upcoming) {
      // Format as YYYY-MM-DD for SQL
      const yyyy = upcoming.event_date.getFullYear();
      const mm = String(upcoming.event_date.getMonth() + 1).padStart(2, '0');
      const dd = String(upcoming.event_date.getDate()).padStart(2, '0');
      EVENT_DATE = `${yyyy}-${mm}-${dd}`;
      console.log("Event date loaded:", EVENT_DATE);
    } else {
      console.warn("No upcoming event found in events.json.");
    }
  } catch (err) {
    console.error("Failed to fetch event date:", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchEventDate(); 

  const tableBody = document.querySelector("#registrationTable tbody");
  const addRowBtn = document.getElementById("addRow");
  const form = document.getElementById("batchRegistrationForm");
  const message = document.getElementById("formSubmitMessage");

  if (!tableBody || !addRowBtn || !form) return;


  addRowBtn.addEventListener("click", () => {
    const newRow = tableBody.rows[0].cloneNode(true);
    [...newRow.querySelectorAll("input, select")].forEach(field => field.value = "");
    tableBody.appendChild(newRow);
  });

  tableBody.addEventListener("click", e => {
    if (e.target.classList.contains("removeRow") && tableBody.rows.length > 1) {
      e.target.closest("tr").remove();
    }
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const rows = tableBody.querySelectorAll("tr");
    const data = [];

    for (const row of rows) {
      const inputs = row.querySelectorAll("input, select");
      const entry = {};
      for (const input of inputs) {
        entry[input.name] = input.value.trim();
      }
      entry.event_date = EVENT_DATE;
      data.push(entry);
    }

    console.log("sending bulk payload", data);
    try {
      const res = await fetch("https://btr-backend-7f5r.onrender.com/admin/bulk-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ registrations: data }) 
      });

      const result = await res.json(); 
      console.log("Server responded with:", result);

      if (res.ok) {
        message.textContent = "Submitted successfully!";
        while (tableBody.rows.length > 1) tableBody.deleteRow(1);
        [...tableBody.rows[0].querySelectorAll("input, select")].forEach(f => f.value = "");
        window.scrollTo({ top: form.offsetTop, behavior: 'smooth' });
      } else {
        message.textContent = result.message || "Submission failed.";
      }
    } catch (err) {
      console.error(err);
      message.textContent = "Error submitting form.";
    }
  });
});
