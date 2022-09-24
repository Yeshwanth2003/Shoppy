let MainDiv = document.getElementById("mainBody");
let subBoby = document.querySelectorAll("#sub"),subLength = subBoby.length;
let IndexImage = document.querySelectorAll("#Interface"),iILength = IndexImage.length;
let IndexImageDiv = document.querySelectorAll("#Indeximage"),iIDivLength = IndexImageDiv.length;
let header = document.querySelector("header");
let headerStyle = header.style;
let bodyWidth = document.body.style.width;
let Mandatory = document.querySelectorAll("#Mandatory");
let Maininput = document.querySelector("#in");
let AppTitle = document.getElementById('AppNameOnHeader');
let adderNavi = document.getElementById("AddProducts");
let indexName = document.querySelectorAll("#IndexName");
let indexPrice = document.querySelectorAll("#IndexPrice");
let searchButtton = document.querySelector(".searchButton");

AppTitle.classList.add("AppNameOnHeader");

adderNavi.onclick=()=>window.location.assign("/adder?name=html")

Mandatory[0].classList.add("logoStyle");
Mandatory[1].classList.add("search");

header.style.width = bodyWidth+"px";
header.style.position = "relative";
MainDiv.style.width = bodyWidth+"px";
headerStyle.bottom = 21+"px";
Maininput.style.width = (header.style.width+250)+"px"
Maininput.classList.add("MainInput")


fetch("/databaseMandatory").then(r=>r.json()).then(data=>{
      
     for(let i =0;i<Mandatory.length;i++){
          for(let j = 0;j<data.length;j++){
               if(Mandatory[i].name === data[j].name){
                    Mandatory[i].src = data[j].source;
                    break;
               }
          }
     }
     
})

fetch("/data?needed="+iILength).then(data=>data.json()).then(d=>{

    for(let i = 0;i<d.length;i++){
          IndexImage[i].src = d[i].source
          IndexImage[i].name = d[i].category
          indexName[i].innerHTML = d[i].name
          indexPrice[i].innerHTML = d[i].price
    }
})

searchButtton.onclick = ()=>{
     let query = Maininput.value;
     window.location.assign("/search?query="+query)
}

for(let i =0;i<IndexImage.length;i++){
     IndexImage[i].onclick = ()=> window.location.assign("/search?query="+IndexImage[i].name)
}