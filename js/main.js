let game = {
    pixi: new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x740574,
        antialias: false,
        resolution: 1
    }),
    settings: {
        width: 50,
        length: 50,
        tileSize: 10,
        snakeSize: 8
    },
    mapClass: class Map extends PIXI.Graphics {
        constructor(width, length) {

        }

        render () {

        }
    },
    tileClass: class Tile extends PIXI.Graphics {
        constructor(startX, startY) {

        }
    },
    map: null,
    positioning () {
        window.addEventListener('resize', ()=> {
            this.pixi.renderer.resize(window.innerWidth, window.innerHeight);
            this.pixi.stage.position.set(window.innerWidth / 2, window.innerHeight / 2);
        });
    },
    init () {
        document.body.appendChild(this.pixi.renderer.view);
        this.positioning();
    }
}

game.init();