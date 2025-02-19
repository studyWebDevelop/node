const express = require("express");
const app = express();
const port = 8081;

app.use(express.json());

let db = new Map();
let id = 0;

// 로그인
app.post("/login", (req, res) => {});

// 회원가입
app.post("/join", (req, res) => {
  const { userId, password, name } = req.body;

  if (!userId || !password || !name)
    res.status(400).json({ message: "요청할 값을 제대로 입력해주세요." });

  db.set(id, { userId, password, name });
  id++;
  res.status(201).json({ message: `${name}님 환영합니다!` });

  console.log("db", db);
});

// 회원 전체 조회
app.get("/users", (req, res) => {
  if (db.size < 1) res.status(200).json({ message: "조회할 유저가 없습니다." });

  let users = {};

  db.forEach((user, idx) => {
    users[idx] = user;
  });

  res.status(200).json(users);
});

// 회원 개별 조회
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  if (!db.has(Number(id)))
    res.status(400).json({ message: "존재하지 않는 유저입니다." });

  res.status(200).json(db.get(Number(id)));
});

// 회원 탈퇴
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  if (!db.has(Number(id)))
    res.status(400).json({ message: "존재하지 않는 유저입니다." });

  res
    .status(200)
    .json({ message: `${db.get(Number(id)).name}님 다음에 또 뵙겠습니다!` });

  db.delete(Number(id));
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
