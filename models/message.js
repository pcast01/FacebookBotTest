// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var messageSchema = new Schema({
    message: String,
    created_time: String,
    from: { name: String, email: String, id: String },
    id: String
})

// the schema is useless so far
// we need to create a model using it
//var Message = mongoose.model('Message', messageSchema);
// make this available to our users in our Node applications
module.exports = mongoose.model('Message', messageSchema);