const http = require("http")
const mongodb = require("mongodb").MongoClient
const fs = require("fs")
const url = require("url")

http.createServer((req,res)=>{
     let urlInPath = url.parse(req.url).pathname
     let urlInQuery = url.parse(req.url).query

     if(urlInPath === "/post"){
          var data = "";

          req.on("data",(d)=>{
              data+=d.toString();
                        
          })
          req.on("end",()=>{
               var ExtractedId;
               var IncomingData;
               var updatedData;
               mongodb.connect("mongodb://127.0.0.1:27017/",(err,db)=>{
                    let dbo = db.db("products")
                    dbo.collection("Indexdata").insertOne(JSON.parse(data),(err,result)=>{
                         if(err)throw err; 
                        ExtractedId = result.insertedId.toString();
                        IncomingData = JSON.parse(data).source
                        IncomingData = IncomingData.split(",")[1]
                        updatedData = JSON.parse(data); 

                        fs.writeFileSync("C:\\Users\\L E N O V O\\.vscode\\Shop\\Indexdata\\"+ExtractedId+".png",IncomingData,"base64")
                        updatedData.source = "/Indexdata?name="+ExtractedId+".png";

                        dbo.collection("Indexdata").updateOne({_id:result.insertedId},{$set: updatedData},(err,res)=>{
                         if (err) throw err;
                         db.close() 
                        })

               
                        
                    })
               })
          })
     }
     else{
       fs.readFile("C:\\Users\\L E N O V O\\.vscode\\Shop\\maintainence.html",(err,data)=>{
          res.write(data)
          res.end()
       })
     }
}).listen(3000)

