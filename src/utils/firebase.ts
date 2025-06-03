import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBnH6h4eYV6fJswNSY5dr5R11GLmLpni28",
  authDomain: "hashira-71d26.firebaseapp.com",
  projectId: "hashira-71d26",
  storageBucket: "hashira-71d26.firebasestorage.app",
  messagingSenderId: "164911977098",
  appId: "1:164911977098:web:0983c8f78c8d7a7ddc5373",
  measurementId: "G-JN1XY3XL9R"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);