import Firebase from "firebase";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_APP_ID
};

let firebase;
if (!Firebase.apps.length) {
    firebase = Firebase.initializeApp(firebaseConfig);
    if (typeof window !== 'undefined') {
        firebase.auth().setPersistence(Firebase.auth.Auth.Persistence.SESSION);
    }
} else {
    // Because of Next.js hot reload
    firebase = Firebase.app();
}

export const db = firebase.firestore();
export const auth = firebase.auth();
