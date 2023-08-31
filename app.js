const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 設定 salt 的複雜度，數字越大越安全，但計算時間也越長

const app = express();
const port = 3000;


// 設定 EJS 為視圖引擎
app.set('view engine', 'ejs');

// 把media移到根目錄
app.use(express.static('media', { 'extensions': ['html', 'css'] }));
// 解析表單資料的中介軟體
app.use(bodyParser.urlencoded({ extended: true }));

// 資料庫連線設定
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'unidessert'
});

// 建立資料庫連線
connection.connect((err) => {
  if (err) {
    console.error('無法連接到資料庫:', err);
  } else {
    console.log('已成功連接到資料庫');
  }
});

app.get('/', function (req, res) {
  res.render('index.ejs');
})

app.get('/user', (req, res) => {
  res.render('user.ejs');
})

const registerTime = () => {
  const date = new Date();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const hh = date.getHours();
  const mi = date.getMinutes();
  const ss = date.getSeconds();

  return [date.getFullYear(), "-" +
    (mm > 9 ? '' : '0') + mm, "-" +
    (dd > 9 ? '' : '0') + dd, " " +
    (hh > 9 ? '' : '0') + hh, ":" +
    (mi > 9 ? '' : '0') + mi, ":" +
    (ss > 9 ? '' : '0') + ss
  ].join('');
}
app.post('/register', (req, res) => {
  const { name, email, mobile, password } = req.body;

  // 檢查使用者電子信箱是否已存在於資料庫
  const checkQuery = 'SELECT * FROM user WHERE uemail = ? ';
  connection.query(checkQuery, [email], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // 使用者電子信箱已存在
      res.render('user', { error: true, showAlert: false, title: "註冊失敗", message: 'Email 已經被註冊過了' });
    } else {
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        const umembertime = registerTime()
        // 使用者電子信箱可用，將資料插入資料庫
        const insertQuery = 'INSERT INTO user (uemail, upwd, uname, umobile, umembertime) VALUES (?, ?, ?, ?, ?)';
        connection.query(insertQuery, [email, hashedPassword, name, mobile, umembertime], (err) => {
          if (err) throw err;

          // 註冊成功，重新導向到登入頁面
          res.render('user', { error: false, showAlert: true, title: "註冊成功", message: '請重新登入' });
        });
      })  
    }
  });

});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const selectUserQuery = 'SELECT * FROM user WHERE uemail = ?';

  connection.query(selectUserQuery, [email], (err, results) => {
    if (err) {
      res.render('user', { error: true, showAlert: false, title: "登入失敗", message: 'Email 尚未被註冊' });

    } else{
      const hashedPassword = results[0].upwd;

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          // 密碼正確，登入成功
          res.render('user', { error: false, showAlert: true, title: "登入成功", message: '歡迎回來' });
        } else {
          // 密碼不正確
          res.render('user', { error: true, showAlert: false, title: "登入失敗", message: '密碼輸入錯誤' });
        }
      });



    }

    //  if (results.length === 0) {
    //   res.render('user', { error: true, showAlert: false, title: "登入失敗", message: '密碼輸入錯誤' });

    // } else {
    //   res.render('user', { error: false, showAlert: true, title: "登入成功", message: '歡迎回來' });

    // }
  });
});



// 啟動伺服器
app.listen(port, () => {
  var d = new Date();
  console.log('胖丁: 伺服器啟動中' + d.toLocaleTimeString());
});
