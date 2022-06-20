// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  StorageReference,
  UploadResult,
  uploadString, uploadBytesResumable,
} from 'firebase/storage'
import { resizeBase64Img } from './helper'
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
export const uploadFile = async (fileRef: StorageReference, data: File) => {
  try {
    console.log("=>(firebaseConfig.ts:35) up anhr", fileRef);
    const reader = new FileReader()
    reader.onload = async () => {
      let newImagesSrc = await resizeBase64Img(String(reader.result), 600, 600)
      await uploadString(fileRef, newImagesSrc, 'data_url')
      console.log("=>(firebaseConfig.ts:40) uploadFile hoan tat");
    }
    reader.readAsDataURL(data)

    // const uploadTask = uploadBytesResumable(fileRef, data);

  } catch (error) {
    console.log('uploadFile - error', error)
  }
}
export const getUrl = getDownloadURL

// export const analytics = getAnalytics(app)
