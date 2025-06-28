// listUsers.js

require('dotenv').config();
// .env must define: ADMIN_EMAIL, ADMIN_PASS

const { initializeApp } = require('firebase/app');
const {
  getAuth,
  signInWithEmailAndPassword
} = require('firebase/auth');
const {
  getFirestore,
  collection,
  getDocs
} = require('firebase/firestore');

// — your Firebase client config
const firebaseConfig = {
  apiKey:    "AIzaSyBNnGdquzgVmtshJ8Llo1eo3bF7vyIQPYM",
  authDomain:"shellblogs-863ee.firebaseapp.com",
  projectId: "shellblogs-863ee",
  storageBucket: "shellblogs-863ee.firebasestorage.app",
  messagingSenderId: "795361965532",
  appId:     "1:795361965532:web:6e8076bbe5ced232ce4b19"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Base64‑encoded collection name
const USERS_COLLECTION = 'bG9ncw';

async function main() {
  // 1) Sign in as admin
  const { user } = await signInWithEmailAndPassword(
    auth,
    process.env.USER_EMAIL,
    process.env.USER_PASS
  );
  console.log('✅ Signed in as admin:', user.uid);

  // 2) Fetch all user docs
  const usersCol = collection(db, USERS_COLLECTION);
  const snap     = await getDocs(usersCol);

  // 3) Print each user's data
  console.log(`\n📋 ${snap.size} users found:\n`);
  snap.docs.forEach(doc => {
    console.log(`— ${doc.id}:`, doc.data());
  });
}

main().catch(err => {
  console.error('❌ Error:', err.code || err.message);
  process.exit(1);
});
