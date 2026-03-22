/*
Sudoku-standard 9x9
Valid sudoku have only one solution
Recursion+backtracking+Depth First Search (DFS).
try a number->check valid(yes-go deep) else backtrack

todo
1.create a full valid sudoku
2.remove element->check if only one solution
                  yes->move next
                  no->backtrack

Level     Clues kept
Easy          ~46
Medium        ~32
Hard          ~24



isValid
    [
    [1,2,3,4,5,6,7,8,9]->row 1(first array)
    [1,2,3,4,5,6,7,8,9]->row 2(second array)
    ]
col:-1,2,3,4,5,6,7,8,9

3x3
[
[[1,2,3]..]
[[1,2,3]..]
[[1,2,3]..]
]
//row
Math.floor(row/3)->gives in which box,row(index) is present
if row=2->(row/3)=0 which means 0-index(first) box
*3 to get starting index
[
[.[1,2,3].]
[.[1,2,3].]
[.[1,2,3].]
]
row=4;box-1*3=3(index)
Math.floor(i / 3)
0,1,2=0
3,4,5-1
6,7,8-2
move down row

//col
same logic
i%3=
0
1
2
0
1
2
.....
*/




/*
using loops

function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num) return false;//check row
        if (board[i][col] === num) return false;//check column
        //3x3 board check
        const boxRow = 3 * (Math.floor(row / 3)) + Math.floor(i / 3);
        const boxcol = 3 * (Math.floor(col / 3)) + (i % 3);
        if (board[boxRow][boxcol] === num) return false;
    }
    return true;
}


function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function createFullBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                shuffle(nums);
                for (let num of nums) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (createFullBoard(board)) return true;//recursion
                        board[row][col] = 0;//backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}


function countSolution(board) {
    let count = 0;
    function solve() {
        if (count > 1) return;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let i = 1; i <= 9; i++) {
                        if (isValid(board, row, col, i)) {
                            board[row][col] = i;
                            solve()//DFS
                            board[row][col] = 0;
                        }
                    }
                    return;
                }
            }
        }
        count++;
    }
    solve();
    return count;
}

function removeNumbers(board, remove = 40) {
    let attempts = remove * 2;
    let removed = 0;
    while (attempts > 0 && removed < remove) {
        const index = Math.floor(Math.random() * 81);
        const row = Math.floor(index / 9);
        const col = index % 9;
        if (board[row][col] === 0) {
            attempts--;
            continue;
        };
        let backup = board[row][col];
        board[row][col] = 0;
        const solution = countSolution(board);
        if (solution !== 1) {
            board[row][col] = backup;
            attempts--;
        } else {
            removed++;
        }

    }
}


createFullBoard(solution);
solve = solution.map(row => [...row]);
removeNumbers(solve, level["easy"]);
*/




/*
bitwise operator
1.
x>>n right shift = x/2^n
x<<n left shift = x*2^n

2.
0101 | 1001 = 1101 (return 1 if atleast one bit is 1)
0101 & 1001 = 0001  (return 1 if both are 1)
0101 ^ 1001 = 1100 (return 1 if bits are different)
~(not)-invert all bits
*/

//using bitmask
class Suduko {
    constructor() {
        this.SIZE = 9;
        this.FULL_MASK = 0x3FE;//1022(b1111111110)->1 to 9 bit are ON,0 bit is OFF.
        this.rows = new Array(9).fill(0);//000000000  1 digit represent entire row
        this.cols = new Array(9).fill(0);//000000000  1 digit represent entire col
        this.boxes = new Array(9).fill(0);//000000000  1 digit represent entire boxes(3x3)
    }

    getBoxIndex(row, col) {
        return Math.floor(row / 3) * 3 + Math.floor(col / 3);
    }

    place(board, row, col, num) {
        let mask = 1 << num;
        /*
        1=000001;
        num=3;
        mask=001000->3rd bit is on
        */
        board[row][col] = num;
        //set in rows,cols and boxes
        this.rows[row] |= mask;
        this.cols[col] |= mask;
        this.boxes[this.getBoxIndex(row, col)] |= mask;
    }

    remove(board, row, col, num) {
        let mask = 1 << num;
        board[row][col] = 0;
        //^ -> if ON turn it OFF
        this.rows[row] ^= mask;
        this.cols[col] ^= mask;
        this.boxes[this.getBoxIndex(row, col)] ^= mask;
    }

    getAvailable(row, col) {
        const used = this.rows[row] | this.cols[col] | this.boxes[this.getBoxIndex(row, col)];
        return (~used) & this.FULL_MASK;
    }

