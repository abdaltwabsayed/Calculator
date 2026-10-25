// Calculator Program

const display = document.getElementById("display");
let justCalculated = false;

document.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-value], button[data-action]");
    if (!button) return;

    if (button.dataset.value !== undefined) {
        const value = button.dataset.value;
        if (isErrorMessage(display.value) || (justCalculated && !isOperator(value))) clearDisplay();
        justCalculated = false;
        appendToDisplay(value);
    } else if (button.dataset.action === "calculate") {
        if (!isErrorMessage(display.value)) calculate(display.value);
    } else if (button.dataset.action === "clear") {
        clearDisplay();
        justCalculated = false;
    } else if (button.dataset.action === "delete") {
        if (justCalculated || isErrorMessage(display.value)) clearDisplay();
        else deleteFromDisplay();
        justCalculated = false;
    }
});

document.addEventListener("keydown", function (event) {
    if (event.target.closest("button") && (event.key === "Enter" || event.key === " ")) return;

    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === "Enter") {
        event.preventDefault();
        if (!isErrorMessage(display.value)) calculate(display.value);
    } else if (event.key === "Escape") {
        clearDisplay();
        justCalculated = false;
    } else if (event.key === "Backspace") {
        event.preventDefault();
        if (justCalculated || isErrorMessage(display.value)) clearDisplay();
        else deleteFromDisplay();
        justCalculated = false;
    } else if (event.key === "Delete") {
        clearDisplay();
        justCalculated = false;
    } else if (event.key >= "0" && event.key <= "9") {
        if (isErrorMessage(display.value) || justCalculated) clearDisplay();
        justCalculated = false;
        appendToDisplay(event.key);
    } else if (event.key === "+" || event.key === "-" || event.key === ".") {
        if (isErrorMessage(display.value) || (justCalculated && event.key === ".")) clearDisplay();
        justCalculated = false;
        appendToDisplay(event.key);
    } else if (event.key === "*") {
        if (isErrorMessage(display.value)) clearDisplay();
        justCalculated = false;
        appendToDisplay("×");
    } else if (event.key === "/") {
        if (isErrorMessage(display.value)) clearDisplay();
        justCalculated = false;
        appendToDisplay("÷");
    }
});

function isOperator(value) {
    return "+-×÷".includes(value);
}

function isErrorMessage(value) {
    return value === "Invalid Input" || value === "Math Error";
}

function appendToDisplay(input) {
    display.value += input;
    display.setSelectionRange(display.value.length, display.value.length);
    display.scrollLeft = display.scrollWidth;
}

function clearDisplay() {
    display.value = "";
    display.scrollLeft = 0;
}

function deleteFromDisplay() {
    display.value = (display.value.slice(-3) !== "Ans") ? display.value.slice(0, -1) : display.value.slice(0, -3);
    display.setSelectionRange(display.value.length, display.value.length);
    display.scrollLeft = display.scrollWidth;
}

function showMessage(message) {
    display.value = message;
    display.setSelectionRange(display.value.length, display.value.length);
    display.scrollLeft = display.scrollWidth;
}

function calculate() {
    const numbersArray = [];
    const operatorsArray = [];
    let currentNumber = "";

    for (let index = 0; index < display.value.length; index++) {
        const character = display.value[index];
        const isOperator = "+-×÷".includes(character);
        const isNegativeSign = character === "-" &&
            (index === 0 || "+-×÷".includes(display.value[index - 1]));

        if (character === "." && currentNumber.includes(".")) {
            showMessage("Invalid Input");
            return;
        } else if (isNegativeSign) {
            currentNumber += character;
        } else if (isOperator) {
            if (currentNumber === "") {
                showMessage("Invalid Input");
                return;
            }
            numbersArray.push(currentNumber);
            operatorsArray.push(character);
            currentNumber = "";
        } else {
            currentNumber += character;
        }
    }

    if (currentNumber === "") {
        showMessage("Invalid Input");
        return;
    }
    numbersArray.push(currentNumber);

    while (operatorsArray.length > 0) {
        let firstNumber;
        let secondNumber;
        let operatorIndex = operatorsArray.findIndex(
            operator => operator === "×" || operator === "÷"
        );
        if (operatorIndex === -1) operatorIndex = 0;

        firstNumber = getOperandValue(numbersArray[operatorIndex]);
        secondNumber = getOperandValue(numbersArray[operatorIndex + 1]);
        const operator = operatorsArray[operatorIndex];
        let result;

        if (operator === "×") result = firstNumber * secondNumber;
        else if (operator === "÷") result = firstNumber / secondNumber;
        else if (operator === "+") result = firstNumber + secondNumber;
        else result = firstNumber - secondNumber;

        operatorsArray.splice(operatorIndex, 1);
        numbersArray.splice(operatorIndex, 2, result);
    }

    const result = getOperandValue(numbersArray[0]);
    if (!Number.isFinite(result)) {
        showMessage("Math Error");
        justCalculated = true;
        return;
    }

    const roundedResult = Number(result.toPrecision(12));
    showMessage(Object.is(roundedResult, -0) ? 0 : roundedResult);
    justCalculated = true;
    savePreviousAnswer(display.value);
}

function savePreviousAnswer(answer) {
    try {
        localStorage.setItem("Previous", answer);
    } catch (error) {
        console.error("Could not save the previous answer.", error);
    }
}

function getPreviousAnswer() {
    try {
        const previousAnswer = localStorage.getItem("Previous");
        return previousAnswer === null ? Number.NaN : parseFloat(previousAnswer);
    } catch (error) {
        console.error("Could not read the previous answer.", error);
        return Number.NaN;
    }
}

function getOperandValue(operand) {
    if (typeof operand === "number") {
        return operand;
    }

    // This regex matches an optional negative sign, followed by a number (integer or decimal), directly followed by 'π' or 'Ans' (e.g., '2π', '-3.5Ans'), to handle implicit multiplication.
    const implicitMultiplication = operand.match(/^(-?(?:\d+(?:\.\d*)?|\.\d+))(π|Ans)$/);
    if (implicitMultiplication) {
        return parseFloat(implicitMultiplication[1]) * getOperandValue(implicitMultiplication[2]);
    } else if (operand.startsWith("-")) {
        return -getOperandValue(operand.slice(1));
    } else if (operand === "π") {
        return Math.PI;
    }  else if (operand === "Ans") {
        return getPreviousAnswer();
    }  else return parseFloat(operand);
}