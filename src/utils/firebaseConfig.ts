// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getDownloadURL, getStorage,
  ref, StorageReference, uploadString
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
const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = (error) => reject(error)
  })

export const uploadFile = async (fileRef: StorageReference, data: File) => {
  try {
    console.log('=>(firebaseConfig.ts:35) up anhr', fileRef)
    const base64Data = await toBase64(data)
    const newImagesSrc = await resizeBase64Img(String(base64Data), 600, 600)
    await uploadString(fileRef, newImagesSrc, 'data_url')
    console.log('=>(firebaseConfig.ts:40) uploadFile hoan tat')
  } catch (error) {
    console.log('uploadFile - error', error)
  }
}
export const getUrl = getDownloadURL

// export const analytics = getAnalytics(app)
