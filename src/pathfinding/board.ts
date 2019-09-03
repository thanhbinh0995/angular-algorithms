import Node from "./node";
import { getDistance } from "./helper";

export default class Board {
  public width: number;
  public height: number;
  public start: string = null;
  public target: string = null;
  public object: string = null;
  public boardArray: any[];
  public nodes: object;
  public nodesToAnimate: any[];
  public objectNodesToAnimate: any[];
  public shortestPathNodesToAnimate: any[];
  public objectShortestPathNodesToAnimate: any[];
  public wallsToAnimate: any[];
  public mouseDown: boolean = false;
  public pressedNodeStatus: string;
  public previouslyPressedNodeStatus: any;
  public previouslySwitchedNode: any;
  public previouslySwitchedNodeWeight: number;
  public keyDown: boolean;
  public algoDone: boolean;
  public currentAlgorithm: any;
  public currentHeuristic: any;
  public numberOfObjects: number;
  public isObject: boolean;
  public buttonsOn: boolean;
  public speed: string;

  constructor(width: number = 24, height: number = 24) {
    this.width = width;
    this.height = height;
    this.pressedNodeStatus = "normal";
    this.speed = "fase";
  }

  public initialise() {
    this.createGrid();
    // event listener will handle with onClick and mouse event
    // this.addEventListeners();
    this.toggleTutorialButtons();
  }

  public createGrid() {
    for (let r = 0; r < this.height; r++) {
      let currentArrayRow = [];
      for (let c = 0; c < this.width; c++) {
        let newNodeId = `${r}-${c}`,
          newNodeClass: string,
          newNode: Node;
        if (
          r === Math.floor(this.height / 2) &&
          c === Math.floor(this.width / 4)
        ) {
          newNodeClass = "start";
          this.start = `${newNodeId}`;
        } else if (
          r === Math.floor(this.height / 2) &&
          c === Math.floor((3 * this.width) / 4)
        ) {
          newNodeClass = "target";
          this.target = `${newNodeId}`;
        } else {
          newNodeClass = "unvisited";
        }
        newNode = new Node(newNodeId, newNodeClass);
        currentArrayRow.push(newNode);
        this.nodes[`${newNodeId}`] = newNode;
      }
      this.boardArray.push(currentArrayRow);
    }
  }

  public toggleTutorialButtons() {}

