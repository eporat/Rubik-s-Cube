//https://en.wikipedia.org/wiki/A*_search_algorithm
const STEP = 68;

function a_star(rubiksCube){
    rubiksCube.moves = [];
    const closedSet = new Set();
    const openSet = new Set();
    const priorityQueue = new FastPriorityQueue((a, b) => a.heuristic < b.heuristic);
    const cameFrom = new Map();

    openSet.add(rubiksCube);
    priorityQueue.add({node: rubiksCube, heuristic: rubiksCube.heuristic()})

    while (priorityQueue.size){
        const current = priorityQueue.poll();
        // console.log(current.heuristic)
        // current.node = RubiksCube.unhash(current.node);
        if (current.node.isTerminal()){
            return reconstruct_path(cameFrom, current);
            // return reconstruct_path(current.node);
        }

        openSet.delete(current);
        closedSet.add(current);

        for (let cube of current.node.nextCubes()){
            if (closedSet.has(cube)){
                continue;
            }

            const neighbor = {node: cube, heuristic: cube.heuristic()}

            if (!openSet.has(cube)){
                openSet.add(cube);
                priorityQueue.add(neighbor);
            }

            if (neighbor.heuristic >= current.heuristic){
                continue;
            }

            cameFrom.set(neighbor, current);
        }
    }

    console.log("FAILURE");
}

function reconstruct_path(cameFrom, current){
    const total_path = [current];
    // const moves = current.moves.slice();
    // return moves;
    while (cameFrom.has(current)){
        current = cameFrom.get(current);
        total_path.push(current);
    }

    return total_path.map(cube => cube.node);
}
