// Calculator Program

const display = document.getElementById("display");

document.addEventListener("click", function (event) {
    const button = event.target.closest(".number-button, .operator-button");

    if (button && button.textContent !== "=" && button.textContent !== "C") {
        if (display.value === "Error") clearDisplay();
        appendToDisplay(button.textContent);
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
    } else if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/" || event.key === ".") {
        appendToDisplay(event.key);
    }
});

function appendToDisplay(input) {
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function calculate() {
    try {
        const inputArray = display.value.split(/[\+\-\*\/]/)[0];
        const orderOperations = [];
        for (let i = 0; i < inputArray.length; i++) {
            let firstNumber = inputArray[i];
            let operator = display.value.match(/[\+\-\*\/]/)?.[i] || "";
            let secondNumber = inputArray[i + 1] || "";
            // We need to handle the arithmetic operations order and ensure that we are not trying to perform operations on empty strings or invalid numbers.
            if (firstNumber === "" || secondNumber === "" || isNaN(firstNumber) || isNaN(secondNumber)) {
                display.value = "Error";
                return;
            }
            switch (operator) {
                case "+":
                    orderOperations.push({firstNumber: parseFloat(firstNumber), operator: "+", secondNumber: parseFloat(secondNumber), index: i});
                    break;
                case "-":
                    orderOperations.push({firstNumber: parseFloat(firstNumber), operator: "-", secondNumber: parseFloat(secondNumber), index: i});
                    break;
                case "*":
                    orderOperations.push({firstNumber: parseFloat(firstNumber), operator: "*", secondNumber: parseFloat(secondNumber), index: i});
                    break;
                case "/":
                    orderOperations.push({firstNumber: parseFloat(firstNumber), operator: "/", secondNumber: parseFloat(secondNumber), index: i});
                    break;
                default:
                    display.value = "Error";
            }
        }
        // Now we can perform the operations in the correct order.
        const result = 0;
        for (let i = 0; i < orderOperations.length; i++) {
           if (orderOperations[i]) //die;
           {}
        }
        display.value = result;
    }
    catch (error) {
        display.value = "Error"
    }
}