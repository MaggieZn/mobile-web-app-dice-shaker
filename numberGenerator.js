const STORAGE_KEY="dice_history" //stores numbers rolled
const SIDED_DIE="chosen_dice_type"

//stores accelerometer permission
var accelerometerPerm=false;
var motionStop=false;
var stored=false; //for number being stored when rolled

var sidedDie=20;

function updateChosenDie(){
  var diceType=getDiceType();
  if(diceType!=null){
    sidedDie=diceType;
  }
}

function currentDiceHome(){
  updateChosenDie();
  const diceType=document.getElementById('diceTypeHome')
  diceType.innerHTML="D"+sidedDie;
}

function generate(){
  requestPermission();
  motionStop=false;
  stored=false;
  updateChosenDie()
  
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

/*Detects motion from user and rolls number*/
function motion(event){
  const {acceleration} = event;

    if (acceleration) {
      //change in motion
      const magnitude=Math.sqrt(Math.pow(acceleration.x || 0,2)+Math.pow(acceleration.y || 0,2)+Math.pow(acceleration.z || 0,2));

      if(magnitude>1 && motionStop==false){
        number=roll()
        document.getElementById('generate').innerHTML=number;
            setTimeout(() => { //once user stops shaking phone
              motionStop=true;
            }, 500);
      }
      else if(motionStop==true && stored==false){
        storeNum(number,Date(), sidedDie)
        stored=true;
        return;
    }
    }
}

/*Clear localstorage/history */
function deleteStore(){
  localStorage.removeItem(STORAGE_KEY);
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
function storeNum(num, date, sidedDie){
  requestPersStore();

  //rolled numbers variable and pushed to array
  var rolledNums=getNum();
  //var position=rolledNums.length+1
  rolledNums.push({num, date, sidedDie});
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
  liElement.innerHTML=`
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">D${num.sidedDie}</h5>
                    <small class="text-body-secondary">${num.date}</small>
                </div>
                <p class="mb-1">${num.num}</p>
                <small class="text-body-secondary">And some muted small print.</small>`;

  return liElement;
}

/*Stores dice type user has selected*/
function changeDice(num){
  requestPersStore();
  var changeDie=num;

  localStorage.setItem(SIDED_DIE, JSON.stringify(changeDie));
  alert("Dice type changed to D"+num)
}

/*Returns user selected dice type in local storage */
function getDiceType(){
  const data=JSON.parse(localStorage.getItem(SIDED_DIE))
  return data;
}

/*Generates a random number depending on dice type */
function roll(){
  var rolled;
  switch(sidedDie){
    case 20:
      rolled= Math.floor(Math.random() * 20)+ 1;
    break;
    case 4:
       rolled=Math.floor(Math.random() * 4)+ 1;
    break;
    case 6:
       rolled=Math.floor(Math.random() * 6)+ 1;
    break;
    case 8:
       rolled=Math.floor(Math.random() * 8)+ 1;
    break;
    case 10:
       rolled=Math.floor(Math.random() * 10)+ 1;
    break;
    case 12:
       rolled=Math.floor(Math.random() * 12)+ 1;
    break;
    case 100:
       rolled=Math.floor(Math.random() * 100)+ 1;
    break;
  }

  return rolled;
}

/*generates a random d20 roll (1-20 number)*/
function getd20Roll() {
  return Math.floor(Math.random() * 20)+ 1;
}
