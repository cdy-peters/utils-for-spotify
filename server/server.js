const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3080;
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI,
  CLIENT_URL,
} = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
  })
);

app.get("/get-access-token", getAccessTokenHandler);
app.get("/refresh-access-token", refreshAccessTokenHandler);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

function getAccessTokenHandler(req, res) {
  const { code } = req.query;
  const grantType = "authorization_code";
  const url = "https://accounts.spotify.com/api/token";
  const body = `grant_type=${grantType}&code=${code}&redirect_uri=${SPOTIFY_REDIRECT_URI}`;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64")}`,
  };

  request.post(
    {
      url,
      body,
      headers,
    },
    (error, response, body) => {
      res.send(body);
    }
  );
}

function refreshAccessTokenHandler(req, res) {
  const { refresh_token } = req.query;
  const grant_type = "refresh_token";
  const url = "https://accounts.spotify.com/api/token";
  const body = `grant_type=${grant_type}&refresh_token=${refresh_token}`;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${Buffer.from(
      `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
    ).toString("base64")}`,
  };

  request.post(
    {
      url,
      body,
      headers,
    },
    (error, response, body) => {
      res.send(body);
    }
  );
}
