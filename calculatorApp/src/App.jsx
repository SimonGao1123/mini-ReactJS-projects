import { useState } from 'react'
import './App.css'

const buttonFunctions = [
    {text:"+/-", type:"function"},
    {text:"Sqrt", type:"function"},
    {text:"%", type:"function"},
    {text:"MRC", type:"number"},
    {text:"M-", type:"function"},
    {text:"M+", type:"function"},
    {text:"7", type:"number"},
    {text:"8", type:"number"},
    {text:"9", type:"number"},
    {text:"4", type:"number"},
    {text:"5", type:"number"},
    {text:"6", type:"number"},
    {text:"1", type:"number"},
    {text:"2", type:"number"},
    {text:"3", type:"number"},
    {text:"C", type:"clear"},
    {text:"0", type:"number"},
    {text:".", type:"number"},

    {text:"^", type:"function"},
    {text:"/", type:"function"},
    {text:"X", type:"function"},
    {text:"-", type:"function"},
    {text:"+", type:"function"},
    {text:"=", type:"result"},

];
function Display () { // screen for displaying results (#output), also stores number
    return (
        <div id="screen">
            <div id="output">123</div>
        </div>
    );
}
function Button ({text, clickF}) { // each button
    return <button class="btn" onClick={clickF}>{text}</button>;
}

function handleFunction ({text, type}) { // determines which function to run when a button is clicked
    const out = document.getElementById("output");
    switch (type) { // TEMPORARY TESTING
        case "number":
            out.textContent+=text;
            break;
        case "function":
            out.textContent=""
            break;
        default:
            break;
    }
    /* TODO:
        - Check if number 
            - if it is a number then add to output (append to string)
        - if it is a function
            - follow instructions on ipad
        - if it is clear then clear past stored and on output
        - result?

    */ 
}
export default function Calculator () { // main function
    const [currVal, setVal] = useState(0);
    const [ifTemp, setTemp] = useState(false); // to track if a # iis just a temp # displaying prev result
    const inputLeftArray = []; // all buttons display loop
    for (let i = 0; i < 6; i++) {
        const rowArray = [];
        for (let j = 0; j < 3; j++) {
            const index = i*3+j;
            rowArray.push(
                <Button text={buttonFunctions[index].text} clickF={()=>handleFunction(buttonFunctions[index])} key={index}/>
            );
        }
        inputLeftArray.push(<div class="input-row">{rowArray}</div>);
    }
    const inputrightArray = [];
    for (let i = 18; i<buttonFunctions.length; i++) {
        inputrightArray.push(
            <Button text={buttonFunctions[i].text} clickF={()=>handleFunction(buttonFunctions[i])} key={i}/>
        );
    }


    return ( // displaying sections
    <>
        <div id="display-section">
            <Display/> 
        </div>
        
        <div id="functions">
            <div id="input-left">
                {inputLeftArray}
            </div>
            <div id="input-right">
                {inputrightArray}
            </div>
        </div>
    </>
    );
}