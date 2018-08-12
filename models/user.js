var bcrypt = require ('bcrypt-nodejs');
var mongoose = require ('mongoose');

var SALT_FACT = 10;

var UserSchema = mongoose.Schema({
    username:{type:String,required:true,unique:true},
    displayName:{type:String},
    password:{type:String,required:true},
    createdat:{type:Date,default:Date.now},
    role:{type:String},
    favoriteTCG:{type:String},
    bio:String 
});
var donothing = () =>{};

UserSchema.pre("save",function(done){
    var user = this;
    if(!user.isModified("password")){
        return done();
    }
    bcrypt.genSalt(SALT_FACT,function(err,salt){
        if(err){
            return done(err);
        }
        bcrypt.hash(user.password, salt, donothing, 
            function(err,hashedpassword){
            if(err){
                return done(err)
            }
            user.password = hashedpassword;
            done();

        });
    });
});

UserSchema.methods.checkPassword = function(guess, done){
    bcrypt.compare(guess,this.password,(err,isMatch) => {
        done(err, isMatch);
    });
}
UserSchema.methods.name = function() {
    return this.displayName ||this.username;
}
var user = mongoose.model("user",UserSchema);
module.exports = user;
