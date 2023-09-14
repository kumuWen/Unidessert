"use strict";

var nodemailer = require('nodemailer'); // 隨機生成驗證碼


var generateVCode = function generateVCode() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var vCode = '';

  for (var i = 0; i < 6; i++) {
    vCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return vCode;
}; // 寄送驗證郵件


var sendEmail = function sendEmail(email, vCode) {
  return new Promise(function (resolve, reject) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'unidessert0802@gmail.com',
        pass: 'rpgeabnasncgwsil'
      }
    });
    var mailOptions = {
      from: 'unidessert0802@gmail.com',
      to: email,
      subject: 'Unidessert驗證信',
      html: " \n            <!DOCTYPE html>\n            <html>\n\n            <head>\n                <meta charset=\"UTF-8\" />\n                <style>\n                    body {\n                        background-color: #F0C7CD;\n                        background-size: cover;\n                        color: #702F43;\n                        display: flex;\n                        justify-content: center;\n                        align-items: center;\n                        height: 100vh;\n                        margin: 0;\n                        padding: 0;\n                    }\n\n                    .container {\n                        background-color: #CC7F91;\n                        max-width: 600px;\n                        margin: 0 auto;\n                        padding: 50px;\n                        text-align: center;\n                        border-radius: 8px;\n                    }\n\n                    .content {\n                        background-color: rgb(234, 223, 217);\n                        border-radius: 8px;\n                        padding: 20px;\n                    }\n                </style>\n            </head>\n            <body>\n                <div class=\"container\">\n                <img src=\"https://i.imgur.com/49ORnnq.png\" title=\"source: imgur.com\" style=\"width: 200px;\"/ >\n                    <div class=\"content\">\n                        <h1>\u4F60\u597D\uFF01</h1>\n                        <h1>\u4F60\u7684\u9A57\u8B49\u78BC\u662F\uFF1A<strong style=\"color: #702F43;\">".concat(vCode, " </strong></h1>\n                        <h2 style=\"color: red;\">\u8A72\u9A57\u8B49\u78BC5\u5206\u9418\u5185\u6709\u6548</h2>\n                    </div> \n                </div>    \n            </body>        \n            </html>\n        ")
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.error('無法發送驗證郵件:', err);
        reject(err); // 將錯誤傳遞給 Promise 的 reject
      } else {
        console.log('驗證郵件已發送:', info.response);
        resolve(info); // 將結果傳遞給 Promise 的 resolve
      }
    });
  });
};

module.exports = {
  sendEmail: sendEmail,
  generateVCode: generateVCode
};