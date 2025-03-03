var jwt = require("jsonwebtoken");
require("dotenv").config();

var token = jwt.sign({ foo: "bar" }, process.env.PRIVATE_KEY); // 서명 (= 토큰발행)
// jwt 구조: (payload, privateKey, [options, callback])

// Valid JWT
// Signature Verified

console.log("token: ", token);

// 검증 (검증 성공시 JSON 보여주기)

var decoded = jwt.verify(token, process.env.PRIVATE_KEY);
console.log(decoded);
