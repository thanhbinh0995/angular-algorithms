import Tile, { TileTypes } from '../tile';
import Node from './node';

export default class PathResult {

    public path: Node[];
    public nodesOpened: number;
    public nodesClosed: number;
    public changements: [Tile, TileTypes][];

    constructor(path: Node[], nodesOpened: number, nodesClosed: number, changements: [Tile, TileTypes][]) {
        this.path = path;
        this.nodesOpened = nodesOpened;
        this.nodesClosed = nodesClosed;
        this.changements = changements;
    }

}
