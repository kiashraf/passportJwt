let mongoose = require('mongoose');
let bcrypt = require('bcrypt');

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }

})

UserSchema.methods.encryptPassword = function (password) {
    let user = this;
    if (this.isModified('password') || this.isNew) {
        let salt = bcrypt.genSaltSync(10)
        console.log(user.password);
        let hash = bcrypt.hashSync(password, salt)
        return hash;
        // bcrypt.genSalt(10, function(err, salt) {

        //     if (err)
        //         return next(err);
        //     bcrypt.hash(user.password, salt, function(err, hash) {
        //         if (err)
        //             return next(err);
        //         user.password = hash;
        //         next();

        //     })
        // })

    } else {
        return next();
    }

}

UserSchema.methods.comparePassword = function (password, callback) {

    // bcrypt.compare(password, this.password, function (err, isMatch) {
    //     if (err)
    //         return callback(err);
    //     return callback(null, isMatch)
    // });
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema);