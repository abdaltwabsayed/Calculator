// Calculator Program

const display = document.getElementById("display");
let justCalculated = false;

document.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-value], button[data-action]");
    if (!button) return;

    if (display.value === "Invalid Input" || display.value === "Infinity" || justCalculated) clearDisplay();
    justCalculated = false;
    if (button.dataset.value !== undefined) {
        appendToDisplay(button.dataset.value);
    } else if (button.dataset.action === "calculate") {
        calculate(display.value);
    } else if (button.dataset.action === "clear") {
        clearDisplay();
    } else if (button.dataset.action === "delete") {
        deleteFromDisplay();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.target.closest("button") && (event.key === "Enter" || event.key === " ")) return;

    if (display.value === "Invalid Input" || display.value === "Infinity" || justCalculated) clearDisplay();
    justCalculated = false;
    if (event.key === "Enter") {
        calculate(display.value);
    } else if (event.key === "Escape") {
        clearDisplay();
    } else if (event.key === "Backspace") {
        deleteFromDisplay();
    } else if (event.key === "Delete") {
        clearDisplay();
    } else if (event.key >= "0" && event.key <= "9") {
        appendToDisplay(event.key);
    } else if (event.key === "+" || event.key === "-" || event.key === ".") {
        appendToDisplay(event.key);
    } else if (event.key === "*") {
        appendToDisplay("×");
    } else if (event.key === "/") {
        appendToDisplay("÷");
    }
});

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

    showMessage(getOperandValue(numbersArray[0]));
    justCalculated = true;
    if (!Number.isNaN(parseFloat(display.value))) localStorage.setItem("Previous", display.value);

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
        return parseFloat(localStorage.getItem("Previous"));
    }  else return parseFloat(operand);
}