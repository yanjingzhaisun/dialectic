
//Creates a new Phaser Game
//You might want to check here to understand the basics of Phaser: http://www.photonstorm.com/phaser/tutorial-making-your-first-phaser-game
                        
var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

  //constant section
  var fCircleRadium = 100;
  var fHitBallRadium = 25;

  var WHITE_HITBALL = 0;
  var BLACK_HITBALL = 1;

  var HIT_WHITE_HALF = 0;
  var HIT_BLACK_HALF = 1;
  var HIT_NOTHING = 2;

  //string and status section
  var sGameStatus;
  var sGamePlayingStatus;


  //sprite section
  var spriteBackground;
  var spritePlayerBallw, spritePlayerBallb;
  var groupHitBalls;

  //collision group
  //var groupHitBallsCollision;
  //var groupPlayerCollision;

  //bool section
  var isMouseInCircle = false;

  //float variables section
  var fMouseAngle = 0;

  //debug variables section
  var debugResult = 'click a body'; 


  var bitmapDataTrace;

  function preload () {
    game.load.image('bg', 'assets/image/background2.png');   
    game.load.image('playerw', 'assets/image/whitehalf.png');
    game.load.image('playerb', 'assets/image/blackhalf2.png');
    game.load.image('hitBallw','assets/image/white_ball.png');
    game.load.image('hitBallb','assets/image/black_ball.png');

    bitmapDataTrace = game.add.bitmapData(game.width, game.height);
    bitmapDataTrace.addToWorld();
    bitmapDataTrace.smoothed = false;
  }

  function create () {
    // game.physics.startSystem(Phaser.Physics.ARCADE); 
    //game.physics.startSystem(Phaser.Physics.P2JS);
    game.world.setBounds(0, 0, 800, 800);
    //game.physics.p2.setImpactEvents(true);

    //collision group
    //groupHitBallsCollision = game.physics.p2.createCollisionGroup();
    //groupPlayerCollision = game.physics.p2.createCollisionGroup();

    //create sprites.
    spriteBackground = game.add.sprite(game.width/2, game.height/2, 'bg');
    spriteBackground.anchor.setTo(0.5, 0.5);
    spriteBackground.visible = false;

    spritePlayerBallw = game.add.sprite(game.width/2, game.height/2, 'playerw');
    spritePlayerBallw.anchor.setTo(0.5, 1);
    spritePlayerBallw.visible = false;

    spritePlayerBallb = game.add.sprite(game.width/2, game.height/2, 'playerb');
    spritePlayerBallb.anchor.setTo(0.5, 0);
    spritePlayerBallb.visible = false;

    //set groups
    groupHitBalls = game.add.group();
    groupHitBalls.enableBody = true;


    sGameStatus = 'GAME_MENU'; 
    initialState();
  }

  function update(){
    if (sGameStatus == 'GAME_MENU') {
      //Start menual
      updateGameMenu();  
    } else if (sGameStatus == 'GAME_PLAYING'){
      //main game. much detailed status machine needed.
      updateGamePlaying();
    } else if (sGameStatus == 'GAME_OVER') {
      //game over menu staff
      updateGameOver();
    } else {
      //else thing;
    }
  }

  //using for debug
  function render(){
    //game.debug.text(debugResult, 32, 32);
    bitmapDataTrace.fill(0,0,0,0.1);
    //bitmapDataTrace.draw(spriteBackground, spriteBackground.x, spriteBackground.y);
    for (var i =0; i > groupHitBalls.children.length; i++) {
      bitmapDataTrace.draw(groupHitBalls.children[i], groupHitBalls.children[i].x, groupHitBalls.children[i].y);
    }
    bitmapDataTrace.draw(spritePlayerBallb, spritePlayerBallb.x, spritePlayerBallb.y);
    bitmapDataTrace.draw(spritePlayerBallw, spritePlayerBallw.x, spritePlayerBallw.y);
    //if (groupHitBalls.children.length > 0) game.debug.body(groupHitBalls.children[0]);
    //game.debug.body(spritePlayerBallb);
    //game.debug.body(spritePlayerBallw);
  }

  function initialState(){
    if (sGameStatus == 'GAME_MENU') {

    } else if (sGameStatus == 'GAME_PLAYING') {
      spriteBackground.visible = true;
      spritePlayerBallb.visible = true;
      spritePlayerBallw.visible = true;
      //timerEventMakeBall.lastTime = 0;

      game.time.events.repeat(Phaser.Timer.SECOND * 4, 10, timerEventMakeBall, this);
    } else if (sGameStatus == 'GAME_OVER') {

    } else {

    }
  }

  //update function for status "GAME_MENU"
  function updateGameMenu(){
    sGameStatus = 'GAME_PLAYING';
    initialState();
  }

  //update function for status "GAME_PLAYING"
  function updateGamePlaying(){
    getIsMouseInCircle();
    if (!isMouseInCircle) {
      getMouseAngle();
      //console.log("MouseAngle is " + fMouseAngle);
      //console.log("MousePosition is " + game.input.mousePointer.x + " " + game.input.mousePointer.y);
      spriteBackground.angle = fMouseAngle;
      spritePlayerBallb.angle = fMouseAngle;
      spritePlayerBallw.angle = fMouseAngle;
    }

    for (var i = 0; i < groupHitBalls.children.length; i++) {
      var spriteHitBall = groupHitBalls.children[i];
      var status = updateHitBall(spriteHitBall);
      if (status != HIT_NOTHING) {
        console.log("spriteHitBall [ " + i + " touched the " + status +" half");
        groupHitBalls.remove(spriteHitBall, true);
      }
    }
    //timerEventMakeBall();
  }

  function updateGameOver(){

  }

  function buttonStart(){

  }

  // TODO:
  // rythm things
  function timerEventMakeBall(){
    if (sGameStatus != 'GAME_PLAYING') return;
    console.log("making timer balls now");
    makeHitBall(0, 0);
  }


  // get whether mouse is in the player's circle
  function getIsMouseInCircle(){

    var distance = Math.sqrt(
        ((game.input.mousePointer.x - game.width/2) * (game.input.mousePointer.x - game.width/2)) +
         ((game.input.mousePointer.y - game.height/2) * (game.input.mousePointer.y - game.height/2))
         )
    //console.log("Mouse distance is " + distance);
    if (distance < fCircleRadium) {
      isMouseInCircle = true;
      return true;
    } else {
      isMouseInCircle = false;
      return false;
    }

  }

  //get Mouse Angle, in order to change the direction of player's ball;
  function getMouseAngle(){
    fMouseAngle = Math.atan2(game.input.mousePointer.y - game.height / 2, game.input.mousePointer.x - game.width / 2) * (180 / Math.PI);

    return fMouseAngle;
  }

  // TODO: 
  // emerge positions
  // hitball color
  // set speed 
  function makeHitBall(posx, posy){
    var hitBall = groupHitBalls.create(posx, posy, 'hitBallb');
    hitBall.anchor.setTo(0.5, 0.5);

    hitBall.kind = BLACK_HITBALL;

    hitBall.body.velocity.x = 40;
    hitBall.body.velocity.y = 40;
  }


  // TODO:
  // update HitBall status, returns:
  // 0: Hit the white part of player's ball;
  // 1: Hit the black part of player's ball;
  // 2: Hit nothing.
  function updateHitBall(spriteHitBall){
    var distance = Math.sqrt(
      ((spriteHitBall.position.x - game.width/2) * (spriteHitBall.position.x - game.width/2)) +
      ((spriteHitBall.position.y - game.height/2) * (spriteHitBall.position.y - game.height/2))
      );

    if (distance > fCircleRadium + fHitBallRadium) return HIT_NOTHING;

    var hitBlackHalf = checkOverlap(spriteHitBall, spritePlayerBallb);
    var hitWhiteHalf = checkOverlap(spriteHitBall, spritePlayerBallw);

    if ((hitBlackHalf) && (hitWhiteHalf)) {
      if (spriteHitBall.kind == BLACK_HITBALL) return HIT_WHITE_HALF;
      else if (spriteHitBall.kind == WHITE_HITBALL) return HIT_BLACK_HALF;
    }

    if (hitBlackHalf) return HIT_BLACK_HALF;
    else if (hitWhiteHalf) return HIT_WHITE_HALF;
  }


  // check whether 2 sprites' bounds get intersects.
  function checkOverlap(spriteA, spriteB){
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
  }
