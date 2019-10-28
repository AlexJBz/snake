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
        red: 0xCC0E00
    },
    settings: {
        width: 50,
        length: 40,
<<<<<<< HEAD
        tileSize: 15
=======
        tileSize: 15,
>>>>>>> 2fbc6e3add3c494b6010b69dfd2225d6ad5e4ebd
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
<<<<<<< HEAD
            this.length = 0;
            this.addLength();
        }

        addLength () {
            this.length++;
            this.addChild(new game.partClass());
        }

        move (key) {
            switch (key) {
                case 37:
                    console.log('left');
                    break;
                case 38:
                    console.log('up');
                    break;
                case 39:
                    console.log('right');
                    break;
                case 40:
                    console.log('down');
=======
            this.parts = [ {x: 0, y: 0 } ];
            this.moveX = 0;
            this.moveY = 0;
            this.draw();
        }

        draw () {
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
                this.clear();
                this.draw();
            } else {
                console.log('Game over!');
                clearInterval(game.loop);
            }
        }

        checkCollisions () {
            let head = this.parts[0];
            let tail = this.parts[this.parts.length - 1];
            if (head.x >= game.settings.width || head.y >= game.settings.length || head.x < 0 || head.y < 0) {
                return false;
            }
            let hitSelf = false;
            this.parts.forEach(part => {
                if (head != part && part.x != tail.x && part.y != tail.y) {
                    if (head.x == part.x && head.y == part.y) {
                        console.log('snake hit itself')
                        hitSelf = true;
                    }
                }
            });
            if (hitSelf == true) {
                return false;
            }
            return true;
        }

        changeDirection(keyCode) {
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
>>>>>>> 2fbc6e3add3c494b6010b69dfd2225d6ad5e4ebd
                    break;
            }
        }
    },
<<<<<<< HEAD
    partClass: class Part extends PIXI.Graphics {
        constructor() {
            super();
            this.draw();
        }

        draw () {
            this.moveTo(-1, 0)
                .beginFill(0xFF0000)
                .lineStyle(1, 0xFf0000)
                .lineTo(game.settings.tileSize - 1, 0)
                .lineTo(game.settings.tileSize - 1, game.settings.tileSize)
                .lineTo(-1, game.settings.tileSize)
                .lineTo(-1, 0)
                .endFill();
        }

        move (x, y) {
            let pixelX = x * game.settings.tileSize;
            let pixelY = y * game.settings.tileSize;
            this.position.x += pixelX;
            this.position.y += pixelY;
        }

    },
    map: null,
    snake: null,
=======
    map: null,
    snake: null,
    loop: null,
>>>>>>> 2fbc6e3add3c494b6010b69dfd2225d6ad5e4ebd
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
<<<<<<< HEAD
        this.pixi.stage.addChild(this.snake);
        window.addEventListener('keyup', (e)=> {
            let key = e.keyCode;
            if (key >= 37 && key <= 40) {
                this.snake.move(key);
            }
        });
=======
        this.snake = new this.snakeClass();
        this.map.addChild(this.snake);

        window.addEventListener('keyup', (e)=> {
            if (e.keyCode >= 37 && e.keyCode <= 40) {
                this.snake.changeDirection(e.keyCode);
            }
        });

        game.loop = setInterval(()=> {
            game.snake.move();
        }, 150);
>>>>>>> 2fbc6e3add3c494b6010b69dfd2225d6ad5e4ebd
    }
}

game.init();