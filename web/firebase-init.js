// Semil Firebase Integration: Firestore Database & Analytics
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics, isSupported as isAnalyticsSupported } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCYbTrXjApwrj-f9Troif2WboauIXHOATM",
  authDomain: "semil-protfolio.firebaseapp.com",
  projectId: "semil-protfolio",
  storageBucket: "semil-protfolio.firebasestorage.app",
  messagingSenderId: "1089636813376",
  appId: "1:1089636813376:web:880054491764649048eda5",
  measurementId: "G-5PLC4Z066M"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Firebase Analytics if supported by environment
let analytics = null;
window.semilFirebaseReady = (async () => {
  try {
    const supported = await isAnalyticsSupported();
    if (supported) {
      analytics = getAnalytics(app);
      window.SemilAnalytics = analytics;
    }
  } catch (e) {
    console.debug("Firebase Analytics not supported in current environment:", e);
  }
  return true;
})();

// Expose database helper to Semil site runtime
window.SemilFirebase = {
  app,
  db,
  getAnalytics: () => analytics,
  async saveSubmission(collectionName, data) {
    return await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent || ""
    });
  }
};
