import { useState, useEffect } from 'react';
import { testFirebase } from '../lib/firebase';

export default function TestFirebase() {
  const [result, setResult] = useState('Click button to test');
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    setTesting(true);
    setResult('Testing Firebase...\n\nCheck browser console (F12) for details...');
    
    try {
      const success = await testFirebase();
      if (success) {
        setResult('✅ SUCCESS!\n\nFirebase is working!\n\nGo to Firebase Console → Realtime Database\nYou should see a "test" folder with data.');
      } else {
        setResult('❌ FAILED\n\nCheck browser console (F12) for error details.');
      }
    } catch (error) {
      setResult(`❌ ERROR:\n\n${error.message}\n\nCheck browser console (F12) for full error.`);
    }
    
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">🔥 Firebase Test</h1>
        <p className="text-gray-600 text-center mb-8">
          This will test if Firebase Realtime Database is working
        </p>

        <button
          onClick={runTest}
          disabled={testing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:shadow-lg transition disabled:opacity-50 mb-6"
        >
          {testing ? '⏳ Testing...' : '🧪 Test Firebase Connection'}
        </button>

        <div className="bg-gray-100 rounded-lg p-6 min-h-[200px]">
          <h3 className="font-bold mb-3">Result:</h3>
          <pre className="text-sm whitespace-pre-wrap font-mono">{result}</pre>
        </div>

        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-900 mb-2">📋 Instructions:</h3>
          <ol className="text-sm text-yellow-800 space-y-1">
            <li>1. Click the test button above</li>
            <li>2. Open browser console: Press <kbd className="bg-yellow-200 px-2 py-1 rounded">F12</kbd></li>
            <li>3. Look for 🔥 Firebase logs in console</li>
            <li>4. Open Firebase Console in another tab</li>
            <li>5. Check Realtime Database → Data tab</li>
            <li>6. You should see a "test" folder appear!</li>
          </ol>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>After testing, check console and Firebase Console</p>
        </div>
      </div>
    </div>
  );
}