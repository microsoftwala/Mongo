const express = require("express")
const bodyParser = require("body-parser")
const exp = require("constants")
const mongoose = require("mongoose")
const app= express()


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true }));
app.use(express.static("public"))


mongoose.connect("mongodb+srv://prakhardeoria2004:8s1Ccfx0XWM13MJf@cluster1.jefbksp.mongodb.net/todolist", {useNewUrlParser:true}).then(() => {
    console.log(`CONNECTED TO MONGO!`);
})
.catch((err) => {
    console.log(`OH NO! MONGO CONNECTION ERROR!`);
    console.log(err);
})



const itemSchema = {
    name:String
}

const workSchema = {
    name:String
}

let item = []
let works = []

const Item = mongoose.model("Item",itemSchema)
const Work = mongoose.model("Work",workSchema)


const item1 = new Item({
    name:"Cricket"
})


const item2 = new Item({
    name:"Coding"
})

const item3 = new Item({
    name:"Listening Music"
})


const work1 = new Work({
    name:'Doing two Projects'
})


const work2 = new Work({
    name:'Doing CP'
})

const work3 = new Work({
    name:'Learn App dev'
})

const defaultItem = [item2,item3]
const defaultItem1 = [work1,work2,work3]
// cricket.save()

// Item.insertMany(defaultItem).then((err)=>{
//     if(err){
//         console.log("Insert succesfully")
//     } else{
//         console.log("Not Insert in database")
//     }
// })

// Item.deleteMany({_id:"646321fcfa559470cef77509"}).then((err)=>{
//     if(err){
//         console.log("Succesfully Deleted")
//     }
//     else{
//         console.log("Unsuccesful")
//     }
// })

// Work.insertMany(defaultItem1).then((err)=>{
//     if(err){
//         console.log("Insert Succesfully")
//     }
//     else{
//         console.log("Sorry Operation not succesfully")
//     }
// })


Item.find().then((data)=>{
    data.forEach(function(Data){
        item.push(Data.name)
    })
})

Work.find().then((data)=>{
    data.forEach(function(Data){
        works.push(Data.name)
    })
})



app.get("/",function(req,res)
{
    var today = new Date()
    var currentday = today.getDay()
    var date = today.getDate()
    var month = today.getMonth()
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var day = ""
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if(currentday === 6 || currentday === 0){
        day = "Weekend"
        // res.sendFile(__dirname+'/weekand.html')
    }
    else{
        day = "Weekday"
        // res.sendFile(__dirname+"/working.html")
    }
    res.render('list',{listTitle:"Normal-works", kindOfDay: days[currentday],Dayname: day, Date:Number(date), Month:months[Number(month)], New:item })
})



app.get("/work", function(req,res)
{
    var today = new Date()
    var currentday = today.getDay()
    var date = today.getDate()
    var month = today.getMonth()
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    var day = ""
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if(currentday === 6 || currentday === 0){
        day = "Weekend"
    }
    else{
        day = "Weekday"
    }
    res.render('list',{listTitle:"Work-List",kindOfDay: days[currentday],Dayname: day, Date:Number(date), Month:months[Number(month)], New:works })
})



app.post("/",function(req,res)
{
    let input = req.body.newItem;
    console.log(req.body.listadd)
    if(req.body.listadd === 'Work-List'){
        works.push(input)
        const work4 = new Work({
            name:input
        })
        let newdata = [work4]
        Work.insertMany(newdata).then((err)=>{
            if(err){
                console.log("Insert Success in workdb")
            }else{
                console.log("Problem Occur in workdb")
            }
        })
        res.redirect("/work");
    }
    else if(req.body.listrem === 'Work-List'){
        let data = works.pop()
        Work.deleteOne({name:data}).then((err)=>{
            if(err){
                console.log("Succesfully Deleted in workdb")
                }
                else{
                    console.log("Unsuccesful in work db")
                }
        })
        res.redirect("/work");
    }
    else if(req.body.listadd === 'Normal-works'){
        item.push(input)
        const item4 = new Item({
            name:input
        })
        let newdata = [item4]
        Item.insertMany(newdata).then((err)=>{
            if(err){
                console.log("Insert Success in itemdb")
            }else{
                console.log("Problem Occur in itemdb")
            }
        })
        res.redirect("/");
    }
    else{
        let data = item.pop()
        Item.deleteOne({name:data}).then((err)=>{
            if(err){
                console.log("Succesfully Deleted in itemdb")
                }
                else{
                    console.log("Unsuccesful in itemdb")
                }
        })
        res.redirect("/")
    }
})



app.listen(3000,function(){
    console.log("Server started")
})