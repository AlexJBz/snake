let game = {
    pixi: new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x740574,
        antialias: false,
        resolution: 1
    }),
    colours: {
        white: 0xFFFFFF,
        black: 0x000000,
        red: 0xCC0E00,
        green: 0x4FD936
    },
    settings: {
        width: 20,
        length: 20,
        tileSize: 25,
    },
    mapClass: class Map extends PIXI.Graphics {
        constructor(width, length) {
            super();
            this.xWidth = width;
            this.yLength = length;
            this.draw();
            this.position.set(-this.width / 2, -this.height / 2);
        }

        draw () {
            for (let x = 0; x < this.xWidth; x++) {
                for (let y = 0; y < this.yLength; y++) {
                    this.addChild(new game.tileClass());
                    this.children[this.children.length - 1].position.set(x * game.settings.tileSize, y * game.settings.tileSize);
                }
            }
        }
    },
    tileClass: class Tile extends PIXI.Graphics {
        constructor(startX, startY) {
            super();
            this.startX = startX;
            this.startY = startY;
            this.draw();
        }

        draw () {
            this.moveTo(0, 0)
                .lineStyle(1, game.colours.black)
                .beginFill(game.colours.white)
                .lineTo(game.settings.tileSize, 0) 
                .lineTo(game.settings.tileSize, game.settings.tileSize)
                .lineTo(0, game.settings.tileSize)
                .lineTo(0, 0)
        }
    },
    snakeClass: class Snake extends PIXI.Graphics {
        constructor() {
            super();
            this.parts = [ {x: 0, y: 0 } ];
            this.moveX = 0;
            this.moveY = 0;
            this.draw();
        }

        draw () {
            this.clear();
            this.parts.forEach(part => {
                this.lineStyle(1, game.colours.red)
                    .beginFill(game.colours.red)
                    .drawRect(part.x * game.settings.tileSize + 1, part.y * game.settings.tileSize + 1, game.settings.tileSize - 2, game.settings.tileSize - 2)
                    .endFill();
            });
        }
        
        addPart () {
            let tail = this.parts[this.parts.length - 1];
            this.parts.push({ x: tail.x, y: tail.y })
        }

        move () {
            let head = this.parts[0];
            let tail = this.parts.pop();
            if (this.moveX != 0 || this.moveY != 0) {
                tail.x = head.x + this.moveX;
                tail.y = head.y + this.moveY;
            }
            this.parts.unshift(tail);
            if (this.checkCollisions()) {
                this.draw();
            } else {
                console.log('Game over!');
                clearInterval(game.loop);
            }
        }

        checkCollisions () {
            let head = this.parts[0];
            let tail = this.parts[this.parts.length - 1];
            if (head.x == tail.x && head.y == tail.y && this.parts.length > 1) {
                return false;
            }
            if (head.x >= game.settings.width || head.y >= game.settings.length || head.x < 0 || head.y < 0) {
                return false;
            }
            // Literally impossible to hit yourself if you are smaller than 4
            let hitSelf = false;
            if (this.parts.length > 4) {
                this.parts.forEach(part => {
                    if (part != tail && part != head) {
                        if (part.x == head.x && part.y == head.y) {
                            hitSelf = true;
                        }
                    }
                });
            }
            if (hitSelf) {
                return false;
            }
            // Found food!
            if (this.checkFood(head, game.food)) {
                this.addPart();
                game.food.placeFood();
            }
            return true;
        }

        checkFood(head, food) {
            if (head.x == food.pos.x && head.y == food.pos.y) {
                return true;
            }
        }

        changeDirection(keyCode) {
            if (!this.dirLock) {
                switch(keyCode) {
                    case 37:
                        if (this.moveX == 0) {
                            this.moveX = -1;
                            this.moveY = 0;
                        }
                        break;
                    case 38:
                        if (this.moveY == 0) {
                            this.moveX = 0;
                            this.moveY = -1;
                        }
                        break;
                    case 39:
                        if (this.moveX == 0) {
                            this.moveX = 1;
                            this.moveY = 0;
                        }
                        break;
                    case 40:
                        if (this.moveY == 0) {
                            this.moveX = 0;
                            this.moveY = 1;
                        }
                        break;
                    default:
                        // Oi stop playing with the console
                        console.log('Cheeky!')
                        break;
                }
                this.dirLock = true;
            }
        }

        isSnakeOnCoord(x, y) {
            let onCoord = false;
            this.parts.forEach(part => {
                if (part.x == x && part.y == y) {
                    onCoord = true;
                }
            });
            return onCoord;
        }
    },
    foodClass: class Food extends PIXI.Graphics {
        constructor() {
            super();
            this.pos = { x: null, y: null };
            this.placeFood();
        }

        draw () {
            this.clear();
            this.lineStyle(1, game.colours.green)
                .beginFill(game.colours.green)
                .drawRect(this.pos.x * game.settings.tileSize + 1, this.pos.y * game.settings.tileSize + 1, game.settings.tileSize - 2, game.settings.tileSize - 2)
                .endFill();
        }

        placeFood () {
            let randomX = Math.floor(Math.random() * game.settings.width);
            let randomY = Math.floor(Math.random() * game.settings.length);
            if (game.snake.isSnakeOnCoord(randomX, randomY)) {
                this.placeFood();
            } else {
                this.pos.x = randomX;
                this.pos.y = randomY;
                this.draw();
            }
        }
    },
    map: null,
    snake: null,
    loop: null,
    food: null,
    positioning () {
        window.addEventListener('resize', ()=> {
            this.position();
        });
    },
    position() {
        this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
        this.pixi.stage.position.set(window.innerWidth / 2, window.innerHeight / 2);
    },
    init () {
        document.body.appendChild(this.pixi.renderer.view);
        this.position();
        this.positioning();
        this.map = new this.mapClass(this.settings.width, this.settings.length);
        this.snake = new this.snakeClass();
        this.pixi.stage.addChild(this.map);
        this.snake = new this.snakeClass();
        this.map.addChild(this.snake);
        this.food = new this.foodClass();
        this.map.addChild(this.food);

        window.addEventListener('keyup', (e)=> {
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                this.snake.changeDirection(e.keyCode);
            }
        });

        game.loop = setInterval(()=> {
            game.snake.move();
            game.snake.dirLock = false;
        }, 100);
    }
}

game.init();