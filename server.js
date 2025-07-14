const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Stockage temporaire des inscriptions en attente (mémoire, pas grave pour tester)
const pending = {};

// 1. Route pour recevoir l’inscription TEMPORAIRE
app.post('/api/register', (req, res) => {
  const id = req.body.id; // id unique généré côté client
  pending[id] = req.body; // on stocke l’inscription en attente
  console.log('Inscription reçue (en attente de paiement) :', pending[id]);
  res.json({ success: true });
});

// 2. Route que SumUp va appeler après paiement
app.post('/sumup-webhook', (req, res) => {
  const { status, reference } = req.body;
  console.log('Webhook reçu SumUp :', req.body);
  if (status === 'PAID' && pending[reference]) {
    // Ici, tu valides l’inscription (envoies à Google Sheets, email, etc.)
    console.log('Paiement validé pour :', pending[reference]);
    // TODO : Ajoute ici l’envoi vers Google Sheets si tu veux
    delete pending[reference]; // on enlève de la liste d’attente
  }
  res.send('OK');
});

// 3. Lancer le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur Node.js démarré sur http://localhost:3000');
});