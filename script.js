(function() {

  var contains = function(a, array) {
    for (var x = 0; x < array.length; x++) {
      if (array[x] == a) {
        return true;
      }
    }
    return false;
  }
  var shape = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.lasers = [];
    this.count = [];
    this.alive = true;

    this.draw = function() {
      board.ctx.fillStyle = "white";
      if(board.gameKeys[0] && board.p1.x >= 10) {
        board.p1.x -= 10
      }
      if(board.gameKeys[1] && board.p1.y >= 10) {
        board.p1.y -= 10;
      }
      if(board.gameKeys[2] && board.p1.x <= 440) {
        board.p1.x += 10;
      }
      if(board.gameKeys[3] && board.p1.y <= 440) {
        board.p1.y += 10;
      }
      board.ctx.fillRect(this.x, this.y, this.width, this.height);
      for (var x = 0; x < board.enemies.length; x++) {
        if (hit(board.enemies[x], this)) {
          this.alive = false;

        }
      }
      for (var x = 0; x < this.lasers.length; x++) {
        this.lasers[x].y -= 10;
        if (this.lasers[x].y <= 0) {
          this.count.push(x);
        } else {
          isHit(this.lasers[x]);
          this.lasers[x].draw();
        }
      }

      for (var y = 0; y < this.count.length; y++) {
        this.lasers.splice(this.count[y], 1);
      }

      this.count = [];
    }
    this.shoot = function() {
      this.lasers.push(new beam(this.x + this.width/3, this.y-this.height, 5, 30));
      this.lasers.push(new beam((this.x + 2*this.width/3), this.y-this.height, 5, 30));
    }
  }
  var enemy = function(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width;
    this.draw = function() {
      board.ctx.fillStyle = "#B2423F";
      board.ctx.beginPath();
      board.ctx.fillRect(this.x, this.y, this.width, this.width);
    }
  }
  var beam = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.draw = function() {
      board.ctx.fillStyle = "#9FC061";
      board.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

  }
  var board = {
    scoreCount: 0,
    p1: new shape(50, 450, 50, 50),
    canvas: document.createElement('canvas'),
    enemies: [],
    gameKeys: [false,false,false,false],
    start: function() {

      this.canvas.style.border = "1px solid black";
      this.canvas.width = "500";
      this.canvas.style.backgroundColor = "black";
      this.canvas.height = "500";
      document.body.appendChild(this.canvas);

      if (this.canvas.getContext) {
        this.ctx = this.canvas.getContext('2d');

        window.onkeydown = function(evt) {
          var key = evt.keyCode;

          if (key == 39) {  
            board.gameKeys[2] = true;
          }
          if (key == 37) { 
            board.gameKeys[0] = true;
          }
          if (key == 38) { 
            board.gameKeys[1] = true;
          }
          if (key == 40) { 
            board.gameKeys[3] = true;
          }
          if (key == 32) {
            board.p1.shoot();
          }
        }

        window.onkeyup = function (e) {
          board.gameKeys[e.keyCode-37] = false;
        }

        window.requestAnimationFrame(draw);

      } else {
        alert("This browser does not support canvas");
      }
    }
  }
  var frameCount = 0;

  var hit = function(b, otherobj) {
    var myleft = b.x;
    var myright = b.x + (b.width);
    var mytop = b.y;
    var mybottom = b.y + (b.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    if (!((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))) {
      return true;
    }
    return false;
  }

  var isHit = function(b) {
    for (var x = 0; x < board.enemies.length; x++) {
      var otherobj = board.enemies[x];
      var myleft = b.x;
      var myright = b.x + (b.width);
      var mytop = b.y;
      var mybottom = b.y + (b.height);
      var otherleft = otherobj.x;
      var otherright = otherobj.x + (otherobj.width);
      var othertop = otherobj.y;
      var otherbottom = otherobj.y + (otherobj.height);
      var crash = true;
      if (!((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright))) {
        board.scoreCount++;
        board.enemies.splice(x, 1);
        return;
      }
    }
    return;
  }

  var draw = function() {
    board.ctx.clearRect(0, 0, 500, 500);

    board.p1.draw();

    board.ctx.fillStyle = "white";
    board.ctx.font = "28px Century gothic";
    board.ctx.fillText("Score: " + board.scoreCount, 10, 30);
    var deadEnemies = [];

    for (var x = 0; x < board.enemies.length; x++) {
      board.enemies[x].y += 10;
      if (board.enemies[x].y >= 500) {
        deadEnemies.push(x);
      } else {
        board.enemies[x].draw();
      }
    }
    for (var x = 0; x < deadEnemies.length; x++) {
      board.enemies.splice(0, 1);
    }

    deadEnemies = [];
    if (board.p1.alive) {
      window.requestAnimationFrame(draw);
    } else {
      board.ctx.fillStyle = "white";
      board.ctx.font = "bold 50pt Century Gothic";
      board.ctx.fillText("YOU DIED", 90,250);
    }
  }

  var enemyWaves = setInterval(function() {
    board.enemies.push(new enemy(Math.random() * 450 + 50, 0, 40));
  }, 500)

  board.start();
})();
