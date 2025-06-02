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

// Initialize the game when the page loads
window.addEventListener('load', initGame);