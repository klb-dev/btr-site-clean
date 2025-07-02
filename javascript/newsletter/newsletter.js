// newsletter.js
import { showToast } from '../contact/contactForm.js';

document.getElementById("subscribeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const emailInput = form.querySelector("input[type='email']");
  const email = emailInput.value.trim().toLowerCase();
  
  if (!email || !email.includes("@")) {
    showToast("Please enter a valid email address.", "error");
    emailInput.focus();
    return;
  }

  try {
    const response = await fetch("/api/newsletter/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

     // Check if the response is OK first
    if (!response.ok) {
      console.error(`HTTP Error: ${response.status} ${response.statusText}`);
      showToast("Server error. Please try again later.", "error");
      return;
    }

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Server returned non-JSON response:", await response.text());
      showToast("Server error. Please try again later.", "error");
      return;
    }

    const data = await response.json();

    if (data.success) {
      showToast(data.message, "success");
      emailInput.value = "";
    } else {
      showToast(data.message || "Subscription failed. Try again later.", "error");
    }

  } catch (err) {
    showToast("Subscription failed. Try again later.", "error");
    console.error("Newsletter subscription error:", err);
  }
});