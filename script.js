
//Creates a new Phaser Game
//You might want to check here to understand the basics of Phaser: http://www.photonstorm.com/phaser/tutorial-making-your-first-phaser-game
                        
var game = new Phaser.Game(500, 500, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

  var sGameStatus;

  function preload () {    
  }

  function create () {
    // game.physics.startSystem(Phaser.Physics.ARCADE); 
    sGameStatus = 'GAME_MENU'; 
  }

  function update(){
    if (sGameStatus == 'GAME_MENU') {

    }
    else {}
  }

  function render(){

  }
