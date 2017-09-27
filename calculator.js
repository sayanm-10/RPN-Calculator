let readline = require("readline-sync");
const operators = ['+', '-', '*', '/', '(', ')'];
const operatorPrecedence = {'+' : 1, '-' : 1, '*' : 2, '/' : 2};
let evaluationStack = [], postfixQueue = [], infixQueue = [], operatorStack = [];

let initCalculator = function () {
    getUserInput();
};

let getUserInput = function () {
    var inputExpression = readline.question("Please enter a valid infix expression: ");
    if (inputExpression.toLocaleLowerCase() === "quit") {
        return;
    } else {
        // convert to postfix
        evaluationStack = [], postfixQueue = [], infixQueue = [], operatorStack = [];
        let infixExpression = inputExpression.replace(/\s+/g,' ').trim(); // get rid of extra whitespaces, ref: https://stackoverflow.com/a/16974697/1705383
        if (createInfixQueue(infixExpression)) {
            console.log("InfixQ: ", infixQueue);
            convertInfixToPostfix();
            console.log("PostfixQ: ", postfixQueue);
            //console.log("Result: ", evaluatePostfixExpression());
        }
        getUserInput();
    }
};

let createInfixQueue = function (expression) {
    let number = '';
    for (let i = 0; i < expression.length; i++) {
        if (!isNaN(expression[i]) || expression[i] === " " || operators.indexOf(expression[i]) > -1) {
            number = (expression[i] === " " || operators.indexOf(expression[i]) > -1)  ? number : number + expression[i];
            if (expression[i] === " " || i === expression.length - 1) {
                number.length > 0 ? infixQueue.push(number) : undefined;
                number = '';
            } else if (operators.indexOf(expression[i]) > -1) {
                number.length > 0 ? infixQueue.push(number) : undefined;
                infixQueue.push(expression[i]);
                number = '';
            }
        } else {
            console.log("Please enter a valid expression");
            return false;
        }
    }
    return true;
};

/*
    Function takes 2 operators as arguement
    Returns true if precedence of operator1
    is less than or equal to operator2,
    otherwise false
*/
let checkOperatorPrecedence = function (operator1, operator2) {
    let op1_weight = operatorPrecedence[operator1];
    let op2_weight = operatorPrecedence[operator2];
    
    return (op1_weight <= op2_weight);
};

let convertInfixToPostfix = function () {
    let token;
    while (infixQueue.length > 0) {
        token = infixQueue.shift();
       // console.log("Token: ", token);

        if (!isNaN(token)) { // token is a number
            postfixQueue.push(token);
            //console.log("postQ: ", postfixQueue);
        } else if (operatorStack.length === 0 || token === "(") {
            operatorStack.unshift(token);
        } else if (token === ")") {
            while (operatorStack[0] !== "(") {
                postfixQueue.push(operatorStack.shift());
            }
            operatorStack.shift();
        } else {
            while (operatorStack.length > 0 && operatorStack[0] !== "(" && checkOperatorPrecedence(token, operatorStack[0])) {
                postfixQueue.push(operatorStack.shift());
            }

            operatorStack.unshift(token);
        }
    }

    //  transfer remaining operators
    while (operatorStack.length > 0) { 
        postfixQueue.push(operatorStack.shift());        
    }
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