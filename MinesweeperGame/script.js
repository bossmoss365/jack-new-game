
document.addEventListener("DOMContentLoaded", () => {
    const gridElement = document.getElementById('grid');
    const gridSize = 10;
    const mineCount = 15;
    let grid = [];

    function initGame() {
        grid = createGrid(gridSize, mineCount);
        renderGrid(grid, gridElement);
    }

    function createGrid(size, mines) {
        let grid = new Array(size).fill(null).map(() => new Array(size).fill(0));
        placeMines(grid, mines);
        return grid;
    }

    function placeMines(grid, mines) {
        let placedMines = 0;
        while (placedMines < mines) {
            let row = Math.floor(Math.random() * grid.length);
            let col = Math.floor(Math.random() * grid[0].length);
            if (grid[row][col] !== 'M') {
                grid[row][col] = 'M';
                placedMines++;
            }
        }
    }

    function renderGrid(grid, container) {
        container.innerHTML = '';
        grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('grid-cell');
                cellElement.addEventListener('click', () => onCellClick(rowIndex, colIndex));
                container.appendChild(cellElement);
            });
        });
    }

    function onCellClick(row, col) {
        // Implement logic for when a cell is clicked
        console.log(`Cell clicked: Row ${row}, Col ${col}`);
    }

    initGame();
});
