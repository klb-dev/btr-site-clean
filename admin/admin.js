import { 
  db, 
  auth,
  collection, 
  getDocs, 
  query, 
  orderBy,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getAuth
} from "../javascript/firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

let allMessages = [];
let allDonations = [];
let allRegistrations = [];

const returnBtn = document.getElementById("btn-return");

if (returnBtn) {
  returnBtn.addEventListener('click', (e) => {
    e.preventDefault(); 
    document.body.classList.add("fade-out");
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 500); 
  });
}

function renderMessages(messages) {
  const container = document.getElementById("message-container");
  container.innerHTML = "";
  messages.forEach(data => {
    const div = document.createElement("div");
    div.className = "message-card";
    div.innerHTML = `
      <h3>${data.name} <span>(${data.email})</span></h3>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p>${data.message}</p>
      <p class="timestamp">${new Date(data.sentAt.seconds * 1000).toLocaleString()}</p>
    `;
    container.appendChild(div);
  });
}

function renderDonations(donations) {
  const container = document.getElementById("donation-container");
  container.innerHTML = "";
  donations.forEach(data => {
    const div = document.createElement("div");
    div.className = "message-card";
    div.innerHTML = `
      <h3>${data.name} <span>(${data.email})</span></h3>
      <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
      <p><strong>Amount:</strong> ${data.displayAmount}</p>
      <p class="timestamp">${new Date(data.created.seconds * 1000).toLocaleString()}</p>
    `;
    container.appendChild(div);
  });
}

async function loadMessages() {
  try {
    const q = query(collection(db, "messages"), orderBy("sentAt", "desc"));
    const snapshot = await getDocs(q);
    allMessages = snapshot.docs.map(doc => doc.data());
    renderMessages(allMessages);
  } catch (err) {}
}

async function loadDonations() {
  try {
    const q = query(collection(db, "donations"), orderBy("created", "desc"));
    const snapshot = await getDocs(q);
    allDonations = snapshot.docs.map(doc => doc.data());
    renderDonations(allDonations);
  } catch (err) {}
}

function filterData(type, query) {
  const lowerQuery = query.toLowerCase();

  if (type === "messages") {
    const filtered = allMessages.filter(m =>
      m.name.toLowerCase().includes(lowerQuery) || m.email.toLowerCase().includes(lowerQuery)
    );
    renderMessages(filtered);
  } else if (type === "donations") {
    const filtered = allDonations.filter(d =>
      d.name.toLowerCase().includes(lowerQuery) || d.email.toLowerCase().includes(lowerQuery)
    );
    renderDonations(filtered);
  } else if (type === "registrations") {
    const filtered = allRegistrations.filter(r =>
      r.child_name.toLowerCase().includes(lowerQuery) ||
      r.parent_name.toLowerCase().includes(lowerQuery) ||
      r.email.toLowerCase().includes(lowerQuery) ||
      r.phone.toLowerCase().includes(lowerQuery)
    );
    renderRegistrations(filtered);
  }
}

