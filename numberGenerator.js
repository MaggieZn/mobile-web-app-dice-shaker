/*Logic:
- once button is pressed
  - wait for either Tap or Accelerometer trigger
  - generate number once stopped accelerometer
  - generate number once tapped again*/


//stores numbers rolled
const STORAGE_KEY="dice_history"

//stores accelerometer permission
var accelerometerPerm=false;
var motionStop=false;
var stored=false; //for number being stored when rolled

function generate(){
  requestPermission();
  motionStop=false;
  stored=false;
  
  /*document.body.addEventListener("click", genNum());
  document.body.removeEventListener("click", genNum(), false);
  return;*/
  window.addEventListener('devicemotion', (event)=>{motion(event)})
}

/*var myButton = document.getElementById('myButton');

// Define the event handler as an anonymous function
var handleClick = function() {
  console.log('Button clicked!');
  
  // Remove the event listener using the stored reference
  myButton.removeEventListener('click', handleClick);
};

// Add the event listener
myButton.addEventListener('click', handleClick);*/

function motion(event){
  const {acceleration} = event;

    if (acceleration) {
      const magnitude=Math.sqrt(Math.pow(acceleration.x || 0,2)+Math.pow(acceleration.y || 0,2)+Math.pow(acceleration.z || 0,2));

      if(magnitude>1 && motionStop==false){
        number=getd20Roll()
        document.getElementById('generate').innerHTML=number;
            setTimeout(() => {
              motionStop=true;
            }, 500);
      }
      else if(motionStop==true && stored==false){
        storeNum(number,Date())
        stored=true;
        return;
    }
    }
}

/*Clear localstorage/history */
function deleteStore(){
  localStorage.clear();
  addToHistory();
}

/*Requests device permsission for accelerometer usage (if available) */
function requestPermission() {
    if (window.DeviceMotionEvent) {
      console.log('DeviceMotionEvent is supported');
    } 
    else {
      console.error('DeviceMotionEvent not supported on this device');
      return;
    }

    if (accelerometerPerm!=true){
      if (typeof DeviceMotionEvent.requestPermission=='function') {
        DeviceMotionEvent.requestPermission().then((response) => {
          if (response=='granted') {
            console.log('Permission granted');
            accelerometerPerm=true;
          }
          else {
            console.error('Permission denied');
          }
        })
        .catch((error) => {
          console.error('Permission request error:', error);
          return;
        });
      }
      else {
        console.log('requestPermission not required or supported on this browser');
      }
    }
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
  //var position=rolledNums.length+1
  rolledNums.push({num, date});
  rolledNums.sort((a, b) => new Date(b.date) - new Date(a.date));

  localStorage.setItem(STORAGE_KEY, JSON.stringify(rolledNums));
}

/*Returns number from local storage*/
function getNum(){
  const data=localStorage.getItem(STORAGE_KEY);

  const getNumbers=data?JSON.parse(data):[];
  return getNumbers
}

/*Adds local storage results to history page in a list*/
function addToHistory(){
  const nums=getNum();
  const position=0;
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
  });

}

/*Creates a list object to allow history*/
function historyListing(num){
  const liElement=document.createElement("li")

  liElement.className="list-group-item"
  liElement.innerHTML=`<li class="list-group-item">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">E</h5>
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
