// reset-password.js
import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

// Reset password for event user
const auth = getAuth();
const email = "event_user@borntoridepleasantontx.org";
const newPassword = "YOUR_NEW_PASSWORD";

auth.getUserByEmail(email)
  .then(user => {
    return auth.updateUser(user.uid, {
      password: newPassword
    });
  })
  .then(() => {
    console.log(`Password updated for ${email}`);
  })
  .catch(error => {
    console.error("Error updating password:", error);
  });
