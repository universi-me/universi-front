import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyAmj90pl5mRfYL2nID25tCWraQnRq38sPM",
    authDomain: "fir-auth-universime.firebaseapp.com",
    projectId: "fir-auth-universime",
    storageBucket: "fir-auth-universime.appspot.com",
    messagingSenderId: "424237615207",
    appId: "1:424237615207:web:0527b2e317acf3a1c22cc2",
    measurementId: "G-EC55CC3H5M"

};

firebase.initializeApp(firebaseConfig);

export default firebase;