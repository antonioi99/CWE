// Game state
let gameState = {
    currentNodeId: 'start',
    visitedNodes: new Set(['start']),
    playerPosition: { x: 50, y: 50 },
    choiceHistory: []
};

// DOM Elements
const narrativeElement = document.getElementById('narrative');
const choicesElement = document.getElementById('choices');
const navigationElement = document.getElementById('navigation');
const startButton = document.getElementById('start-button');
const playerElement = document.getElementById('player');
const labyrinthDisplay = document.getElementById('labyrinth-display');

// Direction buttons
const navUp = document.getElementById('nav-up');
const navLeft = document.getElementById('nav-left');
const navRight = document.getElementById('nav-right');
const navDown = document.getElementById('nav-down');

// Initialize the game
function initGame() {
    startButton.addEventListener('click', startGame);
    updatePlayerPosition();
}

// Start the game
function startGame() {
    choicesElement.innerHTML = '';
    navigationElement.classList.remove('hidden');
    
    // Set up navigation controls
    navUp.addEventListener('click', () => move('up'));
    navLeft.addEventListener('click', () => move('left'));
    navRight.addEventListener('click', () => move('right'));
    navDown.addEventListener('click', () => move('down'));
    
    // Navigate to the first story node
    navigateToNode('intro');
}

// Navigate to a specific story node
function navigateToNode(nodeId) {
    // Get the story node
    const node = storyNodes[nodeId];
    
    if (!node) {
        console.error(`Story node ${nodeId} not found!`);
        return;
    }

    // update progression bar
    if (progressionSystem) {
        progressionSystem.updateProgress(nodeId);
    }
    
    // Update game state
    gameState.currentNodeId = nodeId;
    gameState.visitedNodes.add(nodeId);
    
    // Update the narrative text with fade effect
    narrativeElement.classList.remove('fade-in');
    setTimeout(() => {
        // Display the node's content
        narrativeElement.innerHTML = `<h2>${node.title}</h2>${node.content}`;
        narrativeElement.classList.add('fade-in');
        
        // Update available directions
        updateAvailableDirections(node.exits);
        
        // Update player position on the labyrinth
        updateLabyrinthVisual(nodeId);
        
        // If this is a choice node, show choices instead of navigation
        if (node.choices && node.choices.length > 0) {
            showChoices(node.choices);
            navigationElement.classList.add('hidden');
        } else {
            navigationElement.classList.remove('hidden');
        }
    }, 300);
}

// Show choices for the player
function showChoices(choices) {
    choicesElement.innerHTML = '';
    
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice.text;
        button.addEventListener('click', () => {
            // Record the choice
            gameState.choiceHistory.push({
                fromNode: gameState.currentNodeId,
                choiceText: choice.text,
                toNode: choice.nextNode
            });
            
            // Navigate to the next node
            navigateToNode(choice.nextNode);
        });
        
        choicesElement.appendChild(button);
    });
}

// Move in a direction
function move(direction) {
    const currentNode = storyNodes[gameState.currentNodeId];
    const exits = currentNode.exits || {};
    
    if (exits[direction]) {
        // Update player visual position before navigating
        animatePlayerMovement(direction, () => {
            navigateToNode(exits[direction]);
        });
    }
}

// Update which direction buttons are enabled based on available exits
function updateAvailableDirections(exits = {}) {
    navUp.disabled = !exits.up;
    navLeft.disabled = !exits.left;
    navRight.disabled = !exits.right;
    navDown.disabled = !exits.down;
}

// Update the visual representation of the labyrinth
function updateLabyrinthVisual(nodeId) {
    // This is a simplified visualization
    // You could enhance this with a more detailed representation
    
    // For now, just set a different background color based on the node type
    const node = storyNodes[nodeId];
    
    // Use different colors for different types of locations
    let bgColor = '#f9f9f9';
    
    if (node.type === 'library') {
        bgColor = '#f0e6d2'; // Parchment color for library
    } else if (node.type === 'garden') {
        bgColor = '#e0f2e0'; // Light green for garden
    } else if (node.type === 'tower') {
        bgColor = '#e0e0e0'; // Stone gray for tower
    } else if (node.type === 'mirror') {
        bgColor = '#e0f0ff'; // Light blue for mirror rooms
    }
    
    labyrinthDisplay.style.backgroundColor = bgColor;
    
    // Additional visual effects based on the node properties
    if (node.timeDistortion) {
        labyrinthDisplay.style.boxShadow = 'inset 0 0 20px rgba(255, 0, 0, 0.2)';
    } else {
        labyrinthDisplay.style.boxShadow = 'none';
    }
}

