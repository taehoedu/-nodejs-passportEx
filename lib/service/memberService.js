const DB = require("../db/db");
const bcrypt = require('bcrypt');
const fs = require('fs');

const memberPage = {

    signupForm: (req, res) => {
        res.render('member/sign_up_form', {loginedMember: req.user});

    },

    signupConfirm: (req, res) => {
        let post = req.body;
        console.log('post:', post);

        let sql = `
            INSERT INTO 
                TBL_MEMBER(M_ID, M_PW, M_MAIL, M_PHONE) 
            VALUES(?, ?, ?, ?)
        `;

        let state = [post.m_id, bcrypt.hashSync(post.m_pw, 10), post.m_mail, post.m_phone];

        DB.query(sql, state, 
        (error, result) => {

            if (error) {
                res.render('member/signup_ng');

            } else {
                res.render('member/signup_ok');

            }

        });

    },

    signinForm: (req, res) => {
        res.render('member/sign_in_form', {loginedMember: req.user, errMsg: req.query.errMsg});

    },

    // signinConfirm: (req, res) => {
    //     let post = req.body;

    //     DB.query(`SELECT * FROM TBL_MEMBER WHERE M_ID=?`, 
    //     [post.m_id], 
    //     (error, member) => {

    //         if (error) res.render('member/signin_ng');

    //         if (member.length > 0) {
    //             if (bcrypt.compareSync(post.m_pw, member[0].M_PW)) {
    //                 req.session.loginedMember = member[0];
    //                 res.render('member/signin_ok');

    //             } else {
    //                 res.render('member/signin_ng');

    //             }

    //         } else {
    //             res.render('member/signin_ng');

    //         }

    //     });

    // },

    signoutConfirm: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });

        // req.logout();
        // req.session.save(function(err) {
        //     res.redirect('/');
        // });

    },

    modifyForm: (req, res) => {

        if (req.user === undefined) 
            res.redirect('/member/signin_form');

        DB.query(`SELECT M_NO, M_ID, M_MAIL, M_PHONE FROM TBL_MEMBER WHERE M_ID = ?`, 
        [req.user], 
        (error, member) => {
            if (error) {
                res.redirect('/');

            } else {
                res.render('member/modify_form', {loginedMember: req.user, member: member[0]});

            }
        });

    },

    modifyConfirm: (req, res) => {

        let post = req.body;
        let sql = `
            UPDATE 
                TBL_MEMBER 
            SET 
                M_PW = ?, 
                M_MAIL = ?, 
                M_PHONE = ?, 
                M_MOD_DATE = NOW() 
            WHERE 
                M_NO = ?
        `;

        let state = [bcrypt.hashSync(post.m_pw, 10), post.m_mail, post.m_phone, post.m_no];

        DB.query(sql, state, (error, result) => {

            if (error) {
                res.render('member/modify_ng');

            } else {
                res.render('member/modify_ok');

                // DB.query(`
                // SELECT * FROM TBL_MEMBER WHERE M_NO = ?`, 
                // [post.m_no], 
                // (error, member) => {
                    
                //     req.session.loginedMember = member[0];
                //     res.render('member/modify_ok');

                // });

            }

        });

    },

    deleteConfirm: (req, res) => {
        
        if (req.user === undefined) {
            res.redirect('/member/signin_form');
        }

        DB.query(`DELETE FROM TBL_MEMBER WHERE M_ID = ?`, 
        [req.user], 
        (error, result) => {

            if (error) {
                res.render('member/delete_ng');

            } else {
                req.session.destroy(() => {
                    res.render('member/delete_ok');
                });

            }

        });

    }
    
}

module.exports = memberPage;