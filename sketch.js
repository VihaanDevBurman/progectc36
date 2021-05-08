//Create variables here
var dogimg,happyDog,db,foodS,foodStock,dog,buttonFeed,buttonAddfeed,milkImg,lastFed,garden,washRoom,bedRoom;
var currentTime,gameState;
function preload()
{
  //load images here
  dogimg=loadImage("Dog.png");
  happyDog=loadImage("happydog.png");
milkImg=loadImage("Milk.png")
bedRoom=loadImage("Bed Room.png")
washRoom=loadImage("Wash Room.png")
garden=loadImage("Garden.png")
}

function setup() {
  var canvas=createCanvas(1000,1000);
  dog = createSprite(500,500);
   dog.addImage(dogimg);
   dog.scale=0.3;
  db=firebase.database();
  foodStock=db.ref("food");
  foodStock.on("value",readStock);
buttonFeed=createButton("Feed The Dog");
buttonFeed.position(600,100);
buttonAddfeed=createButton("Add food");
buttonAddfeed.position(800,100);
buttonFeed.mousePressed(feedDog);
buttonAddfeed.mousePressed(addFood);
}


function draw() {  
  background(46, 139, 87);
  currentTime=hour();
  if(currentTime===lastFed+1){
    update("play");
    image(garden,0,0,1000,1000);
  } 
  else if(currentTime===lastFed+2){
    update("sleep");
    image(bedRoom,0,0,1000,1000);
  }
  else if(currentTime>lastFed+2&& currentTime<=lastFed+4){
    update("bathing");
    image(washRoom,0,0,1000,1000);
  }
  else{
    update("hungry")
    display();
  }
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(happyDog);

  }

db.ref("feedTime").on("value",(data)=>{
  lastFed=data.val();

})
db.ref("gameState").on("value",(data)=>{
  gameState=data.val();

})
if(gameState!=="hungry"){
  buttonFeed.hide();
  buttonAddfeed.hide();
  dog.remove();
}
else{
  buttonFeed.show();
  buttonAddfeed.show();
  dog.addImage(dogimg);
}
fill(0);
if(lastFed>=12){
  text("last Feed: "+lastFed%12+" pm",350,30)
}
else if(lastFed==0){
  text("last Feed:  12am",350,30)
}
else{
  text("last Feed: "+lastFed+" am",350,30)
}
  fill(0);
  textSize(20);
  text("food left:"+foodS,200,450)
  drawSprites();
  //add styles here


}
function readStock(data){
  foodS=data.val();
}
function writeStock(x){
  db.ref("/").set({
      food:x
  })


}
function feedDog(){
  var foodDed=foodS-1
  dog.addImage(happyDog);
  db.ref("/").update({
    food:foodDed,
    feedTime:hour()
  })
}
function addFood(){
  var foodAdd=foodS+1;
  if(foodS<30){
    db.ref("/").update({
      food:foodAdd
    })  }
}
function display(){
var x=80,y=100;
imageMode(CENTER);
if(foodS!==0){
  for(var i=0;i<foodS;i++){
    if(i%10===0){
      x=80;
      y=y+50;
    }
    image(milkImg,x,y,50,50);
    x=x+30;
  }
}
}
function update(state){
  db.ref("/").update({
    gameState:state

  })
}