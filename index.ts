import './index.css'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');
canvas.width = window.screen.width
canvas.height = window.screen.height
const cellDiameter = 10
const numRows = Math.ceil(canvas.height / cellDiameter)
const numCols = Math.ceil(canvas.width / cellDiameter)

const getNextGridGen = (grid: Array<Array<number>>) => {
    const nextGrid = grid.map(row => [...row])
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            nextGrid[i][j] = getNextCellGen(i, j, grid)
        }
    }
    return nextGrid
}

const getNextCellGen = (i: number, j: number, grid: Array<Array<number>>) => {
    const cell = grid[i][j]
    const liveNeighbors = countLiveNeighbors(i, j, grid)

    if (cell == 0 && liveNeighbors == 3) {
        return 1
    } else if (cell == 1 && (liveNeighbors == 2 || liveNeighbors == 3)) {
        return 1
    } else {
        return 0
    }
}

const countLiveNeighbors = (i: number, j: number, grid: Array<Array<number>>) => {
    // Treat grid as a toroidal array: top and bottom, left and right edges stitched together
    const up = i - 1 >= 0 ? i - 1 : numRows - 1
    const down = i + 1 < numRows ? i + 1 : 0
    const left = j - 1 >= 0 ? j - 1 : numCols - 1
    const right = j + 1 < numCols ? j + 1 : 0

    const neighbors = [
        grid[up][left], grid[up][j], grid[up][right],
        grid[i][left], grid[i][right],
        grid[down][left], grid[down][j], grid[down][right]
    ]

    return neighbors.reduce((acc, c) => acc + c)
}

const renderGrid = (grid: Array<Array<number>>) => {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            ctx.beginPath()
            ctx.arc(j * cellDiameter, i * cellDiameter, cellDiameter / 2, 0, 2 * Math.PI)
            ctx.fillStyle = grid[i][j] ? '#50a05f' : 'white'
            ctx.fill()
            ctx.closePath()
        }
    }
}

const update = (grid: Array<Array<number>>) => {
    const nextGrid = getNextGridGen(grid)
    renderGrid(nextGrid)
    setTimeout(() => requestAnimationFrame(() => update(nextGrid)), 500)
}

// Seed grid randomly with 0 and 1
const seedGrid = new Array(numRows).fill(0)
    .map(() => new Array(numCols).fill(0)
    .map(() => Math.round(Math.random())))

requestAnimationFrame(() => update(seedGrid))