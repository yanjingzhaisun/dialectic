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
  var fHitBallRadium = 27;

  var WHITE_HITBALL = 0;
  var BLACK_HITBALL = 1;

  var HIT_WHITE_HALF = 0;
  var HIT_BLACK_HALF = 1;
  var HIT_RED_HALF = 2;
  var HIT_NOTHING = 3;

  //string and status section
  var sGameStatus;
  var sGamePlayingStatus;
  var counterOpAnimationOnComplete = 0;
  var counterEdAnimationOnComplete = 0;
  var mouseClickCounter = 0;
  var boolMPClickEnable = false;

  //sprite section
  var spriteBackground;
  var spritePlayerBallw, spritePlayerBallb;
  var groupHitBalls;
  var groupNarrativeBitTextsWhite;
  var groupNarrativeBitTextsBlack;
  var upperScoreBitTexts;
  var lowerScoreBitTexts;

  var titleBitText;
  var titleBitText2;
  var instrutionBitText;
  var instrutionBitText2;
  var endTitleBitText1;
  var endTitleBitText2;


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
  var endCondition = 0;
  var Score = [0, 0];
  var ballSprite = ['hitBallw', 'hitBallb'];
  var narrativeChangeThreshold = 50;
  var spriteNarrativeBitTextsWhitePositionX = game.width / 2;
  var spriteNarrativeBitTextsWhitePositionY = 200;
  var spriteNarrativeBitTextsBlackPositionX = game.width / 2;
  var spriteNarrativeBitTextsBlackPositionY = 568;


  var bitmapDataTrace;
  var bitmapR,bitmapG,bitmapB;
  var music;

  function preload () {
    game.load.image('bg', 'assets/image/background3.png');
    game.load.image('playerw', 'assets/image/whitehalf.png');
    game.load.image('playerb', 'assets/image/blackhalf.png');
    game.load.image('hitBallw','assets/image/white_ball.png');
    game.load.image('hitBallb','assets/image/black_ball.png');

    game.load.bitmapFont('pixelFont', 'assets/font/pixfont.png', 'assets/font/pixfont.xml');

    game.load.audio('music', 'assets/sound/1.ogg');

    bitmapDataTrace = game.add.bitmapData(game.width, game.height);
    bitmapDataTrace.addToWorld();
    bitmapDataTrace.smoothed = false;

    bitmapR = 0; bitmapG = 0; bitmapB = 0;
  }

  function create () {
    // game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.physics.startSystem(Phaser.Physics.P2JS);
    game.world.setBounds(0, 0, 800, 800);
    music = game.add.audio('music');
    music.loop = true;
    console.log("music should be added");
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

    titleBitText = game.add.bitmapText(game.world.width/2, spriteNarrativeBitTextsWhitePositionY - 60, 'pixelFont', 'One', 50);
    titleBitText.anchor.x = 0.5;
    titleBitText.tint = 0xFFFFFF;
    titleBitText.visible = false;

    titleBitText2 = game.add.bitmapText(game.world.width/2, spriteNarrativeBitTextsWhitePositionY , 'pixelFont', 'Hundred', 50);
    titleBitText2.anchor.x = 0.5;
    titleBitText2.tint = 0xFFFFFF;
    titleBitText2.visible = false;

    instrutionBitText = game.add.bitmapText(game.world.width / 2, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'click mouse to start',32);
    instrutionBitText.anchor.x = 0.5;
    instrutionBitText.tint = 0x000000;
    instrutionBitText.visible = false;

    instrutionBitText2 = game.add.bitmapText(game.world.width / 2, spriteNarrativeBitTextsBlackPositionY + 32, 'pixelFont', 'move mouse to change the angle',32);
    instrutionBitText2.anchor.x = 0.5;
    instrutionBitText2.tint = 0x000000;
    instrutionBitText2.visible = false;

    endTitleBitText1 = game.add.bitmapText(game.world.width / 2, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'THE', 32);
    endTitleBitText1.anchor.x = 0.5;
    endTitleBitText1.tint = 0xFFFFFF;
    endTitleBitText1.visible = false;

    endTitleBitText2 = game.add.bitmapText(game.world.width / 2, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'END', 32);
    endTitleBitText2.anchor.x = 0.5;
    endTitleBitText2.tint = 0x000000;
    endTitleBitText2.visible = false;

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
    } else if (sGameStatus == 'GAME_OVER_ANIMATION'){
      // game over animation
      updateGameOverAnimation();
    } else {
      //else thing;
    }
  }

  function gameDebugBound(stance){
    game.debug.spriteBounds(stance);
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

    //game.debug.spriteBounds(spritePlayerBallw);
    //game.debug.spriteBounds(spritePlayerBallb);
    //groupHitBalls.forEach(gameDebugBound);
  }

  function destruction() {
    if (sGameStatus == 'GAME_MENU') {

    } else if (sGameStatus == 'GAME_PLAYING') {
      Score[0] = 0;
      Score[1] = 0;
      upperScoreBitTexts.text = "white: " + Score[0];
      lowerScoreBitTexts.text = "black: " + Score[1];
      groupHitBalls.removeAll(true);
      for (var i = 0; i < groupNarrativeBitTextsWhite.children.length; i++) {
        groupNarrativeBitTextsWhite.children[i].visible = false;
      }
      for (var i = 0; i < groupNarrativeBitTextsBlack.children.length; i++) {
        groupNarrativeBitTextsBlack.children[i].visible = false;
      }

      timerMakeBall.stop();
      timerMakeBall.destroy();

    } else if (sGameStatus == 'GAME_OVER') {

    } else if (sGameStatus == 'GAME_OVER_ANIMATION') {
      Score[0] = 0;
      Score[1] = 0;
      upperScoreBitTexts.text = "white: " + Score[0];
      lowerScoreBitTexts.text = "black: " + Score[1];
      groupHitBalls.removeAll(true);
      for (var i = 0; i < groupNarrativeBitTextsWhite.children.length; i++) {
        groupNarrativeBitTextsWhite.children[i].visible = false;
      }
      for (var i = 0; i < groupNarrativeBitTextsBlack.children.length; i++) {
        groupNarrativeBitTextsBlack.children[i].visible = false;
      }

      timerMakeBall.stop();
      timerMakeBall.destroy();
    }
  }

  function initialState(){
    if (sGameStatus == 'GAME_MENU') {
      music.fadeOut(2000);
      
      spriteBackground.tint = 0xFFFFFF;
      spritePlayerBallw.tint = 0xFFFFFF;

      titleBitText.visible = true;
      titleBitText2.visible = true;
      instrutionBitText.visible = true;
      instrutionBitText2.visible = true;
      endTitleBitText1.visible = false;
      endTitleBitText2.visible = false;

      groupNarrativeBitTextsWhite.visible = false;
      groupNarrativeBitTextsBlack.visible = false;


      spriteBackground.visible = true;
      spritePlayerBallw.visible = true;
      spritePlayerBallb.visible = true;
      upperScoreBitTexts.visible = false;
      lowerScoreBitTexts.visible = false;
      spriteBackground.angle = 0;
      spritePlayerBallw.angle = 0;
      spritePlayerBallb.angle = 0;
      counterOpAnimationOnComplete = 0;
      mouseClickCounter = 0;

    } else if (sGameStatus == 'GAME_PLAYING') {
      music.fadeIn(1);
      console.log("music should be played.");
      endCondition = 0;

      endTitleBitText1.visible = false;
      endTitleBitText2.visible = false;

      titleBitText.visible = false;
      titleBitText2.visible = false;
      instrutionBitText.visible = false;
      instrutionBitText2.visible = false;

      groupNarrativeBitTextsWhite.visible = true;
      groupNarrativeBitTextsBlack.visible = true;

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
      upperScoreBitTexts.tint = 0xFFFFFF;
      //timerEventMakeBall.lastTime = 0;

      //game.time.events.repeat(Phaser.Timer.SECOND * 1, 100, timerEventMakeBall, this);
      timerMakeBall = game.time.create(false);
      timerMakeBall.loop(923.076923, timerEventMakeBall, this);
      timerMakeBall.start();

    } else if (sGameStatus == 'GAME_OVER') {
      //music.stop();
      endTitleBitText1.visible = true;
      endTitleBitText2.visible = true;
      titleBitText.visible = false;
      titleBitText2.visible = false;
      instrutionBitText2.visible = false;
      instrutionBitText.visible = false;
      groupNarrativeBitTextsWhite.visible = false;
      groupNarrativeBitTextsBlack.visible = false;

      lowerScoreBitTexts.visible = false;
      upperScoreBitTexts.visible = false;

      // ========================================
      // Ending Material
      // ========================================
      switch(endCondition) {
        case 1:

          break;
        case 2:
          endTitleBitText1.tint = 0xe74c3c;
          break;
        default:

          break;
      }

    } else if (sGameStatus == 'GAME_OVER_ANIMATION'){
      for (var i = 0; i < groupHitBalls.children.length; i++) {
        groupHitBalls.children[i].body.velocity.x = 0;
        groupHitBalls.children[i].body.velocity.y = 0;
        var tween1 = game.add.tween(groupHitBalls.children[i]).to({alpha:0}, 1500, Phaser.Easing.Quadratic.InOut, true);
        tween1.onComplete.add(tweenEdAnimationOnComplete, this);
      }
      groupNarrativeBitTextsWhite.visible = false;
      groupNarrativeBitTextsBlack.visible = false;


      counterEdAnimationOnComplete = 0;
    } else {
      groupNarrativeBitTextsWhite.visible = false;
      groupNarrativeBitTextsBlack.visible = false;

    }
  }

  //update function for status "GAME_MENU"
  function updateGameMenu(){
    if (mouseClickCounter == 0) {
        if (game.input.mousePointer.isDown && boolMPClickEnable) {
            boolMPClickEnable = false;
            mouseClickCounter = 1;
            updateGameMenu_OpAnimation_Initialization();
        }
        if (game.input.mousePointer.isUp) {
          boolMPClickEnable = true;
        }
    }
    if (counterOpAnimationOnComplete >= 3) {
      sGameStatus = 'GAME_PLAYING';
      initialState();
    }
  }

  function updateGameMenu_OpAnimation_Initialization(){
    var tween1 = game.add.tween(spriteBackground).to({angle:180}, 1500, Phaser.Easing.Quadratic.InOut, true);
    tween1.onComplete.add(tweenOpAnimationOnComplete, this);
    var tween2 = game.add.tween(spritePlayerBallw).to({angle:180}, 1500, Phaser.Easing.Quadratic.InOut, true);
    tween2.onComplete.add(tweenOpAnimationOnComplete, this);
    var tween3 = game.add.tween(spritePlayerBallb).to({angle:180}, 1500, Phaser.Easing.Quadratic.InOut, true);
    tween3.onComplete.add(tweenOpAnimationOnComplete, this);
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
    decideEndCondition();


    // ==============================================================
    // Ending termination
    // ==============================================================

    if (endCondition > 0) {
      //destruction();
      sGameStatus = 'GAME_OVER_ANIMATION';
      initialState();
    }
    //timerEventMakeBall();
  }

  function updateGameOverAnimation(){
    if (counterEdAnimationOnComplete >= groupHitBalls.children.length) {
      destruction();
      sGameStatus = 'GAME_OVER';
      initialState();
    }

  }

  function updateGroupHitBalls(){
    for (var i = 0; i < groupHitBalls.children.length; i++) {
      var spriteHitBall = groupHitBalls.children[i];
      var status = updateHitBall(spriteHitBall);
      if (status != HIT_NOTHING) {
        //console.log("spriteHitBall [ " + i + " touched the " + status +" half");
        spriteHitBall.isDiminishing = true;
        spriteHitBall.body.velocity.x = 0;
        spriteHitBall.body.velocity.y = 0;
        //spriteHitBall.scale.setTo(1.5,1.5);
        delayRemoveFromGroup3s(groupHitBalls, spriteHitBall);

        //groupHitBalls.remove(spriteHitBall, true);
        updateScore(spriteHitBall,status);
      }
      
    }
  }

  function updateGameOver(){
    getIsMouseInCircle();
    if (!isMouseInCircle) {
      getMouseAngle();
      //console.log("MouseAngle is " + fMouseAngle);
      //console.log("MousePosition is " + game.input.mousePointer.x + " " + game.input.mousePointer.y);
      spriteBackground.angle = fMouseAngle;
      spritePlayerBallb.angle = fMouseAngle;
      spritePlayerBallw.angle = fMouseAngle;
    }
    if (game.input.mousePointer.isDown && boolMPClickEnable) {
      boolMPClickEnable = false;
      sGameStatus = 'GAME_MENU';
      initialState();
    } 
    if (game.input.mousePointer.isUp) {
      boolMPClickEnable = true;
    }
  }

  function buttonStart(){

  }

  // TODO:
  // rythm things
  function timerEventMakeBall(){
    if (sGameStatus != 'GAME_PLAYING') return;
    //console.log("making timer balls now");
    var kind = generateRandomBall();
    var angle = (Math.random() * 2 - 1) * Math.PI;
    makeHitBall(angle, kind);
    game.world.bringToTop(groupHitBalls);
    game.world.bringToTop(spritePlayerBallw);
    game.world.bringToTop(spritePlayerBallb);
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
    hitBall.isDiminishing = false;
    hitBall.body.setSize(50, 50);

    hitBall.body.velocity.x = 160 * Math.cos(angle);
    hitBall.body.velocity.y = 160 * Math.sin(angle);
  }


  // TODO:
  // update HitBall status, returns:
  // 0: Hit the white part of player's ball;
  // 1: Hit the black part of player's ball;
  // 2: Hit nothing.
  function updateHitBall(spriteHitBall){
    if (spriteHitBall.isDiminishing) return HIT_NOTHING;
    var distance = Math.sqrt(
      ((spriteHitBall.position.x - game.width/2) * (spriteHitBall.position.x - game.width/2)) +
      ((spriteHitBall.position.y - game.height/2) * (spriteHitBall.position.y - game.height/2))
      );

    if (distance > fCircleRadium + fHitBallRadium) return HIT_NOTHING;

    var hitBlackHalf = checkOverlap(spriteHitBall, spritePlayerBallb);
    var hitWhiteHalf = checkOverlap(spriteHitBall, spritePlayerBallw);

    if (hitBlackHalf.width * hitBlackHalf.height > hitWhiteHalf.width * hitWhiteHalf.height) return HIT_BLACK_HALF;
    else return HIT_WHITE_HALF;

    
  }


  // check whether 2 sprites' bounds get intersects.
  function checkOverlap(spriteA, spriteB){
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    var output;

    return Phaser.Rectangle.intersection(boundsA, boundsB);
  }


  function updateNarrativeBitTexts(){
    var current1 = Math.min(Score[0], groupNarrativeBitTextsWhite.children.length - 1);
    //console.log("Current1 is " + current1);

    groupNarrativeBitTextsWhite.children[current1].visible = true;
    if (current1 > 0) groupNarrativeBitTextsWhite.children[current1 - 1].visible = false;

    var current2 = Math.min(Score[1], groupNarrativeBitTextsBlack.children.length - 1);
    //console.log("Current2 is " + current2);
    groupNarrativeBitTextsBlack.children[current2].visible = true;
    if (current2 > 0) groupNarrativeBitTextsBlack.children[current2 - 1].visible = false;
  }

  function updateScore(spriteHitBall, status){
    if (status == HIT_NOTHING) return;
    if (spriteHitBall.kind == status) {
      Score[status] ++;

      game.add.tween(spriteHitBall.scale).to({x : 0.8}, 1000, "Linear", true);
      game.add.tween(spriteHitBall.scale).to({y : 0.8}, 1000, "Linear", true); 
      delayInvisible(spriteHitBall, 1000);
      //game.add.tween(spriteHitBall).to({alpha : 0}, 1000, "Linear", true);
      game.add.tween(spriteHitBall).to({x: game.width /2}, 1500, Phaser.Easing.Quadratic.InOut, true);
      game.add.tween(spriteHitBall).to({y: game.width /2}, 1500, Phaser.Easing.Quadratic.InOut, true);
      if ((status == 0) && (Score[0] == narrativeChangeThreshold + 1)) {
        tweenTint(spriteBackground, 0xFFFFFF, 0xe74c3c, 5000);
        tweenTint(spritePlayerBallw, 0xFFFFFF, 0xe74c3c, 5000);
        upperScoreBitTexts.tint = 0xe74c3c;

      } else {
        game.stage.backgroundColor = '#000000';
      }

      //console.log("kind " + status + " earn 1 point now");
      updateNarrativeBitTexts();

    } else {
      game.add.tween(spriteHitBall.scale).to({x : 1.5}, 1000, "Linear", true);
      game.add.tween(spriteHitBall.scale).to({y : 1.5}, 1000, "Linear", true); 
      game.add.tween(spriteHitBall).to({alpha : 0}, 1000, "Linear", true);

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

function tweenOpAnimationOnComplete(){
  counterOpAnimationOnComplete += 1;
}

function tweenEdAnimationOnComplete(){
  counterEdAnimationOnComplete += 1;
  //console.log("counterEdAnimationOnComplete is " + counterEdAnimationOnComplete);
}

function delayRemoveFromGroup3s(group, stance){
  game.time.events.add(3000, function(){
      group.remove(stance, true);
    }, 
    this);
}

function delayInvisible(stance, delayTime) {
  game.time.events.add(delayTime, function(){
    stance.visible = false;
  },
  this);
}


  function generateRandomBall(){
    return Math.floor(Math.random() + 0.5);
  }

  function decideEndCondition(){
    if (Score[0] + Score[1] >= 100) {
      endCondition = 1; 
      if (Score[0] > narrativeChangeThreshold) endCondition = 2;
    }
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
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //3
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //4
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //5
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;
    

    //6
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //7
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //8
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //9
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //10
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //11
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //12
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //13
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //14
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //15
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //16
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //17
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //18
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //19
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //20
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Things happen around me", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //21
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //22
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //23
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //24
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //25
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //26
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //27
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //28
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //29
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //30
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Swallowing me, like the sea", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //31
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //32
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //33
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //34
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //35
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //36
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //37
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //38
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //39
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //40
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Nobody is my friend", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //41
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //42
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //43
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //44
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //45
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //46
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //47
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //48
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //49
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //50
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', "Everything is boring in my life", 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xFFFFFF;

    //51 ==  narrativeChangeThreshold + 1;
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //52
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //53
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //54
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //55
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //56
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //57
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //58
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //59
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //60
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'Until she goes into my life', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //61
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //62
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //63
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //64
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //65
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //66
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //67
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //68
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //69
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //70
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will be with me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //71
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //72
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //73
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //74
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //75
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //76
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //77
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //78
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //79
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //80
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she can see the future of us', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //81
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //82
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //83
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //84
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //85
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //86
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //87
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //88
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //89
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //90
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says we should marry', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //91
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will marry me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //92
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will marry me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //93
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will marry me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //94
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will marry me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //95
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will marry me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //96
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will marry me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //97
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will marry me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //98
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'She says she will marry me', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //99
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'But she lied.', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;

    //100
    spriteNarrativeBitTextsWhite = game.add.bitmapText(spriteNarrativeBitTextsWhitePositionX, spriteNarrativeBitTextsWhitePositionY, 'pixelFont', 'But she lied.', 32);
    groupNarrativeBitTextsWhite.add(spriteNarrativeBitTextsWhite);
    spriteNarrativeBitTextsWhite.visible = false;
    spriteNarrativeBitTextsWhite.anchor.x = 0.5;
    spriteNarrativeBitTextsWhite.tint = 0xe74c3c;















    // ========================================================
    // Black story
    // ========================================================
    //1
    var spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //2
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //3
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //4
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //5
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //6
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;


    //7
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;


    //8
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;


    //9
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;


    //10
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', '', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //11
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //12
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //13
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //14
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //15
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //16
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //17
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //18
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //19
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //20
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I don't know what should I do", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //21
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //22
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //23
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //24
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //25
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //26
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //27
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //28
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //29
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //30
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "and I'm afraid of future", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //31
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //32
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //33
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //34
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;


    //35
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //36
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //37
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //38
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //39
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //40
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', 'I wish I can be alone', 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //41
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //42
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //43
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //44
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //45
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //46
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //47
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //48
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //49
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //50
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "But I'm scared of being lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //51
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //52
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //53
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //54
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //55
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //56
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //57
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //58
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //59
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //60
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "How can I stop this feeling?", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //61
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //62
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //63
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //64
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //65
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //66
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //67
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.tint = 0x000000;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;

    //68
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //69
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //70
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I start to talk to myself", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //71
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //72
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //73
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //74
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //75
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //76
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //77
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //78
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //79
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //80
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I still feel lonely", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //81
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //82
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //83
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //84
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //85
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //86
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //87
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //88
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //89
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //90
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I can't stop this", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //91
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "Finally I come up with something", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //92
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "Finally I come up with something", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //93
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "Finally I come up with something", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //94
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "Finally I come up with something", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //95
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "Finally I come up with something", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //96
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "Finally I come up with something", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //97
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "Finally I come up with something", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //98
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "Finally I come up with something", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //99
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I decide to kill myself.", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;

    //100
    spriteNarrativeBitTextsBlack = game.add.bitmapText(spriteNarrativeBitTextsBlackPositionX, spriteNarrativeBitTextsBlackPositionY, 'pixelFont', "I decide to kill myself.", 32);
    groupNarrativeBitTextsBlack.add(spriteNarrativeBitTextsBlack);
    spriteNarrativeBitTextsBlack.visible = false;
    spriteNarrativeBitTextsBlack.anchor.x = 0.5;
    spriteNarrativeBitTextsBlack.tint = 0x000000;
  }
