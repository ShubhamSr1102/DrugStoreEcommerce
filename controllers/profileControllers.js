const User = require('../models/User');

module.exports.get_user = (req,res) => {
    const userId = req.params.id;
    User.find({userId}).sort({date:-1}).then(users => res.json(users));
}



module.exports.get_userDetails = (req,res) => {
    const userId = req.params.id;
    // console.log(userId);
    // User.find({userId}).sort({date:-1}).then(users => res.json(users));
}


module.exports.post_user = (req,res) => {
    const newUser = new User(req.body);
    newUser.save().then(user => res.json(user));
}

module.exports.update_user = (req,res) => {
    Item.findByIdAndUpdate({_id: req.params.id},req.body).then(function(user){
        User.findOne({_id: req.params.id}).then(function(user){
            res.json(user);
        });
    });
}

// module.exports.delete_user = (req,res) => {
//     Item.findByIdAndDelete({_id: req.params.id}).then(function(user){
//         res.json({success: true});
//     });
// }