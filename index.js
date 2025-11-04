const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

const db = admin.firestore();
db.settings({ databaseId: process.env.FIREBASE_DATABASE_ID || 'dbprincipal' });

app.get('/', (req, res) => {
  res.json({ message: 'API funcionando ✅' });
});

// Importamos rutas
const studentsRoutes = require('./src/routes/studentsRoutes');
app.use('/students', studentsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
