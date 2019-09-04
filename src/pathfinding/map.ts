import Tile from "./tile";

export default class Map {
  public width: number;
  public height: number;
  public obstacleProb: number;
  public tiles: Tile[];
  public start: Tile;
  public end: Tile;

  constructor(
    width: number = 10,
    height: number = 6,
    obstacleProb: number = 0.2
  ) {
    this.width = width;
    this.height = height;
    this.obstacleProb = obstacleProb;
  }

  public generate() {
    this.tiles = [];

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        const isObstacle =
          Math.floor(Math.random() * 100) + 1 <= this.obstacleProb * 100;
        this.tiles.push(new Tile(row, col, isObstacle));
      }
    }

    const startTile = this.tiles.find(tile => tile.col === 0 && tile.row === 0);
    startTile.isObstacle = false;
    this.start = startTile;

    const endTile = this.tiles.find(
      tile => tile.col === this.width - 1 && tile.row === this.height - 1
    );
    endTile.isObstacle = false;
    this.end = endTile;
  }

  public setTile() {
    const testTile = this.tiles.find(tile => tile.col === 1 && tile.row === 0);
    testTile.isObstacle = true;
    this.tiles.splice(1, 1, testTile);
  }
}
