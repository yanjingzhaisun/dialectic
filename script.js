
//Creates a new Phaser Game
//You might want to check here to understand the basics of Phaser: http://www.photonstorm.com/phaser/tutorial-making-your-first-phaser-game
                        
var game = new Phaser.Game(800, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

  var sGameStatus;
  var sGamePlayingStatus;
  var spriteBackground;

  var isMouseInCircle = false;

  var fCircleRadium = 100;

  var fMouseAngle = 0;

  function preload () {
    game.load.image('bg', 'assets/image/background.png');    
  }

  function create () {
    // game.physics.startSystem(Phaser.Physics.ARCADE); 
    game.world.setBounds(0, 0, 800, 800);

    spriteBackground = game.add.sprite(game.width/2, game.height/2, 'bg');
    spriteBackground.anchor.setTo(0.5, 0.5);

    spriteBackground.visible = false;

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

  }

  function initialState(){
    if (sGameStatus == 'GAME_MENU') {

    } else if (sGameStatus == 'GAME_PLAYING') {
      spriteBackground.visible = true;
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
    }
  }

  function updateGameOver(){

  }

  function buttonStart(){

  }

  function getIsMouseInCircle(){

    var distance = Math.sqrt(
        ((game.input.mousePointer.x - game.width/2) * (game.input.mousePointer.x - game.width/2)) +
         ((game.input.mousePointer.y - game.height/2) * (game.input.mousePointer.y - game.height/2))
         )
    console.log("Mouse distance is " + distance);
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
