// scrollAnimations.js
export function animateOnScroll() {
  const elements = document.querySelectorAll(
    ".section-title, .mission-content, .program-card, .event-card, .gallery-item, .donation-form, .contact-container"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeInUp 1s forwards";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  elements.forEach((element) => {
    element.style.opacity = "0";
    observer.observe(element);
  });

  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}
