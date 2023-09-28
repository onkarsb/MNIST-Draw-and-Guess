// get canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext('2d')
ctx.canvas.width = 280;
ctx.canvas.height = 280;

const canvasSmall = document.getElementById("smallCanvas");
var ctxSmall = canvasSmall.getContext('2d');
ctxSmall.canvas.width = 28;
ctxSmall.canvas.height = 28;



// Reset Canvas

const rstBtn = document.getElementById("resetBtn");
// function to clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxSmall.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("predOut").textContent='';
  console.log("clearedCanvas");
}
// Clear the canvas when reset canvas button is clicked
rstBtn.addEventListener("click",clearCanvas);



// function to predict number drawn on canvas

let model;
const predBtn = document.getElementById("predictBtn");
// function to predict
function predictNum() {
  console.log("Predicted value: ");
  ctxSmall.drawImage(canvas, 0, 0, 280, 280, 0, 0, 28, 28);

  const imgData = ctxSmall.getImageData(0,0,ctxSmall.canvas.width,ctxSmall.canvas.height).data;
  console.log(imgData);
  const imgGray = [];
  for (let i=0;i<imgData.length;i++){
    if ((i+1)%4 === 0){
      imgGray.push(imgData[i]);
    }
  }
  console.log(imgGray);

  let sum = 0;
  // calculate sum using forEach() method
  imgGray.forEach( num => {
    sum += num;
  })
  // check if canvas is empty else use model to predict
  if (sum == 0) {
    document.getElementById("predOut").innerHTML='&#128533';
  }
  else {
    const predVal = model.predict(tf.tensor(imgGray).reshape([-1, 784]));
    tf.print(predVal,true);
    tf.print(predVal.argMax(-1),true);
    const values = predVal.argMax(-1).dataSync();
    console.log(values);
    document.getElementById("predOut").textContent=values;
  }
  
}
// Predict number once predict button is pressed
predBtn.addEventListener("click",predictNum);



// ANN model

// function to load ANN model
// with async the program will not wait for this method to complete execution
async function loadModel(){
  model = await tf.loadLayersModel("tfjs_artifacts\\model.json")
  console.log("Model loaded");
  return model;
}

// load ANN model
loadModel();



// Drawing line on canvas
// Geeksforgeeks

window.addEventListener('load', ()=>{
  console.log("This function is executed once the page is fully loaded");
  document.addEventListener('mousedown', startPainting);
  document.addEventListener('mouseup', stopPainting);
  document.addEventListener('mousemove', sketch);
});

// Stores the initial position of the cursor
let coord = {x:0 , y:0};

// This is the flag that we are going to use to
// trigger drawing
let paint = false;
  
// Updates the coordianates of the cursor when
// an event e is triggered to the coordinates where
// the said event is triggered.
function getPosition(event){
coord.x = event.clientX - canvas.offsetLeft;
coord.y = event.clientY - canvas.offsetTop;
}

// The following functions toggle the flag to start
// and stop drawing
function startPainting(event){
paint = true;
getPosition(event);
}
function stopPainting(){
paint = false;
}
  
function sketch(event){
if (!paint) return;
ctx.beginPath();

// Sets line properties
ctx.lineWidth = 17;
ctx.lineCap = 'round';
ctx.strokeStyle = 'black';
ctx.shadowColor = 'black';
ctx.shadowBlur = 5;

// The cursor to start drawing
// moves to this coordinate
ctx.moveTo(coord.x, coord.y);

// The position of the cursor
// gets updated as we move the
// mouse around.
getPosition(event);

// A line is traced from start
// coordinate to this coordinate
ctx.lineTo(coord.x , coord.y);
  
// Draws the line.
ctx.stroke();
}