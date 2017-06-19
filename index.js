import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import config from './src/config';
import situation from './src/situation.js';

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/situation', situation);
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(config.port, () => {
  console.info(`The server is running at http://localhost:${config.port}/`);
});
