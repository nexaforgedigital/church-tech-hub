import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYsEXGjyfWvyZuGEtwBk6p1DWnFjbPwcI",
  authDomain: "chruchassistremote.firebaseapp.com",
  databaseURL: "https://chruchassistremote-default-rtdb.asia-southeast1.firebasedatabase.app",
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
    console.log('🔥 Initializing Firebase with config:', {
      projectId: firebaseConfig.projectId,
      databaseURL: firebaseConfig.databaseURL
    });
    
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    
    console.log('✅ Firebase initialized!');
    console.log('📊 Database:', database);
  } catch (error) {
    console.error('❌ Firebase init error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

// Test function to verify database works
export const testFirebase = async () => {
  if (!database) {
    console.error('❌ Database not initialized');
    return false;
  }
  
  try {
    const testRef = ref(database, 'test');
    await set(testRef, {
      message: 'Firebase is working!',
      timestamp: Date.now()
    });
    console.log('✅ Test write successful!');
    return true;
  } catch (error) {
    console.error('❌ Test write failed:', error);
    return false;
  }
};

export const createSession = async (sessionId, initialData) => {
  if (!database) {
    console.error('❌ Database not initialized');
    return;
  }
  
  console.log('📝 Creating session:', sessionId);
  const sessionRef = ref(database, `sessions/${sessionId}`);
  
  try {
    await set(sessionRef, {
      ...initialData,
      createdAt: Date.now()
    });
    console.log('✅ Session created!');
  } catch (error) {
    console.error('❌ Create session error:', error);
    console.error('Error code:', error.code);
    throw error;
  }
};

export const updateSession = async (sessionId, data) => {
  if (!database) {
    console.error('❌ Database not initialized');
    return;
  }
  
  console.log('📝 Updating session:', sessionId);
  const sessionRef = ref(database, `sessions/${sessionId}`);
  
  try {
    await update(sessionRef, {
      ...data,
      updatedAt: Date.now()
    });
    console.log('✅ Session updated!');
  } catch (error) {
    console.error('❌ Update session error:', error);
    throw error;
  }
};

export const listenToSession = (sessionId, callback) => {
  if (!database) {
    console.error('❌ Database not initialized');
    return () => {};
  }
  
  console.log('👂 Listening to session:', sessionId);
  const sessionRef = ref(database, `sessions/${sessionId}`);
  
  return onValue(sessionRef, (snapshot) => {
    const data = snapshot.val();
    console.log('📩 Received data from Firebase:', data);
    if (data) {
      callback(data);
    }
  }, (error) => {
    console.error('❌ Listen error:', error);
  });
};

export const sendCommand = async (sessionId, command) => {
  if (!database) {
    console.error('❌ Database not initialized');
    return;
  }
  
  console.log('📤 Sending command:', command);
  const commandRef = ref(database, `sessions/${sessionId}/command`);
  
  try {
    await set(commandRef, {
      action: command,
      timestamp: Date.now()
    });
    console.log('✅ Command sent!');
  } catch (error) {
    console.error('❌ Send command error:', error);
    throw error;
  }
};

export { database };