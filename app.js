require('dotenv').config();
const express = require('express');
const http = require('http');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const { Hash } = require('crypto');

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

webpush.setVapidDetails(
  'mailto:test@test.com',
  process.env.PUBLIC_VAPID,
  process.env.PRIVATE_VAPID
);

// Subscribe Route
app.get('/:id', (req, res) => {
  res.json({ msg: req.params.id });
  // // Get push subscribe object
  // const subscriptoon = req.body;

  // // Send 201 - resource created.
  // res.status(201).json({});

  // // Create the payload
  // const payload = JSON.stringify({ title: 'Order Ready' });

  // // Pass object into sendNotification
  // webpush
  //   .sendNotification(subscriptoon, payload)
  //   .catch((err) => console.error(err));
});

// Subscribe Route
app.post('/subscribe', (req, res) => {
  // Get push subscribe object
  const subscriptoon = req.body;

  console.log(subscriptoon);

  // Send 201 - resource created.
  res.status(201).json({});

  // Create the payload
  const payload = JSON.stringify({ title: 'Order Ready' });

  // Pass object into sendNotification
  webpush
    .sendNotification(subscriptoon, payload)
    .catch((err) => console.error(err));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
