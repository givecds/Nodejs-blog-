var express = require('express');
var router = express.Router();
var user = require('../db/db').user;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'index' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'login' });
});

router.get('/ucenter',function(req,res){
	res.redirect('/');
});

router.post('/ucenter',function(req,res){
	var query = {name: req.body.name,password: req.body.password};
	user.findOne(query,function(err,doc){
		if(doc) {
			console.log(doc);
			res.render('ucenter',{title: '已登录'});
		}else{
			console.log(err+"登录失败"+new Date());
			res.redirect('/login')
			}
	})
});

router.get('/reg',function(req,res){
	res.render('reg', { title: 'regist' });
});

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
				res.redirect('/reg');
			}else{
				console.log(query+"注册没问题");
				newUser=new user(query);
				newUser.save(function(err,docs){
					console.log(err||docs);
					});
				res.redirect('/login');
			}
		});
		
	
		// (function(){
		// 	newUser.save(newUser,{safe:true},function(err,doc){
		// 		if(err){console.log("insertError"+err)};
		// 		console.log(doc);
		// 		res.redirect('/');
		// 	});
		// })(newUser);
	
		
	}
});


module.exports = router;
