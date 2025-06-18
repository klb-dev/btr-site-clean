

window.addEventListener("DOMContentLoaded", () => {
  const status = new URLSearchParams(window.location.search).get("status");

  if (status === "success") {
    const successModal = document.getElementById("successModal");
    if (successModal) {
      successModal.style.display = "flex";
      if (typeof confetti === "function") {
        confetti({ particleCount: 200, spread: 125, origin: { y: 0.6 } });
      }
      let countdown = 5;
      const countdownElement = document.getElementById("countdown");
      const interval = setInterval(() => {
        countdown--;
        if (countdownElement) {
          countdownElement.textContent = countdown;
        }
        if (countdown <= 0) {
          clearInterval(interval);
          successModal.classList.add("closing");
          setTimeout(() => {
            successModal.style.display = "none";
            successModal.classList.remove("closing");
          }, 400);
        }
      }, 1000);
    }
  } else if (status === "cancel") {
    const cancelModal = document.getElementById("cancelModal");
    if (cancelModal) {
      cancelModal.style.display = "flex";
    }
  }

  const cleanUrl = new URL(window.location);
  cleanUrl.searchParams.delete("status");
  window.history.replaceState({}, document.title, cleanUrl.toString());
});

if (window.location.pathname === "/success") {
  const successSection = document.getElementById("success-section");
  if (successSection) {
    successSection.style.display = "block";
  }

  if (typeof confetti === "function") {
    confetti({
      particleCount: 200,
      spread: 125,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ff00ff"],
    });
  }
}

document.querySelectorAll(".modal-overlay button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const modal = btn.closest(".modal-overlay");
    if (modal) {
      modal.classList.add("closing");
      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("closing");
      }, 400);
    }
  });
});
