const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
 
    
    commentId :{ type: Number , unique:false },
    currentDate :  { type: Date },
    commentTxt: { type: String },
    creater: { 
        
        display_name : {type : String},
        id : {  }
    },
    respondsto: {type : Number},
    replyComment: []

    
}); 


schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('comments', schema);

