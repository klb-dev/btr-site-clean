// menu.js
const mobileMenu = document.querySelector(".mobile-menu");
const nav = document.querySelector("nav");

if (mobileMenu && nav) {
  mobileMenu.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
    nav.classList.toggle("active");
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    if (nav.classList.contains("active")) {
      mobileMenu.classList.remove("active");
      nav.classList.remove("active");
    }

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: "smooth",
      });
    }
  });
});

const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header?.classList.add("scrolled");
  } else {
    header?.classList.remove("scrolled");
  }
});
