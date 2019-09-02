import Map from '../map';
import PathResult from './pathResult';

export default abstract class Algorithm {

    protected map: Map;

    public getShortestPath(map: Map): PathResult {
        this.map = map;
        return this.getPath();
    }

    protected abstract getPath(): PathResult;

}
