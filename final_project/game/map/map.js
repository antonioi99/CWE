// Story Map Visualization Logic
class StoryMapVisualizer {
    constructor() {
        this.svg = null;
        this.g = null;
        this.simulation = null;
        this.nodes = [];
        this.links = [];
        this.nodeElements = null;
        this.linkElements = null;
        this.labelElements = null;
        
        // Visualization settings
        this.width = 1200;
        this.height = 800;
        this.nodeRadius = 25;
        
        // Color scheme for different node types
        this.colors = {
            intro: '#3498db',
            library: '#8b4513',
            garden: '#27ae60',
            forest: '#228b22',
            village: '#e67e22',
            tower: '#95a5a6',
            mirror: '#9b59b6',
            station: '#34495e',
            default: '#bdc3c7'
        };
        
        this.init();
    }
    
    init() {
        this.processStoryData();
        this.createVisualization();
        this.setupControls();
        this.updateStatistics();
        this.populateNodeSelectors();
    }
    
    // Process the story nodes data into graph format
    processStoryData() {
        this.nodes = [];
        this.links = [];
        
        // Convert story nodes to graph nodes
        Object.keys(storyNodes).forEach(nodeId => {
            const storyNode = storyNodes[nodeId];
            
            this.nodes.push({
                id: nodeId,
                title: storyNode.title,
                content: storyNode.content,
                type: storyNode.type || 'default',
                timeDistortion: !!storyNode.timeDistortion,
                hasChoices: !!(storyNode.choices && storyNode.choices.length > 0),
                isEnding: this.isEndingNode(storyNode),
                choiceCount: storyNode.choices ? storyNode.choices.length : 0,
                exitCount: storyNode.exits ? Object.keys(storyNode.exits).length : 0
            });
            
            // Create links from exits
            if (storyNode.exits) {
                Object.entries(storyNode.exits).forEach(([direction, targetId]) => {
                    this.links.push({
                        source: nodeId,
                        target: targetId,
                        type: 'navigation',
                        direction: direction
                    });
                });
            }
            
            // Create links from choices
            if (storyNode.choices) {
                storyNode.choices.forEach(choice => {
                    this.links.push({
                        source: nodeId,
                        target: choice.nextNode,
                        type: 'choice',
                        choiceText: choice.text
                    });
                });
            }
        });
    }
    
    // Check if a node is an ending node (no exits or choices)
    isEndingNode(storyNode) {
        const hasExits = storyNode.exits && Object.keys(storyNode.exits).length > 0;
        const hasChoices = storyNode.choices && storyNode.choices.length > 0;
        return !hasExits && !hasChoices;
    }
    
    // Create the main D3.js visualization
    createVisualization() {
        // Clear any existing visualization
        d3.select('#story-map').selectAll('*').remove();
        
        // Create SVG
        this.svg = d3.select('#story-map')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
        
        // Add zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
            
        this.svg.call(zoom);
        
        // Create main group for zoomable content
        this.g = this.svg.append('g');
        
        // Create arrow markers for directed edges
        this.svg.append('defs').selectAll('marker')
            .data(['navigation', 'choice'])
            .enter().append('marker')
            .attr('id', d => `arrow-${d}`)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 35)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', d => d === 'choice' ? '#e74c3c' : '#34495e');
        
        // Create force simulation
        this.simulation = d3.forceSimulation(this.nodes)
            .force('link', d3.forceLink(this.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('x', d3.forceX(this.width / 2).strength(0.01))
            .force('y', d3.forceY(this.height / 2).strength(0.07))
            .force('collision', d3.forceCollide().radius(this.nodeRadius + 5));
        
        this.createLinks();
        this.createNodes();
        this.createLabels();
        
        // Start simulation
        this.simulation.on('tick', () => this.tick());
    }
    
    createLinks() {
        this.linkElements = this.g.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.links)
            .enter().append('line')
            .attr('stroke', d => d.type === 'choice' ? '#e74c3c' : '#7f8c8d')
            .attr('stroke-width', d => d.type === 'choice' ? 3 : 2)
            .attr('stroke-dasharray', d => d.type === 'choice' ? '5,5' : 'none')
            .attr('marker-end', d => `url(#arrow-${d.type})`)
            .on('mouseover', (event, d) => this.showLinkTooltip(event, d))
            .on('mouseout', () => this.hideLinkTooltip());
    }
    
