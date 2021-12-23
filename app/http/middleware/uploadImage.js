const multer=require("multer")
const shortid=require("shortid")
const path=require("path")
const dest=path.join(path.dirname(__dirname),"../../public/images")
const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,dest)
  },
  filename:function(req,file,cb){
    cb(null,shortid.generate()+"-"+file.originalname)
  }
})
exports.uploads=multer({storage})
