const db = require('_helpers/db');
const comments = db.comments;


module.exports = {
    getall,
    create,
};

async function create(userParam) {
    
    // console.log(userParam);
    for(i = 0;i<userParam.length;i++){
         let commentsection = userParam[i];
         let commentid =  commentsection.commentId;
         let comment1 = await comments.findOne({ commentId: commentid });
         
        if(comment1)
        {
            console.log(comment1);
            Object.assign(comment1, userParam[i]);
            await comment1.save();
        }
        else{
        const comment = new comments(userParam[i]);
         console.log(comment);
        await comment.save();
        }
        // await comment.save();
    }
   
}

async function getall() {
    return await comments.find().select('-hash');;
}

