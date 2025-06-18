import { signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { auth } from "../firebase/firebase.js"; 

signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((err) => {
    console.error("Anonymous sign-in failed:", err);
  });
