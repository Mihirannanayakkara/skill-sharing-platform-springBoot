// src/utils/firebaseUploader.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgPS4ZxhhZ79gMyCFP6c7JlkDIPSCLz2M",
  authDomain: "paf-it-c136a.firebaseapp.com",
  projectId: "paf-it-c136a",
  storageBucket: "paf-it-c136a.firebasestorage.app",
  messagingSenderId: "16558317543",
  appId: "1:16558317543:web:d5c48e0d9e4a562fefa742",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadMedia(file, userId) {
  const uniqueName = `posts/${userId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, uniqueName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCgPS4ZxhhZ79gMyCFP6c7JlkDIPSCLz2M",
//   authDomain: "paf-it-c136a.firebaseapp.com",
//   projectId: "paf-it-c136a",
//   storageBucket: "paf-it-c136a.firebasestorage.app",
//   messagingSenderId: "16558317543",
//   appId: "1:16558317543:web:d5c48e0d9e4a562fefa742",
//   measurementId: "G-LSZNV0M3S6"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);