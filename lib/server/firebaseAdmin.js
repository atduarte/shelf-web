import FirebaseAdmin from 'firebase-admin'

let firebaseAdmin;
if (typeof window === 'undefined') {
    if (!FirebaseAdmin.apps.length) {
        FirebaseAdmin.initializeApp({
            credential: FirebaseAdmin.credential.cert(require('../../firebaseadmin.cert.json')),
            databaseURL: process.env.NEXT_PUBLIC_REACT_APP_FIREBASE_DATABASE_URL
        });
    }

    firebaseAdmin = FirebaseAdmin.app()
}

export default firebaseAdmin;