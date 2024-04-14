const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
const session = require('express-session');
const MemoryStore = require('memorystore')(session); 
const DB = require('./lib/db/db');
const bcrypt = require('bcrypt');

app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));

const maxAge = 60 * 60 * 30;
const sessionObj = {
    secret: 'green$%^&',
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({ checkPeriod: maxAge }),
    cookie: {
        maxAge: maxAge,
    },
};
app.use(session(sessionObj));


/////// PASSPORT START
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    console.log('serializeUser: ', user);
    done(null, user.M_ID);

});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser: ', id);
    done(null, id);

});

passport.use(new LocalStrategy(
    {
        usernameField: 'm_id',
        passwordField: 'm_pw'
    },
    function(username, password, done) {
        console.log('LocalStrategy: ', username, password);

        DB.query(`SELECT * FROM TBL_MEMBER WHERE M_ID=?`, 
        [username], 
        (error, member) => {

            if (error) {
                return done(err);

            }  
            
            if (member.length > 0) {
                if (bcrypt.compareSync(password, member[0].M_PW)) {
                    return done(null, member[0], { message: 'Welcome' });
    
                } else {
                    return done(null, false, { message: 'INCORRECT MEMBER PW.' });

                }
                
            } else {
                return done(null, false, { message: 'INCORRECT MEMBER ID.' });

            }
            
        });
    }
));

// let pp = require('./lib/passport/passport');
// let passport = pp.passport(app);

app.post('/member/signin_confirm', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/member/signin_form?errMsg=INCORRECT MEMBER ID or PW'
}));

/////// PASSPORT END

app.set('view engine', 'ejs');
app.set('views', './view/');

// 라우팅
app.get('/', (req, res) => {
    console.log('req.session---> ', req.session);
    console.log('req.user---> ', req.user);
    
    console.log('/');
    res.redirect('/home');

});

// 라우터 설정
const homeRouter = require('./routes/homeRouter');
const memberRouter = require('./routes/memberRouter');

app.use('/home', homeRouter);
app.use('/member', memberRouter);


app.listen(3000);