// 'use strict';

// var
//   _ = require('underscore')
//   , passport =        require('passport')
//   , LocalStrategy =   require('passport-local').Strategy
//   , userRoles =       require('../../client/js/routingConfig').userRoles;

// /**
//  * Module dependencies.
//  */
// var mongoose = require('mongoose'),
//   Schema = mongoose.Schema,
//   crypto = require('crypto');

// /**
//  * Validations
//  */
// var validatePresenceOf = function(value) {
//   // If you are authenticating by any of the oauth strategies, don't validate.
//   return (this.provider && this.provider !== 'local') || (value && value.length);
// };

// var validateUniqueEmail = function(value, callback) {
//   var User = mongoose.model('User');
//   User.find({
//     $and: [{
//       email: value
//     }, {
//       _id: {
//         $ne: this._id
//       }
//     }]
//   }, function(err, user) {
//     callback(err || user.length === 0);
//   });
// };

// /**
//  * User Schema
//  */

// var UserSchema = new Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [/.+\@.+\..+/, 'Please enter a valid email'],
//     validate: [validateUniqueEmail, 'E-mail address is already in-use']
//   },
//   username: {
//     type: String,
//     unique: true,
//     required: true
//   },
//   roles: {
//     type: Array,
//     default: ['authenticated']
//   },
//   hashed_password: {
//     type: String,
//     validate: [validatePresenceOf, 'Password cannot be blank']
//   },
//   provider: {
//     type: String,
//     default: 'local'
//   },
//   salt: String,
//   resetPasswordToken: String,
//   resetPasswordExpires: Date
// });

// /**
//  * Virtuals
//  */
// UserSchema.virtual('password').set(function(password) {
//   this._password = password;
//   this.salt = this.makeSalt();
//   this.hashed_password = this.hashPassword(password);
// }).get(function() {
//   return this._password;
// });

// /**
//  * Pre-save hook
//  */
// UserSchema.pre('save', function(next) {
//   if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
//     return next(new Error('Invalid password'));
//   next();
// });

// /**
//  * Methods
//  */
// UserSchema.methods = {

//   /**
//    * HasRole - check if the user has required role
//    *
//    * @param {String} plainText
//    * @return {Boolean}
//    * @api public
//    */
//   hasRole: function(role) {
//     var roles = this.roles;
//     return roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
//   },

//   /**
//    * IsAdmin - check if the user is an administrator
//    *
//    * @return {Boolean}
//    * @api public
//    */
//   isAdmin: function() {
//     return this.roles.indexOf('admin') !== -1;
//   },

//   /**
//    * Authenticate - check if the passwords are the same
//    *
//    * @param {String} plainText
//    * @return {Boolean}
//    * @api public
//    */
//   authenticate: function(plainText) {
//     return this.hashPassword(plainText) === this.hashed_password;
//   },

//   /**
//    * Make salt
//    *
//    * @return {String}
//    * @api public
//    */
//   makeSalt: function() {
//     return crypto.randomBytes(16).toString('base64');
//   },

//   /**
//    * Hash password
//    *
//    * @param {String} password
//    * @return {String}
//    * @api public
//    */
//   hashPassword: function(password) {
//     if (!password || !this.salt) return '';
//     var salt = new Buffer(this.salt, 'base64');
//     return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
//   },

//   // localStrategy: new LocalStrategy(
//   //       function(username, password, done) {

//   //           var user = module.exports.findByUsername(username);

//   //           if(!user) {
//   //               done(null, false, { message: 'Incorrect username.' });
//   //           }
//   //           else if(user.password != password) {
//   //               done(null, false, { message: 'Incorrect username.' });
//   //           }
//   //           else {
//   //               return done(null, user);
//   //           }

//   //       }
//   //   ),

//     localStrategy:  new LocalStrategy({
//       usernameField: 'email',
//       passwordField: 'password'
//     },
//       function(email, password, done) {
//         User.findOne({
//           email: email
//         }, function(err, user) {
//           if (err) {
//             return done(err);
//           }
//           if (!user) {
//             return done(null, false, {
//               message: 'Unknown user'
//             });
//           }
//           if (!user.authenticate(password)) {
//             return done(null, false, {
//               message: 'Invalid password'
//             });
//           }
//           return done(null, user);
//         });
//       }
//   ),
// };

// mongoose.model('User', UserSchema);
