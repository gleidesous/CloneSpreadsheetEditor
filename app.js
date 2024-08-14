// Gleidson De Sousa
// desousag@bc.edu
// 08/01/2024

//video time: 1:05:10

//Outer function redraws the grid everytime with the new values
(function () {
    function create2DArray(N, M, defaultValue = '') {
        let arr = new Array(N)
        for (let i = 0; i < N; i++) {
            if (typeof defaultValue == "object") {
                arr[i] = new Array(M).fill({...defaultValue});
            } else {
                arr[i] = new Array(M).fill(defaultValue)
            }
        }
        return arr;
    }
    const rowCount = 100;
    const colCount = 100;
    let mode = "NORMAL" //Can be NORMAL or SEARCH

    let selectedCell = {
        row: 1, col: 1 
    }
    let selectedCellRange = {
        startRow: selectedCell.row,
        endRow: selectedCell.row,
        startCol: selectedCell.col,
        endCol: selectedCell.col
    }
    let spreadsheetData = create2DArray(rowCount, colCount, '');
    let cellProperties = create2DArray(rowCount, colCount, {
        textAlign: "left"
    })

    let canvas;
    let ctx;
    let rowHeights = new Array(rowCount).fill(26);
    let colWidths = new Array(colCount).fill(100);

    //Hold the different functions that we can call
    var DrawFunctions = (function() {
        function getCellPosition(row, col) {
            let y = 0;
            for (let r = 0; r < row; r++) {
                y += rowHeights[r];
            }
            let x = 0;
            for (let c = 0; c < col; c++) {
                x += colWidths[c];
            }
            return {x, y};    
        }

        function drawSingleCell(row, col) {
            const props = cellProperties[row][col];
            const pos = getCellPosition(row, col);
            
            ctx.strokeRect(pos.x, pos.y, colWidths[col], rowHeights[row]);
        }

        function drawCells() {
            for (let row = 0; row < rowCount; row++) {
                for (let col = 0; col < colCount; col++) {
                    drawSingleCell(row, col)
                }
            }
        }

        function drawSelectedCellBorder(){
            const pos = getCellPosition(selectedCell.row, selectedCell.col);
            const borderDiv = document.getElementById("selectedCellBorder");
            borderDiv.style.display = "block";
            borderDiv.style.left = `${pos.x + 1}px`;
            borderDiv.style.top = `${pos.y + 1}px`;
            borderDiv.style.width = `${colWidths[selectedCell.col] - 1}px`;
            borderDiv.style.height = `${rowHeights[selectedCell.row] - 1}px`;
            borderDiv.style.border = "3px solid blue";
        }

        function drawGrid() {
            ctx.clearRect(0,0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            drawCells();
            drawSelectedCellBorder()

        }
        return {drawGrid};
    })()



    document.addEventListener("DOMContentLoaded", function() {
        canvas = document.getElementById("spreadsheet");
        ctx = canvas.getContext("2d");
        const canvasWidth = 1200
        const canvasHeight = 1700
        const ratio = window.devicePixelRatio;
        canvas.width = canvasWidth * ratio;
        canvas.height = canvasHeight * ratio;
        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";
        
        ctx.scale(ratio, ratio);

        //Draws the most current grid based in the changes made
        DrawFunctions.drawGrid()

    })

    function canSelectedCellBeShifted(key) {
        const r = selectedCell.row;
        const c = selectedCell.col;
        if (key == "ArrowLeft") {
            return c > 1
        }
        if (key == "ArrowRight") {
            return c < colCount - 1;
        }
        if (key == "ArrowUp") {
            return r > 1;
        }
        if (key == "ArrowDown") {
            return r < rowCount - 1;
        }
    }

    function handleNormalArrowKeys(key) {
        console.log(key)
        if (canSelectedCellBeShifted(key)) {
            switch(key) {
                case "ArrowLeft":
                    selectedCell.col -= 1;
                    break;
                case "ArrowRight":
                    selectedCell.col += 1;
                    break;
                case "ArrowUp":
                    selectedCell.row -= 1;
                    break;
                case "ArrowDown":
                    selectedCell.row += 1;
                    break;
            }
        }

    }

    function handleArrowKeys(key) {
        if (mode == "NORMAL") {
            handleNormalArrowKeys(key)
        }
    }

    document.addEventListener("keydown", function(event) {
        let key = event.key
        if (event.shiftKey && ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(key)) {
            event.preventDefault()
            // handle shift key press
        } else if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(key)) {
            event.preventDefault()
            handleArrowKeys(key);
        }
    })
})()