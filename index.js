const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();

app.use(bodyParser.json());

const channelSecret = 'YOUR_CHANNEL_SECRET'; // チャネルシークレットをここに入力

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-line-signature'];
  const body = JSON.stringify(req.body);
  const hash = crypto.createHmac('sha256', channelSecret).update(body).digest('base64');

  if (signature !== hash) {
    return res.status(400).send('Invalid signature');
  }

  const events = req.body.events;
  events.forEach(event => {
    if (event.type === 'follow') {
      const userId = event.source.userId;
      console.log(`New friend added: ${userId}`);
      // ユーザーIDを保存するなどの処理を行う
    }
  });

  res.status(200).send('Success');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
