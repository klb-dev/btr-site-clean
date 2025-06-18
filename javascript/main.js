window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("fade-in");
  document.body.classList.remove("preload");
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  collection,
  addDoc,
  getFirestore,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtQpcwbDBL2DtpQ7ZBiOkwj_jlwEMt3jE",
  authDomain: "btr-database.firebaseapp.com",
  projectId: "btr-database",
  storageBucket: "btr-database.firebasestorage.app",
  messagingSenderId: "152168510677",
  appId: "1:152168510677:web:012fe1f89b4d700dccde5c",
  measurementId: "G-EE9GVQRX6T",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Mobile Menu Toggle
const mobileMenu = document.querySelector(".mobile-menu");
const nav = document.querySelector("nav");

mobileMenu.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
  nav.classList.toggle("active");
});

// Smooth Scrolling
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

// Header Scroll Effect
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ThreeJS Animation
const setupThreeJS = () => {
  const canvas = document.getElementById("hero-canvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);

  // Create Skateboards
  const skateboards = [];
  const createSkateboard = (x, y, z) => {
    // Deck
    const shape = new THREE.Shape();
    const width = 2.6;
    const height = 0.7;
    const radius = 0.2;

    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(
      width / 2,
      -height / 2,
      width / 2,
      -height / 2 + radius
    );
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(
      width / 2,
      height / 2,
      width / 2 - radius,
      height / 2
    );
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(
      -width / 2,
      height / 2,
      -width / 2,
      height / 2 - radius
    );
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(
      -width / 2,
      -height / 2,
      -width / 2 + radius,
      -height / 2
    );

    const extrudeSettings = {
      depth: 0.1,
      bevelEnabled: false,
    };

    const deckGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const deckMaterial = new THREE.MeshStandardMaterial({
      color: Math.random() < 0.5 ? 0x2ecc71 : 0x3498db,
      roughness: 0.5,
    });
    const deck = new THREE.Mesh(deckGeometry, deckMaterial);
    deck.rotation.x = Math.PI / 2; // Rotate to make it horizontal
    deck.rotation.z = Math.PI / 2; // Rotate to make it vertical

    // Trucks
    const truckGeometry = new THREE.BoxGeometry(1, 0.15, 0.25);
    const truckMaterial = new THREE.MeshStandardMaterial({ color: 0xbdc3c7 });

    const frontTruck = new THREE.Mesh(truckGeometry, truckMaterial);
    frontTruck.position.z = 0.9;
    frontTruck.position.y = -0.125;

    const backTruck = new THREE.Mesh(truckGeometry, truckMaterial);
    backTruck.position.z = -0.9;
    backTruck.position.y = -0.125;

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0xf39c12 });

    const wheels = [];

    // Front left wheel
    const frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.rotation.z = Math.PI / 2; // Rotate so it rolls forward
    frontLeftWheel.position.set(0.5, -0.25, 0.9);
    wheels.push(frontLeftWheel);

    // Front right wheel
    const frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.rotation.z = Math.PI / 2;
    frontRightWheel.position.set(-0.5, -0.25, 0.9);
    wheels.push(frontRightWheel);

    // Back left wheel
    const backLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backLeftWheel.rotation.z = Math.PI / 2;
    backLeftWheel.position.set(0.5, -0.25, -0.9);
    wheels.push(backLeftWheel);

    // Back right wheel
    const backRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backRightWheel.rotation.z = Math.PI / 2;
    backRightWheel.position.set(-0.5, -0.25, -0.9);
    wheels.push(backRightWheel);

    // Create skateboard group
    const skateboard = new THREE.Group();
    skateboard.add(deck);
    skateboard.add(frontTruck);
    skateboard.add(backTruck);

    wheels.forEach((wheel) => {
      skateboard.add(wheel);
    });

    skateboard.position.set(x, y, z);
    skateboard.rotation.y = Math.random() * Math.PI * 2;
    skateboard.userData = {
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      moveSpeed: Math.random() * 0.03 + 0.01,
      moveDirection: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.05
      ),
    };

    scene.add(skateboard);
    return skateboard;
  };

  // Store skateboards

  for (let i = 0; i < 5; i++) {
    skateboards.push(
      createSkateboard(Math.random() * 10 - 5, 1, Math.random() * 10 - 5)
    );
  }

  // Animation loop
  const animateSkateboard = () => {
    requestAnimationFrame(animateSkateboard);

    skateboards.forEach((skateboard) => {
      // Move skateboard
      skateboard.rotation.y += skateboard.userData.rotationSpeed;
      skateboard.position.x += skateboard.userData.moveDirection.x;
      skateboard.position.y += skateboard.userData.moveDirection.y;
      skateboard.position.z += skateboard.userData.moveDirection.z;

      // Rotate wheels
      skateboard.children.forEach((child, index) => {
        if (index > 2) {
          // Wheels are after the deck and trucks
          child.rotation.z -= 0.1; // Spin in the correct direction
        }
      });
    });

    renderer.render(scene, camera);
  };

  // Start animation
  animateSkateboard();

  // Create multiple skateboards
  for (let i = 0; i < 5; i++) {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 10 - 5;
    const z = (Math.random() - 0.5) * 20 - 15;

    const skateboard = createSkateboard(x, y, z);
    skateboards.push(skateboard);
  }

  // Create simple figure jumping on skateboard
  const createSkater = () => {
    const skater = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.4;

    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf1c40f });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1;

    // Arms
    const armGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });

    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(0.45, 0.4, 0);

    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(-0.45, 0.4, 0);

    // Legs
    const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(0.2, -0.3, 0);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(-0.2, -0.3, 0);

    // Skateboard
    const skateboard = createSkateboard(0, -0.65, 0);
    skateboard.scale.set(0.8, 0.8, 0.8);

    skater.add(body);
    skater.add(head);
    skater.add(leftArm);
    skater.add(rightArm);
    skater.add(leftLeg);
    skater.add(rightLeg);
    skater.add(skateboard);

    skater.position.set(0, 0, -10);
    skater.rotation.y = Math.PI;

    scene.add(skater);
    return skater;
  };

  const skater = createSkater();

  // Position camera
  camera.position.z = 5;
  camera.position.y = 1;

  // Animation
  let jumpDirection = 2;
  let jumpHeight = 5;

  const animate = () => {
    requestAnimationFrame(animate);

    // Animate skateboards
    skateboards.forEach((skateboard) => {
      skateboard.rotation.y += skateboard.userData.rotationSpeed;

      // Move skateboard
      skateboard.position.x += skateboard.userData.moveDirection.x;
      skateboard.position.y += skateboard.userData.moveDirection.y;
      skateboard.position.z += skateboard.userData.moveDirection.z;

      // Boundary check and reverse direction
      if (Math.abs(skateboard.position.x) > 15) {
        skateboard.userData.moveDirection.x *= -1;
      }

      if (Math.abs(skateboard.position.y) > 10) {
        skateboard.userData.moveDirection.y *= -1;
      }

      if (skateboard.position.z > 5 || skateboard.position.z < -25) {
        skateboard.userData.moveDirection.z *= -1;
      }

      // Spin wheels
      skateboard.children.forEach((child, index) => {
        if (index > 2) {
          // Only rotate wheels (indices 3-6)
          child.rotation.z += 0.1;
        }
      });
    });

    // Animate skater jumping
    jumpHeight += 0.05 * jumpDirection;
    if (jumpHeight > 1) {
      jumpDirection = -1;
    } else if (jumpHeight < 0) {
      jumpDirection = 1;
    }

    skater.position.y = jumpHeight * 0.2;
    skater.rotation.z = jumpHeight * 0.2;
    skater.position.x = Math.sin(Date.now() * 0.001) * 5;

    renderer.render(scene, camera);
  };

  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
};

