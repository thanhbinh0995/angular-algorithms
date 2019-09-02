export default class Tile {

    public row: number;
    public col: number;
    public isObstacle: boolean;
    public type: TileTypes;

    constructor(row: number, col: number, isObstacle: boolean) {
        this.row = row;
        this.col = col;
        this.isObstacle = isObstacle;
        this.type = TileTypes.None;
    }

}

export enum TileTypes {
    None,
    Opened,
    Closed,
    Path
}
