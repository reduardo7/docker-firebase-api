const https = require('https');
const google = require('googleapis');
const express = require('express');
const cors = require('cors');

const HOST = 'fcm.googleapis.com';
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];
const APP_PORT = 3000;

const PROJECT_ID = process.env.PROJECT_ID;
const PATH = '/v1/projects/' + PROJECT_ID + '/messages:send';
const key = require('./service-account.json');

const app = express();

/**
 * Get a valid access token.
 */
function getAccessToken() {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );

    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}

/**
 * Send HTTP request to FCM with given message.
 *
 * @param {JSON} fcmMessage will make up the body of the request.
 */
async function sendFcmMessage(fcmMessage) {
  return new Promise(async (resolve, reject) => {
    const accessToken = await getAccessToken();

    const options = {
      hostname: HOST,
      path: PATH,
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    };

    const request = https.request(options, (resp) => {
      resp.setEncoding('utf8');
      resp.on('data', (data) => {
        console.log('Message sent to Firebase for delivery, response:', data);
        resolve(data);
      });
    });

    request.on('error', (err) => {
      console.log('Unable to send message to Firebase', err);
      reject(err);
    });

    request.write(JSON.stringify(fcmMessage));
    request.end();
  });
}

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.get('/', (req, res) => res.send('Firebase Messages. Use /message/:topic/:title/:message'));

app.get('/message/:topic/:title/:body', async (req, res) => {
  const topic = decodeURI(req.params.topic);
  const title = decodeURI(req.params.title);
  const body  = decodeURI(req.params.body);

  console.log(`Message (${topic}) "${title}": ${body}`);

  const data = await sendFcmMessage({
    message: {
      topic: topic,
      notification: {
        title: title,
        body: body
      }
    }
  });

  return res.send(data);
});

app.listen(APP_PORT, () => console.log(`Server running at ${APP_PORT}!`));
