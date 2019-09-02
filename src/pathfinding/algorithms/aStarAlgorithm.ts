import { notImplemented } from '@angular/core/src/render3/util';
import Map from '../map';
import Tile, { TileTypes } from '../tile';
import Algorithm from './algorithm';
import Node from './node';
import PathResult from './pathResult';

export default class AStarAlgorithm extends Algorithm {

    protected getPath(): PathResult {
        const changements = new Array<[Tile, TileTypes]>();
        const openList = new Array<Node>();
        const closedList = new Array<Node>();
        const startNode = new Node(this.map.start);
        startNode.g = 0;
        startNode.f = startNode.g + this.heuristic(startNode.tile);
        openList.push(startNode);

        while (openList.length !== 0) {

            const current = this.findLowestF(openList);
            const currentNode = current.node;

            if (currentNode.tile === this.map.end) {
                return new PathResult(this.constructPath(currentNode), openList.length, closedList.length, changements);
            }

            openList.splice(current.index, 1);
            closedList.push(currentNode);
            changements.push([currentNode.tile, TileTypes.Closed]);
            this.addValidNeighborsToOpenList(currentNode, openList, closedList, changements);
        }

        return undefined;
    }

    private addValidNeighborsToOpenList(currentNode: Node, openList: Node[], closedList: Node[], changements: [Tile, TileTypes][]) {
        for (let r = -1; r < 2; r++) {
            for (let c = -1; c < 2; c++) {
                if (r === 0 && c === 0) {
                    continue;
                }

                const neighbourTile = this.map.tiles.find((tile) => tile.row === currentNode.tile.row + r &&
                    tile.col === currentNode.tile.col + c);
                if (!neighbourTile || neighbourTile.isObstacle) {
                    continue;
                }

                const clnode = closedList.find((node) => node.tile === neighbourTile);
                if (clnode) { // if this neighbour is in the closed list
                    continue;
                }

                const neighbour = new Node(neighbourTile);
                neighbour.parent = currentNode;
                neighbour.g = currentNode.g + 1; // all directions have the same cost (1)
                neighbour.f = neighbour.g + this.heuristic(neighbourTile);

                const olnode = openList.find((node) => node.tile === neighbourTile);
                if (!olnode) {
                    openList.push(neighbour);
                    changements.push([neighbourTile, TileTypes.Opened]);
                } else if (neighbour.g < olnode.g) {
                    olnode.g = neighbour.g;
                    olnode.parent = neighbour.parent;
                }
            }
        }
    }

    private heuristic(currentTile: Tile): number {
        if (!this.map) {
            throw new Error('Call getShortestPath first.');
        }

        return Math.max(Math.abs(currentTile.row - this.map.end.row), Math.abs(currentTile.col - this.map.end.col));
    }

    private findLowestF(openList: Node[]): any {
        let lowestNode = openList[0];
        let lowestIndex = 0;

        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < lowestNode.f) {
                lowestNode = openList[i];
                lowestIndex = i;
            }
        }

        return {
            node: lowestNode,
            index: lowestIndex
        };
    }

    private constructPath(endNode: Node): Node[] {

        const path = new Array<Node>();
        let currentNode = endNode;
        path.push(currentNode);

        while (currentNode.parent) {
            currentNode = currentNode.parent;
            path.unshift(currentNode);
        }

        return path;
    }

}
