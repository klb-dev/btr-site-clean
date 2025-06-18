# 🛹 Born To Ride – Nonprofit Landing Page

This is the **Born To Ride** (BTR) nonprofit landing page — a modern, interactive website focused on empowering youth through skateboarding. It’s built with love, Vanilla JS, Three.js for 3D animations, Firebase for data storage, Stripe for donations, and Google Maps for event location. The site is responsive, dynamic, and visually compelling on both desktop and mobile.

---

## 🔧 Tech Stack

- **HTML5** – semantic markup
- **CSS3** – fully responsive, custom modals, mobile nav
- **JavaScript** – vanilla JS for DOM interactions and integrations
- **Three.js** – 3D skateboards and animated skater
- **Stripe Checkout API** – secure donation flow
- **Firebase Firestore** – handles newsletter, messages, and donations
- **Firebase Auth** – admin login system
- **Google Maps JavaScript API** – location map with directions
- **Font Awesome** – for scalable iconography

---

## ✨ Features

- 🎮 **Animated 3D Skateboards + Skater** (Three.js)
- 📅 **Editable "Upcoming Events"** via `events.json`
- 💸 **Donation Form** with preset tiers + custom amount
- 🔐 **Secure Stripe Integration** with thank-you modal + confetti
- 📫 **Newsletter + Contact Form** (stored in Firebase Firestore)
- 🗺️ **Live Map with Directions** (Google Maps API)
- 📊 **Admin Dashboard** to view:
  - Contact messages
  - Donation history
  - Filter and Export to CSV
  - Toggle between datasets
- 🔒 **Admin Login** via Firebase Auth + URL query param ...
- 🎨 **Modals with animation** for donations and alerts
- 📱 **Fully Responsive** with mobile-first design

---

## 🚀 Deployment

This project is hosted on **Render**.

### 🔹 Frontend (Static Site)

- GitHub Repo: `btr-frontend`
- Render Static Site setup:
  - Publish Directory
  - No build command required
  - Environment variables not needed on frontend

### 🔹 Backend (Web Service)

- GitHub Repo: `btr-backend`
- Hosted on Render Web Service
- Enviroment variables include Firebase credentials and Stripe secret key
- Handles Stripe sessions, email notifications, and Firebase updates

---

## 💳 Stripe Integration (Flow)

1. User selects a donation amount or enters a custom one.
2. Clicks Donate → Triggers `fetch` to `/create-checkout-session`
3. Backend validates and redirects to Stripe Checkout
4. On success:
   - Firebase logs donation
   - Confetti + custom thank-you modal is shown (no page redirect)
   - Admin dashboard shows info immediately

## 🧠 Developer Notes

- Events pulled from `events.json`
- Admin portal is `admin.html?key=secret123`
- All Firebase and Stripe logic is handled securely on the backend
- Uses CDN-based Firebase SDK (no bundler needed)
- Google Maps requires authorized domain for production
- Frontend maps and modals use `main.js`, which controls scroll, animation, donation, and messaging logic
- Success modals use countdown timers and slide animations
- Newsletter list prevents duplicates with validation

---

## 🛡️ Security

- Stripe secret key is only in backend
- Email credentials are hidden via `.env` (not in GitHub)
- Admin dashboard protected by Firebase Auth + secret query param
- Firebase rules can be tightened for stricter access

---

## ✍️ Author

### Karen Byrd
### klbdev88@gmail.com
### 2025
![Blue Byrd Developments](./images/blueByrdDevelopmentLogo.png) 
