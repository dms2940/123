const mysql = require('mysql2');
const mysqlConfig = require('../config/mysql');
const pool = mysql.createPool(mysqlConfig);

const getDate = (d) => `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
const getTime = (d) => `${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
const getDateTime = (d) => getDate(d) + ' ' + getTime(d);

const blogList = (req, res)=>{
  let sql = `SELECT idUsers, nick, img, about From users`;
  pool.query(sql, (err, rows, field)=>{
    if(err) throw err;
    res.render('blog/list.html', { blogs : rows, user : req.session.user});
  })  
}

const postList = (req, res)=>{
  let sql = `SELECT idposts, title, content, registrationDate, writer From posts`;
  pool.query(sql, (err, rows, field)=>{
    if(err) throw err;
    res.render('post/list.html', { posts : rows, user : req.session.user});
  })  
}

const registration = (req, res)=>{
  if(req.session.user == undefined)
    res.render('auth/signIn.html', {msg : "로그인 하세요"});
  else 
    res.render('post/registration.html', {user : req.session.user});
}

const registrationProcess = (req, res)=>{
  if(req.session.user == undefined)
    res.render('auth/signIn.html', {msg : "로그인 하세요"});
  else {
    let sql = 'INSERT INTO posts (title, content, registrationDate, img, writer, likes) ';
        sql += 'VALUES(?, ?, ?, ?, ?, ?)';
    let values = [];
    console.log(req.file);
    if(req.file!== undefined){
      values = [req.body.title, req.body.content, getDateTime(new Date()),
                req.file.filename, req.session.user.nick, 0];
      }
    else{
      values = [req.body.title, req.body.content, getDateTime(new Date()),
                '', req.session.user.nick, 0];
    }
    pool.query(sql, values, (err, rows, field)=>{
      if(err) throw err;
        res.render("post/list.html", {msg : "글이 등록되었습니다"}) 
    })
  }
}

const postNum = (req, res)=>{
  let sql = "SELECT * FROM posts WHERE idposts=?";
  let values = [req.params.postNum];
  pool.query(sql, values, (err, rows, field)=>{
    if(err) throw err;
    res.render('post/postNum.html', {post : rows[0], user : req.session.user});
  })
}

const blogNum = (req, res)=>{
  let sql = `SELECT * FROM users WHERE users.idUsers=?;`;
  let values = [req.params.blogNum];
  pool.query(sql, values, (err, rows, field)=>{
    if(err) throw err;
    let info_user = rows[0];
    let sql = "SELECT * FROM posts WHERE writer=?";
    let values = [rows[0].nick];
    pool.query(sql, values, (err, rows, field)=>{
      if(err) throw err;
      console.log(info_user, rows);
      res.render('blog/blogNum.html', {info: info_user, posts: rows, user : req.session.user});
    })
  })
}

module.exports =  {
  blogList,
  postList,
  registration,
  registrationProcess,
  postNum,
  blogNum,
}
