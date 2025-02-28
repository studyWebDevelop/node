const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body } = require("express-validator");
const validationErrors = require("../middleware/index");

router.use(express.json());

const validationEmail = [
  body("email").notEmpty().isString().withMessage("문자를 입력해주세요."),
  validationErrors,
];

// 로그인
router.post(
  "/login",
  [
    [
      body("email").notEmpty().isString().withMessage("문자를 입력해주세요."),
      body("password")
        .notEmpty()
        .isString()
        .withMessage("문자를 입력해주세요."),
    ],
    validationErrors,
  ],
  (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    conn.query(sql, [email], (err, results) => {
      if (err) return next(err);

      let loginUser = results[0];

      if (!loginUser)
        res.status(404).json({ message: "회원 정보가 없습니다." });

      if (loginUser.password === password) {
        return res.status(200).json({ message: "로그인 성공!" });
      } else {
        return res
          .status(401)
          .json({ message: "비밀번호가 일치하지 않습니다." });
      }
    });
  }
);

// 회원가입
router.post(
  "/join",
  [
    [
      body("email").notEmpty().isString().withMessage("문자를 입력해주세요."),
      body("name").notEmpty().isString().withMessage("문자를 입력해주세요."),
      body("password")
        .notEmpty()
        .isString()
        .withMessage("문자를 입력해주세요."),
      body("contact").notEmpty().isString().withMessage("문자를 입력해주세요."),
    ],
    validationErrors,
  ],
  (req, res) => {
    const { email, name, password, contact } = req.body;

    const sql =
      "INSERT INTO users(email, name, password, contact) VALUES (?, ?, ?, ?)";

    conn.query(sql, [email, name, password, contact], (err, results) => {
      if (err) return next(err);

      if (results.length) {
        return res.status(200).json(results);
      } else {
        return res.status(404).json({ message: "회원 정보가 없습니다." });
      }
    });

    res.status(201).json({ message: `${name}님 환영합니다!` });
  }
);

// 회원 조회
router.get("/users", validationEmail, (req, res) => {
  const { email } = req.body;

  const sql = email
    ? "SELECT * FROM users WHERE email=?"
    : "SELECT * FROM users";

  conn.query(sql, [email], (err, results) => {
    if (err) return next(err);

    if (results.length) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "회원 정보가 없습니다." });
    }
  });
});

// 회원 탈퇴
router.delete("/users", validationEmail, (req, res) => {
  const { email } = req.body;

  const sql = "DELETE FROM users where email=?";

  conn.query(sql, [email], (err) => {
    if (err) return next(err);

    res.status(200).json({ message: `${email}님 다음에 또 뵙겠습니다!` });
  });
});

router.use((err, req, res, next) => {
  // err, req, res, next가 매개변수에 존재한다면 에러처리 미들웨어로 인식함.
  console.error(err);
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
});

module.exports = router;
