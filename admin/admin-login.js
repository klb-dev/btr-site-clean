import {
  auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
} from "../javascript/firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginContainer = document.getElementById("login-container");
  const loginBtn = document.getElementById("login-btn");
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const resetBtn = document.getElementById("reset-password-btn");
  const toast = document.getElementById("toast");

  function handleLoginRedirect(user) {
    const email = user.email;

    if (email === "info@borntoridepleasantontx.org") {
      window.location.href = "/admin/admin.html";
    } else if (email === "event_user@borntoridepleasantontx.org") {
      window.location.href = "/admin/admin-registration.html";
    } else {
      showToast("Access denied. You are not authorized.");
      auth.signOut();
    }
  }

  function showToast(message, type = "error") {
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
      toast.className = "toast hidden";
    }, 4000);
  }

  // Wait for auth state before showing anything
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      document.getElementById('loading-screen').style.display = 'none';
      document.getElementById('login-container').style.display = 'block';
    }
  });

 loginBtn.addEventListener("click", async () => {
  console.log("Login button clicked ✅");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  console.log("Email:", email, "| Password:", password ? "✓" : "⛔");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Login successful 🎉", user.email);

    console.log("emailVerified (before):", user.emailVerified);

    // Admin force verification
    if (!user.emailVerified && user.email === "info@borntoridepleasantontx.org") {
      console.log("Attempting forced verification for admin...");
      const token = await user.getIdToken();

      const res = await fetch("https://btr-backend-7f5r.onrender.com/admin/verify-admin-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await res.json();
      console.log("Verification response:", result);

      await user.reload();
      console.log("emailVerified (after reload):", user.emailVerified);
    // Allow event_user to bypass email verification (no real inbox; used for limited registration only)
    } else if (!user.emailVerified && user.email !== "event_user@borntoridepleasantontx.org") {
      console.log("Non-admin not verified");
      showToast("Please verify your email before logging in.");
      await sendEmailVerification(user);
      await auth.signOut();
      return;
    }

    console.log("Redirecting user...");
    handleLoginRedirect(user);
    showToast("Login successful!", "success");

  } catch (err) {
    console.error("Login error:", err);
    showToast("Invalid email or password. Please try again.");
  }
});


  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      if (!email) {
        showToast("Please enter your email to reset password.");
        return;
      }

      try {
        await sendPasswordResetEmail(auth, email);
        showToast("Password reset email sent.", "success");
      } catch (err) {
        showToast("Failed to send reset email.");
      }
    });
  }

  toast.className = "toast hidden";
});
