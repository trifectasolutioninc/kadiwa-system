import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../configurations/firebase.config";

export const app = initializeApp(firebaseConfig);