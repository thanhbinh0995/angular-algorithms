import {
  AfterContentInit,
  Component,
  ElementRef,
  ViewChild
} from "@angular/core";

import Board from "../pathfinding/board";
import Node from "../pathfinding/node";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css", "./styling/cssBasic.css"]
})
export class AppComponent implements AfterContentInit {
  @ViewChild("navbarDiv") navbarDiv: ElementRef;
  @ViewChild("mainText") mainText: ElementRef;
  @ViewChild("algorithmDescriptor") algorithmDescriptor: ElementRef;

  public board: Board;
  public buttonsOn: boolean;

  constructor() {
    this.buttonsOn = true;
  }

  ngAfterContentInit() {
    this.initializeMap();
  }

  private initializeMap() {
    const navbarDivHeight = this.navbarDiv.nativeElement.offsetHeight;
    const mainTextHeight = this.mainText.nativeElement.offsetHeight;
    const algorithmDescriptorHeight = this.algorithmDescriptor.nativeElement
      .offsetHeight;
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;
    const height = Math.floor(
      (innerHeight -
        navbarDivHeight -
        mainTextHeight -
        algorithmDescriptorHeight) /
        28
    );
    let width = Math.floor(innerWidth / 25);

    this.board = new Board(width, height);
    this.board.initialise();
  }

  runBoard() {
    this.board.startButtonStartClicked();
  }

  clearBoard() {
    this.board.clearPath("clickedButton");
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
