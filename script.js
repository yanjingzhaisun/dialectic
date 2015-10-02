// This is a Zed's Game
// =================================================
// TODO list:

// implement story
// implement rythm system (including time calculation)
// implement the connection between story and gameplay()
// implement the shape system()

// =================================================

// final ball color : Alizarin 0xe74c3c
// final backgroud color: #c0392b


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
  var HIT_RED_HALF = 2;
  var HIT_NOTHING = 3;

  //string and status section
  var sGameStatus;
  var sGamePlayingStatus;


  //sprite section
  var spriteBackground;
  var spritePlayerBallw, spritePlayerBallb;
  var groupHitBalls;
  var groupNarrativeBitTextsWhite;
  var groupNarrativeBitTextsBlack;
  var upperScoreBitTexts;
  var lowerScoreBitTexts;


  //collision group
  //var groupHitBallsCollision;
  //var groupPlayerCollision;

  //bool section
  var isMouseInCircle = false;

  //float variables section
  var fMouseAngle = 0;

  //debug variables section
  var debugResult = 'click a body'; 

  //score and story control section
  var Score = [0, 0]; 
  var ballSprite = ['hitBallw', 'hitBallb'];
  var narrativeChangeThreshold = 5;
  var spriteNarrativeBitTextsWhitePositionX = game.width / 2;
  var spriteNarrativeBitTextsWhitePositionY = 200;
  var spriteNarrativeBitTextsBlackPositionX = game.width / 2;
  var spriteNarrativeBitTextsBlackPositionY = 568;


  var bitmapDataTrace;
  var bitmapR,bitmapG,bitmapB;

  function preload () {
    game.load.image('bg', 'assets/image/background3.png');   
    game.load.image('playerw', 'assets/image/whitehalf.png');
    game.load.image('playerb', 'assets/image/blackhalf2.png');
    game.load.image('hitBallw','assets/image/white_ball.png');
    game.load.image('hitBallb','assets/image/black_ball.png');

    game.load.bitmapFont('pixelFont', 'assets/font/pixfont.png', 'assets/font/pixfont.xml');

    bitmapDataTrace = game.add.bitmapData(game.width, game.height);
    bitmapDataTrace.addToWorld();
    bitmapDataTrace.smoothed = false;

    bitmapR = 0; bitmapG = 0; bitmapB = 0;
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
    spriteBackground.anchor.setTo(0.5, 0);
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

    //
    upperScoreBitTexts = game.add.bitmapText(game.world.width/2, game.height - 32 - 4, 'pixelFont', 'white: 0', 32);
    lowerScoreBitTexts = game.add.bitmapText(game.world.width/2, 4, 'pixelFont', 'black: 0', 32);
    upperScoreBitTexts.anchor.x = 0.5;
    lowerScoreBitTexts.anchor.x = 0.5;
    upperScoreBitTexts.tint = 0xFFFFFF;
    lowerScoreBitTexts.tint = 0x000000;
    upperScoreBitTexts.visible = false;
    lowerScoreBitTexts.visible = false;

    createNarrativeBitTexts();
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
    bitmapDataTrace.fill(0, 0, 0,0.4);

    bitmapDataTrace.draw(spriteBackground, spriteBackground.x, spriteBackground.y);
    for (var i = 0; i > groupHitBalls.children.length; i++) {
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
      upperScoreBitTexts.visible = true;
      lowerScoreBitTexts.visible = true;
      Score[0] = 0;
      Score[1] = 0;
      bitmapR = 0;
      bitmapG = 0;
      bitmapB = 0;

      spriteBackground.tint = 0xFFFFFF;
      spritePlayerBallw.tint = 0xFFFFFF;
      //timerEventMakeBall.lastTime = 0;

      game.time.events.repeat(Phaser.Timer.SECOND * 1, 100, timerEventMakeBall, this);
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

    updateGroupHitBalls();
    //timerEventMakeBall();
  }

  function updateGroupHitBalls(){
    for (var i = 0; i < groupHitBalls.children.length; i++) {
      var spriteHitBall = groupHitBalls.children[i];
      var status = updateHitBall(spriteHitBall);
      if (status != HIT_NOTHING) {
        console.log("spriteHitBall [ " + i + " touched the " + status +" half");
        groupHitBalls.remove(spriteHitBall, true);
      }
      updateScore(spriteHitBall,status);
    }
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
    var kind = generateRandomBall();
    var angle = (Math.random() * 2 - 1) * Math.PI;
    makeHitBall(angle, kind);
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
  // when white balls come from bottom, nothing can be seen
  function makeHitBall(angle, kind){
    var posx = game.width /2 * (-1) * Math.cos(angle) + game.width / 2;
    var posy = game.height /2 * (-1) * Math.sin(angle) + game.height / 2;

    if (posy > game.height / 2) kind = WHITE_HITBALL;
    else kind = BLACK_HITBALL;
    var hitBall = groupHitBalls.create(posx, posy, ballSprite[kind]);
    hitBall.anchor.setTo(0.5, 0.5);

    hitBall.kind = kind;

    if ((Score[0] >= narrativeChangeThreshold) && (kind == 0)) {
      hitBall.tint = 0xe74c3c;
    } else if ((Score[0] > narrativeChangeThreshold) && (kind == 1)) {
      hitBall.tint = 0xe74c3c;
    }

    hitBall.body.velocity.x = 160 * Math.cos(angle);
    hitBall.body.velocity.y = 160 * Math.sin(angle);
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
      if (hitBlackHalf.width * hitBlackHalf.height > hitWhiteHalf.width * hitWhiteHalf.height) return HIT_BLACK_HALF;
      else return HIT_WHITE_HALF;
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

  
  function updateNarrativeBitTexts(){
    var current1 = Math.min(Score[0], groupNarrativeBitTextsWhite.children.length - 1);
    groupNarrativeBitTextsWhite.children[current1].visible = true;
    if (current1 > 0) groupNarrativeBitTextsWhite.children[current1 - 1].visible = false;

    var current2 = Math.min(Score[1], groupNarrativeBitTextsBlack.children.length - 1);
    groupNarrativeBitTextsBlack.children[current2].visible = true;
    if (current2 > 0) groupNarrativeBitTextsBlack.children[current2 - 1].visible = false;    
  }

  function updateScore(spriteHitBall, status){
    if (spriteHitBall.kind == status) {
      Score[status] ++;
      if ((status == 0) && (Score[0] == narrativeChangeThreshold + 1)) {
        tweenTint(spriteBackground, 0xFFFFFF, 0xe74c3c, 5000);
        tweenTint(spritePlayerBallw, 0xFFFFFF, 0xe74c3c, 5000);
        upperScoreBitTexts.tint = 0xe74c3c;

      } else {
        game.stage.backgroundColor = '#000000';
      }
      
      console.log("kind " + status + " earn 1 point now");
      updateNarrativeBitTexts();

    }
    if (Score[0] > narrativeChangeThreshold){
      if (upperScoreBitTexts) upperScoreBitTexts.text = "red: " + Score[0];
    } else {
      if (upperScoreBitTexts) upperScoreBitTexts.text = "white: " + Score[0];
    }
    if (lowerScoreBitTexts) lowerScoreBitTexts.text = "black: " + Score[1];
  }

  function tweenTint(obj, startColor, endColor, time) {
    // create an object to tween with our step value at 0
    var colorBlend = {step: 0};

    // create the tween on this object and tween its step property to 100
    var colorTween = game.add.tween(colorBlend).to({step: 100}, time);
    
    // run the interpolateColor function every time the tween updates, feeding it the
    // updated value of our tween each time, and set the result as our tint
    colorTween.onUpdateCallback(function() {
      obj.tint = Phaser.Color.interpolateColor(startColor, endColor, 100, colorBlend.step);   
    });
    
    // set the object to the start color straight away
    obj.tint = startColor;    
    
    // start the tween
    colorTween.start();
}


  function generateRandomBall(){
    return Math.floor(Math.random() + 0.5);
  }



// ===============================================
// Story Line
// ===============================================

  function createNarrativeBitTexts(){
    groupNarrativeBitTextsWhite = game.add.group();
    groupNarrativeBitTextsBlack = game.add.group();

    //0
    var spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //1
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //2
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'They treat me like this.', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //3
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'They treat me like this.', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //4
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'They treat me like this.', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //5
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'They treat me like this.', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    //

    //6 ==  narrativeChangeThreshold + 1;
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'I fall in love.', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    var spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'This is the story score[1] == 0', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'This is the story score[1] == 1', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'This is the story score[1] == 2', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

  }
