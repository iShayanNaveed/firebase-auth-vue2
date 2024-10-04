import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, uploadBytes } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyALrtxcusmzDX-UvHsGCXdbVbAE9e7XBCs",
  authDomain: "fir-auth-vue2.firebaseapp.com",
  projectId: "fir-auth-vue2",
  storageBucket: "fir-auth-vue2.appspot.com",
  messagingSenderId: "464320984180",
  appId: "1:464320984180:web:82cf34b3bb9bc657d9cd21",
  measurementId: "G-2K1H05XQ5P",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
const auth = getAuth(app);
export const db = getFirestore(app);
// const store = getStorage(app);
// // const upload = uploadBytes
// export { store };
export default auth;