// Initialize ThreeJS scene
window.addEventListener("load", setupThreeJS);

// Animation on Scroll
const animateOnScroll = () => {
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
};

window.addEventListener("load", animateOnScroll);

// Add animation keyframes to the document
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

// Contact submission
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("contactName")?.value.trim();
    const email = document.getElementById("contactEmail")?.value.trim();
    const subject = document.getElementById("contactSubject")?.value.trim();
    const message = document.getElementById("contactMessage")?.value.trim();

    if (!name || !email || !subject || !message) {
      showToast("Please fill out all fields.", "error");
      return;
    }

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

// Custom Donation Amount Handler
const customAmount = document.getElementById("customAmount");
const amountOptions = document.querySelectorAll('input[name="amount"]');

if (customAmount && amountOptions) {
  customAmount.addEventListener("focus", () => {
    amountOptions.forEach((option) => {
      option.checked = false;
    });
  });

  amountOptions.forEach((option) => {
    option.addEventListener("change", () => {
      if (option.checked) {
        customAmount.value = "";
      }
    });
  });
}

// stripe integration/collection of data to firebase
document.querySelector(".btn-donate").addEventListener("click", async (e) => {
  e.preventDefault();

  const selectedAmount = document.querySelector(
    'input[name="amount"]:checked'
  )?.value;
  const customAmount = document.getElementById("customAmount").value;

  let finalAmount = selectedAmount
    ? parseFloat(selectedAmount)
    : parseFloat(customAmount);

  if (isNaN(finalAmount) || finalAmount < 0.5) {
    showToast("Minimum donation is $0.50", "error");
    return;
  }

  const firstName = document.getElementById("firstName")?.value;
  const lastName = document.getElementById("lastName")?.value;
  const email = document.getElementById("email")?.value;
  const phone = document.getElementById("phone")?.value;
  const fullName = `${firstName} ${lastName}`.trim();

  // calculate the amount
  const amountInCents = customAmount
    ? parseFloat(customAmount) * 100
    : parseFloat(selectedAmount) * 100;

    fetch("https://btr-backend-7f5r.onrender.com/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amountInCents,
        name: fullName,
        email,
        phone,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url; // Send user to Stripe
        } else {
          showToast("Something went wrong. Try again.", "error");
        }
      })
      .catch((error) => {
        showToast("Network error. Try again later.", "error");
        console.error(error);
      });
});

