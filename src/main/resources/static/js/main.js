var mouseIsInDownState = 0;
var count = 0;
var allNodes = {};
var grid = [];
var startNode;
var finishNode;


class GridNode {
  constructor(row, col, isWall, isStart, isFinish, id, distance) {
    this.row = row;
    this.col = col;
    this.isWall = isWall;
    this.isStart = isStart;
    this.isFinish = isFinish;
    this.id = id;
    this.distance = distance;
    this.previousNode = null;
  }

  getRow() {
    return this.row;
  }

  getCol() {
    return this.col;
  }

  getIsWall() {
    return this.isWall;
  }

  getIsStart() {
    return this.isStart;
  }

  getIsFinish() {
    return this.isFinish;
  }

  setIsFinish(isFinish) {
    this.isFinish = isFinish;
  }

  setIsWall(isWall) {
    this.isWall = isWall;
  }

  setIsStart(isStart) {
    this.isStart = isStart;
  }

  getId() {
    return this.id;
  }

  setId(id) {
    this.id = id;
  }

  getDistance() {
    return this.distance;
  }
  setDistance(distance) {
    this.distance = distance;
  }
}


window.onload = function () {
  var x = 40;
  const container = document.createElement("div");
  container.id = "container";
  container.addEventListener("mousedown", function () {
    console.log("Down");
    mouseIsInDownState = 1;
    console.log(mouseIsInDownState);
  });

  container.addEventListener("mouseup", function () {
    console.log("up");
    mouseIsInDownState = 0;
    console.log(mouseIsInDownState);
  });
  document.body.appendChild(container);
  for (var rows = 0; rows < x; rows++) {
    var currentRow = [];
    for (var columns = 0; columns < x; columns++) {
      let cell = document.createElement("div");
      cell.className = "grid";
      cell.id = rows + "-" + columns;
      cell.onclick = nodeClicked;
      cell.onmouseover = nodeVisited;
      $("#container").append(cell);
      gridNode = new GridNode(
        rows,
        columns,
        false,
        false,
        false,
        cell.id,
        Infinity
      );
      allNodes[cell.id] = gridNode;
      currentRow.push(gridNode);
    }
    grid.push(currentRow);
  }
  $(".grid").width(960 / x);
  $(".grid").height(960 / x);
  console.log(allNodes);
};

function nodeClicked(event) {
  count++;
  if (count === 1) {
    let id = event.target.id;
    console.log("Setting start Node: " + id);
    document.getElementById(id).style.backgroundColor = "orange";
    gridNode = allNodes[id];
    gridNode.setIsStart(true);
    allNodes[id] = gridNode;
    startNode = gridNode;
  } else if (count === 2) {
    let id = event.target.id;
    console.log("Setting finish Node: " + id);
    document.getElementById(id).style.backgroundColor = "green";
    gridNode = allNodes[id];
    gridNode.setIsFinish(true);
    allNodes[id] = gridNode;
    finishNode = gridNode;
  }
}

function nodeVisited(event) {
  if (mouseIsInDownState) {
    let id = event.target.id;
    console.log(id);
    document.getElementById(id).className = "wall-grid";
    gridNode = allNodes[id];
    gridNode.setIsWall(true);
    allNodes[id] = gridNode;
  } else {
    console.log("Do nothing");
  }
}

function runDijkstraAlgorithm() {
  var visitedNodesInOrder = dijkstraAlgorithm(grid, startNode, finishNode);
  console.log(visitedNodesInOrder);
  var shortestPathOrder = getNodesInShortestPathOrder(finishNode);
  console.log(shortestPathOrder);
  animateDijkstra(visitedNodesInOrder, shortestPathOrder);
}

function dijkstraAlgorithm(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

function animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
  for (let i = 0; i <= visitedNodesInOrder.length; i++) {
    if (i === visitedNodesInOrder.length) {
      setTimeout(() => {
        this.animateShortestPath(nodesInShortestPathOrder);
      }, 10 * i);
      return;
    }
    setTimeout(() => {
      const node = visitedNodesInOrder[i];
      document.getElementById(node.row + "-" + node.col).className =
        "grid node-visited";
    }, 10 * i);
  }
}

function animateShortestPath(nodesInShortestPathOrder) {
  for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
    setTimeout(() => {
      const node = nodesInShortestPathOrder[i];
      document.getElementById(node.row + "-" + node.col).className =
        "grid node-shortest-path";
    }, 50 * i);
  }
}
