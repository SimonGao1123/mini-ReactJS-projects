import { useState } from 'react'
import './App.css'

function Square ({value, clickFunction}) {
    return <button className="square" onClick={clickFunction}>{value}</button>;
}
/* 0 1 2
   3 4 5
   6 7 8
*/
const handleWinner = (squares) => {
    const winningIndexes = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 4, 8],
        [2, 4, 6],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8]
    ]

    for (let i = 0; i < winningIndexes.length; i++) {
        const win = winningIndexes[i];
        if (squares[win[0]] && squares[win[1]] && squares[win[2]] && 
            (squares[win[0]] == squares[win[1]] && squares[win[1]] == squares[win[2]])) {
            return squares[win[0]];
        }
    }
    return null;
}
function Board ({XIsNext, squares, handlePlay}) {
    // each index in squares array will hold "X" or "O"
    const ifWin = handleWinner(squares); 
    
    let displayText = ifWin ? (ifWin == "X" ? "Player X has won" : "Player O has won") : 
    (XIsNext ? "Player X's turn" : "Player O's turn");
    if (!ifWin && squares.every(square => square)) {
        displayText="TIE!!!";
    }
    const handleClick = (index) => {
        if (squares[index] || ifWin) return;

        const newArr = [...squares];
        newArr[index] = XIsNext ? "X" : "O";
        
        handlePlay(newArr); 
    }

    return (
    <>
        <div id="display">{displayText}</div>
        <div id="container">
            {squares.map((value, index) => {
                return <Square value={value} clickFunction={()=>handleClick(index)}/>
            })}
        </div>
    </>);
}
export default function Game () {
    const [move, setMove] = useState(0);
    const [history, setHistory] = useState([Array(9).fill(null)]);
    let XIsNext = move % 2 === 0;
    const currentMove = history[move];
    const [isReversed, setReversed] = useState(false);
    function jumpBack (moveNum) {
        setMove(moveNum); // NOTE changing the useState will RERUN the function
    }
    function handlePlay (nextSquares) {
        const nextHistory = [...history.slice(0, move + 1), nextSquares];
        setHistory(nextHistory);
        setMove(nextHistory.length - 1);

    }
    const moves = history.map((board, moveNum) => {
        let description;
        if (moveNum == move) {
            description="You are currently at move #" + moveNum;
            return <li key={moveNum}>{description}</li>
        }
        if (moveNum > 0) {
            description="Go to move #" + moveNum;
            return <li key={moveNum}><button onClick={()=>jumpBack(moveNum)}>{description}</button></li>
        } else {
            description="Go to start of game";
            return (<li key={moveNum}>
                <button onClick={()=>jumpBack(moveNum)}>{description}</button>
                </li>);
        }
    });

    function reverseFunction () {
        return setReversed(!isReversed);
    }
    return (
        <>
            <Board XIsNext={XIsNext} squares={currentMove} handlePlay={handlePlay}/>
            <ul>{isReversed ? [...moves].reverse() : moves}</ul>
            <div id="reverse-container">
                <ReverseBtn reverseFunction={reverseFunction}/>
            </div>
        </>
    )
}
function ReverseBtn ({reverseFunction}) {
    return <button id="reverse-btn" onClick={reverseFunction}>Reverse Moves History</button>
}