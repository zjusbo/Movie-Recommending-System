 var ids = [];
 var interval;
 var len;
 function load(){

var sth = document.getElementById("here"); 
var txt  = "Submit<input type = \"button\" onClick = \"submit()\">";

 var xmlhttp;
          if (window.XMLHttpRequest) {
              xmlhttp = new XMLHttpRequest();
          } else {
              xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }      

          xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			     
				  json = JSON.parse(xmlhttp.responseText);
				  
          len = json.Movie.length;
           for(i=0;i<json.Movie.length;i++){

            
            txt = txt + "<center><li>" ;
            

            txt = txt + "<h3>" + json.Movie[i]["title"];
            ids.push(json.Movie[i]["id"]);

            txt = txt + " Rate Me <select id = " + i + ">"
                      + "<option value = \"0\">  </option>"
                      + "<option value = \"1\"> 1</option>"
                      + "<option value = \"2\"> 2</option>" 
                      + "<option value = \"3\"> 3</option>" 
                      + "<option value = \"4\"> 4</option>" 
                      + "<option value = \"5\"> 5</option>" 
                      + "</select> <br>" + "</h3>"
                      + "</li></center>";
          }
          var sth = document.getElementById("here");
				  sth.innerHTML = txt;


              }
          }
          xmlhttp.open("GET", "http://sunny-song.com/recommend/index.php",true);
          xmlhttp.send();
}



function submit(){
 var sth = document.getElementById("here"); 
 var xmlhttp;
 var rates = [];

 for(i=0;i<len;i++)
 {
  var s = document.getElementById(i);
  var r = s.options[s.selectedIndex].value;
  if(r != 0)
  {
  var rating = {"id": ids[i], "rating": r};
  rates.push(rating);
  }
  //alert(rating["id"] + " " + rating["rating"]);
} 
 if(rates.length < 3) 
    alert("must rate at least 3 movies");
 else
 {
 rates = JSON.stringify(rates);
 sth.innerHTML ="Please Wait...";    
  
 start();
          if (window.XMLHttpRequest) {
              xmlhttp = new XMLHttpRequest();
          } else {
              xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }      

          xmlhttp.onreadystatechange = function () {
              if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         
          var txt = "";
          json = JSON.parse(xmlhttp.responseText);
          
           for(i=0;i<json.Movie.length;i++){


            txt = txt + "<center><li>";

            txt = txt + "<h3>" + json.Movie[i]["title"] +  " "+ json.Movie[i]["rating"] + "</h3>"
                      + "</li></center>";
          
          }
            sth.innerHTML = txt;     
            end();
              }
              }
          xmlhttp.open("GET", "http://sunny-song.com/recommend/index.php?query="+rates,true);
          xmlhttp.send();
  }
}

function start(){
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");
var W = 500, H = 100;
canvas.height = H; canvas.width = W;


// Defining the balls that will collide. This will be one dimensional, so the ball only has an x position and x velocity. Each ball has a radius and color, and a method to draw it on the canvas

function Ball(locx, radius, color, velx) {
  
    this.x = locx;
    this.vx = velx;
    this.rad = radius;
    this.c = color;
    this.draw = function() {
    // Here, we'll first begin drawing the path and then use the arc() function to draw a circle. The arc function accepts 6 parameters, x position, y position, radius, start angle, end angle and a boolean for anti-clockwise direction.
    ctx.beginPath();
    ctx.arc(this.x, 50, this.rad, 0, Math.PI*2, false);
    ctx.fillStyle = this.c;
    ctx.fill();
    ctx.closePath();
    } // draw function end
  } // Ball function end


ball1 = new Ball(20,20, "red", 8);
ball2 = new Ball (W-30, 30, "blue", -6);

// When we do animations in canvas, we have to repaint the whole canvas in each frame. Either clear the whole area or paint it with some color. This helps in keeping the area clean without any repetition mess.
// So, lets create a function that will do it for us.

function clearCanvas() {
  ctx.clearRect(0, 0, W, H);
}


// We want balls to change direction when they hit the edge of the canvas

function checkbounce(ball,end) {
  if (ball.x + ball.rad > end) ball.vx *= -1;
  if (ball.x - ball.rad < 0) ball.vx *= -1;
}

function checkCollision(ball1,ball2) {
  if(Math.abs(ball1.x - ball2.x)<= (ball1.rad + ball2.rad))
  {
    var v1x = ((ball1.rad * ball1.rad - ball2.rad * ball2.rad) * ball1.vx + (2 * ball2.rad * ball2.rad) * ball2.vx ) / (ball1.rad * ball1.rad + ball2.rad * ball2.rad) ;
    var v2x = ((ball2.rad * ball2.rad - ball1.rad * ball1.rad) * ball2.vx + (2 * ball1.rad * ball1.rad) * ball1.vx ) / (ball1.rad * ball1.rad + ball2.rad * ball2.rad) ;
    ball1.vx = v1x;
    ball2.vx = v2x;
  }

}

// A function that will update the positions of the balls is needed
function update() {
  clearCanvas();

  ball1.draw();
    ball2.draw();
  
  checkCollision(ball1, ball2);
  // Now, lets make the ball move by adding the velocity vectors to its position
  ball1.x += ball1.vx;
    ball2.x += ball2.vx;  
  // We will bounce the balls against the edges of the canvas
  checkbounce(ball1,W);
  checkbounce(ball2,W);
}

// Now, the animation time!
// In setInterval, 1000/x depicts x fps! So, in this case, we are aiming for 60fps for smoother animations.
 interval = setInterval(update, 1000/60);
}

function end()
{
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");
var W = 500, H = 100;
canvas.height = H; canvas.width = W;
ctx.clearRect(0, 0, W, H);
clearInterval(interval);
}