window.addEventListener("DOMContentLoaded", () => {
  const status = new URLSearchParams(window.location.search).get("status");

  if (status === "success") {
    const successModal = document.getElementById("successModal");
    if (successModal) {
      successModal.style.display = "flex";

      // Confetti
      if (typeof confetti === "function") {
        confetti({
          particleCount: 200,
          spread: 125,
          origin: { y: 0.6 },
        });
      }

      // Countdown
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

  // 🧹 Clean the URL only AFTER handling status
  const cleanUrl = new URL(window.location);
  cleanUrl.searchParams.delete("status");
  window.history.replaceState({}, document.title, cleanUrl.toString());
});


// updating Events
async function loadEvents() {
  const res = await fetch("events.json");
  const events = await res.json();
  const container = document.querySelector(".events-container");
  container.innerHTML = "";

  events.forEach((event) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
            <div class="event-date">
                <div class="day">${event.date}</div>
                <div class="month">${event.month}</div>
            </div>
            <div class="event-content">
                <img src="${event.image}" alt="${event.date} ${event.month} event">
                <div class="event-details"><i class="fas fa-map-marker-alt"></i><p>${event.location}</p>
            </div>
            <div class="event-details"><i class="fas fa-clock"></i><p>${event.time}</p></div>
            </div>`;
    container.appendChild(card);
  });
}

window.addEventListener("load", loadEvents);


// Toast Notification Function
function showToast(message = "Something happened.", type = "info") {
  const toast = document.getElementById("toast");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 3000);
}

// google map
window.initMap = function () {
  const atascosaPark = { lat: 28.97175, lng: -98.48225 };

  const map = new google.maps.Map(document.getElementById("map"), {
    center: atascosaPark,
    zoom: 15,
  });

  const marker = new google.maps.Marker({
    position: atascosaPark,
    map: map,
    title: "Atascosa River Park - Skatepark",
  });

  const infoWindow = new google.maps.InfoWindow({
    content: `
          <div style="font-family:sans-serif; max-width: 200px;">
            <strong>Pleasanton Skatepark</strong><br>
            River Park Rd<br>
            Pleasanton, TX 78064<br><br>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=28.95413,-98.48142"
              target="_blank"
              style="color:#1E88E5; text-decoration:underline;">
              🚗 Get Directions
            </a>
          </div>
        `,
  });

  marker.addListener("click", () => {
    infoWindow.open(map, marker);
  });
};

function loadGoogleMapsScript(callback) {
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=AIzaSyCEM2AadWPq40e513thsFYXp8ShBVVEWmI";
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
}

loadGoogleMapsScript(() => {
  if (typeof window.initMap === "function") {
    window.initMap();
  }
});

// after donations sends to /success route, shows home screen and confetti
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

// Close modals 
document.querySelectorAll('.modal-overlay button').forEach(btn => {
  btn.addEventListener('click', () => {
    const modal = btn.closest('.modal-overlay');
    if (modal) {
      modal.classList.add("closing");
      setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("closing");
      }, 400);
    }
  });
});


