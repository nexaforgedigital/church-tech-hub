import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, update, remove, get } from 'firebase/database';

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

// Debug mode - only log in development
const DEBUG = process.env.NODE_ENV === 'development';

const log = (...args) => {
  if (DEBUG) console.log(...args);
};

const logError = (...args) => {
  console.error(...args); // Always log errors
};

// Initialize Firebase
let app;
let database;

if (typeof window !== 'undefined') {
  try {
    log('🔥 Initializing Firebase...');
    
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    
    log('✅ Firebase initialized successfully!');
  } catch (error) {
    logError('❌ Firebase initialization error:', error.message);
  }
}

/**
 * Test Firebase connection
 * @returns {Promise<boolean>} - True if connection successful
 */
export const testFirebase = async () => {
  if (!database) {
    logError('❌ Database not initialized');
    return false;
  }
  
  try {
    const testRef = ref(database, 'test');
    await set(testRef, {
      message: 'Firebase is working!',
      timestamp: Date.now()
    });
    log('✅ Firebase test write successful!');
    return true;
  } catch (error) {
    logError('❌ Firebase test write failed:', error.message);
    return false;
  }
};

/**
 * Create a new presentation session
 * @param {string} sessionId - Unique session identifier
 * @param {object} initialData - Initial session data
 */
export const createSession = async (sessionId, initialData) => {
  if (!database) {
    logError('❌ Database not initialized');
    return false;
  }
  
  log('📝 Creating session:', sessionId);
  const sessionRef = ref(database, `sessions/${sessionId}`);
  
  try {
    await set(sessionRef, {
      ...initialData,
      createdAt: Date.now(),
      status: 'active'
    });
    log('✅ Session created successfully!');
    return true;
  } catch (error) {
    logError('❌ Create session error:', error.message);
    return false;
  }
};

/**
 * Update an existing session
 * @param {string} sessionId - Session identifier
 * @param {object} data - Data to update
 */
export const updateSession = async (sessionId, data) => {
  if (!database) {
    logError('❌ Database not initialized');
    return false;
  }
  
  log('📝 Updating session:', sessionId);
  const sessionRef = ref(database, `sessions/${sessionId}`);
  
  try {
    await update(sessionRef, {
      ...data,
      updatedAt: Date.now()
    });
    log('✅ Session updated successfully!');
    return true;
  } catch (error) {
    logError('❌ Update session error:', error.message);
    return false;
  }
};

/**
 * Listen for real-time session updates
 * @param {string} sessionId - Session identifier
 * @param {function} callback - Function to call when data changes
 * @returns {function} - Unsubscribe function
 */
export const listenToSession = (sessionId, callback) => {
  if (!database) {
    logError('❌ Database not initialized');
    return () => {};
  }
  
  log('👂 Listening to session:', sessionId);
  const sessionRef = ref(database, `sessions/${sessionId}`);
  
  const unsubscribe = onValue(sessionRef, (snapshot) => {
    const data = snapshot.val();
    log('📩 Received session data:', data ? 'Data exists' : 'No data');
    if (data) {
      callback(data);
    }
  }, (error) => {
    logError('❌ Listen error:', error.message);
  });

  return unsubscribe;
};

/**
 * Send a command to the presentation
 * @param {string} sessionId - Session identifier
 * @param {string} command - Command to send (NEXT_SLIDE, PREV_SLIDE, etc.)
 */
export const sendCommand = async (sessionId, command) => {
  if (!database) {
    logError('❌ Database not initialized');
    return false;
  }
  
  log('📤 Sending command:', command);
  const commandRef = ref(database, `sessions/${sessionId}/command`);
  
  try {
    await set(commandRef, {
      action: command,
      timestamp: Date.now()
    });
    log('✅ Command sent successfully!');
    return true;
  } catch (error) {
    logError('❌ Send command error:', error.message);
    return false;
  }
};

/**
 * Clear command after processing to prevent duplicate execution
 * @param {string} sessionId - Session identifier
 */
export const clearCommand = async (sessionId) => {
  if (!database) {
    logError('❌ Database not initialized');
    return false;
  }
  
  log('🧹 Clearing command from session:', sessionId);
  const commandRef = ref(database, `sessions/${sessionId}/command`);
  
  try {
    await remove(commandRef);
    log('✅ Command cleared successfully!');
    return true;
  } catch (error) {
    logError('❌ Clear command error:', error.message);
    return false;
  }
};

/**
 * Get current session data (one-time read)
 * @param {string} sessionId - Session identifier
 * @returns {Promise<object|null>} - Session data or null
 */
export const getSession = async (sessionId) => {
  if (!database) {
    logError('❌ Database not initialized');
    return null;
  }
  
  log('📖 Getting session:', sessionId);
  const sessionRef = ref(database, `sessions/${sessionId}`);
  
  try {
    const snapshot = await get(sessionRef);
    if (snapshot.exists()) {
      log('✅ Session data retrieved!');
      return snapshot.val();
    } else {
      log('⚠️ Session not found');
      return null;
    }
  } catch (error) {
    logError('❌ Get session error:', error.message);
    return null;
  }
};

/**
 * Delete a session completely
 * @param {string} sessionId - Session identifier
 */
export const deleteSession = async (sessionId) => {
  if (!database) {
    logError('❌ Database not initialized');
    return false;
  }
  
  log('🗑️ Deleting session:', sessionId);
  const sessionRef = ref(database, `sessions/${sessionId}`);
  
  try {
    await remove(sessionRef);
    log('✅ Session deleted successfully!');
    return true;
  } catch (error) {
    logError('❌ Delete session error:', error.message);
    return false;
  }
};

/**
 * Clean up old sessions (older than 24 hours)
 * Call this periodically to prevent database bloat
 */
export const cleanupOldSessions = async () => {
  if (!database) {
    logError('❌ Database not initialized');
    return;
  }
  
  log('🧹 Cleaning up old sessions...');
  const sessionsRef = ref(database, 'sessions');
  
  try {
    const snapshot = await get(sessionsRef);
    if (!snapshot.exists()) {
      log('✅ No sessions to clean up');
      return;
    }
    
    const sessions = snapshot.val();
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    let cleanedCount = 0;
    
    for (const [sessionId, sessionData] of Object.entries(sessions)) {
      const sessionAge = now - (sessionData.createdAt || 0);
      
      if (sessionAge > maxAge) {
        await deleteSession(sessionId);
        cleanedCount++;
      }
    }
    
    log(`✅ Cleaned up ${cleanedCount} old sessions`);
  } catch (error) {
    logError('❌ Cleanup error:', error.message);
  }
};

/**
 * Check if Firebase is connected and working
 * @returns {boolean} - True if database is initialized
 */
export const isFirebaseReady = () => {
  return database !== null && database !== undefined;
};

// Export database instance for advanced usage
export { database };