    createNodes() {
        this.nodeElements = this.g.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(this.nodes)
            .enter().append('circle')
            .attr('r', this.nodeRadius)
            .attr('fill', d => this.colors[d.type] || this.colors.default)
            .attr('stroke', d => {
                if (d.isEnding) return '#e74c3c';
                if (d.timeDistortion) return '#f39c12';
                return '#2c3e50';
            })
            .attr('stroke-width', d => {
                if (d.isEnding) return 4;
                if (d.timeDistortion) return 3;
                return 2;
            })
            .attr('stroke-dasharray', d => d.timeDistortion ? '3,3' : 'none')
            .style('cursor', 'pointer')
            .on('click', (event, d) => this.selectNode(d))
            .on('mouseover', (event, d) => this.showNodeTooltip(event, d))
            .on('mouseout', () => this.hideNodeTooltip())
            .call(d3.drag()
                .on('start', (event, d) => this.dragStarted(event, d))
                .on('drag', (event, d) => this.dragged(event, d))
                .on('end', (event, d) => this.dragEnded(event, d)));
        
        // Add special indicators for choice nodes
        this.g.append('g')
            .attr('class', 'choice-indicators')
            .selectAll('circle')
            .data(this.nodes.filter(d => d.hasChoices))
            .enter().append('circle')
            .attr('r', 8)
            .attr('fill', '#e74c3c')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('pointer-events', 'none');
    }
    
    createLabels() {
        this.labelElements = this.g.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(this.nodes)
            .enter().append('text')
            .text(d => d.title)
            .attr('font-size', '12px')
            .attr('font-family', 'Arial, sans-serif')
            .attr('text-anchor', 'middle')
            .attr('dy', this.nodeRadius + 15)
            .attr('fill', '#2c3e50')
            .style('pointer-events', 'none');
    }
    
