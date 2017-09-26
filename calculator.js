let readline = require("readline-sync");
const operators = ['+', '-', '*', '/', '(', ')'];
let evaluationStack = [], postfixQueue = [];

let initCalculator = function () {
    getUserInput();
};

let getUserInput = function () {
    var inputExpression = readline.question("Please enter a valid infix expression: ");
    if (inputExpression.toLocaleLowerCase() === "quit") {
        return;
    } else {
        // convert to postfix
        let infixExpression = inputExpression.replace(/\s+/g,' ').trim(); // get rid of extra whitespaces, ref: https://stackoverflow.com/a/16974697/1705383
        if (createValidExpression(infixExpression)) {
            console.log("Postfix: ", postfixQueue);
            console.log("Result: ", evaluatePostfixExpression());
        }
        getUserInput();
    }
};

let createValidExpression = function (expression) {
    let number = '';
    for (let i = 0; i < expression.length; i++) {
        if (!isNaN(expression[i]) || expression[i] === " " || operators.indexOf(expression[i]) > -1) {
            number = (expression[i] === " " || operators.indexOf(expression[i]) > -1)  ? number : number + expression[i];
            if (expression[i] === " ") {
                number.length > 0 ? postfixQueue.push(number) : undefined;
                number = '';
            } else if (operators.indexOf(expression[i]) > -1) {
                number.length > 0 ? postfixQueue.push(number) : undefined;
                postfixQueue.push(expression[i]);
                number = '';
            }
        } else {
            console.log("Please enter a valid expression");
            return false;
        }
    }
    return true;
};

let evaluatePostfixExpression = function () {
    let token;
    while (postfixQueue.length > 0) {
        token = postfixQueue.shift();
        console.log("postQ: ", postfixQueue);

        if (!isNaN(token)) { // token is a number (operand)
            evaluationStack.unshift(token);
            console.log("eval: ", evaluationStack);
        } else { // token is an operator
            let firstNumber = evaluationStack.shift();
            let secondNumber = evaluationStack.shift();
            let answer = 0;

            switch (token) {
                case '+': answer = +secondNumber + +firstNumber; // type casting to number
                break;
                case '-': answer = +secondNumber - +firstNumber; // type casting to number
                break;
                case '*': answer = secondNumber * firstNumber;
                break;
                case '/': answer = secondNumber / firstNumber;
                break;
            }

            evaluationStack.unshift(answer);
            console.log("eval: ", evaluationStack);            
        }
    }

    return evaluationStack[0];
};

// used to bootstrap the app
initCalculator();