const express = require("express");
const router = express.Router();
const conn = require("../mariadb");

router.use(express.json());

const notFoundChannel = (res) => {
  res.status(404).json({ message: "채널정보를 찾을 수 없습니다." });
};

router
  .route("/")
  .post((req, res) => {
    const { userId, channelTitle } = req.body;

    if (!channelTitle) {
      return res.status(400).json({ message: "채널이름을 입력하세요." });
    }

    const sql = "INSERT INTO channels(user_id, name) VALUES (?, ?)";

    conn.query(sql, [userId, channelTitle], (err, results) => {
      if (!results)
        res.status(500).json({ message: "채널 등록에 실패했어요." });

      res
        .status(201)
        .json({ message: `${channelTitle}님의 채널을 응원합니다. ` });
    });
  })
  .get((req, res) => {
    let { id } = req.body;

    const sql = "SELECT * FROM channels";

    conn.query(sql, [id], (err, results) => {
      if (results.length < 0) notFoundChannel(res);

      res.status(201).json(results);
    });
  });

router
  .route("/:id")
  .put((req, res) => {
    const { id } = req.params;
    const { channelTitle } = req.body;

    if (!channelTitle) {
      return res.status(400).json({ message: "채널 이름을 입력하세요." });
    }

    const sql = "UPDATE channels SET name = ? WHERE id = ?";

    conn.query(sql, [channelTitle, id], (err, results) => {
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "채널을 찾을 수 없습니다." });
      }

      res.status(201).json({ message: "채널이름이 수정되었습니다." });
    });
  })
  .delete((req, res) => {
    const { id } = req.params;

    const selectSqL = "SELECT name FROM channels WHERE id = ?";
    const deleteSql = "DELETE FROM channels WHERE id = ?";

    conn.query(selectSqL, [id], (err, results) => {
      if (results.length === 0) {
        return res.status(404).json({ message: "채널을 찾을 수 없습니다." });
      }

      const channelName = results[0].name;

      conn.query(deleteSql, [id], () => {
        res.status(200).json({
          message: `${channelName} 채널이 삭제되었습니다.`,
        });
      });
    });
  })
  .get((req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM channels WHERE id = ?";

    conn.query(sql, [id], (err, results) => {
      if (results.length < 1) notFoundChannel(res);

      res.status(200).json(results);
    });
  });

module.exports = router;
