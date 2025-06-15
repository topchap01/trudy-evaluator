import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Or use serviceAccount
  });
}

const db = admin.firestore();
export { db };
