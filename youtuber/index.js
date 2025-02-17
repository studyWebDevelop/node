const express = require("express");
const app = express();
const port = 8080;

app.use(express.json());

// @15ya_egg
let youtuber1 = {
  channelTitle: "십오야",
  sub: "600만명",
  videoNum: "6.6천개",
};

// @ChimChakMan_Official
let youtuber2 = {
  channelTitle: "침착맨",
  sub: "274만명",
  videoNum: "7.4천개",
};

// @서재로36
let youtuber3 = {
  channelTitle: "서재로36",
  sub: "43.2만명",
  videoNum: "93개",
};

let db = new Map();

db.set(1, youtuber1);
db.set(2, youtuber2);
db.set(3, youtuber3);

app.get("/youtuber/:id", (req, res) => {
  const { id } = req.params;

  if (db.has(Number(id))) {
    res.json(db.get(Number(id)));
  } else {
    res.status(404).json({ message: "존재하지 않는 유튜버입니다." });
  }
});

app.get("/youtubers", (req, res) => {
  res.json(Array.from(db.values()));
});

app.get("/:nickname", (req, res) => {
  const { nickname } = req.params;

  if (nickname === "@15ya_egg") {
    res.json(youtuber1);
  } else if (nickname === "@ChimChakMan_Official") {
    res.json(youtuber2);
  } else if (nickname === "@서재로36") {
    res.json(youtuber3);
  } else {
    res.json({ message: "저는 모르는 유튜버 입니다." });
  }
});

app.post("/youtuber", (req, res) => {
  const { channelTitle, sub, videoNum } = req.body;

  const newYoutuber = {
    channelTitle,
    sub,
    videoNum,
  };

  db.set(db.size + 1, newYoutuber);

  console.log("db", db);
  res.json(db.get(db.size));
});

app.put("/youtuber/:id", (req, res) => {
  const { id } = req.params;

  if (db.has(Number(id))) {
    const updatedYoutuber = { ...db.get(Number(id)), ...req.body };

    db.set(Number(id), updatedYoutuber);
    console.log("db", db);

    res.json(updatedYoutuber);
  }
});

app.delete("/youtuber/:id", (req, res) => {
  const { id } = req.params;

  if (db.has(Number(id))) {
    res.json(db.get(Number(id)));
    db.delete(Number(id));
  } else {
    res.json({ message: "유튜버가 존재하지 않습니다." });
  }

  console.log("db", db);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
