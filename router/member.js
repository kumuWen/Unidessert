const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 設定 salt 的複雜度，數字越大越安全，但計算時間也越長
const { sendEmail } = require('./nodemailer');
const { generateVCode } = require('./nodemailer');
const session = require('express-session');
const app = express();


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

//設置session
app.use(session({
  secret: 'unidessert',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 10 * 60 * 1000 // 10分鐘的過期時間
  }
}));


app.get('/', (req, res) => {
  res.render('user.ejs');
})

app.get('/change', (req, res) => {
  res.render('change.ejs')
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


// 在註冊路由之前處理驗證碼的路由
app.get('/verify', (req, res) => {
  const email = req.query.email;
  console.log(email)
  // 生成驗證碼
  const verificationCode = generateVCode();

  // 將驗證碼存儲在 session 中
  req.session.verificationCode = verificationCode;

  // 寄送驗證郵件
  sendEmail(email, verificationCode)
    .then(() => {
      // 郵件發送成功，返回成功訊息給前端
      res.json({ message: '驗證郵件已成功發送' });
    })
    .catch(error => {
      // 郵件發送失敗，處理錯誤
      console.error('無法發送驗證郵件:', error);
      res.status(500).json({ message: '無法發送驗證郵件' });
    });
});

// 註冊路由
app.post('/register', (req, res) => {
  const { name, email, password, verificationCode } = req.body;

  // 檢查使用者電子信箱是否已存在於資料庫
  const checkQuery = 'SELECT * FROM user WHERE uemail = ?';

  connection.query(checkQuery, [email], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // 使用者電子信箱已存在
      res.render('user', { error: true, title: "註冊失敗", message: 'Email 已經被註冊過了', showAlert: false });
    } else {
      // 驗證碼比對
      if (verificationCode !== req.session.verificationCode) {
        // 驗證碼不正確，返回錯誤提示給使用者
        res.render('user', { error: true, title: "驗證失敗", message: '驗證碼不正確', showAlert: false });
        return;
      }

      // 生成加密密碼
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) throw err;

        const hashedPassword = hash;
        const umembertime = registerTime();

        const insertQuery = 'INSERT INTO user (uemail, upwd, uname,  umembertime) VALUES (?, ?, ?, ?)';
        connection.query(insertQuery, [email, hashedPassword, name, umembertime], (err) => {
          if (err) throw err;

          // 清除 session 中的驗證碼資料
          req.session.verificationCode = null;

          res.render('user', { error: false, title: "註冊成功", message: '請重新登入', showAlert: true });
        });
      });
    }
  });
});

//忘記密碼路由
app.post('/forgot', (req, res) => {
  const { email, verificationCode } = req.body;

  // 檢查使用者電子信箱是否已存在於資料庫
  const checkQuery = 'SELECT * FROM user WHERE uemail = ?';

  connection.query(checkQuery, [email], (err, results) => {
    if (err) throw err;
    if (!results.length > 0) {
      // 使用者電子信箱不存在
      res.render('forgot', { error: true, title: "驗證失敗", message: 'Email 尚未註冊過', showAlert: false });
    } else {
      // 驗證碼比對
      if (verificationCode !== req.session.verificationCode) {
        // 驗證碼不正確，返回錯誤提示給使用者
        res.render('forgot', { error: true, title: "驗證失敗", message: '驗證碼不正確', showAlert: false });
        return;
      } else {
        req.session.email = email;
        req.session.verificationCode = null; // 清除驗證碼
        res.render('forgot', { error: false, title: "驗證成功", message: '請重新更改密碼', showAlert: true });
      }
    }
  })
})

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const selectUserQuery = 'SELECT * FROM user WHERE uemail = ?';

  connection.query(selectUserQuery, [email], (err, results) => {

    if (err || results.length === 0) {
      res.render('user', { error: true, title: "登入失敗", message: 'Email 尚未被註冊', showAlert: false });

    } else {
      const hashedPassword = results[0].upwd;

      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          // 密碼正確，登入成功
          const user = {
            email: results[0].uemail,
          };

          req.session.loggedIn = true;
          req.session.user = user; // 將使用者資訊儲存到 session 中
          console.log(user);
          // 密碼正確，登入成功
          res.render('user', { error: false, title: "登入成功", message: '歡迎回來', showAlert: true });
        } else {
          // 密碼不正確
          res.render('user', { error: true, title: "登入失敗", message: '密碼輸入錯誤', showAlert: false });
        }
      });
    }
  });
});


