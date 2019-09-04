import {
  AfterContentInit,
  Component,
  ElementRef,
  ViewChild,
  HostListener
} from "@angular/core";
import { clearTimeout, setTimeout } from "timers";
import Algorithm from "../pathfinding/algorithms/algorithm";
import AStarAlgorithm from "../pathfinding/algorithms/aStarAlgorithm";
import PathResult from "../pathfinding/algorithms/pathResult";
import Map from "../pathfinding/map";
import Tile, { TileTypes } from "../pathfinding/tile";

import Board from "../pathfinding/board";
import Node from "../pathfinding/node";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css", "./board.component.css"]
})
export class AppComponent implements AfterContentInit {
  @ViewChild("mapDiv") mapEl: ElementRef;
  @ViewChild("inputMapWidth") inputMapWidth: ElementRef;
  @ViewChild("inputMapHeight") inputMapHeight: ElementRef;
  @ViewChild("inputObstaclesProb") inputObstaclesProb: ElementRef;
  public inputSpeed = 20;
  public map: Map;
  private algorithm: Algorithm;
  private animationTimeouts: any[];
  public board: Board;
  public buttonsOn: boolean;

  constructor() {
    this.map = new Map();
    this.algorithm = new AStarAlgorithm();
    this.animationTimeouts = [];

    this.board = new Board(20, 14);
    this.buttonsOn = true;
  }

  ngAfterContentInit() {
    this.initializeMap();
  }

  private initializeMap() {
    const divWidth = this.mapEl.nativeElement.clientWidth;
    const divHeight = this.mapEl.nativeElement.clientHeight;
    // this.map.width = Math.floor((divWidth - 20) / 32);
    // this.map.height = Math.floor((divHeight - 20) / 32);

    const widthTest = 10;
    const heightTest = 6;
    this.map.width = widthTest;
    this.map.height = heightTest;
    this.inputMapWidth.nativeElement.value = this.map.width;
    this.inputMapHeight.nativeElement.value = this.map.height;
    this.map.generate();

    // let navbarHeight = $("#navbarDiv").height();
    // let textHeight =
    //   $("#mainText").height() + $("#algorithmDescriptor").height();
    // let height = Math.floor(
    //   ($(document).height() - navbarHeight - textHeight) / 28
    // );
    // let width = Math.floor($(document).width() / 25);
    this.board.initialise();
  }

  private getTileClasses(tile: Tile): string {
    let classes = "";

    if (tile.isObstacle) {
      classes = "bg-dark";
    }

    if (this.map.start === tile) {
      classes += " start-tile";
    }

    if (this.map.end === tile) {
      classes += " end-tile";
    }

    if (tile.type === TileTypes.Path) {
      classes += " bg-success";
    } else if (tile.type === TileTypes.Closed) {
      classes += " bg-secondary";
    } else if (tile.type === TileTypes.Opened) {
      classes += " bg-info";
    }

    return classes;
  }

  private generateMap(event) {
    event.preventDefault();
    this.map.width = parseInt(this.inputMapWidth.nativeElement.value);
    this.map.height = parseInt(this.inputMapHeight.nativeElement.value);
    this.map.obstacleProb = parseFloat(
      this.inputObstaclesProb.nativeElement.value
    );
    this.clear();
    this.map.generate();
  }

  private run() {
    this.clear();
    const start = window.performance.now();
    const result = this.algorithm.getShortestPath(this.map);
    const timeTaken = window.performance.now() - start;

    if (result) {
      this.animate(result);
    } else {
      console.log("NOT FOUND");
    }
  }

  runBoard() {
    this.board.startButtonStartClicked();
  }

  clearBoard() {
    this.board.clearPath("clickedButton");
  }

  private clear() {
    this.animationTimeouts.forEach(at => clearTimeout(at));
    this.map.tiles.forEach(tile => (tile.type = TileTypes.None));
  }

  private animate(result: PathResult) {
    if (result.changements.length === 0) {
      result.path.forEach(pnode => (pnode.tile.type = TileTypes.Path));
    } else {
      const changement: [Tile, TileTypes] = result.changements.shift();
      changement[0].type = changement[1];
      // console.log(this.inputSpeed);
      this.animationTimeouts.push(
        setTimeout(() => this.animate(result), this.inputSpeed)
      );
    }
  }

  mousedown(currentNode: Node): any {
    if (this.buttonsOn) {
      this.board.mouseDown = true;
      if (
        currentNode.status === "start" ||
        currentNode.status === "target" ||
        currentNode.status === "object"
      ) {
        this.board.pressedNodeStatus = currentNode.status;
      } else {
        this.board.pressedNodeStatus = "normal";
        this.board.changeNormalNode(currentNode);
      }
    }
  }

  mouseup(currentNode: Node): any {
    if (this.buttonsOn) {
      this.board.mouseDown = false;
      if (this.board.pressedNodeStatus === "target") {
        this.board.target = currentNode.id;
      } else if (this.board.pressedNodeStatus === "start") {
        this.board.start = currentNode.id;
      } else if (this.board.pressedNodeStatus === "object") {
        this.board.object = currentNode.id;
      }
      this.board.pressedNodeStatus = "normal";
    }
  }

  mouseenter(currentNode: Node): any {
    if (this.buttonsOn) {
      if (this.board.mouseDown && this.board.pressedNodeStatus !== "normal") {
        this.board.changeSpecialNode(currentNode);
        if (this.board.pressedNodeStatus === "target") {
          this.board.target = currentNode.id;
          if (this.board.algoDone) {
            this.board.redoAlgorithm();
          }
        } else if (this.board.pressedNodeStatus === "start") {
          this.board.start = currentNode.id;
          if (this.board.algoDone) {
            this.board.redoAlgorithm();
          }
        } else if (this.board.pressedNodeStatus === "object") {
          this.board.object = currentNode.id;
          if (this.board.algoDone) {
            this.board.redoAlgorithm();
          }
        }
      } else if (this.board.mouseDown) {
        this.board.changeNormalNode(currentNode);
      }
    }
  }

  mouseleave(currentNode: Node): any {
    if (this.buttonsOn) {
      if (this.board.mouseDown && this.board.pressedNodeStatus !== "normal") {
        this.board.changeSpecialNode(currentNode);
      }
    }
  }
}
