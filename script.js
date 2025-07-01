// script- entry point after modularization
import './javascript/firebase/firebase.js';
import './javascript/menu.js';
import { setupThreeJS } from './javascript/threeScene.js';
import { animateOnScroll } from './javascript/scrollAnimations.js';
import './javascript/contact/contactForm.js';
import './javascript/donations/donationForm.js';
import './javascript/events/eventsLoader.js';
import './javascript/newsletter/newsletter.js';
import './javascript/map.js';
import './javascript/modals.js';

console.log("All modules loaded successfully.");

window.addEventListener('load', () => {
  setupThreeJS();
  animateOnScroll();
});

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("preload");
  document.body.classList.add("fade-in"); // optional
});

