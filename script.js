// ========================================
// ALGORITMO PRINCIPAL - MÁXIMO 50 LÍNEAS
// ========================================
function solveNQueens() {
    const solutions = [];
    const board = new Array(8).fill(-1);
    
    function isValid(row, col) {
        for (let i = 0; i < row; i++) {
            if (board[i] === col || 
                board[i] - i === col - row || 
                board[i] + i === col + row) {
                return false;
            }
        }
        return true;
    }
    
    function backtrack(row) {
        if (row === 8) {
            solutions.push([...board]);
            return;
        }
        
        for (let col = 0; col < 8; col++) {
            if (isValid(row, col)) {
                board[row] = col;
                backtrack(row + 1);
                board[row] = -1;
            }
        }
    }
    
    backtrack(0);
    return solutions;
}
// ========================================
// FIN DEL ALGORITMO PRINCIPAL (28 líneas)
// ========================================

// ========================================
// FUNCIONES AUXILIARES Y DE INTERFAZ
// ========================================
let interactiveBoard = [];
let currentQueens = [];
let allSolutions = [];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    createInteractiveBoard();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('findSolutions').addEventListener('click', findAllSolutions);
    document.getElementById('clearBoard').addEventListener('click', clearInteractiveBoard);
}

function createInteractiveBoard() {
    const boardElement = document.getElementById('interactiveBoard');
    boardElement.innerHTML = '';
    interactiveBoard = [];
    currentQueens = [];
    
    for (let row = 0; row < 8; row++) {
        interactiveBoard[row] = [];
        for (let col = 0; col < 8; col++) {
            const cell = document.createElement('div');
            cell.className = `cell ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
            interactiveBoard[row][col] = cell;
        }
    }
}

function handleCellClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    // Si ya hay una reina en esta posición, la removemos
    if (event.target.textContent === '♛') {
        removeQueen(row, col);
        return;
    }
    
    // Verificar si la posición es válida
    if (isValidPosition(row, col)) {
        placeQueen(row, col);
        showMessage('¡Posición válida! Reina colocada.', 'success');
        
        if (currentQueens.length === 8) {
            showMessage('¡Felicitaciones! Has resuelto el problema de las 8 reinas.', 'complete');
        }
    } else {
        showMessage('Posición inválida. La reina estaría en jaque.', 'error');
        highlightInvalidCell(event.target);
    }
}

function isValidPosition(row, col) {
    for (let queen of currentQueens) {
        // Misma fila o columna
        if (queen.row === row || queen.col === col) {
            return false;
        }
        
        // Misma diagonal
        if (Math.abs(queen.row - row) === Math.abs(queen.col - col)) {
            return false;
        }
    }
    return true;
}

function placeQueen(row, col) {
    const cell = interactiveBoard[row][col];
    cell.textContent = '♛';
    cell.classList.add('queen', 'valid');
    currentQueens.push({row, col});
    
    setTimeout(() => {
        cell.classList.remove('valid');
    }, 500);
}

function removeQueen(row, col) {
    const cell = interactiveBoard[row][col];
    cell.textContent = '';
    cell.classList.remove('queen');
    currentQueens = currentQueens.filter(queen => !(queen.row === row && queen.col === col));
    showMessage('Reina removida.', 'success');
}

function highlightInvalidCell(cell) {
    cell.classList.add('invalid');
    setTimeout(() => {
        cell.classList.remove('invalid');
    }, 500);
}

function showMessage(text, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    
    setTimeout(() => {
        messageElement.textContent = '';
        messageElement.className = 'message';
    }, 3000);
}

function clearInteractiveBoard() {
    currentQueens = [];
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const cell = interactiveBoard[row][col];
            cell.textContent = '';
            cell.classList.remove('queen', 'valid', 'invalid');
        }
    }
    showMessage('Tablero limpiado.', 'success');
}

function findAllSolutions() {
    showMessage('Calculando soluciones...', 'success');
    
    setTimeout(() => {
        allSolutions = solveNQueens();
        displayAllSolutions();
        document.getElementById('solutionCount').textContent = allSolutions.length;
        showMessage(`Se encontraron ${allSolutions.length} soluciones.`, 'complete');
    }, 100);
}

function displayAllSolutions() {
    const container = document.getElementById('solutionsContainer');
    container.innerHTML = '';
    
    allSolutions.forEach((solution, index) => {
        const solutionDiv = document.createElement('div');
        solutionDiv.className = 'solution-item';
        
        const title = document.createElement('div');
        title.className = 'solution-title';
        title.textContent = `Solución ${index + 1}`;
        solutionDiv.appendChild(title);
        
        const board = document.createElement('div');
        board.className = 'solution-board';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = `solution-cell ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
                
                if (solution[row] === col) {
                    cell.textContent = '♛';
                    cell.style.color = '#333';
                }
                
                board.appendChild(cell);
            }
        }
        
        solutionDiv.appendChild(board);
        container.appendChild(solutionDiv);
    });
}