const jwt           = require('jsonwebtoken');
const mongoose = require('mongoose');
const userSchema = require('../model/user');
const bodyParser = require('body-parser');
const bcrypt     = require('bcrypt')
const User = mongoose.model('userSchema', userSchema);

module.exports = routes = (app) => {
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.route('/signin').post(async (req, res) => {
        console.log('request=', req.body)
        const existingUser = await User.findOne({username: req.body.username});
        console.log('existing user password', existingUser.password, req.body.password)
        console.log('compare=', bcrypt.compareSync(req.body.password, existingUser.password))
        if (existingUser) {
            if (bcrypt.compareSync(req.body.password, existingUser.password)) {
                let token = jwt.sign({username: req.body.username}, 'secret', {
                    expiresIn: '3h'
                })
                return res.status(200).send({msg: 'Authenticated successfully', token, email: existingUser.userEmail});
            } else {
                res.status(400).send({msg: 'Invalid password'})
            }
        } else {
            return res.status(400).send({msg: 'User is not registered'})
        }
    });
    app.route('/signup').post(async (req, res) => {
        console.log(req.body.userEmail);
        if (!(req.body.userEmail && req.body.userEmail && req.body.userEmail)) {
            res.status(400).send({msg: 'All input are required'});
        }
        const oldUser = await User.findOne({userEmail: req.body.userEmail});
        console.log('old user=', oldUser)
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }
        console.log('before hash',req.body.password);
        const encryptedPassword = await bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
            userEmail: req.body.userEmail,
            username: req.body.username,
            password: encryptedPassword
        })
        const user = await newUser.save().then((result) => {
            return res.status(200).send({user: User, msg_code: '0007', result});
        }).catch( (err) => {
            return res.status(400).send({user: User,err});
        });
    });
    app.route('/verifyToken').get( (req, res) => {
        let token = req.query.currentToken
        jwt.verify(token, 'secret', (err, token) => {
            if (err) {
                return res.status(400).json({ msg: 'unauthorized request'})
            }
            if (token)  {
                res.status(200).send({msg: `token accepted`, data_token: token})
            }
        })
    });
    app.route('/userInfo').get( async (req, res) => {
        const existingUser = await User.findOne({userEmail: req.query.email_address});
        if (existingUser) {
            res.send({ user: existingUser})
        } else {
            res.send({ msg: 'user not found'})
        }
    })
}
