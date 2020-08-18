require("dotenv").config();
const cors = require("cors");
const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(cors());
app.use(express.json());
const scraps = [];

function logRequests(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}]${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateScrapId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Param sent is not a valisUUID" });
  }

  return next();
}

function validateRequestBody(req, res, next) {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: "All the fields must be filled" });
  }

  next();
}

app.use(logRequests);
app.use("/scraps/:id", validateScrapId);

app.get("/scraps", (req, res) => {
  const { title } = req.query;

  const results = title
    ? scraps.filter((scrap) =>
        scrap.title.toLowerCase().includes(title.toLowerCase())
      )
    : scraps;

  return res.json(scraps);
});

app.post("/scraps", validateRequestBody, (req, res) => {
  const id = uuid();
  const { title, message } = req.body;

  const scrap = { id, title, message };

  scraps.push(scrap);

  return res.json(scrap);
});

app.put("/scraps/:id", (req, res) => {
  const { id } = req.params;
  const { title, message } = req.body;

  const scrapIndex = scraps.findIndex((scrap) => scrap.id === id);

  if (scrapIndex < 0) {
    return res.status(400).json({ error: "Scrap not found" });
  }

  const scrap = {
    id,
    title,
    message,
  };
});

app.delete("/scraps/:id", (req, res) => {
  const { id } = req.params;

  const scrapIndex = scraps.findIndex((scrap) => scrap.id === id);

  if (scrapIndex < 0) {
    return res.status(400).json({ error: "Scrap not found" });
  }

  scraps.splice(scrapIndex, 1);

  return res, status(204).send();
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`Server up and running on PORT ${port}`);
});
