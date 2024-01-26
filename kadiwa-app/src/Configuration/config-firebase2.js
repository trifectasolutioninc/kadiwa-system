import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDRIgPAM9q9wIdqzCGziePTfhgOcbhfFFs",
  authDomain: "kadiwa-b9d26.firebaseapp.com",
  databaseURL: "https://kadiwa-b9d26-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kadiwa-b9d26",
  storageBucket: "kadiwa-b9d26.appspot.com",
  messagingSenderId: "96545971690",
  appId: "1:96545971690:web:cce5e900f7e2efd221a693",
  measurementId: "G-MNF8RZ39G2"
};

const app = initializeApp(firebaseConfig);
const firebaseDB = getDatabase(app);

export default firebaseDB;
