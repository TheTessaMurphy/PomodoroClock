//Global variables
var od;
var clock;
var count = 0;

//Onload, set countdown clock to session time, set progress bar to blue background color
window.onload = function(){
  document.getElementById("countdown").innerHTML = document.getElementById("ssnTime").innerHTML + ":00";
  var x = document.getElementsByClassName("progress");  
  x[0].style.background = "#00bfff"
}

//Function for buttons that set session and break times. 
function setTimes(value, id){

  switch(id){
    case "btnSsnLeft":
    value = document.getElementById("ssnTime").innerHTML;
      if (value >= 4){
         value--; 
      }        
      document.getElementById("ssnTime").innerHTML = value;
      document.getElementById("countdown").innerHTML = value + ":00";
      break;
      
    case "btnSsnRight":
    value = document.getElementById("ssnTime").innerHTML;
    if (value <= 1440){
      value++
    }
    document.getElementById("ssnTime").innerHTML = value;
    document.getElementById("countdown").innerHTML = value+ ":00";
    break;
  
  case "btnBrkLeft":
      value = document.getElementById("brkTime").innerHTML;
      if (value >= 4){
         value--; 
      }        
      document.getElementById("brkTime").innerHTML = value;
      break;

    case "btnBrkRight":
      value = document.getElementById("brkTime").innerHTML;
      if (value <= 1440){
        value++
      }
      document.getElementById("brkTime").innerHTML = value;
    
  }
}

//Called by Go button. If progress bar background is green, call getBreak(). 
//Otherwise call Start().
function Go(){
  var x = document.getElementsByClassName("progress");  
  if(x[0].style.background === "rgb(0, 179, 0)"){
    getBreak();
  }else{
    Start();
  }
}

//Starts Session.
function Start() {
  document.getElementById("start").disabled = true; //disable button to avoid restarting
  
  var stim = document.getElementById("ssnTime").innerHTML; //Get session time
  var bar = document.getElementById("bar");   
  var width = bar.style.width;                             //width = bar width. Allows stop and go.
  width = width.slice(0, -1);                              //To get number only, remove % sign.
  var wid = (stim * 60000) - (width);                      //multiply session time by minute -60,000 for 100%
  var inter = (stim * 590) - (width);                      //multiply session time by 590 - should be 600, for seconds but 590 
                                                           //worked better with countdown clock.
  if(count===0){
    document.getElementById("countdown").innerHTML = stim + ':00'; //if first time, start the countdown.
    min = stim-1;
    sec = 59;
    count = 1
  } else {
     var doc = document.getElementById("countdown").innerHTML;  //Else get amount and start from there.
     var ind = doc.indexOf(":");
     min = doc.slice(0, ind)
     sec = doc.slice(ind + 1, doc.length);
  }
  
  od = setInterval(frame, inter); //run the status bar. When it reaches 100%, stop, reset count, and call Break.
  function frame() {
    if (width * inter >= wid) {
      clearInterval(od);
      count = 0;
      getBreak();
    }else {                      //Until then keep coounting up.
       width++; 
       bar.style.width = width + '%'; 
    }
 }
   document.getElementById("countdown").innerHTML = stim - 1 + ':' + 59 ;
   startClock();  //start the countdown clock.
 } 

function Stop(){
  clearInterval(od);
  clearInterval(clock);
  document.getElementById("start").disabled = false;
}

function Reset(){
  clearInterval(od);
  clearInterval(clock);
  var x = document.getElementsByClassName("progress");  
  x[0].style.background = "#00bfff"
  
  document.getElementById("bar").style.width = 0 + '%'; 
  value = document.getElementById("ssnTime").innerHTML;
  document.getElementById("countdown").innerHTML=value + ":00";
  document.getElementById("minutes").innerHTML = "Session Minutes";  
  document.getElementById("start").disabled = false;
  
  count = 0;
}

function startClock(){
  clock = setInterval(getTime, 1000);
    function getTime(){
      sec--;
      if(sec < 0){
      min--;
      sec=59;
    }
      
    if (min == 0 && sec == 0) {  
      clearInterval(clock);
    }
      if (sec < 10){        //add a 0 to front of seconds if below 10
        sec = "0" + sec;
      }
      document.getElementById("countdown").innerHTML = min + ":" + sec ;
    }
  }  
 
//Like Start only for Break instead of session
function getBreak(){
  var stim = document.getElementById("ssnTime").innerHTML;
  var btim = document.getElementById("brkTime").innerHTML;
  var bar = document.getElementById("bar");   
  
  var width = bar.style.width;
  width = width.slice(0, -1);
  var wid = (btim * 60000) - (width);
  var inter = (btim * 680) - (width);
  
  document.getElementById("minutes").innerHTML = "Break Minutes";  
  var x = document.getElementsByClassName("progress");  
  x[0].style.background = "rgb(0, 179, 0)";
  
  if(count===0){
    document.getElementById("countdown").innerHTML = btim - 1 + ':' + 59 ;
    min = btim-1;
    sec = 59;
    count = 1
  }else {
    var doc = document.getElementById("countdown").innerHTML;
    var ind = doc.indexOf(":");
    min = doc.slice(0, ind)
    sec = doc.slice(ind + 1, doc.length);
  }
  
  od = setInterval(frame, inter);
  function frame() {
    if (width * inter <= 0) {
     clearInterval(od); 
     Reset(); //reset and restarts the session.
     Start();
    }else {
       width--; 
       bar.style.width = width + '%'; 
    }
    
  }
   startClock();
  }