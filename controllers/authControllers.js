const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

module.exports.signup = (req,res) => {
    const { name, email, password, gender, phone_number} = req.body;

    if(!name || !email || !password || !gender || !phone_number){
        return res.status(400).json({msg: 'Please enter all fields'});
    }

    if(password.length<6){
        return res.status(400).json({msg: 'Password minimum length is 6'});

    }

    if(phone_number.length<10){
        return res.status(400).json({msg: 'Please enter valid phone number'});

    }

    User.findOne({email})
    .then(user => {
        if(user) return res.status(400).json({msg: 'User already exists'});

        const newUser = new User({ name, email, password, gender, phone_number});

        // Create salt and hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        jwt.sign(
                            { id: user._id },
                            config.get('jwtsecret'),
                            { expiresIn: 3600 },
                            (err, token) => {
                                if(err) throw err;
                                res.json({
                                    token,
                                    user: {
                                        id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        phone_number:user.phone_number,
                                        gender:user.gender
                                    }
                                });
                            }
                        )
                    });
            })
        })
    })
}

module.exports.login = async (req,res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(400).json({msg: 'Please enter all fields'});
    }
    User.findOne({email})
        .then(user => {
            if(!user) return res.status(400).json({msg: 'User does not exist'});

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials'});

                    jwt.sign(
                        { id: user._id },
                        config.get('jwtsecret'),
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    phone_number:user.phone_number,
                                    gender:user.gender
                                }
                            });
                        }
                    )
                })
        })
}

module.exports.get_user = (req,res) => {
  //  console.log(req.user)
    User.findById(req.user.id)
        // .select('-password')
        .then(user => {
            

            res.json(user)});
}

module.exports.updateUser=async(req,res)=>{
    console.log(req.body);
    let user = await User.findOne({_id:req.body.id});

    user.name=req.body.name;
    user.phone_number=req.body.phone_number;
    user.credit_card=req.body.credit_card;
    
    await user.save();
    // let user= await User.findByIdAndUpdate(req.body.id,req.body.user);
    // console.log("---------")
    // console.log(user)
}