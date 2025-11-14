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

  storeNum(number, Date());
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
function storeNum(num, date){
  requestPersStore();

  //rolled numbers variable and pushed to array
  var rolledNums=getNum();
  var position=rolledNums.length+1
  rolledNums.push({num, date, position});

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rolledNums));
}

/*Returns number from local storage*/
function getNum(){
  const data=localStorage.getItem(STORAGE_KEY);

  const getNumbers=data?JSON.parse(data):[];
  return getNumbers
}

function addToHistory(){
  const nums=getNum();
  console.log(nums)

  const historyContainer=document.getElementById('history')

  if (nums.length==0){
    historyContainer.innerHTML=
            `<li class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">Nothing here!</h5>
                </div>
            </li>`;
    return;
  }

  nums.forEach((num) => {
      historyContainer.appendChild(historyListing(num));
            
    //document.getElementById('random').innerHTML=JSON.stringify(getNum());
    //document.getElementById('date').innerHTML=Date();
  });

}

/*Creates a list object to allow history*/
function historyListing(num){
  const liElement=document.createElement("li")

  liElement.className="list-group-item"
  liElement.innerHTML=`<li class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${num.position}</h5>
                    <small class="text-body-secondary">${num.date}</small>
                </div>
                <p class="mb-1">${num.num}</p>
                <small class="text-body-secondary">And some muted small print.</small>
            </li>`;

  return liElement;
}

/*generates a random d20 roll (1-20 number)*/
function getd20Roll() {
  return Math.floor(Math.random() * 20)+ 1;
}