import { useState } from 'react'
import './App.css'

// TODO: IMPLEMENT CHECK IF INPUT IS VALID
const buttonFunctions = [
    {text:"+/-", type:"signSwitch"},
    {text:"Sqrt", type:"sqrt"},
    {text:"%", type:"percent"},
    {text:"MRC", type:"memoryRecall"},
    {text:"M-", type:"memSub"},
    {text:"M+", type:"memAdd"},
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
function Display ({displayVal}) { // screen for displaying results (#output), also stores number
    return (
        <div id="screen">
            <div id="output">{displayVal}</div>
        </div>
    );
}
function Button ({text, clickF}) { // each button
    return <button className="btn" onClick={clickF}>{text}</button>;
}
function roundNum (num, decimals = 10) {
    // takes float and rounds to avoid floating point error (decimals is automatically to 10, can customize)
    let rounded = num.toFixed(decimals);
    if (rounded.includes(".")) {
        rounded = rounded.replace(/\.?0+$/, ""); // replaces all trailing 0s and the decimal point if necessary
    }
    return rounded;
}
function checkIfDecimalAlreadyExists (displayVal) {
    // returns true if already exists, false if can still add decimal
    return displayVal.split("").includes(".");
    // split turns into array
}

function handleFunction (
    {text, type},
    prevVal, 
    setPrevVal, 
    ifTemp, 
    setTemp, 
    displayVal, 
    setDisplay, 
    currOperate, 
    setOperate, 
    memory, 
    setMemory
    ) { // determines which function to run when a button is clicked
    
    
    switch (type) {
        case "memAdd":
            setDisplay(String(parseFloat(displayVal) + memory));
            setTemp(false);
            break;
        case "memSub":
            setDisplay(String(parseFloat(displayVal) - memory));
            setTemp(false);
            break;
        case "percent":
            if (ifTemp) {
                return;
            }
            setDisplay(String(0.01*parseFloat(displayVal)));
            break;
        case "sqrt":
            if (ifTemp) {
                return;
            }
            setDisplay(String(Math.sqrt(parseFloat(displayVal))));
            break;
        case "memoryRecall":
            if (!memory) {
                return;
            }
            setDisplay(String(memory));
            setTemp(false);
            break; // TODO fix bug with memory recall
        case "number":
            handleNumber(text, displayVal, ifTemp, setTemp, setDisplay);
            break;
        case "result":
            if (ifTemp) {
                return;
            }
            const resDisplay = roundNum(handleOperation (text, currOperate, setOperate, prevVal, setPrevVal, displayVal, setTemp));
            setDisplay(resDisplay);
            setMemory(parseFloat(resDisplay)); // saves value for MRC M- and M+
            setTemp(true);
            break;
        case "signSwitch":
            if (ifTemp) {
                return;
            }
            setDisplay(String(-1*parseFloat(displayVal)));
            break;
        case "function":
            if (ifTemp) {
                return;
            }
            // note display will be altered from last time
            const newDisplay = roundNum(handleOperation (text, currOperate, setOperate, prevVal, setPrevVal, displayVal, setTemp));
            
            setPrevVal(parseFloat(newDisplay)); // set previous value to display if no previous value tracked
            setDisplay(newDisplay);
            setTemp(true);
            break;
        case "clear":
            setDisplay("0");
            setOperate(null);
            setPrevVal(0);
            setTemp(true);
            setMemory(0);
        default:
            break;
    }

}
// only for type="function" and "result" (returns new display)
function handleOperation (text, currOperate, setOperate, prevVal, setPrevVal, displayVal, setTemp) {
    const displayNum = parseFloat(displayVal);
    console.log("test");
    if (text !== "=") {
        setOperate(text); 
    } else {
        setOperate(null);// for equals sign reset to beginning
    }

    console.log("test");
    let newDisplay;
    // use switch case in future to calculate with all different functions
    switch (currOperate) {
        // bug where when switching between operations will still have old operation since setOperate(text); is async
        case "+":
            newDisplay = prevVal + displayNum;
            break;
        case "-":
            newDisplay = prevVal - displayNum;
            break;
        case "/":
            newDisplay = prevVal / displayNum;
            break;
        case "X":
            newDisplay = prevVal * displayNum;
            break;
        case "^":
            newDisplay = Math.pow(prevVal, displayNum);
            break;
        default:
            // first operation (no past), just set values to display
            setPrevVal(displayNum);
            setTemp(true);
            return displayNum;
    }
    return newDisplay;
}
// only for type="number"
function handleNumber (text, displayVal, ifTemp, setTemp, setDisplay) {
    if (text==="." && checkIfDecimalAlreadyExists(displayVal)) {
                return; // cant have 2 decimals
    }
    if (parseFloat(displayVal) === 0 && text === "0") {
        return; // avoids repeating 0's
    }
    if (parseFloat(displayVal) === 0 && text===".") {
        setDisplay(displayVal + text);
        setTemp(false);
        return;
    }
    if (ifTemp) {
        // temporary number (displaying result in middle of calculation)
        setDisplay(text);
        setTemp(false);
    } else {
        setDisplay(displayVal + text);
    }
}
    
export default function Calculator () { // main function
    const [prevVal, setPrevVal] = useState(0); // track previous value
    const [ifTemp, setTemp] = useState(true); // to track if a # is just a temp # displaying prev result
    const [displayVal, setDisplay] = useState("0"); // holds newest entered value
    const [currOperate, setOperate] = useState(null); // save past operator
    const [memory, setMemory] = useState(0); // rememebers the past # saved when pressing "result" function

    const inputLeftArray = []; // all buttons display loop
    for (let i = 0; i < 6; i++) {
        const rowArray = [];
        for (let j = 0; j < 3; j++) {
            const index = i*3+j;
            rowArray.push(
                <Button text={buttonFunctions[index].text}
                clickF={()=>handleFunction(buttonFunctions[index], prevVal, setPrevVal, ifTemp, setTemp, displayVal, setDisplay, currOperate, setOperate, memory, setMemory)}
                key={index}/>
            );
        }
        inputLeftArray.push(<div className="input-row">{rowArray}</div>);
    }
    const inputrightArray = [];
    for (let i = 18; i<buttonFunctions.length; i++) {
        inputrightArray.push(
            <Button text={buttonFunctions[i].text} 
            clickF={()=>handleFunction(buttonFunctions[i], prevVal, setPrevVal, ifTemp, setTemp, displayVal, setDisplay, currOperate, setOperate, memory, setMemory)}
            key={i}/>
        );
    }


    return ( // displaying sections
    <>
        <div id="display-section">
            <Display displayVal={displayVal}/> 
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