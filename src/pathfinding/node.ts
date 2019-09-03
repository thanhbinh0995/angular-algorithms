export default class Node {
  public id: string;
  public status: any;
  public previousNode: any;
  public path: any;
  public direction: any;
  public storedDirection: any;
  public distance: any;
  public totalDistance: any;
  public heuristicDistance: any;
  public weight: any;
  public relatesToObject: any;
  public overwriteObjectRelation: any;

  public otherid: any;
  public otherstatus: any;
  public otherpreviousNode: any;
  public otherpath: any;
  public otherdirection: any;
  public otherstoredDirection: any;
  public otherdistance: any;
  public otherweight: any;
  public otherrelatesToObject: any;
  public otheroverwriteObjectRelation: any;

  constructor(id: string, status: any) {
    this.id = id;
    this.status = status;
    this.totalDistance = Infinity;
    this.otherdirection = Infinity;
  }
}
