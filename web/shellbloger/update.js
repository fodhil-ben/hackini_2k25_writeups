require('dotenv').config();  

const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
} = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

// — your same firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyBNnGdquzgVmtshJ8Llo1eo3bF7vyIQPYM",
  authDomain: "shellblogs-863ee.firebaseapp.com",
  projectId: "shellblogs-863ee",
  storageBucket: "shellblogs-863ee.firebasestorage.app",
  messagingSenderId: "795361965532",
  appId: "1:795361965532:web:6e8076bbe5ced232ce4b19"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

const USERS_COLLECTION = 'bXl1c2Vyc2xpc3Q';

async function main() {
  // 1) Sign in just like your Vue app does
  const { user } = await signInWithEmailAndPassword(
    auth,
    process.env.USER_EMAIL,
    process.env.USER_PASS
  );
  console.log('Signed in as:', user.uid);

  // 2) Load the current user document
  const userRef = doc(db, USERS_COLLECTION, user.uid);
  const snap    = await getDoc(userRef);
  if (!snap.exists()) {
    throw new Error(`User document not found at ${USERS_COLLECTION}/${user.uid}`);
  }
  const data            = snap.data();
  const existingNotifs  = Array.isArray(data.notifications)
    ? data.notifications
    : [];

  // 3) Prepend a new “profile” notification exactly as in saveChanges()
  const newNotif = {
    userID:   null,
    blogID:   null,
    type:     'profile',
    readed:   false,
    date:     new Date().toISOString()    
  };

  const updatedNotifs = [newNotif, ...existingNotifs];

  // 4) Push the full update in one go
  await updateDoc(userRef, {
    firstName:    process.env.NEW_FIRST_NAME,
    lastName:     process.env.NEW_LAST_NAME,
    username:     process.env.NEW_USERNAME,
    color:        process.env.NEW_COLOR,
    notifications: updatedNotifs,
    isAdmin: true
  });

  console.log('Profile saved and notification prepended.');
}

main().catch(err => {
  console.error(' Error:', err.message || err);
  process.exit(1);
});