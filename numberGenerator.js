/*Logic:
- once button is pressed
  - wait for either Tap or Accelerometer trigger
  - generate number once stopped accelerometer
  - generate number once tapped again*/


//stores numbers rolled
const STORAGE_KEY="dice_history"

function generate(){
  number=getd20Roll();
  document.getElementById('generate').innerHTML=number;

  storeNum(number);
}

/*Requests Persistent Storage from browser/device*/
async function requestPersStore() {
  // Request persistent storage for site
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Persisted storage granted: ${isPersisted}`);
  }

}

/*Stores number in local storage */
function storeNum(num){
  requestPersStore();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(num))
}

/*Returns number from local storage*/
function getNum(){
  const data=localStorage.getItem(STORAGE_KEY);

  const getNumbers=data?JSON.parse(data):[];
  return getNumbers
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
  
  document.getElementById('random').innerHTML=JSON.stringify(getNum());
  document.getElementById('date').innerHTML=Date();
}

function getd20Roll() {
  return Math.floor(Math.random() * 20)+ 1;
}