// 更改密碼路由
app.post('/change', (req, res) => {
  const { email, password } = req.body;
  const sessionEmail = req.session.email; // 從 session 中取出之前儲存的 email

  if (email === sessionEmail) {
    // 使用者輸入的 email 和前面驗證的 email 是同一個
    // 生成加密密碼
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log('更換密碼失敗');
        res.render('change', { error: true, title: "更換密碼失敗", message: '更換密碼發生錯誤', showAlert: false });
      } else {
        const hashedPassword = hash;
        const updatequery = 'UPDATE user SET upwd = ? WHERE uemail = ?';
        connection.query(updatequery, [hashedPassword, email], (err, result) => {
          if (err) {
            console.log('更換密碼失敗');
            res.render('change', { error: true, title: "更換密碼失敗", message: '更換密碼發生錯誤', showAlert: false });
          } else {
            // 更新成功，清除 session 中的 email
            req.session.email = null;
            res.render('change', { error: false, title: "更換密碼成功", message: "請再重新登入", showAlert: true });
          }
        });
      }
    });
  } else {
    res.render('change', { error: true, title: "更換密碼失敗", message: '這不是剛剛驗證的 email', showAlert: false });
  }
});

app.get('/logout', (req, res) => {
  if (req.session && req.session.user) {
    // 使用者已登入，銷毀 session
    req.session.destroy((err) => {
      if (err) {
        console.error('無法銷毀 session:', err);
        res.status(500).json({ message: '登出失敗' });
      } else {
        // 導向登入頁面或其他頁面
        res.redirect('/'); // 這裡可以改成你想要導向的頁面
      }
    });
  } else {
    // 使用者未登入，導向登入頁面或其他頁面
    res.redirect('/user'); // 這裡可以改成你想要導向的頁面
  }
});



function auth(req, res, next) {
  if (req.session.user) {
    console.log('authenticated')
    next()
  } else {
    console.log('not authenticated')
    return res.redirect('/user')
  }
}

// 路由處理函式，用來檢查使用者登入狀態
app.get('/checkLogin', (req, res) => {
  if (req.session.loggedIn) {
      // 使用者已登入
      res.json({ loggedIn: true });
  } else {
      // 使用者尚未登入
      res.json({ loggedIn: false });
  }
});

app.get('/forgot', (req, res) => {
  res.render('forgot.ejs')
})

app.get('/protected', (req, res) => {
  if (req.session && req.session.user) {
    // session 存在且使用者已登入
    res.render('protected', { user: req.session.user });
  } else {
    // session 不存在或使用者未登入，重新導向到登入頁面
    res.redirect('/user');
  }
});

// 設定 session 過期時的處理
app.use((req, res, next) => {
  if (req.session && req.session.user) {
    // session 存在且使用者已登入，檢查 session 是否過期
    const currentTime = new Date().getTime();
    const maxAge = req.session.cookie.maxAge;

    if (currentTime - req.session.cookie.lastAccess > maxAge) {
      // session 已過期，銷毀 session
      req.session.destroy((err) => {
        if (err) {
          console.error('無法銷毀 session:', err);
        }
        // 導向登入頁面
        res.redirect('/user');
      });
    } else {
      // 更新 session 的 lastAccess 時間
      req.session.cookie.lastAccess = currentTime;
      next();
    }
  } else {
    next();
  }
});


module.exports = app;
