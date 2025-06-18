import { db, collection, addDoc } from '../firebase/firebase.js';

// Select the contact form element
const contactForm = document.getElementById("contactForm");

// Main submit handler for contact form
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Grab and sanitize input values
    const name = document.getElementById("contactName")?.value.trim();
    const email = document.getElementById("contactEmail")?.value.trim();
    const subject = document.getElementById("contactSubject")?.value.trim();
    const message = document.getElementById("contactMessage")?.value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showToast("Please fill out all fields.", "error");
      return;
    }

     // Save message to Firestore
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        subject,
        message,
        sentAt: new Date(),
      });

      showToast("Your message was sent successfully!", "success");
      contactForm.reset();
    } catch (error) {
      console.error("Error saving message: ", error);
      showToast("Something went wrong. Try again later.", "error");
    }
  });
}

/**
 * Display a toast message on screen
 * @param {string} message - Message to display
 * @param {string} type - 'success' | 'error' | 'info'
 */
export function showToast(message = "Something happened.", type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  // Hide the toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 3000);
}
