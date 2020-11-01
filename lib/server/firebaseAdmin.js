import FirebaseAdmin from 'firebase-admin'
import atob from 'atob'

let firebaseAdmin;
if (typeof window === 'undefined') {
    if (!FirebaseAdmin.apps.length) {
        FirebaseAdmin.initializeApp({
            credential: FirebaseAdmin.credential.cert(JSON.parse(atob(process.env.NEXT_REACT_APP_CERT))),
            databaseURL: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_DATABASE_URL
        });
    }

    firebaseAdmin = FirebaseAdmin.app()
}

export default firebaseAdmin;