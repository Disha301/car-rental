const book= document.querySelector('.book');
const form=document.querySelector('.form');
book.addEventListener("click",()=>{
if(form.style.display==="none"){
    form.style.display="block";
}else{
    form.style.display="none";
}
})