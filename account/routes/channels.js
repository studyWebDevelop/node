const express = require("express");
const router = express.Router();
const conn = require("../mariadb");
const { body } = require("express-validator");
const validationErrors = require("../middleware/index");

router.use(express.json());

const validationChannels = [
  [
    body("userId").notEmpty().isInt().withMessage("숫자를 입력해주세요."),
    body("channelTitle")
      .notEmpty()
      .isString()
      .withMessage("문자를 입력해주세요."),
  ],
  validationErrors,
];

const validationEditChannel = [
  body("channelTitle")
    .notEmpty()
    .isString()
    .withMessage("문자를 입력해주세요."),
  validationErrors,
];

const getChannelUseId = (id, callback) => {
  const sql = "SELECT * FROM channels WHERE id = ?";

  conn.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

router
  .route("/")
  .post(validationChannels, (req, res, next) => {
    const { userId, channelTitle } = req.body;

    const sql = "INSERT INTO channels(user_id, name) VALUES (?, ?)";

    conn.query(sql, [userId, channelTitle], (err) => {
      if (err) return next(err);
      res
        .status(201)
        .json({ message: `${channelTitle}님의 채널을 응원합니다.` });
    });
  })
  .get((req, res) => {
    const sql = "SELECT * FROM channels";

    conn.query(sql, (err, results) => {
      if (err) return next(err);
      res.status(201).json(results);
    });
  });

router
  .route("/:id")
  .put(validationEditChannel, (req, res, next) => {
    const { id } = req.params;
    const { channelTitle } = req.body;

    const sql = "UPDATE channels SET name = ? WHERE id = ?";

    conn.query(sql, [channelTitle, id], (err) => {
      if (err) return next(err);
      res.status(201).json({ message: "채널이름이 수정되었습니다." });
    });
  })
  .delete((req, res) => {
    const { id } = req.params;

    getChannelUseId(id, (err, results) => {
      if (err) return next(err);
      const channelName = results[0].name;

      const deleteSql = "DELETE FROM channels WHERE id = ?";

      conn.query(deleteSql, [id], () => {
        res.status(200).json({
          message: `${channelName} 채널이 삭제되었습니다.`,
        });
      });
    });
  })
  .get((req, res, next) => {
    const { id } = req.params;

    getChannelUseId(id, (err, results) => {
      if (err) return next(err);
      if (results.length < 1) {
        return res
          .status(404)
          .json({ message: "채널 정보를 찾을 수 없습니다." });
      }

      res.status(200).json(results);
    });
  });

router.use((err, req, res, next) => {
  // err, req, res, next가 매개변수에 존재한다면 에러처리 미들웨어로 인식함.
  console.error(err);
  res.status(500).json({ message: "서버 오류가 발생했습니다." });
});

module.exports = router;
