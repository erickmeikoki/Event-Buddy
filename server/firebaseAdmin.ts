import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // If running on Firebase Functions, the admin SDK will automatically
  // use the Function configuration (FIREBASE_CONFIG environment variable)
  // If running elsewhere (like local development), provide credentials manually
  if (process.env.NODE_ENV === 'development') {
    try {
      admin.initializeApp({
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
      console.log('Firebase Admin SDK initialized in development mode');
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
    }
  } else {
    // In production (Firebase Functions), the SDK auto-initializes
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized in production mode');
  }
}

export default admin;