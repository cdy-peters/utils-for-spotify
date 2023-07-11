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

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

function getAccessTokenHandler(req, res) {
  const code = req.query.code;
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
      url: url,
      body: body,
      headers: headers,
    },
    (error, response, body) => {
      return res.send(body);
    }
  );
}
