const http = require('http');
const { URLSearchParams } = require('url');
const express = require('express');
const WebSocket = require('ws');
const got = require('got');
const { clientId, clientSecret } = require('./consts');
const VkUser = require('./classes/VkUser');
const UsersCollection = require('./classes/UsersCollection');
const port = 8081;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const authURL = 'https://oauth.vk.com/access_token';

const [,, type] = process.argv;
const redirectUri = type === '--production'
  ? 'https://sanchezz.me/likes/auth'
  : 'http://localhost:8080/auth';

const users = new UsersCollection();
const queues = {};

app.get('/auth', async (request, response) => {
  try {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: request.query.code,
    }).toString();
    const url = `${authURL}?${params}`;
    const result = await got(url);
    const user = JSON.parse(result.body);
    const vkUser = new VkUser(user.access_token, user);
    users.add(vkUser);

    response
      .status(200)
      .send(user);

  } catch (error) {
    response
      .status(500)
      .send(error);
  }
});

wss.on('connection', function connection(ws, req) {
  let accessToken;

  ws.on('message', function (message) {
    queues[message] = [];
    accessToken = message;
  });

  function send() {
    const queue = queues[accessToken];

    if (
      Array.isArray(queue)
      && queue.length
      && ws.readyState === WebSocket.OPEN
    ) {
      const { accessToken, ...data } = queue[0];
      ws.send(JSON.stringify(data));
      queue.shift();
    }

    setTimeout(send, 150);
  }

  send();
});

function append(event) {
  const { type, users, accessToken } = event;

  if (!queues[accessToken]) {
    queues[accessToken] = [];
  }

  const queue = queues[accessToken];

  for (const user of users) {
    queue.push({
      [type]: event[type],
      accessToken,
      type,
      user,
    });
  }
}

users.on('post', append);
users.on('photo', append);

server.listen(port);
