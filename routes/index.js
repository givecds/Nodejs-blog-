var express = require('express');
var router = express.Router();
var user = require('../db/db').user;
var posts = require('../db/post').posts;
var crypto = require('crypto');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blogdb');
var db = mongoose.connection;
var markdown = require('markdown').markdown;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 
	  	title: '首页',
	  	user: req.session.user.name,
		success: req.flash('success').toString(),
		error: req.flash('error').toString()  
	});
});

function checkLogin(req,res,next){
	if(!req.session.user){
		req.flash("error","还未登录");
		res.redirect('/login');
	}
	next();
};

function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash("error","已登录");
		res.redirect('back');
	}
	next();
};

router.post('/login',checkNotLogin);
router.post('/login', function(req, res) {
  	res.render('login', { 
  		title: 'login' ,
  		error: req.flash('error').toString(),
  		user: req.session.user.name,
		success: req.flash('success').toString()
  	});
});

router.get('/login',checkNotLogin);
router.get('/login', function(req, res) {
  	res.render('login', { 
  		title: 'login' ,
  		error: req.flash('error').toString(),
  		user: req.session.user.name,
		success: req.flash('success').toString()
  	});
});

router.get('/logout',checkLogin);
router.get('/logout',function(req,res){
	req.session.user = null;
	req.flash("success","成功退出登录");
	res.redirect('/login');
});

router.get('/ucenter',checkLogin);
router.get('/ucenter',function(req,res){
	res.render('ucenter', { 
		title: '会员中心',
		user: req.session.user.name,
		success: req.flash('success').toString(),
		error: req.flash('error').toString() 
	});
});


router.post('/ucenter',checkNotLogin);
router.post('/ucenter',function(req,res){
	var query = {name: req.body.name,password: req.body.password};
	user.findOne(query,function(err,doc){
		if(doc) {
			console.log(doc);
			req.session.user = query;
			res.render('ucenter',{user: req.body.name,title:'会员中心'});
		}else{
			req.flash("error","用户名不存在或者密码错误");
			res.redirect('/login')
			}
	})
});


router.get('/reg',checkNotLogin);
router.get('/reg',function(req,res){
	res.render('reg', { 
		title: '注册',
		user: req.session.user.name,
		success: req.flash('success').toString(),
		error: req.flash('error').toString() 
	});
});

router.post('/reg',checkNotLogin);
router.post('/reg',function(req,res){
	var query = {name: req.body.name,password: req.body.password};
	if(query.password !== req.body.password_rep){
		console.log("注册重复密码不相同");
		res.redirect('/reg');
	}else{
		user.findOne(query.name,function(err,docs){
			console.log("docs"+docs);
			if(docs) {
				console.log(query.name+"已注册");
				req.flash("error","已注册")
				res.redirect('/reg');
			}else{
				console.log(query+"注册没问题");
				req.flash("success","注册没问题")
				newUser=new user(query);
				req.session.user=newUser;
				newUser.save(function(err,docs){
					console.log(err||docs);
					});
				res.redirect('/login');
			}
		});
	}
});

router.get('/post',checkNotLogin);
router.get('/post',function(req,res){
	res.redirect('/ucenter');
});

router.post('/post',checkLogin);
router.post('/post',function(req,res){
	var date = new Date();
	var time={
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear()+'-'+(date.getMonth()+1),
		day: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
		minute: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
	}
	var query = {
		name: req.session.user.name,
		time: time,
		title: req.body.title,
		post: markdown.toHTML(req.body.textpost)
	}
	var newPost= new posts(query);
	newPost.save(function(err,docs){
		console.log(err||docs);
	});
	res.render('post',{
		title: 'post' ,
  		error: req.flash('error').toString(),
  		user: query.name,
		success: req.flash('success').toString(),
		postTitle: query.title,
		postText: query.post
	})
})

module.exports = router;
