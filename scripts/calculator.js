// Calculator Program

const display = document.getElementById("display");

document.addEventListener("click", function (event) {
    const button = event.target.closest(".number-button, .operator-button");

    if (button && button.textContent !== "=" &&
        button.textContent !== "AC" &&
        button.textContent !== "DEL"
    ) {
        appendToDisplay(button.textContent);
    } else if (button.textContent === "=") {
        calculate(display.value);
    } else if (button.textContent === "AC") {
        clearDisplay();
    } else if (button.textContent === "DEL") {
        display.value = display.value.slice(0, -1);
    }
});

document.addEventListener("keydown", function (event) {
    if (display.value === "Error") clearDisplay();
    if (event.key === "Enter") {
        calculate(display.value);
    } else if (event.key === "Escape") {
        clearDisplay();
    } else if (event.key === "Backspace") {
        display.value = display.value.slice(0, -1);
    } else if (event.key === "Delete") {
        clearDisplay();
    } else if (event.key >= "0" && event.key <= "9") {
        appendToDisplay(event.key);
    } else if (event.key === "+" || event.key === "-" || event.key === "×" || event.key === "/" || event.key === ".") {
        appendToDisplay(event.key);
    }
});

function appendToDisplay(input) {
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function postMessage(message) {
    display.value = message;
}

function calculate() {
    try {
        // Handling the arithmetic operations order
        const numbersArray = display.value.split(/[\+\-\×\÷]/);
        const operatorsArray = display.value.match(/[\+\-\×\÷]/g);
        if (numbersArray.length !== operatorsArray - 1) postMessage("Invalid Input");
        while (numbersArray.length > 1 && operatorsArray != null) {
            let firstNumber;
            let secondNumber;
            let index;
            if (operatorsArray.includes("×")) {
                index = operatorsArray.indexOf("×");
                firstNumber = getOperandValue(numbersArray[index]);
                secondNumber = getOperandValue(numbersArray[index + 1]);
                operatorsArray.splice(index, 1);
                numbersArray.splice(index, 2, (firstNumber * secondNumber));
            } else if (operatorsArray.includes("÷")) {
                index = operatorsArray.indexOf("÷");
                firstNumber = getOperandValue(numbersArray[index]);
                secondNumber = getOperandValue(numbersArray[index + 1]);
                operatorsArray.splice(index, 1);
                numbersArray.splice(index, 2, (firstNumber / secondNumber));
            } else if (operatorsArray.includes("+")) {
                index = operatorsArray.indexOf("+");
                firstNumber = getOperandValue(numbersArray[index]);
                secondNumber = getOperandValue(numbersArray[index + 1]);
                operatorsArray.splice(index, 1);
                numbersArray.splice(index, 2, (firstNumber + secondNumber));
            } else if (operatorsArray.includes("-")) {
                index = operatorsArray.indexOf("-");
                firstNumber = getOperandValue(numbersArray[index]);
                secondNumber = getOperandValue(numbersArray[index + 1]);
                operatorsArray.splice(index, 1);
                numbersArray.splice(index, 2, (firstNumber - secondNumber));
            }
        }
        if (numbersArray[0] == "π") postMessage(Math.PI);
        else if (numbersArray[0] == "Ans") postMessage(parseFloat(localStorage.getItem("Previous")));
        else postMessage(numbersArray[0]);
        if (!Number.isNaN(parseFloat(display.value))) localStorage.setItem("Previous", display.value);
    }
    catch (error) {
        postMessage(error);
    }
}

function getOperandValue(operand) {
    if (operand === "π"){
        return Math.PI;
    } else if (operand === "Ans") {
        return parseFloat(localStorage.getItem("Previous"));
    } else return parseFloat(operand);
}