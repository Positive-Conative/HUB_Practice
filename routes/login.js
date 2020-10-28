var express = require('express');
var router = express.Router();
var db = require("../config/db");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login/login');
});

  
router.post('/', function(req, res, next) {
    //로그인 성공 시를 가정.
    db.query(`select * from login_univ where USER_ID = ?`, req.body.uid, function (error, univ_db_value) {
        if (error) {
            throw error;
        }
        db.query(`select * from login_uck where USER_ID = ?`, req.body.uid, function (error, uck_db_value) {
            if (error) {
                throw error;
            }
            for(key in univ_db_value[0])  {
                if(univ_db_value[0][key] != uck_db_value[0][key]){ // UCK DB와 대학 DB에 있는 내용이 다른 경우
                    db.query(`update login_uck set ${key} = ? where USER_ID = ?`, [univ_db_value[0][key], req.body.uid], function (error, uck_db_value) {
                        if (error) {
                            throw error;
                        }
                    });
                }
            }
            res.render("test", {'db_value':uck_db_value});
        });
    });
});

module.exports = router;
