// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAmjsGDcmd3lWDDu44S3fVDWDezbZT1s5M',
  authDomain: 'quiwi-511fc.firebaseapp.com',
  projectId: 'quiwi-511fc',
  storageBucket: 'quiwi-511fc.appspot.com',
  messagingSenderId: '235653899182',
  appId: '1:235653899182:web:0bb43656ae93d206409e3f',
  measurementId: 'G-E8M2LTRFN2',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)
export const storageRef = ref
export const uploadFile = uploadBytes
export const getUrl = getDownloadURL

// export const analytics = getAnalytics(app)
