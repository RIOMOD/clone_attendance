import { initializeApp } from "firebase/app";
// 1. Import hàm getFirestore
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNiuf4jb62mYs4LK6fhpMT-XrEVW3E2z8", // Giữ nguyên thông tin của bạn
  authDomain: "attendancectsv-rk.firebaseapp.com",
  projectId: "attendancectsv-rk",
  storageBucket: "attendancectsv-rk.firebasestorage.app",
  messagingSenderId: "405130319138",
  appId: "1:405130319138:web:2c5d6d039477bfd9a8c17b"
  // measurementId có thể có hoặc không, không quan trọng với Firestore
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. Khởi tạo Firestore và export nó ra để các file khác có thể dùng
export const db = getFirestore(app);