const express = require('express');
const bodyParser=require("body-parser")
const fs = require('fs');
const path = require('path');
const app = express();
var store=[]
var line=[]
var isON=false
app.get("/addrequest",(req,res)=>{
    let id = generateAlphabetId()
    line.push({id,status:"Pending"})
    store.push({id,status:"Pending"})
    res.send("Your id is : "+id)
    if(!isON){
        startit()
    }
})

app.get("/status/:id",(req,res)=>{
    let id=req.params.id
    
    let obj = store.find((ob)=> ob.id==id)
    if(!obj){
        res.send("No such id exists")
        return
    }
    res.send(obj.status)

})
app.get("/all",(req,res)=>{
    res.send(store)
})

function generateAlphabetId() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let id = '';
    for (let i = 0; i < 3; i++) {
      id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return id;
  }

async function startit(){
    isON=true;
    while(line.length>0){
        let obj = line.shift()
        let data = await new Promise((resolve,reject)=>{
            setTimeout(() => {resolve("Done")},10000)
        })
        
        let newobj= store.find((ob)=> ob.id == obj.id)

        newobj.status="Done"
        console.log(newobj," Done task")
        
    }
    isON=false
}

app.listen(3020,()=>{
    console.log("Server is running on port 3020")
})