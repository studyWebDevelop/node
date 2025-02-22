const express = require("express");
const router = express.Router();

router.use(express.json());

let channelDB = new Map();
let channelId = 0;

router
  .route("/")
  .post((req, res) => {
    const { channelTitle } = req.body;

    if (!channelTitle) {
      return res.status(400).json({ message: "채널이름을 입력하세요." });
    }
    channelDB.set(channelId++, { channelTitle });

    console.log(channelDB);

    res
      .status(201)
      .json({ message: `${channelTitle}님의 채널을 응원합니다. ` });
  })
  .get((req, res) => {
    let channels = {};

    if (channelDB.size === 0) {
      return res.status(200).json({ message: "조회할 채널이 없습니다." });
    }

    channelDB.forEach((channel, idx) => {
      channels[idx] = channel;
    });

    res.status(200).json(channels);
  });

router
  .route("/:id")
  .put((req, res) => {
    const { id } = req.params;
    const { channelTitle } = req.body;

    if (!channelTitle) {
      return res.status(400).json({ message: "채널 이름을 입력하세요." });
    }

    if (!channelDB.has(Number(id))) {
      return res.status(404).json({ message: "채널정보를 찾을 수 없습니다." });
    }

    channelDB.get(Number(id)).channelTitle = channelTitle;

    res.status(200).json({ message: "채널이름이 수정되었습니다." });
  })
  .delete((req, res) => {
    const { id } = req.params;

    if (!channelDB.has(Number(id))) {
      return res.status(404).json({ message: "채널정보를 찾을 수 없습니다." });
    }

    res.status(200).json({
      message: `${
        channelDB.get(Number(id)).channelTitle
      }채널이 삭제되었습니다.`,
    });

    channelDB.delete(Number(id));
  })
  .get((req, res) => {
    const { id } = req.params;

    if (!channelDB.has(Number(id))) {
      return res.status(404).json({ message: "채널정보를 찾을 수 없습니다." });
    }

    res.status(200).json(channelDB.get(Number(id)));
  });

module.exports = router;
