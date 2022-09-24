const http = require("http");
const fs = require("fs");
const url = require("url");
const mongodb = require("mongodb").MongoClient;

let server = http.createServer
                                               
let Mainport = server((req,res)=>{
     let urlInPath = url.parse(req.url).pathname
     let urlInQuery = url.parse(req.url).query
 
     if(urlInPath == "/data"){
          let limitLength = urlInQuery.split("=")[1]
        mongodb.connect("mongodb://127.0.0.1:27017/",(err,collections)=>{
          let dbs = collections.db("products");
          dbs.collection("Datas").find({}).sort({date:-1,time:-1}).limit(parseInt(limitLength)).toArray((err,result)=>{
               if(err){
                    res.write("[]")
                    console.log(err)
               }
               else{
                    res.write(JSON.stringify(result));
               }
               collections.close()
               res.end()
          })
        })
     }
     else if(urlInPath === "/description"){
          let query = urlInQuery.split("=")[1];

          mongodb.connect("mongodb://127.0.0.1:27017/",(err,collections)=>{
          let dbs = collections.db("products");
          dbs.collection("Datas").find({source:{$regex:query,$options:"i"}}).sort({date:-1,time:-1}).toArray((err,result)=>{
               if(err){
                    res.write("[]")
                    console.log(err)
               }
               else{
                    res.write(JSON.stringify(result));
               }
               collections.close()
               res.end()
          })
        })
     }
     else if(urlInPath ==="/products"){
          let query = urlInQuery.split("=")[1];
          if(query == "css" || query=="js"){
               fileRender("./products/products."+query).then(d=>{
                    res.write(d.toString())
                    res.end()                 
               })
          }else{
               fileRender("./products/products.html").then(d=>{
                    res.write(d.toString())
                    res.end()                 
               })
          }
     }
     else if(urlInPath ==="/searchData"){
          let query = urlInQuery.split("=")[1];
           
          mongodb.connect("mongodb://127.0.0.1:27017/",(err,collections)=>{
          let dbs = collections.db("products");
          dbs.collection("Datas").find({$or:[{category:{$regex:query, $options: 'i'}},{name:{$regex:query, $options: 'i'}}]}).sort({date:-1,time:-1}).toArray((err,result)=>{
               if(err){
                    res.write("[]")
                    console.log(err)
               }
               else{
                    res.write(JSON.stringify(result));
               }
               collections.close()
               res.end()
          })
        })

     }
     else if(urlInPath === "/search"){
          let pathRequired = "./search/search.html"
          let query = urlInQuery.split("=")[1];

          if(query == "css" || query == "js"){
               pathRequired = "./search/search."+query;
               fileRender(pathRequired).then(d=>{
                    res.write(d)
                    res.end()                 
               })
          }else{
               fileRender(pathRequired).then(d=>{
                    res.write(d)
                    res.end()                 
               })
          }
     }
     else if(urlInPath === "/ProductDataIn"){
          let data = "";
      
          req.on("data",(d)=>{
              data+=d.toString();
          })
          req.on("end",()=>{
               let ExtractedId;
               let IncomingData;
               let updatedData;
               mongodb.connect("mongodb://127.0.0.1:27017/",(err,db)=>{
                    let dbo = db.db("products")
                    dbo.collection("Datas").insertOne(JSON.parse(data),(err,result)=>{
                         if(err)throw err; 
                        ExtractedId = result.insertedId.toString();
                        IncomingData = JSON.parse(data).source
                        IncomingData = IncomingData.split(",")[1]
                        updatedData = JSON.parse(data); 

                        fs.writeFileSync("./Datas/"+ExtractedId+".png",IncomingData,"base64")
                        updatedData.source = "/Datas?name="+ExtractedId+".png";

                        dbo.collection("Datas").updateOne({_id:result.insertedId},{$set: updatedData},(err,res)=>{
                         if (err) throw err;
                         db.close() 
                        })
                    })
               })
          })
     }
     else if(urlInPath ==="/Datas"){
          let render = urlInQuery.split("=")[1];
          let askingPath = "."+urlInPath+"/"+render;

          fileRender(askingPath).then(d=>{
               res.write(d)
               res.end()                 
          })
     }
     else if(urlInPath === "/adder"){ 
          let ext = urlInQuery.split("=")[1]
          let pathRequired = "."+urlInPath+"/adder."+ext;

          fileRender(pathRequired).then(d=>{
               res.write(d)
               res.end()                 
          })

     }
     else if(urlInPath ==="/Indexdata"){
          let render = urlInQuery.split("=")[1];
          let askingPath = "."+urlInPath+"/"+render;

          fileRender(askingPath).then(d=>{
               res.write(d)
               res.end()                 
          })

     }
     else if(urlInPath === "/databaseMandatory"){

       mongodb.connect("mongodb://127.0.0.1:27017/",(err,db)=>{
          let dbo = db.db("products");
           dbo.collection("Indexdata").find({}).toArray((err,Imgdata)=>{
              if(err)throw err;
              res.write(JSON.stringify(Imgdata))
              res.end()
              db.close()
           })
       })
     }
     else if (urlInPath == "/homePage"){
         let render = urlInQuery.split("=")[1];
         if(render == "js"){
          fileRender("./Home/ShopScript.js").then(d=>{
               res.write(d.toString())
               res.end()                 
          })
         }
         else{
          fileRender("./Home/ShopStyle.css").then(d=>{
               res.write(d.toString())
               res.end()                 
          })
         }
     }
     else{
          res.writeHead(200, {
               'Content-Type': 'text/html'
             });

             fileRender("./Home/ShopHome.html").then(d=>{
               res.write(d.toString())
               res.end()                 
          })
     }


})
Mainport.listen(80)

async function fileRender(path){
     let data = await fs.readFileSync(path)
     return data
} 