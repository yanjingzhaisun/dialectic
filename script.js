
//Creates a new Phaser Game
//You might want to check here to understand the basics of Phaser: http://www.photonstorm.com/phaser/tutorial-making-your-first-phaser-game
                        
var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

  //constant section
  var fCircleRadium = 100;
  var fHitBallRadium = 25;

  //string and status section
  var sGameStatus;
  var sGamePlayingStatus;


  //sprite section
  var spriteBackground;
  var spritePlayerBall;
  var groupHitBalls;

  //collision group
  var groupHitBallsCollision;
  var groupPlayerCollision;

  //bool section
  var isMouseInCircle = false;

  //float variables section
  var fMouseAngle = 0;

  //debug variables section
  var debugResult = 'click a body'; 


  function preload () {
    game.load.image('bg', 'assets/image/background.png');   
    game.load.image('player', 'assets/image/ball.png');
    game.load.image('hitBallw','assets/image/white_ball.png');
    game.load.image('hitBallb','assets/image/black_ball.png');
  }

  function create () {
    // game.physics.startSystem(Phaser.Physics.ARCADE); 
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.world.setBounds(0, 0, 800, 800);
    game.physics.p2.setImpactEvents(true);

    //collision group
    groupHitBallsCollision = game.physics.p2.createCollisionGroup();
    groupPlayerCollision = game.physics.p2.createCollisionGroup();

    //create sprites.
    spriteBackground = game.add.sprite(game.width/2, game.height/2, 'bg');
    spriteBackground.anchor.setTo(0.5, 0.5);
    spriteBackground.visible = false;

    spritePlayerBall = game.add.sprite(game.width/2, game.height/2, 'player');
    spritePlayerBall.anchor.setTo(0.5, 0.5);
    spritePlayerBall.visible = false;

    //set groups
    groupHitBalls = game.add.group();
    groupHitBalls.enableBody = true;
    groupHitBalls.physicsBodyType = Phaser.Physics.P2JS;


    //set player body and collides
    game.physics.p2.enable(spritePlayerBall);
    spritePlayerBall.body.setCircle(100);
    spritePlayerBall.body.fixedRotation = true;
    spritePlayerBall.body.setCollisionGroup(groupPlayerCollision);
    spritePlayerBall.body.collides(groupHitBallsCollision, actionGetCollided, this);

    //debug
    game.input.onDown.add(debugClick, this);

    //initialization
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

  function render(){
    game.debug.text(debugResult, 32, 32);
  }

  function initialState(){
    if (sGameStatus == 'GAME_MENU') {

    } else if (sGameStatus == 'GAME_PLAYING') {
      spriteBackground.visible = true;
      spritePlayerBall.visible = true;
      //timerEventMakeBall.lastTime = 0;

      game.time.events.repeat(Phaser.Timer.SECOND * 4, 10, timerEventMakeBall, this);
    } else if (sGameStatus == 'GAME_OVER') {

    } else {

    }
  }

  function updateGameMenu(){
    sGameStatus = 'GAME_PLAYING';
    initialState();
  }

  function updateGamePlaying(){
    getIsMouseInCircle();
    if (!isMouseInCircle) {
      getMouseAngle();
      //console.log("MouseAngle is " + fMouseAngle);
      //console.log("MousePosition is " + game.input.mousePointer.x + " " + game.input.mousePointer.y);
      spriteBackground.angle = fMouseAngle;
      spritePlayerBall.angle = fMouseAngle;
    }
    //timerEventMakeBall();
  }

  function updateGameOver(){

  }

  function buttonStart(){

  }

  // todo:
  // rythm things
  function timerEventMakeBall(){
    if (sGameStatus != 'GAME_PLAYING') return;
    console.log("making timer balls now");
    makeHitBall(0, 0);
  }

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

  function getMouseAngle(){
    fMouseAngle = Math.atan2(game.input.mousePointer.y - game.height / 2, game.input.mousePointer.x - game.width / 2) * (180 / Math.PI);

    return fMouseAngle;
  }

  // todo: 
  // emerge positions
  // hitball color
  // set speed 
  function makeHitBall(posx, posy){
    var hitBall = groupHitBalls.create(posx, posy, 'hitBallb');
    hitBall.anchor.setTo(0.5, 0.5);
    hitBall.body.setCircle(fHitBallRadium);
    hitBall.body.setCollisionGroup(groupHitBallsCollision);
    hitBall.body.collides(groupPlayerCollision);
    
    // todo:
    // curious thing is hitBall.body.speed generally lower and lower
    hitBall.body.velocity.x = 40;
    hitBall.body.velocity.y = 40;
  }

  // todo:
  // rightnow just print that it is collided.
  function actionGetCollided(body1, body2){
    //body1 is player, body2 is hitball
    console.log("get hit");

    //body2.sprite is indeed in the groupHitBalls
    groupHitBalls.remove(body2.sprite, true);
    //console.log("and after the remove the new length is " + groupHitBalls.length);

  }


  // debug functions section
  function debugClick(pointer){
    var bodies = game.physics.p2.hitTest(pointer.position, [spritePlayerBall]);
    if (bodies.length == 0) {
      debugResult = "You didn't click a body.";
    } else {
      debugResult = "You clicked: ";
      for (var i = 0; i < bodies.length; i++) {
        debugResult += bodies[i].parent.sprite.key;
        if (i < bodies.length - 1) debugResult += ',';
      } 
    }
  }

