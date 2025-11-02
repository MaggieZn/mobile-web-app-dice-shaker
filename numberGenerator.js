/*Logic:
- once button is pressed
  - wait for either Tap or Accelerometer trigger
  - generate number once stopped accelerometer
  - generate number once tapped again*/

function generate(){
  addEventListener("deviceorientationabsolute", function(){
      document.getElementById('generate').innerHTML=getd20Roll();
  })

}

function getd20Roll() {
  return Math.floor(Math.random() * 20)+ 1;
}