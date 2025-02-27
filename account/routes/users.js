const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

router.use(express.json());

// 로그인
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "요청할 값을 제대로 입력해주세요." });
  }

  conn.query(sql, [email], (err, results) => {
    let loginUser = results[0];

    if (!loginUser) res.status(404).json({ message: "회원 정보가 없습니다." });

    if (loginUser.password === password) {
      return res.status(200).json({ message: "로그인 성공!" });
    } else {
      return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
    }
  });
});

// 회원가입
router.post("/join", (req, res) => {
  const { email, name, password, contact } = req.body;

  if (!email || !name || !password || !contact)
    res.status(400).json({ message: "요청할 값을 제대로 입력해주세요." });

  const sql =
    "INSERT INTO users(email, name, password, contact) VALUES (?, ?, ?, ?)";

  conn.query(sql, [email, name, password, contact], (err, results) => {
    if (results.length) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "회원 정보가 없습니다." });
    }
  });

  res.status(201).json({ message: `${name}님 환영합니다!` });
});

// 회원 전체 조회
router.get("/users", (req, res) => {
  const { email } = req.body;

  const sql = "SELECT * FROM users WHERE email=?";

  conn.query(sql, [email], (err, results) => {
    if (results.length) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "회원 정보가 없습니다." });
    }
  });
});

// 회원 탈퇴
router.delete("/users", (req, res) => {
  const { email } = req.body;

  const sql = "DELETE FROM users where email=?";

  conn.query(sql, [email], (err, results) => {
    if (results) {
      return res.status(200).json({
        message: `${email}님 다음에 또 뵙겠습니다!`,
      });
    } else {
      return res.status(404).json({ message: "회원 정보가 없습니다." });
    }
  });
});

module.exports = router;