// Set initial player position
function updatePlayerPosition() {
    playerElement.style.left = `${gameState.playerPosition.x}%`;
    playerElement.style.top = `${gameState.playerPosition.y}%`;
}

// Animate player movement
function animatePlayerMovement(direction, callback) {
    // Define movement amount
    const moveAmount = 20;

    const fromX = gameState.playerPosition.x;
    const fromY = gameState.playerPosition.y;
    
    // Calculate new position based on direction
    switch (direction) {
        case 'up':
            gameState.playerPosition.y = Math.max(0, gameState.playerPosition.y - moveAmount);
            break;
        case 'down':
            gameState.playerPosition.y = Math.min(80, gameState.playerPosition.y + moveAmount);
            break;
        case 'left':
            gameState.playerPosition.x = Math.max(0, gameState.playerPosition.x - moveAmount);
            break;
        case 'right':
            gameState.playerPosition.x = Math.min(80, gameState.playerPosition.x + moveAmount);
            break;
    }

    drawPathLine(fromX, fromY, gameState.playerPosition.x, gameState.playerPosition.y);
    
    // Update player position
    playerElement.style.left = `${gameState.playerPosition.x}%`;
    playerElement.style.top = `${gameState.playerPosition.y}%`;
    
    // Wait for animation to complete before executing callback
    setTimeout(callback, 350);
}


function drawPathLine(x1, y1, x2, y2) {
    const container = document.getElementById('path-container');

    const line = document.createElement('div');
    line.classList.add('path-line');

    const displayWidth = labyrinthDisplay.offsetWidth;
    const displayHeight = labyrinthDisplay.offsetHeight;

    // Convert % positions to px
    const startX = (x1 / 100) * displayWidth+12;
    const startY = ((y1 / 100) * displayHeight)+5;
    const endX = (x2 / 100) * displayWidth+12;
    const endY = (y2 / 100) * displayHeight+5;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    line.style.width = `${length}px`;
    line.style.height = `8px`; // thickness of the path
    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.transform = `rotate(${angle}deg)`;

    container.appendChild(line);
}

// Progression Bar
// Add this to your existing game.js file

class ProgressionSystem {
    constructor() {
        this.targetNode = 'the_point';
        console.log('Initializing ProgressionSystem, target:', this.targetNode);
        
        this.distances = this.calculateDistances();
        const validDistances = Object.entries(this.distances)
            .filter(([nodeId, distance]) => nodeId !== 'start' && distance !== 999)
            .map(([_, distance]) => distance);

        this.maxDistance = validDistances.length > 0 ? Math.max(...validDistances) : 1;
        
        console.log('All calculated distances:', this.distances);
        console.log('Max distance found:', this.maxDistance);
        
        this.createProgressBar();
    }

    // Calculate shortest path distances from each node to 'the_point'

    calculateDistances() {
        const distances = {};
        
        // Build a graph of all connections first
        const graph = {};
        for (const nodeId in storyNodes) {
            graph[nodeId] = [];
        }
        
        // Add forward connections from exits
        for (const nodeId in storyNodes) {
            const node = storyNodes[nodeId];
            if (node.exits) {
                for (const direction in node.exits) {
                    const targetNode = node.exits[direction];
                    if (targetNode && graph[nodeId]) {
                        graph[nodeId].push(targetNode);
                        
                        // DEBUG: Log each connection
                        console.log(`Exit connection: ${nodeId} -> ${targetNode} (${direction})`);
                        
                        // ADD BIDIRECTIONAL CONNECTIONS (if you want reverse paths)
                        if (graph[targetNode]) {
                            graph[targetNode].push(nodeId);
                            console.log(`Reverse connection: ${targetNode} -> ${nodeId}`);
                        }
                    }
                }
            }
            
            // Add forward connections from choices
            if (node.choices) {
                for (const choice of node.choices) {
                    if (choice.nextNode && graph[nodeId]) {
                        graph[nodeId].push(choice.nextNode);
                        console.log(`Choice connection: ${nodeId} -> ${choice.nextNode}`);
                        
                        // Note: Usually choices don't have reverse connections
                        // because story choices are typically one-way
                    }
                }
            }
        }
        
        // DEBUG: Print the complete graph
        console.log('Complete graph structure:');
        for (const nodeId in graph) {
            if (graph[nodeId].length > 0) {
                console.log(`${nodeId}: [${graph[nodeId].join(', ')}]`);
            }
        }
        
        // Now use BFS from each node to find distance to target
        for (const startNode in storyNodes) {
            distances[startNode] = this.bfsDistance(startNode, this.targetNode, graph);
        }
        
        return distances;
    }

