const express=require("express");
const router=express.Router()
const app=express()
const multer=require('multer')
const Facultydetails=require("./model/Facdetails")
const bodyParser=require("body-parser")
const uploads = multer({dest:'uploads/'})
//importing mongoose package
const mongoose=require("mongoose");
//connecting to mongodb database
mongoose.connect("mongodb://localhost:27017/details",{useNewUrlParser:true},()=>{console.log("connected to db")});
app.listen(3200,()=>{console.log("listening")});
app.use(bodyParser.json());

//disk storage
const instorage=multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, './images')
    },
    filename:function(req,file,cb){
        cb(null,Date.now() + '-' + file.originalfile)
    }
})
//upload
const upload = multer({storage: instorage })
app.post("/profile",uploads.single("avatar"),(req,res)=>{
    console.log(req.file)
    res.send(req.file)
    //res.send("uploaded successfully")
});
app.post("/test",uploads.single("image"),(req,res)=>{
    console.log(res.file)
    res.send("Uploaded successfully")
});

//posts
app.post("/",async(req,res)=>{
    const post=new Facultydetails({
        Name:req.body.Name,
        Gender:req.body.Gender,
        EmailId:req.body.EmailId,
        Phonenumber:req.body.Phonenumber,
        Department:req.body.Department,
        Qualification:req.body.Qualification,
        Designation:req.body.Designation,
        ProffesionalExperience:req.body.ProffesionalExperience,
        Image:req.body.Image
    })
    try{
        await post.save();
        res.send({status:"true",message:"saved"})
    }
    catch(err)
    {
        res.send(err.message);
    }
    console.log(req.body)
    res.send("done")
})

//delete
app.delete('/:id',async(req,res)=>{
    try{
        await Facultydetails.remove({_id:req.params.id});
        res.send({status:'true',message:"post delete successfully"});
    }
    catch(err)
    {
        res.send(err.message)
    }
})

//sorting
app.get('/sorts',async(req,res)=>{
    try{
        const post=await Facultydetails.find().sort({year:1});
        res.json(post)
    }
    catch(err)
    {
        res.send(err.message)
    }
})

//update the data
app.patch('/:id',async(req,res)=>{
    try{
        const post=await Facultydetails.findByIdAndUpdate(req.params.id,{$set:req.body})
    }
    catch(err)
    {
        res.send(err.message)
    }
})

//retrieve the data
app.get("/",async(req,res)=>{
    try{
        const Facdetails=await Facultydetails.find()
        res.json(Facdetails)
    }
    catch(err) 
    {
        res.json({message:err.message})
    }
})