  public getNode(id: string) {
    let coordinates = id.split("-");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);
    return this.boardArray[r][c];
  }

  public changeSpecialNode(currentNode: any) {
    // will be handle by event like as addEventListeners
  }

  public changeNormalNode(currentNode: any) {
    // will be handle by event like as addEventListeners
  }

  public drawShortestPath(targetNodeId, startNodeId, object) {
    let currentNode;
    let secondCurrentNode;
    if (this.currentAlgorithm !== "bidirectional") {
      currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
      if (object) {
        while (currentNode.id !== startNodeId) {
          this.objectShortestPathNodesToAnimate.unshift(currentNode);
          currentNode = this.nodes[currentNode.previousNode];
        }
      } else {
        while (currentNode.id !== startNodeId) {
          this.shortestPathNodesToAnimate.unshift(currentNode);

          /** TODO
           *
           * assign currentNode.id classname equal shortest-path
           */
          //   document.getElementById(currentNode.id).className = `shortest-path`;
          currentNode = this.nodes[currentNode.previousNode];
        }
      }
    } else {
      if (this.middleNode !== this.target && this.middleNode !== this.start) {
        currentNode = this.nodes[this.nodes[this.middleNode].previousNode];
        secondCurrentNode = this.nodes[
          this.nodes[this.middleNode].otherpreviousNode
        ];
        if (secondCurrentNode.id === this.target) {
          this.nodes[this.target].direction = getDistance(
            this.nodes[this.middleNode],
            this.nodes[this.target]
          )[2];
        }
        if (this.nodes[this.middleNode].weight === 0) {
          document.getElementById(this.middleNode).className = `shortest-path`;
        } else {
          document.getElementById(
            this.middleNode
          ).className = `shortest-path weight`;
        }
        while (currentNode.id !== startNodeId) {
          this.shortestPathNodesToAnimate.unshift(currentNode);
          document.getElementById(currentNode.id).className = `shortest-path`;
          currentNode = this.nodes[currentNode.previousNode];
        }
        while (secondCurrentNode.id !== targetNodeId) {
          this.shortestPathNodesToAnimate.unshift(secondCurrentNode);
          document.getElementById(
            secondCurrentNode.id
          ).className = `shortest-path`;
          if (secondCurrentNode.otherpreviousNode === targetNodeId) {
            if (secondCurrentNode.otherdirection === "left") {
              secondCurrentNode.direction = "right";
            } else if (secondCurrentNode.otherdirection === "right") {
              secondCurrentNode.direction = "left";
            } else if (secondCurrentNode.otherdirection === "up") {
              secondCurrentNode.direction = "down";
            } else if (secondCurrentNode.otherdirection === "down") {
              secondCurrentNode.direction = "up";
            }
            this.nodes[this.target].direction = getDistance(
              secondCurrentNode,
              this.nodes[this.target]
            )[2];
          }
          secondCurrentNode = this.nodes[secondCurrentNode.otherpreviousNode];
        }
      } else {
        document.getElementById(
          this.nodes[this.target].previousNode
        ).className = `shortest-path`;
      }
    }
  }

  public addShortestPath(targetNodeId, startNodeId, object) {
    let currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
    if (object) {
      while (currentNode.id !== startNodeId) {
        this.objectShortestPathNodesToAnimate.unshift(currentNode);
        currentNode.relatesToObject = true;
        currentNode = this.nodes[currentNode.previousNode];
      }
    } else {
      while (currentNode.id !== startNodeId) {
        this.shortestPathNodesToAnimate.unshift(currentNode);
        currentNode = this.nodes[currentNode.previousNode];
      }
    }
  }

  public drawShortestPathTimeout = function(
    targetNodeId,
    startNodeId,
    type,
    object
  ) {
    let board = this;
    let currentNode;
    let secondCurrentNode;
    let currentNodesToAnimate;

    if (board.currentAlgorithm !== "bidirectional") {
      currentNode = board.nodes[board.nodes[targetNodeId].previousNode];
      if (object) {
        board.objectShortestPathNodesToAnimate.push("object");
        currentNodesToAnimate = board.objectShortestPathNodesToAnimate.concat(
          board.shortestPathNodesToAnimate
        );
      } else {
        currentNodesToAnimate = [];
        while (currentNode.id !== startNodeId) {
          currentNodesToAnimate.unshift(currentNode);
          currentNode = board.nodes[currentNode.previousNode];
        }
      }
    } else {
      if (
        board.middleNode !== board.target &&
        board.middleNode !== board.start
      ) {
        currentNode = board.nodes[board.nodes[board.middleNode].previousNode];
        secondCurrentNode =
          board.nodes[board.nodes[board.middleNode].otherpreviousNode];
        if (secondCurrentNode.id === board.target) {
          board.nodes[board.target].direction = getDistance(
            board.nodes[board.middleNode],
            board.nodes[board.target]
          )[2];
        }
        if (object) {
        } else {
          currentNodesToAnimate = [];
          board.nodes[board.middleNode].direction = getDistance(
            currentNode,
            board.nodes[board.middleNode]
          )[2];
          while (currentNode.id !== startNodeId) {
            currentNodesToAnimate.unshift(currentNode);
            currentNode = board.nodes[currentNode.previousNode];
          }
          currentNodesToAnimate.push(board.nodes[board.middleNode]);
          while (secondCurrentNode.id !== targetNodeId) {
            if (secondCurrentNode.otherdirection === "left") {
              secondCurrentNode.direction = "right";
            } else if (secondCurrentNode.otherdirection === "right") {
              secondCurrentNode.direction = "left";
            } else if (secondCurrentNode.otherdirection === "up") {
              secondCurrentNode.direction = "down";
            } else if (secondCurrentNode.otherdirection === "down") {
              secondCurrentNode.direction = "up";
            }
            currentNodesToAnimate.push(secondCurrentNode);
            if (secondCurrentNode.otherpreviousNode === targetNodeId) {
              board.nodes[board.target].direction = getDistance(
                secondCurrentNode,
                board.nodes[board.target]
              )[2];
            }
            secondCurrentNode =
              board.nodes[secondCurrentNode.otherpreviousNode];
          }
        }
      } else {
        currentNodesToAnimate = [];
        let target = board.nodes[board.target];
        currentNodesToAnimate.push(board.nodes[target.previousNode], target);
      }
    }

    timeout(0);

    function timeout(index) {
      if (!currentNodesToAnimate.length)
        currentNodesToAnimate.push(board.nodes[board.start]);
      setTimeout(function() {
        if (index === 0) {
          shortestPathChange(currentNodesToAnimate[index]);
        } else if (index < currentNodesToAnimate.length) {
          shortestPathChange(
            currentNodesToAnimate[index],
            currentNodesToAnimate[index - 1]
          );
        } else if (index === currentNodesToAnimate.length) {
          shortestPathChange(
            board.nodes[board.target],
            currentNodesToAnimate[index - 1],
            "isActualTarget"
          );
        }
        if (index > currentNodesToAnimate.length) {
          board.toggleButtons();
          return;
        }
        timeout(index + 1);
      }, 40);
    }

    function shortestPathChange(
      currentNode,
      previousNode = null,
      isActualTarget = null
    ) {
      if (currentNode === "object") {
        let element = document.getElementById(board.object);
        element.className = "objectTransparent";
      } else if (currentNode.id !== board.start) {
        if (
          currentNode.id !== board.target ||
          (currentNode.id === board.target && isActualTarget)
        ) {
          let currentHTMLNode = document.getElementById(currentNode.id);
          if (type === "unweighted") {
            currentHTMLNode.className = "shortest-path-unweighted";
          } else {
            let direction;
            if (
              currentNode.relatesToObject &&
              !currentNode.overwriteObjectRelation &&
              currentNode.id !== board.target
            ) {
              direction = "storedDirection";
              currentNode.overwriteObjectRelation = true;
            } else {
              direction = "direction";
            }
            if (currentNode[direction] === "up") {
              currentHTMLNode.className = "shortest-path-up";
            } else if (currentNode[direction] === "down") {
              currentHTMLNode.className = "shortest-path-down";
            } else if (currentNode[direction] === "right") {
              currentHTMLNode.className = "shortest-path-right";
            } else if (currentNode[direction] === "left") {
              currentHTMLNode.className = "shortest-path-left";
            } else {
              currentHTMLNode.className = "shortest-path";
            }
          }
        }
      }
      if (previousNode) {
        if (
          previousNode !== "object" &&
          previousNode.id !== board.target &&
          previousNode.id !== board.start
        ) {
          let previousHTMLNode = document.getElementById(previousNode.id);
          previousHTMLNode.className =
            previousNode.weight === 15
              ? "shortest-path weight"
              : "shortest-path";
        }
      } else {
        let element = document.getElementById(board.start);
        element.className = "startTransparent";
      }
    }
  };

  public createMazeOne = function(type) {
    Object.keys(this.nodes).forEach(node => {
      let random = Math.random();

      /**
       * TODO
       *
       *   get classname of current node
       *
       */
      //   let currentHTMLNode = document.getElementById(node);

      let relevantClassNames = ["start", "target", "object"];
      let randomTwo = type === "wall" ? 0.25 : 0.35;

      /**
       *
       * TODO
       *
       * add a condition relevantClassNames.includes(currentHTMLNode.className)
       *
       */
      if (
        random < randomTwo
        // !relevantClassNames.includes(currentHTMLNode.className)
      ) {
        if (type === "wall") {
          /**
           *
           * TODO
           *
           * set classname of current node is wall
           *
           */
          //   currentHTMLNode.className = "wall";
          this.nodes[node].status = "wall";
          this.nodes[node].weight = 0;
        } else if (type === "weight") {
          /**
           *
           * TODO
           *
           * set classname of current node is unvisited weight
           *
           */
          //   currentHTMLNode.className = "unvisited weight";
          this.nodes[node].status = "unvisited";
          this.nodes[node].weight = 15;
        }
      }
    });
  };
}