    // Also debug your BFS function:
    bfsDistance(start, target, graph) {
        if (start === target) return 0;
        
        const queue = [start];
        const visited = new Set([start]);
        const distances = { [start]: 0 };
        
        console.log(`\nBFS from ${start} to ${target}:`);
        
        while (queue.length > 0) {
            const current = queue.shift();
            const currentDistance = distances[current];
            
            console.log(`  Visiting ${current} (distance: ${currentDistance})`);
            
            // Check all neighbors of current node
            if (graph[current]) {
                console.log(`    Neighbors: [${graph[current].join(', ')}]`);
                
                for (const neighbor of graph[current]) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        distances[neighbor] = currentDistance + 1;
                        queue.push(neighbor);
                        
                        console.log(`    -> Added ${neighbor} with distance ${distances[neighbor]}`);
                        
                        // If we found the target, return the distance
                        if (neighbor === target) {
                            console.log(`    Found target! Distance: ${distances[neighbor]}`);
                            return distances[neighbor];
                        }
                    }
                }
            } else {
                console.log(`    No neighbors for ${current}`);
            }
        }
        
        console.log(`  Target ${target} unreachable from ${start}`);
        return 999;
    }

    
    createProgressBar() {
        // Make sure the progress container exists
        const progressContainer = document.getElementById('progress-container');
        if (!progressContainer) {
            console.error('Progress container not found in HTML.');
            return;
        }
    }
    
    updateProgress(currentNodeId) {
        if (!this.distances[currentNodeId]) return;
        
        const currentDistance = this.distances[currentNodeId];
        const progressPercentage = Math.max(0, Math.round(((this.maxDistance - currentDistance) / this.maxDistance) * 100));

        
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill && progressText) {
            progressFill.style.width = progressPercentage + '%';
            progressText.textContent = progressPercentage + '%';
            
            // Special message when reaching the target
            if (currentNodeId === this.targetNode) {
                progressText.textContent = '100% - You have reached The Point!';
                progressText.style.color = '#27ae60';
                progressText.style.fontWeight = 'bold';
            }
        }
        
        // Optional: Log for debugging
        console.log(`Node: ${currentNodeId}, Distance: ${currentDistance}, Progress: ${progressPercentage}%`);
    }
    
    // Get a hint about the direction to progress
    getProgressHint(currentNodeId) {
        if (!this.distances[currentNodeId]) return null;
        
        const currentDistance = this.distances[currentNodeId];
        if (currentDistance === 0) return "You have reached your destination!";
        if (currentDistance === 1) return "You are very close to The Point!";
        if (currentDistance <= 3) return "You are getting closer to The Point.";
        if (currentDistance <= 5) return "You are making progress toward The Point.";
        return "The Point feels distant, but every step matters.";
    }
}

// Initialize the progression system when the game loads
let progressionSystem;

function initProgressionSystem() {
    if (typeof storyNodes !== 'undefined') {
        console.log('Story nodes available:', Object.keys(storyNodes));
        console.log('Looking for target node "the_point":', storyNodes['the_point'] ? 'FOUND' : 'NOT FOUND');
        
        progressionSystem = new ProgressionSystem();
        
        // Debug: Check distances for key nodes
        console.log('Distances calculated:');
        console.log('- start:', progressionSystem.distances['start']);
        console.log('- intro:', progressionSystem.distances['intro']);
        console.log('- the_point:', progressionSystem.distances['the_point']);
        console.log('Max distance:', progressionSystem.maxDistance);
        
        // Set initial progress for intro node (since that's where the game actually starts)
        progressionSystem.updateProgress('intro');
    } else {
        console.log('Story nodes not loaded yet, retrying...');
        setTimeout(initProgressionSystem, 100);
    }
}


function updateNodeProgress(nodeId) {
    if (progressionSystem) {
        progressionSystem.updateProgress(nodeId);
    }
}



// Initialize the game when the page loads
window.addEventListener('load', function() {
    initGame();
    initProgressionSystem();
});