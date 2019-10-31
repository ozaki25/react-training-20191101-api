const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./serviceAccount.json');

const app = express();

app.use(bodyParser.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ippo-app.firebaseio.com',
});

const db = admin.firestore();
const teamRef = db.collection('baseball-teams');
const playerRef = db.collection('baseball-players');

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/hello', (req, res) => {
  res.send('Hello');
});

app.get('/teams', async (req, res, next) => {
  console.log('GET /teams');
  try {
    const snapshots = await teamRef.get();
    const teams = snapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log({ teams });
    res.send(teams);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

app.get('/players', async (req, res, next) => {
  console.log('GET /players');
  try {
    const snapshots = await playerRef.get();
    const players = await snapshots.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    for (let i = 0; i < players.length; i++) {
      const team = (await players[i].team.get()).data().name;
      players[i].team = team;
    }

    console.log({ players });
    res.send(players);
  } catch (e) {
    console.log(e);
    next(e);
  }
});

// app.post('/players', async (req, res, next) => {
//   console.log('POST /messages');
//   try {
//     console.log(req.body);
//     const { content } = req.body;
//     if (content) {
//       const message = {
//         content,
//       };
//       await messagesRef.add(message);
//       res.send(message);
//     } else {
//       res.send(null);
//     }
//   } catch (e) {
//     console.log(e);
//     next(e);
//   }
// });

// app.delete('/messages/:id', async (req, res, next) => {
//   console.log('DELET /messages/:id');
//   try {
//     console.log(req.params);
//     const { id } = req.params;
//     if (id) {
//       await messagesRef.doc(id).delete();
//       res.send(null);
//     } else {
//       res.send(null);
//     }
//   } catch (e) {
//     console.log(e);
//     next(e);
//   }
// });

module.exports.hello = serverless(app);

const port = '8080';
app.listen(port, () => {
  console.log(`app start listening on port ${port}`);
});
