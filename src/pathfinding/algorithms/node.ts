import Tile from '../tile';

export default class Node {

    public tile: Tile;
    public parent: Node;
    public g: number;
    public f: number;
    public h: number;

    constructor(tile: Tile) {
        this.tile = tile;
    }

}
