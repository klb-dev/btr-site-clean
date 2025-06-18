import { showToast } from '../contact/contactForm.js';

// DOM Elements
const donateBtn = document.querySelector(".btn-donate");
const customAmountInput = document.getElementById("customAmount");
const amountOptions = document.querySelectorAll('input[name="amount"]');

// Main donation submission handler
if (donateBtn) {
  donateBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Determine final amount (either selected radio or custom input)
    const selectedAmount = document.querySelector('input[name="amount"]:checked')?.value;
    const customAmount = document.getElementById("customAmount").value;
    const finalAmount = selectedAmount ? parseFloat(selectedAmount) : parseFloat(customAmount);

    // Validate minimum amount
    if (isNaN(finalAmount) || finalAmount < 0.5) {
      showToast("Minimum donation is $0.50", "error");
      return;
    }

    // Collect user input
    const firstName = document.getElementById("firstName")?.value;
    const lastName = document.getElementById("lastName")?.value;
    const email = document.getElementById("email")?.value;
    const phone = document.getElementById("phone")?.value;
    const fullName = `${firstName} ${lastName}`.trim();

    const amountInCents = finalAmount * 100;
    // Call backend to create Stripe Checkout session
    try {
      const res = await fetch("https://btr-backend-7f5r.onrender.com/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents, name: fullName, email, phone })
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast("Something went wrong. Try again.", "error");
      }
    } catch (error) {
      console.error("Stripe session error:", error);
      showToast("Network error. Try again later.", "error");
    }
  });
}
// UX: Clear radio buttons if user focuses on custom amount input
if (customAmountInput && amountOptions.length) {
  customAmountInput.addEventListener("focus", () => {
    amountOptions.forEach(option => option.checked = false);
  });

  amountOptions.forEach(option => {
    option.addEventListener("change", () => {
      if (option.checked) customAmountInput.value = "";
    });
  });
}