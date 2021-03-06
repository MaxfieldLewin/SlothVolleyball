(function(){
	if (window.SlothVolleyball === undefined) {
		window.SlothVolleyball= {};
	};

	var Game = SlothVolleyball.Game = function (dim_x ,dim_y, num_players) {
		this.DIM_X = dim_x;
		this.DIM_Y = dim_y;
		this.NUM_PLAYERS = num_players;
		this.paused = true;
		this.roundTimeout = false;
		this.gameOverScreen = false;

		this.leftPoints = 0;
		this.rightPoints = 0;

		this.net = new SlothVolleyball.Net(10, this);
		this.resetObjects();
	};


	Game.prototype.resetObjects = function(){
		this.ball = new SlothVolleyball.Ball([this.DIM_X/2, this.DIM_Y/2], this);
		this.sloths = [];
		this.sloths.push( new SlothVolleyball.Sloth(true, [0 + (this.DIM_X/4), this.DIM_Y], this));
		this.sloths.push( new SlothVolleyball.Sloth(false, [this.DIM_X - (this.DIM_X/4), this.DIM_Y], this));
	}

  Game.prototype.allObjects = function() {
    return [this.ball].concat(this.sloths);
  }

	Game.prototype.draw = function(ctx) {
		ctx.clearRect(0, 0, this.DIM_X, this.DIM_Y);

		this.net.draw(ctx);
		this.allObjects().forEach( function(obj){
			obj.draw(ctx);
		});

		if (this.paused){
			ctx.fillStyle = 'rgba(225,225,225,0.5)';
			ctx.fillRect(0, 0, this.DIM_X, this.DIM_Y);
			ctx.font = "40px Arial";
			ctx.fillStyle = "black";
			ctx.textAlign = "center";
			ctx.fillText("Press space to unpause", this.DIM_X/2, this.DIM_Y/2);
		}

		if (this.gameOverScreen){
			ctx.font = "40px Arial";
			ctx.fillStyle = "black";
			ctx.textAlign = "center";
			ctx.fillText(this.gameWinner + " player wins!", this.DIM_X/2, this.DIM_Y/2);
		}
	};

	Game.prototype.moveObjects = function(){
		this.allObjects().forEach( function(obj){
			obj.move();
		});
	};

	Game.prototype.checkCollisions = function(){
		var objects = this.allObjects();
		for(var i = 0; i < objects.length - 1; i++){
			for(var j = i + 1; j < objects.length; j++){
				if (objects[i].isCollidedWith(objects[j])){
					objects[i].collideWith(objects[j]);
				};
			};
		};
	};

	Game.prototype.step = function(){
		this.checkPause();
		if (!this.paused){
			if (this.roundOver()){
				if(!this.roundTimeout){
					this.updateRoundState();
					if(!this.gameOver()){
						this.roundTimeout = true;
						window.setTimeout(function(){
							this.roundTimeout = false;
							this.resetObjects();
						}.bind(this), 3000)
					}
				}
			};

			if (this.gameOver()){
				this.gameOverScreen = true;
			}

			this.checkInputs();
			this.moveObjects();
		}
	};

	Game.prototype.roundOver = function(){
		return this.ball.atGround();
	};

	Game.prototype.updateRoundState = function(){
		if (this.ball.pos.x < this.DIM_X/2) {
			this.rightPoints += 1;
		} else {
			this.leftPoints += 1;
		}
	};

	Game.prototype.gameOver = function(){
		if (this.leftPoints > 3){
			this.gameWinner = "Left";
			return true;
		} else if (this.rightPoints > 3){
			this.gameWinner = "Right";
			return true;
		} else {
			return false;
		}
	};

	Game.prototype.outOfBounds = function (pos) {
		if(pos.x > this.DIM_X ||
			 pos.x < 0 ||
			 pos.y > this.DIM_Y ||
			 pos.y < 0) {
				return true;
			} else {
				return false;
			};
	};

	Game.prototype.checkPause = function(){
		if(key.isPressed("space")){
			(this.paused === true) ? (this.paused = false) : (this.paused = true);
		}
	}

	Game.prototype.checkInputs = function(){
		if(key.isPressed("A")){
			this.sloths[0].moveLeft();
		};

		if(key.isPressed("D")){
			this.sloths[0].moveRight();
		}

		if(key.isPressed("W")){
			this.sloths[0].jump();
		};

		if(key.isPressed("left")){
			this.sloths[1].moveLeft();
		};

		if(key.isPressed("right")){
			this.sloths[1].moveRight();
		}

		if(key.isPressed("up")){
			this.sloths[1].jump();
		};
	};

})();