    solve(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    let available = this.getAvailable(row, col);
                    while (available) {
                        let bit = available & -available;
                        /*
                         available=00100
                         zeroth position ignored
                         2 is available
                         
                         Negative number follow two complement
                         1.invert the bit
                         2.add 1
                         
                         1-11011
                         2-11100   
                          =11100 
                          
                        00100 & 11100=00100
                        */
                        let num = Math.log2(bit);//converts bit position to digit
                        this.place(board, row, col, num);
                        if (this.solve(board)) return true;
                        this.remove(board, row, col, num);
                        available ^= bit;
                    }
                    return false;
                }
            }
        }
        return true;
    }

    countSolution(board) {
        let count = 0;
        //we need this so use arrow function
        const dfs = () => {
            if (count > 1) return;
            for (let r = 0; r < 9; r++) {
                for (let c = 0; c < 9; c++) {
                    if (board[r][c] === 0) {
                        let available = this.getAvailable(r, c);
                        while (available) {
                            let bit = available & -available;
                            let num = Math.log2(bit);
                            this.place(board, r, c, num);
                            dfs();
                            this.remove(board, r, c, num);
                            available ^= bit;
                        }
                        return;
                    }
                }
            }
            count++;
        }
        dfs();
        return count;
    }
    init(board) {
        this.rows.fill(0);
        this.cols.fill(0);
        this.boxes.fill(0);


        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (board[r][c] !== 0) {
                    this.place(board, r, c, board[r][c]);
                }
            }
        }
    }

    shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    getFullBoard() {
        const board = Array.from({ length: 9 }, () => Array(9).fill(0));
        this.init(board);
        this.solve(board);
        return board;
    }

    generatePuzzle(board, remove = 40) {
        const puzzle = board.map((row) => [...row]);
        let attempts = remove * 2;
        let removed = 0;
        while (attempts > 0 && removed < remove) {
            let index = Math.floor(Math.random() * 81);
            let row = Math.floor(index / 9);
            let col = index % 9;

            if (puzzle[row][col] === 0) {
                attempts--;
                continue;
            }

            let backup = puzzle[row][col];
            puzzle[row][col] = 0;

            this.init(puzzle);
            let solutions = this.countSolution(puzzle);

            if (solutions !== 1) {
                puzzle[row][col] = backup;
                attempts--;
            } else {
                removed++;
            }
        }
        return puzzle;
    }
}

const levels = { "easy": 30, "medium": 40, "hard": 50 };
const sudoku = new Suduko();
let solution = sudoku.getFullBoard();
let puzzle = sudoku.generatePuzzle(solution, levels.medium);






//dom


//helper
const $ = id => document.getElementById(id);
const $qs = selector => document.querySelector(selector);
const $qsAll = selector => document.querySelectorAll(selector);



function getRowAndCol(index) {
    const row = Math.floor(index / 9);
    const col = index % 9;
    return [row, col];
}

function getIndex(row, col) {
    return row * 9 + col;
}

function insertInput() {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < 81; i++) {
        const [row, col] = getRowAndCol(i);
        const input = document.createElement("input");
        input.type = "number";
        input.maxLength = 1;
        input.min = 1;
        input.max = 9;
        input.id = i;
        if (col % 3 === 2) input.style.borderRight = "2px solid white";
        if (row % 3 === 2) input.style.borderBottom = "2px solid white";
        frag.append(input);
    }
    $qs(".loading").style.height = "0";
    $qs(".loading").remove();
    $qs(".sudoku").append(frag);
}
insertInput();



function fillPuzzle(level, init = false) {
    if (!init) {
        solution = sudoku.getFullBoard();
        puzzle = sudoku.generatePuzzle(solution, level);
    }
    const input = $qsAll("input");
    input.forEach((inp) => {
        const [row, col] = getRowAndCol(parseInt(inp.id));
        const value = puzzle[row][col];;
        inp.value = "";
        inp.removeAttribute("disabled");
        inp.classList.remove("check", "red", "green");
        if (value === 0) {
            inp.classList.add("check");
            return;
        };
        inp.value = value;
        inp.setAttribute("disabled", true);
    })
}
fillPuzzle(undefined, true);




$qsAll(".level button").forEach((l) => {
    l.addEventListener("click", () => {
        $qsAll(".level button").forEach((l) => l.classList.remove("active"));
        l.classList.add("active");
        fillPuzzle(levels[`${l.id}`]);
    })
})


function check() {
    $qsAll(".check").forEach((check) => {
        const value = check.value;
        check.classList.remove("red");
        if (!value || value.trim() === "" || isNaN(Number(value))) return;
        const [row, col] = getRowAndCol(parseInt(check.id));
        if (Number(value) !== solution[row][col]) {
            check.classList.add("red");
        }
    })
}

$qsAll("input").forEach((inp) => {
    inp.addEventListener("change", () => {
        inp.classList.remove("red");
    })
})
$("check").addEventListener("click", check);



function checkWin() {
    const input = $qsAll("input")

    for (let i = 0; i < input.length; i++) {
        if (!input[i].value || input[i].value.trim() === "" || isNaN(Number(input[i].value))) {
            return;
        }
        const [row, col] = getRowAndCol(parseInt(input[i].id));
        if (Number(input[i].value) !== solution[row][col]) return;
    }
    input.forEach((inp) => {
        inp.setAttribute("disabled", true);
        inp.classList.add("green");
    });
    alert("Won!!");
}

$("win").addEventListener("click", checkWin);