// newsletter.js
import { db, collection, query, where, getDocs, addDoc } from '../firebase/firebase.js';
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
    const newsletterRef = collection(db, "newsletter");
    const q = query(newsletterRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      showToast("Thanks! You’re already on the list.", "success");
      emailInput.value = "";
      return;
    }

    const unsubscribeToken = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2) + Date.now().toString(36);

    await addDoc(newsletterRef, {
      email: email,
      subscribedAt: new Date(),
      unsubscribeToken,
    });

    showToast("You have been subscribed!");
    emailInput.value = "";
  } catch (err) {
    showToast("Subscription failed. Try again later.", "error");
    console.error(err);
  }
});