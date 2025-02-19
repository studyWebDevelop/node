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

app.get("/youtubers", (req, res) => {
  let youtubers = {};

  db.forEach((value, key) => {
    youtubers[key] = value;
  });

  if (db.size > 0) {
    res.status(200).json(youtubers);
  } else {
    res.status(200).json({ message: "조회할 유튜버가 없습니다." });
  }
});

app.get("/youtubers/:id", (req, res) => {
  const { id } = req.params;

  if (db.has(Number(id))) {
    res.json(db.get(Number(id)));
  } else {
    res.status(200).json({ message: "존재하지 않는 유튜버입니다." });
  }
});

app.post("/youtubers", (req, res) => {
  const { channelTitle, sub, videoNum } = req.body;

  const newYoutuber = {
    channelTitle,
    sub,
    videoNum,
  };

  db.set(db.size + 1, newYoutuber);

  console.log("db", db);
  if (channelTitle && sub && videoNum) {
    res.status(201).json(db.get(db.size));
  } else {
    res.status(400).json({ message: "요청할 값을 제대로 입력해주세요. " });
  }
});

app.delete("/youtubers", (req, res) => {
  if (db.size > 0) {
    db.clear();
    res.status(200).json({ message: "모든 유튜버가 삭제되었습니다." });
  } else {
    res.status(200).json({ message: "삭제할 유튜버가 없습니다." });
  }
});

app.delete("/youtubers/:id", (req, res) => {
  const { id } = req.params;

  if (db.has(Number(id))) {
    res.status(200).json(`${id}번 유튜버가 삭제되었습니다.`);
    db.delete(Number(id));
  } else {
    res.status(200).json({ message: "유튜버가 존재하지 않습니다." });
  }

  console.log("db", db);
});

app.put("/youtubers/:id", (req, res) => {
  const { id } = req.params;
  const { channelTitle, sub, videoNum } = req.body;

  if (db.has(Number(id)) && channelTitle && sub && videoNum) {
    const updatedYoutuber = { ...db.get(Number(id)), ...req.body };

    db.set(Number(id), updatedYoutuber);
    console.log("db", db);

    res.status(200).json({
      data: updatedYoutuber,
      message: `${id}번 유튜버의 정보가 수정되었습니다.`,
    });
  } else {
    res.status(400).json({ message: "요청할 값을 제대로 입력해 주세요." });
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
