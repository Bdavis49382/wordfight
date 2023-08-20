import { initializeApp} from "firebase/app";
import { getFirestore} from 'firebase/firestore';
// import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyAGX2CuhT2haXbGAokCVc_QX_KVTbjZpHY",
  authDomain: "wordfight-64703.firebaseapp.com",
  databaseURL: "https://wordfight-64703-default-rtdb.firebaseio.com",
  projectId: "wordfight-64703",
  storageBucket: "wordfight-64703.appspot.com",
  messagingSenderId: "259828392912",
  appId: "1:259828392912:web:f242a30e4ecca0bf2f4fd5",
  measurementId: "G-S61Q9GG733"
};
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export {db};