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
        black: 0x000000
    },
    settings: {
        width: 50,
        length: 40,
        tileSize: 15,
        snakeSize: 8
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
    map: null,
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
    }
}

game.init();