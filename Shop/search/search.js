let indexImg = document.querySelectorAll("#infc"),
 searchButton = document.getElementById("searchButton"),
 vIndex = document.querySelectorAll("#sVIndex"),
 Vbody = document.getElementById("vBody"),
 ProductPrice = document.querySelectorAll("#ProductPrice"),
 ProductName = document.querySelectorAll("#ProductName")
 searchIn = document.getElementById("search");
 

 fetch("/databaseMandatory").then(r=>r.json()).then(data=>{ 

    for(let i =0;i<data.length;i++){
        if(data[i].name == searchButton.name) searchButton.src = data[i].source;
    }   
})

searchButton.onclick = () => {
    let query = searchIn.value;
    window.location.assign("/search?query="+query)
};

let query = window.location.href.split("=")[1];

fetch("/searchData?q="+query).then(d=>d.json()).then(data=>{
    for(let i =0;i<data.length;i++){
        indexImg[i].src = data[i].source
        ProductName[i].innerHTML = data[i].name
        ProductPrice[i].innerHTML = data[i].price

    }
})

for(let i =0;i<indexImg.length;i++){
    indexImg[i].onclick =()=>{
        let query = indexImg[i].src.split("=")[1].split(".")[0];
        window.location.assign("/products?q="+query)
    }
}


