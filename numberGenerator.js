/*Logic:
- once button is pressed
  - wait for either Tap or Accelerometer trigger
  - generate number once stopped accelerometer
  - generate number once tapped again*/

function generate(){
  number=getd20Roll();
  document.getElementById('generate').innerHTML=number;
}

function addToHistory(){
  //const list=document.createElement("li")
  document.getElementById('history').innerHTML=
            `<li class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">List group item heading</h5>
                    <small class="text-body-secondary" id="date">3 days ago</small>
                </div>
                <p class="mb-1" id="random">Some placeholder content in a paragraph.</p>
                <small class="text-body-secondary">And some muted small print.</small>
            </li>`;
  
  document.getElementById('random').innerHTML="lolxd";
  document.getElementById('date').innerHTML=Date();
}

function getd20Roll() {
  return Math.floor(Math.random() * 20)+ 1;
}