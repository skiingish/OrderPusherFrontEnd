const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
const { Hash } = require('crypto');

const app = express();

app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

const publicVapidKey =
  'BJKfugtSRPwIUr9P6wqFa0jmB_d9TmRR7W0Yquxulf0rCpQPe3KStrZ0vLIca39LQtphUobaV3c2lmqzS3Q2ey4';
const privateVapidKey = 'hF869KWOvBTtE821gULPwhNrcKqF3xl9LwwRWJKQYJs';

webpush.setVapidDetails(
  'mailto:test@test.com',
  publicVapidKey,
  privateVapidKey
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

const port = 5000;

app.listen(port, () => console.log(`Listening on port ${port}`));
