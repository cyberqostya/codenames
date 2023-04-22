<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>

body {
display:flex;
flex-direction:column-reverse;
justify-content:center;
align-items:center;
height:100vh;
}

.board {
display:grid;
grid-gap:10px;
background:beige;
border:5px solid beige;
}

.board div {
width:30px;
height:30px;
}

button {
margin-top:20px;
width: fit-content;
}

</style>
</head>
<body>
<button>СОЗДАТЬ</button>
<div class="board"></div>
<script>

const button = document.querySelector(“button”);
const board = document.querySelector(“.board”);
let randomArray;
let firstPlayer;
let secondPlayer;
const length = 5;
const width = 4;

let cardsQuantity = Math.floor( length*width*0.75 );
if(cardsQuantity%2===0) cardsQuantity++;
const firstPlayerCards = cardsQuantity/2+0.5;
const secondPlayerCards = cardsQuantity - firstPlayerCards;

const deathCards = 1;
const commonCards = length*width - cardsQuantity - deathCards;

for(let i=0;i<length*width;i++) {
board.insertAdjacentHTML(“afterbegin”,”<div></div>”);
}
const cells = document.querySelectorAll(“.board div”);
board.style = `grid-template-columns:repeat(${length}, 10px)`;

button.addEventListener(“click”,()=>{
randomArray = new Array(length*width).fill().map((i,ind)=>ind).sort(()=>Math.random()>0.5?1:-1);

firstPlayer = Math.random()>0.5?”red”:”blue”;
secondPlayer = firstPlayer === “red” ? “blue” : “red”;
document.body.style.background = firstPlayer;

for(let i=0; i<length*width;i++){

if(i<deathCards){
cells[randomArray[i]].style.background = “#000”;continue;
}

if(i<deathCards+commonCards){
cells[randomArray[i]].style.background = “#00000088”;continue;
}

if(i<deathCards+commonCards+secondPlayerCards){
cells[randomArray[i]].style.background = secondPlayer;continue;
}

if(i<length*width){
cells[randomArray[i]].style.background = firstPlayer;continue;
}

}
});

</script>
</body>
</html>
