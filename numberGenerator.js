function generate(){
    document.getElementById('generate').innerHTML=getd20Roll();
}

function getd20Roll() {
  return Math.floor(Math.random() * 20)+ 1;
}