function exportToCSV(type) {
  const data =
  type === "messages"
    ? allMessages
    : type === "donations"
    ? allDonations
    : allRegistrations;

  if (!data.length) return;

  const keys = Object.keys(data[0]);
  const csvRows = [keys.join(",")];

  data.forEach(row => {
    const values = keys.map(key => JSON.stringify(row[key] ?? ""));
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}_export.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function loadRegistrations(date = "") {
  try {
    let url = "https://btr-backend-7f5r.onrender.com/api/registrations";
    if (date) {
      url += `?date=${encodeURIComponent(date)}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    allRegistrations = data;
    renderRegistrations(data);
  } catch (err) {
    console.error("Failed to load registrations", err);
  }
}

function renderRegistrations(data) {
  const regTableBody = document.querySelector("#regTable tbody");
  if (!regTableBody) return;

  if (!Array.isArray(data)) {
    regTableBody.innerHTML = "<tr><td colspan='9'>Invalid data format.</td></tr>";
    return;
  }

  if (data.length === 0) {
    regTableBody.innerHTML = "<tr><td colspan='9'>No registrations found.</td></tr>";
    return;
  }

  regTableBody.innerHTML = "";
  data.forEach(reg => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${reg.child_name}</td>
      <td>${reg.age}</td>
      <td>${reg.gender}</td>
      <td>${reg.skate_level}</td>
      <td>${reg.school}</td>
      <td>${reg.parent_name}</td>
      <td>${reg.email}</td>
      <td>${reg.phone}</td>
      <td>${reg.event_date?.split("T")[0] || "N/A"}</td>
    `;
    regTableBody.appendChild(row);
  });
}

let currentView = "";

function toggleViews(view) {
  document.getElementById("message-container").style.display = view === "message" ? "block" : "none";
  document.getElementById("donation-container").style.display = view === "donation" ? "block" : "none";
  document.getElementById("registration-container").style.display = view === "registration" ? "block" : "none";
  document.getElementById("filterSection").style.display = view === "registration" ? "block" : "none";
}


function initAdminPortal() {
 const loginBtn = document.getElementById("login-btn");
 const viewMessagesBtn = document.getElementById("view-messages");
 const viewDonationsBtn = document.getElementById("view-donations");
 const registrationBtn = document.getElementById("registerAtEventBtn");
 const viewRegistrationsBtn = document.getElementById("view-registrations");
 const searchInput = document.getElementById("search-input");
 const exportBtn = document.getElementById("export-csv");
 const logoutBtn = document.getElementById('logout-btn');
 const filterDateInput = document.getElementById("filterDate");
 const filterButton = document.getElementById("filterButton");
 const clearFilterBtn = document.getElementById("clearFilter");


 if (filterButton && filterDateInput) {
   filterButton.addEventListener("click", () => {
     const selectedDate = filterDateInput.value;
     loadRegistrations(selectedDate || "");
   });
 }

 if (clearFilterBtn) {
   clearFilterBtn.addEventListener("click", () => {
     filterDateInput.value = "";
     loadRegistrations();
   });
 }

 if (registrationBtn) {
   registrationBtn.addEventListener("click", () => {
     window.location.href = "/admin/admin-registration.html";
   });
 }

 if (logoutBtn) {
   logoutBtn.addEventListener('click', () => {
     signOut(auth).then(() => {
       window.location.href = "/index.html";
     }).catch((error) => {
       console.error("Logout failed:", error);
     });
   });
 }

 if (viewMessagesBtn) {
   viewMessagesBtn.addEventListener("click", () => {
     currentView = "messages";
     toggleViews("message");
   });
 }

 if (viewDonationsBtn) {
   viewDonationsBtn.addEventListener("click", () => {
     currentView = "donations";
     toggleViews("donation");
   });
 }

 if (viewRegistrationsBtn) {
   viewRegistrationsBtn.addEventListener("click", () => {
     currentView = "registrations";
     toggleViews("registration");
     document.getElementById("filterSection").style.display = "block";
     loadRegistrations();
   });
 }

 if (searchInput) {
   searchInput.addEventListener("input", () => {
     filterData(currentView, searchInput.value);
   });
 }

 if (exportBtn) {
   exportBtn.addEventListener("click", () => {
     exportToCSV(currentView);
   });
 }
}
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/admin/admin-login.html";
    return;
  }

  const email = user.email;

  if (email === "event_user@borntoridepleasantontx.org") {
    window.location.href = "/admin/admin-registration.html";
  } else if (email === "info@borntoridepleasantontx.org") {
    document.body.style.display = "block";
    document.getElementById("loading-screen").style.display = "none";

    const controls = document.getElementById('admin-toggle-buttons');
    if (controls) controls.style.display = 'block';
    
    initAdminPortal(); 
  } else {
    auth.signOut();
    window.location.href = "/admin/admin-login.html";
  }
});

  const exportRegistrationsBtn = document.getElementById("export-registrations");
  if (exportRegistrationsBtn) {
    exportRegistrationsBtn.addEventListener("click", () => {
      if (!Array.isArray(allRegistrations) || allRegistrations.length === 0) {
        alert("No registrations to download.");
        return;
      }

      const headers = [
        "Child Name",
        "Age",
        "Gender",
        "Skate Level",
        "School",
        "Parent Name",
        "Email",
        "Phone",
        "Event Date"
      ];

      const csvRows = [
        headers.join(","),
        ...allRegistrations.map(reg => [
          reg.child_name,
          reg.age,
          reg.gender,
          reg.skate_level,
          reg.school,
          reg.parent_name,
          reg.email,
          reg.phone,
          reg.event_date?.split("T")[0] || "N/A"
        ].map(val => `"${val}"`).join(","))
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      const dateLabel = allRegistrations[0]?.event_date?.split("T")[0] || "all";
      a.href = url;
      a.download = `registrations-${dateLabel}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});

  const updateBtn = document.getElementById("update-password-btn");
    if (updateBtn) {
      updateBtn.addEventListener("click", async () => {
      const newPassword = document.getElementById("newPassword").value;

      if (!newPassword) {
        alert("Please enter a new password.");
        return;
      }

      try {
        const token = await auth.currentUser.getIdToken();

        const res = await fetch("https://btr-backend-7f5r.onrender.com/admin/update-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            email: "event_user@borntoridepleasantontx.org", 
            newPassword,
            adminEmail: auth.currentUser.email 
          })
        });

        const result = await res.json();

        if (result.success) {
          alert("Password updated successfully.");
          document.getElementById("newPassword").value = "";
        } else {
          alert("Error: " + result.message);
        }
      } catch (err) {
        console.error("Failed to update password:", err);
        alert("An error occurred while updating the password.");
      }
    });
}

window.loadRegistrations = loadRegistrations;