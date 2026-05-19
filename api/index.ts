import express from 'express';
import admin from 'firebase-admin';

const app = express();
app.use(express.json());

// Initialize Firebase Admin
const initFirebase = () => {
  if (admin.apps.length > 0) return admin.app();
  
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }
  return null;
};

const db = initFirebase()?.firestore();

// Mock data fallbacks
const localAutomations = [
  { 
    id: '1', 
    name: 'Lead Response Protocol', 
    status: 'Active', 
    executions: 1242, 
    lastRun: '12 mins ago', 
    trigger: 'Tag Mention', 
    color: 'bg-indigo-600',
    details: {
      triggerConditions: ['Keyword detected', 'User has > 500 followers', 'Business account'],
      metrics: { successRate: '98.4%', latency: '0.4s' }
    }
  }
];

app.get('/api/automations', async (req, res) => {
  if (db) {
    try {
      const snapshot = await db.collection('automations').get();
      const autos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (autos.length > 0) return res.json(autos);
    } catch (e) {
      console.error('Firestore fetch failed', e);
    }
  }
  res.json(localAutomations);
});

app.get('/api/cron', async (req, res) => {
  if (db) {
    try {
      const activeAutos = await db.collection('automations').where('status', '==', 'Active').get();
      for (const doc of activeAutos.docs) {
        await doc.ref.update({
          executions: admin.firestore.FieldValue.increment(1),
          lastRun: 'Just now'
        });
      }
    } catch (e) {
      console.error('Cron Firestore update failed', e);
    }
  }
  res.json({ success: true, timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    database: db ? 'connected' : 'local-only',
    timestamp: new Date().toISOString() 
  });
});

export const api = app;
