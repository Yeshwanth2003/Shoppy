let productId = window.location.href.split("=")[1].split(".")[0];


document.getElementById("home").onclick = () => window.location.assign("/");
document.getElementById("back").onclick = () => window.history.back();


fetch("/description?name="+productId).then(d=>d.json()).then(data=>{
    document.querySelector("img").src = data[0].source;
    document.querySelectorAll("label")[0].innerHTML = data[0].name;
    document.querySelectorAll("label")[1].innerHTML = data[0].price;

    fetch("/searchData?q="+data[0].category).then(r=>r.json()).then(d=>{
     let infc = document.querySelectorAll("#infc");
     let productName = document.querySelectorAll("#ProductName");
     let productPrice = document.querySelectorAll("#ProductPrice");

      console.log(data,data[0].category,d)
     for(let i =0;i<productName.length;i++){
          infc[i].src = d[i].source;
          productName[i].innerHTML = d[i].name;
          productPrice[i].innerHTML = d[i].price
     }
    })
})