    tick() {
        this.linkElements
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        this.nodeElements
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        this.labelElements
            .attr('x', d => d.x)
            .attr('y', d => d.y);
        
        // Update choice indicators
        this.g.selectAll('.choice-indicators circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y - this.nodeRadius - 8);
    }
    
    // Drag handlers
    dragStarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    dragEnded(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    // Node selection and information display
    selectNode(node) {
        // Highlight selected node
        this.nodeElements.attr('opacity', d => d.id === node.id ? 1 : 0.6);
        this.linkElements.attr('opacity', d => 
            d.source.id === node.id || d.target.id === node.id ? 1 : 0.3
        );
        
        // Update node info panel
        this.displayNodeInfo(node);
        this.displayNodeBranches(node);
    }
    
    displayNodeInfo(node) {
        const infoDiv = document.getElementById('node-info');
        
        const connectionInfo = this.getNodeConnections(node.id);
        
        infoDiv.innerHTML = `
            <h4>${node.title}</h4>
            <p><strong>Type:</strong> ${node.type}</p>
            <p><strong>Node ID:</strong> ${node.id}</p>
            <p><strong>Has Choices:</strong> ${node.hasChoices ? 'Yes' : 'No'}</p>
            ${node.hasChoices ? `<p><strong>Choice Count:</strong> ${node.choiceCount}</p>` : ''}
            <p><strong>Navigation Exits:</strong> ${node.exitCount}</p>
            <p><strong>Time Distortion:</strong> ${node.timeDistortion ? 'Yes' : 'No'}</p>
            <p><strong>Is Ending:</strong> ${node.isEnding ? 'Yes' : 'No'}</p>
            <p><strong>Incoming Connections:</strong> ${connectionInfo.incoming}</p>
            <p><strong>Outgoing Connections:</strong> ${connectionInfo.outgoing}</p>
            <p><strong>Plot Description:</strong> ${node.content}</p>
        `;
    }
    
    getNodeConnections(nodeId) {
        const incoming = this.links.filter(link => link.target.id === nodeId).length;
        const outgoing = this.links.filter(link => link.source.id === nodeId).length;
        return { incoming, outgoing };
    }
    

    
    // Tooltip functions
    showNodeTooltip(event, node) {
        // Create tooltip element if it doesn't exist
        let tooltip = d3.select('body').select('.node-tooltip');
        if (tooltip.empty()) {
            tooltip = d3.select('body').append('div')
                .attr('class', 'node-tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0,0,0,0.8)')
                .style('color', 'white')
                .style('padding', '8px')
                .style('border-radius', '4px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('opacity', 0);
        }
        
        tooltip.transition().duration(200).style('opacity', 1);
        tooltip.html(`
            <strong>${node.title}</strong><br/>
            Type: ${node.type}<br/>
            ${node.timeDistortion ? 'Time Distortion<br/>' : ''}
            ${node.hasChoices ? `${node.choiceCount} choices<br/>` : ''}
            ${node.isEnding ? 'Ending node' : ''}
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    }
    
    hideNodeTooltip() {
        d3.select('.node-tooltip').transition().duration(200).style('opacity', 0);
    }
    
    showLinkTooltip(event, link) {
        let tooltip = d3.select('body').select('.link-tooltip');
        if (tooltip.empty()) {
            tooltip = d3.select('body').append('div')
                .attr('class', 'link-tooltip')
                .style('position', 'absolute')
                .style('background', 'rgba(0,0,0,0.8)')
                .style('color', 'white')
                .style('padding', '8px')
                .style('border-radius', '4px')
                .style('font-size', '12px')
                .style('pointer-events', 'none')
                .style('opacity', 0);
        }
        
        tooltip.transition().duration(200).style('opacity', 1);
        const sourceNode = this.nodes.find(n => n.id === link.source.id);
        const targetNode = this.nodes.find(n => n.id === link.target.id);
        
        tooltip.html(`
            <strong>${sourceNode.title}</strong><br/>
            → <strong>${targetNode.title}</strong><br/>
            ${link.type === 'choice' ? `Choice: "${link.choiceText}"` : `Direction: ${link.direction}`}
        `)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px');
    }
    
    hideLinkTooltip() {
        d3.select('.link-tooltip').transition().duration(200).style('opacity', 0);
    }
    
    // Control panel functions
    setupControls() {
        // Type filter
        document.getElementById('type-filter').addEventListener('change', (e) => {
            this.filterByType(e.target.value);
        });
        
        // Time distortion filter
        document.getElementById('time-distortion-only').addEventListener('change', (e) => {
            this.filterByTimeDistortion(e.target.checked);
        });
        
        // Choice nodes filter
        document.getElementById('choice-nodes-only').addEventListener('change', (e) => {
            this.filterByChoiceNodes(e.target.checked);
        });
        
        // Reset view
        document.getElementById('reset-view').addEventListener('click', () => {
            this.resetFilters();
        });
        
        // Center graph
        document.getElementById('center-graph').addEventListener('click', () => {
            this.centerGraph();
        });
        
        // Path finder
        document.getElementById('find-paths').addEventListener('click', () => {
            this.findPaths();
        });
        // Find Node functionality
        document.getElementById('find-node-button').addEventListener('click', () => {
            const nodeId = document.getElementById('find-node-selector').value;
            if (nodeId) {
                const node = this.nodes.find(n => n.id === nodeId);
                if (node) this.focusOnNode(node);
            }
        });
    }
    
    filterByType(type) {
        if (type === 'all') {
            this.nodeElements.style('display', 'block');
            this.labelElements.style('display', 'block');
        } else {
            this.nodeElements.style('display', d => d.type === type ? 'block' : 'none');
            this.labelElements.style('display', d => d.type === type ? 'block' : 'none');
        }
        this.updateVisibleLinks();
    }
    
    filterByTimeDistortion(showOnly) {
        if (showOnly) {
            this.nodeElements.style('display', d => d.timeDistortion ? 'block' : 'none');
            this.labelElements.style('display', d => d.timeDistortion ? 'block' : 'none');
        } else {
            this.nodeElements.style('display', 'block');
            this.labelElements.style('display', 'block');
        }
        this.updateVisibleLinks();
    }
    
    filterByChoiceNodes(showOnly) {
        if (showOnly) {
            this.nodeElements.style('display', d => d.hasChoices ? 'block' : 'none');
            this.labelElements.style('display', d => d.hasChoices ? 'block' : 'none');
        } else {
            this.nodeElements.style('display', 'block');
            this.labelElements.style('display', 'block');
        }
        this.updateVisibleLinks();
    }
    
    updateVisibleLinks() {
        this.linkElements.style('display', d => {
            const sourceVisible = this.nodeElements.filter(n => n.id === d.source.id).style('display') !== 'none';
            const targetVisible = this.nodeElements.filter(n => n.id === d.target.id).style('display') !== 'none';
            return sourceVisible && targetVisible ? 'block' : 'none';
        });
    }
    
    resetFilters() {
        document.getElementById('type-filter').value = 'all';
        document.getElementById('time-distortion-only').checked = false;
        document.getElementById('choice-nodes-only').checked = false;
        
        this.nodeElements.style('display', 'block').attr('opacity', 1);
        this.labelElements.style('display', 'block');
        this.linkElements.style('display', 'block').attr('opacity', 1);
    }
    
    centerGraph() {
        this.svg.transition().duration(750).call(
            d3.zoom().transform,
            d3.zoomIdentity.translate(0, 0).scale(1)
        );
    }
    
    // Statistics and analysis
    updateStatistics() {
        const stats = {
            totalNodes: this.nodes.length,
            choiceNodes: this.nodes.filter(n => n.hasChoices).length,
            navNodes: this.nodes.filter(n => n.exitCount > 0 && !n.hasChoices).length,
            endingNodes: this.nodes.filter(n => n.isEnding).length,
            timeDistortionNodes: this.nodes.filter(n => n.timeDistortion).length
        };
        
        document.getElementById('total-nodes').textContent = stats.totalNodes;
        document.getElementById('choice-nodes-count').textContent = stats.choiceNodes;
        document.getElementById('nav-nodes-count').textContent = stats.navNodes;
        document.getElementById('ending-nodes-count').textContent = stats.endingNodes;
        document.getElementById('time-distortion-count').textContent = stats.timeDistortionNodes;
    }
    
    populateNodeSelectors() {
        const startSelect = document.getElementById('start-node');
        const endSelect = document.getElementById('end-node');
        const findSelect = document.getElementById('find-node-selector');
        
        this.nodes.forEach(node => {
            const option1 = document.createElement('option');
            option1.value = node.id;
            option1.textContent = node.title;
            startSelect.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = node.id;
            option2.textContent = node.title;
            endSelect.appendChild(option2);

            const option3 = document.createElement('option');
            option3.value = node.id;
            option3.textContent = node.title;
            findSelect.appendChild(option3);
        });
    }
    
    findPaths() {
        const startId = document.getElementById('start-node').value;
        const endId = document.getElementById('end-node').value;
        
        if (!startId || !endId) {
            document.getElementById('path-results').innerHTML = '<p>Please select both start and end nodes.</p>';
            return;
        }
        
        const paths = this.findAllPaths(startId, endId);
        const resultsDiv = document.getElementById('path-results');
        
        if (paths.length === 0) {
            resultsDiv.innerHTML = '<p>No paths found between selected nodes.</p>';
        } else {
            let html = `<h4>Found ${paths.length} path(s):</h4>`;
            paths.forEach((path, index) => {
                html += `<div class="path-result">
                    <strong>Path ${index + 1} (${path.length} steps):</strong><br/>
                    ${path.map(nodeId => this.nodes.find(n => n.id === nodeId).title).join(' → ')}
                </div>`;
            });
            resultsDiv.innerHTML = html;
        }
    }
    
    findAllPaths(startId, endId, visited = new Set(), currentPath = []) {
        if (startId === endId) {
            return [currentPath.concat(startId)];
        }
        
        if (visited.has(startId)) {
            return [];
        }
        
        visited.add(startId);
        const paths = [];
        
        const outgoingLinks = this.links.filter(link => link.source.id === startId);
        
        outgoingLinks.forEach(link => {
            const subPaths = this.findAllPaths(link.target.id, endId, new Set(visited), currentPath.concat(startId));
            paths.push(...subPaths);
        });
        
        return paths;
    }

    focusOnNode(node) {
        const transform = d3.zoomIdentity
            .translate(this.width / 2 - node.x, this.height / 2 - node.y)
            .scale(1.5);

        this.svg.transition().duration(750).call(
            d3.zoom().transform,
            transform
        );
        // Visually highlight the node
        this.nodeElements.attr('stroke-width', d => d.id === node.id ? 5 : 2);
        this.selectNode(node);
    }

}

// Initialize the visualization when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if storyNodes is available
    if (typeof storyNodes === 'undefined') {
        document.getElementById('story-map').innerHTML = 
            '<p style="text-align: center; color: red; padding: 50px;">Error: story.js file not found or storyNodes not defined.</p>';
        return;
    }
    
    // Create the visualization
    new StoryMapVisualizer();
});