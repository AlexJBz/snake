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
        tileSize: 15,
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
            this.parts = [ { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 } ];
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
        
        move () {
            let head = this.parts[0];
            let tail = this.parts.pop();
            tail.x = head.x + this.moveX;
            tail.y = head.y + this.moveY;
            this.parts.unshift(tail);
            if (this.checkCollisions()) {
                this.clear();
                this.draw();
            } else {
                console.log('Game over!');
            }
        }

        checkCollisions () {
            let head = this.parts[0];
            if (head.x > game.settings.width || head.y > game.settings.length || head.x < 0 || head.y < 0) {
                clearInterval(game.loop);
                return false;
            }
            return true;
        }

        changeDirection(keyCode) {
            switch(keyCode) {
                case 37:
                    this.moveX = -1;
                    this.moveY = 0;
                    break;
                case 38:
                    this.moveX = 0;
                    this.moveY = -1;
                    break;
                case 39:
                    this.moveX = 1;
                    this.moveY = 0;
                    break;
                case 40:
                    this.moveX = 0;
                    this.moveY = 1;
                    break;
                default:
                    // Oi stop playing with the console
                    console.log('Cheeky!')
                    break;
            }
        }
    },
    map: null,
    snake: null,
    loop: null,
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
        this.pixi.stage.addChild(this.map);
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
    }
}

game.init();