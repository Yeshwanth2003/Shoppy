let naviback = document.querySelectorAll("#back");
let addButton = document.getElementById("submit");
let naviHome = document.querySelectorAll("#home");

naviback[1].onclick = ()=>window.history.back()
naviback[0].onclick = ()=>window.history.back()

naviHome[0].onclick = ()=>window.location.assign("/")
naviHome[1].onclick = ()=>window.location.assign("/")

addButton.onclick = () =>{
     let Category = document.getElementById("Category").value;
     let Name = document.getElementById("Name").value;
     let Price = document.getElementById("Price").value;
     let Photo = document.getElementById("Photo").files[0],imageData = "";

     let reader = new FileReader();

     reader.onload=()=>{
          imageData+=reader.result;
     }
     reader.onloadend=()=>{
          let obj = {
               category:Category,
               name:Name,
               price:Price,
               date:new Date().toDateString(),
               time:new Date().toTimeString(),
               source:imageData,
               rating:0
          }

          fetch("/ProductDataIn",{
               method:"POST",
               body:JSON.stringify(obj)
          })
     }

     reader.readAsDataURL(Photo)

     alert("Added")

}