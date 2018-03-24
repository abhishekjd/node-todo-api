var mongoose = require('mongoose');

var User = mongoose.model('User', {
    Email : {
        type : String,
        required : true,
        trim : true
    }
});

module.exports = {User};