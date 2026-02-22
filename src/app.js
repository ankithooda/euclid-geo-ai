// Initialize JSXGraph board
const board = JXG.JSXGraph.initBoard('jxgboard', {
    boundingbox: [-1, 1, 1, -1],
    axis: false,
    grid: true,
    keepaspectratio: true,
    showCopyright: false,
    showNavigation: false
});

// State management
let state = {
    points: [],
    lines: [],
    circles: []
};



// Create a new point
function createPoint(x, y) {
    const point = board.create('point', [x, y], {
        size: 6,
        color: '#667eea',
        strokeColor: '#764ba2',
        strokeWidth: 2,
        name: `P${state.points.length + 1}`,
        withLabel: true,
        labelOffsetX: 5,
        labelOffsetY: -15
    });
    
    state.points.push(point);
    return point;
}

// Draw line between two points
function drawLine(point1, point2) {
    const line = board.create('line', [point1, point2], {
        color: '#ff9800',
        strokeWidth: 2,
        fixed: true
    });
    
    state.lines.push(line);
}

// Draw line segment between two points (not extending beyond them)
function drawSegment(point1, point2) {
    const segment = board.create('segment', [point1, point2], {
        color: '#ff9800',
        strokeWidth: 2,
        fixed: true
    });
    
    state.lines.push(segment);
}

// Draw circle with center and point on circumference
function drawCircle(center, pointOnCircumference) {
    const circle = board.create('circle', [center, pointOnCircumference], {
        color: '#4caf50',
        strokeWidth: 2,
        fixed: true,
        fillColor: '#4caf50',
        fillOpacity: 0.05
    });
    
    state.circles.push(circle);
}

// Board click handler - creates points on click
board.on('click', function(evt) {
    const coords = board.getUsrCoordsOfMouse(evt);
    const x = coords[0];
    const y = coords[1];
    createPoint(x, y);
});

// Find nearest point to coordinates
function findNearbyPoint(x, y, threshold = 0.3) {
    for (let point of state.points) {
        const dx = point.X() - x;
        const dy = point.Y() - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < threshold) {
            return point;
        }
    }
    return null;
}



// Command Palette
const commandInput = document.getElementById('commandInput');

// Helper to find point by label
function getPointByLabel(label) {
    return state.points.find(p => p.name === label);
}

// Execute command
function executeCommand(input) {
    const parts = input.trim().split(/\s+/);
    const command = parts[0]?.toLowerCase();
    
    if (!command) {
        setCommandOutput('', 'info');
        return;
    }
    
    if (command === 'help') {
        const helpText = `
Available Commands:
  line pointA pointB     - Draw infinite line through two points
  segment pointA pointB  - Draw line segment between two points
  circle pointA pointB   - Draw circle (pointA = center, pointB = on circumference)
  help                   - Show this message

Example:
  line P1 P2
  segment P1 P2
  circle P1 P3`;
        setCommandOutput(helpText, 'info');
        return;
    }
    
    if (command === 'line') {
        if (parts.length < 3) {
            setCommandOutput('Error: line requires 2 point labels\nUsage: line pointA pointB', 'error');
            return;
        }
        
        const pointA = getPointByLabel(parts[1]);
        const pointB = getPointByLabel(parts[2]);
        
        if (!pointA) {
            setCommandOutput(`Error: Point "${parts[1]}" not found`, 'error');
            return;
        }
        if (!pointB) {
            setCommandOutput(`Error: Point "${parts[2]}" not found`, 'error');
            return;
        }
        
        drawLine(pointA, pointB);
        setCommandOutput(`✓ Line created between ${parts[1]} and ${parts[2]}`, 'success');
        return;
    }
    
    if (command === 'segment') {
        if (parts.length < 3) {
            setCommandOutput('Error: segment requires 2 point labels\nUsage: segment pointA pointB', 'error');
            return;
        }
        
        const pointA = getPointByLabel(parts[1]);
        const pointB = getPointByLabel(parts[2]);
        
        if (!pointA) {
            setCommandOutput(`Error: Point "${parts[1]}" not found`, 'error');
            return;
        }
        if (!pointB) {
            setCommandOutput(`Error: Point "${parts[2]}" not found`, 'error');
            return;
        }
        
        drawSegment(pointA, pointB);
        setCommandOutput(`✓ Segment created between ${parts[1]} and ${parts[2]}`, 'success');
        return;
    }
    
    if (command === 'circle') {
        if (parts.length < 3) {
            setCommandOutput('Error: circle requires 2 point labels\nUsage: circle pointA pointB', 'error');
            return;
        }
        
        const center = getPointByLabel(parts[1]);
        const pointOnCirc = getPointByLabel(parts[2]);
        
        if (!center) {
            setCommandOutput(`Error: Point "${parts[1]}" not found`, 'error');
            return;
        }
        if (!pointOnCirc) {
            setCommandOutput(`Error: Point "${parts[2]}" not found`, 'error');
            return;
        }
        
        drawCircle(center, pointOnCirc);
        setCommandOutput(`✓ Circle created (center: ${parts[1]}, circumference: ${parts[2]})`, 'success');
        return;
    }
    
    setCommandOutput(`Error: Unknown command "${command}"\nType "help" for available commands`, 'error');
}

function setCommandOutput(text, type = 'info') {
    // Output display removed
}

// Command input handler
commandInput.addEventListener('keydown', (evt) => {
    if (evt.key === 'Enter') {
        executeCommand(commandInput.value);
        commandInput.value = '';
    }
});

// Initialize
console.log('Euclid Geo AI - Ready');
