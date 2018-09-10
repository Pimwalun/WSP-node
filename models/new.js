let mongoose = require('mongoose'); //import module

let articleSchema = mongoose.Schema({ //import
  title:{type: String,required: true},
  author:{type: String,required: true},
  body:{type: String,required: true}
});
let Article = module.exports = mongoose.model('news', articleSchema); //import exports ให้คนอื่นใช้ได้ด้วย
