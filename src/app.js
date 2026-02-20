// Initialize JSXGraph board
const board = JXG.JSXGraph.initBoard('jxgboard', {
    boundingbox: [-10, 10, 10, -10],
    axis: true,
    grid: true,
    showCopyright: false,
    showNavigation: false
});

// State management
let state = {
    mode: null,
    selectedPoints: [],
    points: [],
    lines: [],
    circles: []
};

// DOM elements
const pointBtn = document.getElementById('pointBtn');
const lineBtn = document.getElementById('lineBtn');
const circleBtn = document.getElementById('circleBtn');
const selectBtn = document.getElementById('selectBtn');
const clearBtn = document.getElementById('clearBtn');
const status = document.getElementById('status');
const pointCount = document.getElementById('pointCount');
const lineCount = document.getElementById('lineCount');
const circleCount = document.getElementById('circleCount');

// Update statistics display
function updateStats() {
    pointCount.textContent = state.points.length;
    lineCount.textContent = state.lines.length;
    circleCount.textContent = state.circles.length;
}

// Set mode and update UI
function setMode(mode) {
    state.mode = mode;
    state.selectedPoints = [];
    
    // Update button states
    [pointBtn, lineBtn, circleBtn, selectBtn].forEach(btn => {
        btn.classList.remove('active');
    });
    
    switch(mode) {
        case 'point':
            pointBtn.classList.add('active');
            setStatus('Click on the canvas to create a point', 'inactive');
            break;
        case 'line':
            lineBtn.classList.add('active');
            setStatus('Select 2 points to draw a line', 'inactive');
            break;
        case 'circle':
            circleBtn.classList.add('active');
            setStatus('Select center point, then point on circumference', 'inactive');
            break;
        case 'select':
            selectBtn.classList.add('active');
            setStatus('Select mode active', 'inactive');
            break;
        default:
            setStatus('Ready', 'inactive');
    }
}

// Update status message
function setStatus(message, type = 'inactive') {
    status.textContent = message;
    status.className = 'status ' + (type !== 'inactive' ? type : 'inactive');
}

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
    updateStats();
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
    updateStats();
    setStatus('Line created', 'inactive');
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
    updateStats();
    setStatus('Circle created', 'inactive');
}

// Board click handler
board.on('click', function(evt) {
    if (state.mode === null) return;
    
    const coords = board.getUsrCoordsOfMouse(evt);
    const x = coords[0];
    const y = coords[1];
    
    if (state.mode === 'point') {
        createPoint(x, y);
        setStatus('Point created', 'inactive');
    } 
    else if (state.mode === 'line') {
        // Find nearest point to click
        const nearbyPoint = findNearbyPoint(x, y);
        if (nearbyPoint) {
            state.selectedPoints.push(nearbyPoint);
            if (state.selectedPoints.length === 2) {
                drawLine(state.selectedPoints[0], state.selectedPoints[1]);
                state.selectedPoints = [];
            } else {
                setStatus(`Point 1 of 2 selected (${state.selectedPoints.length})`, 'inactive');
            }
        } else {
            setStatus('Click on a point! No point nearby.', 'error');
        }
    }
    else if (state.mode === 'circle') {
        // Find nearest point to click
        const nearbyPoint = findNearbyPoint(x, y);
        if (nearbyPoint) {
            state.selectedPoints.push(nearbyPoint);
            if (state.selectedPoints.length === 1) {
                setStatus('Center selected. Click point on circumference.', 'inactive');
            } else if (state.selectedPoints.length === 2) {
                drawCircle(state.selectedPoints[0], state.selectedPoints[1]);
                state.selectedPoints = [];
            }
        } else {
            setStatus('Click on a point! No point nearby.', 'error');
        }
    }
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

// Button event listeners
pointBtn.addEventListener('click', () => setMode('point'));
lineBtn.addEventListener('click', () => setMode('line'));
circleBtn.addEventListener('click', () => setMode('circle'));
selectBtn.addEventListener('click', () => setMode('select'));

clearBtn.addEventListener('click', () => {
    if (confirm('Clear all objects? This cannot be undone.')) {
        // Remove all objects from board
        state.points.forEach(p => board.removeObject(p));
        state.lines.forEach(l => board.removeObject(l));
        state.circles.forEach(c => board.removeObject(c));
        
        state.points = [];
        state.lines = [];
        state.circles = [];
        state.selectedPoints = [];
        state.mode = null;
        
        board.update();
        updateStats();
        setStatus('All objects cleared', 'inactive');
    }
});

// Initialize
updateStats();
setStatus('Ready', 'inactive');
