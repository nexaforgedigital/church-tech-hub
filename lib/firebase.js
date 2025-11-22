import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, update } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYsEXGjyfWvyZuGEtwBk6p1DWnFjbPwcI",
  authDomain: "chruchassistremote.firebaseapp.com",
  projectId: "chruchassistremote",
  storageBucket: "chruchassistremote.firebasestorage.app",
  messagingSenderId: "352894489694",
  appId: "1:352894489694:web:8de883de9d238b134650cf"
};

// Initialize Firebase
let app;
let database;

if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Helper functions for remote control
export const createSession = (sessionId, initialData) => {
  if (!database) return;
  const sessionRef = ref(database, `sessions/${sessionId}`);
  return set(sessionRef, {
    ...initialData,
    createdAt: Date.now()
  });
};

export const updateSession = (sessionId, data) => {
  if (!database) return;
  const sessionRef = ref(database, `sessions/${sessionId}`);
  return update(sessionRef, {
    ...data,
    updatedAt: Date.now()
  });
};

export const listenToSession = (sessionId, callback) => {
  if (!database) return () => {};
  const sessionRef = ref(database, `sessions/${sessionId}`);
  return onValue(sessionRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(data);
    }
  });
};

export const sendCommand = (sessionId, command) => {
  if (!database) return;
  const commandRef = ref(database, `sessions/${sessionId}/command`);
  return set(commandRef, {
    action: command,
    timestamp: Date.now()
  });
};

export { database };