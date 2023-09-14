const nodemailer = require('nodemailer');


// 隨機生成驗證碼
const generateVCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let vCode = '';
    for (let i = 0; i < 6; i++) {
        vCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return vCode;
};

// 寄送驗證郵件
const sendEmail = (email, vCode) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'unidessert0802@gmail.com',
                pass: 'rpgeabnasncgwsil'
            }
        });

        const mailOptions = {
            from: 'unidessert0802@gmail.com',
            to: email,
            subject: 'Unidessert驗證信',
            html: ` 
            <!DOCTYPE html>
            <html>

            <head>
                <meta charset="UTF-8" />
                <style>
                    body {
                        background-color: #F0C7CD;
                        background-size: cover;
                        color: #702F43;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        padding: 0;
                    }

                    .container {
                        background-color: #CC7F91;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 50px;
                        text-align: center;
                        border-radius: 8px;
                    }

                    .content {
                        background-color: rgb(234, 223, 217);
                        border-radius: 8px;
                        padding: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                <img src="https://i.imgur.com/49ORnnq.png" title="source: imgur.com" style="width: 200px;"/ >
                    <div class="content">
                        <h1>你好！</h1>
                        <h1>你的驗證碼是：<strong style="color: #702F43;">${vCode} </strong></h1>
                        <h2 style="color: red;">該驗證碼5分鐘内有效</h2>
                    </div> 
                </div>    
            </body>        
            </html>
        `
        };

        transporter.sendMail(mailOptions, (err, info) => {
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
module.exports = { sendEmail, generateVCode };
