const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

// 유저 정보
const userRouter = require("./routes/users");

// 채널 정보
const channelRouter = require("./routes/channels");

app.use("/", userRouter);
app.use("/channels", channelRouter);
