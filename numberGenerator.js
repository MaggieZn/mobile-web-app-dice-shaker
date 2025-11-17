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
var number=0;

function generate(){
  requestPermission();
  motionStop=false;
  
  /*document.body.addEventListener("click", genNum());
  document.body.removeEventListener("click", genNum(), false);
  return;*/
  var start=window.addEventListener('devicemotion', (event) => {motion(event)});
  window.removeEventListener('devicemotion', start)
  storeNum(number,Date())
}

function motion(event){
const {acceleration} = event;

    if (acceleration) {
      const magnitude=Math.sqrt(Math.pow(acceleration.x || 0,2)+Math.pow(acceleration.y || 0,2)+Math.pow(acceleration.z || 0,2));

      if(magnitude>2 && motionStop==false){
        number=getd20Roll()
        document.getElementById('generate').innerHTML=number;
            setTimeout(() => {
              motionStop=true;
            }, 1500);
      }
      else if(motionStop==true){
      return;
    }
    }
}

function deleteStore(){
  localStorage.clear();
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
