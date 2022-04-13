class Token {
    constructor(type, text, position) {
        this.type = type
        this.text = text
        this.position = position
    }
}

class TokenType {
    constructor(name, regexp) {
        this.name = name
        this.regexp = regexp
    }
}

const tokenTypesList = {
    "number": new TokenType('number', '[0-9.]*'),
    "variable": new TokenType('variable', '[a-zA-Z_0-9]*'),
    "space": new TokenType('space', '[ \\t\\r\\n]*'),
    "assign": new TokenType('assign', '[=]'),
    "plus": new TokenType('plus', '[+]'),
    "minus": new TokenType('minus', '[-]'),
    "multi": new TokenType('multi', '[*]'),
    "division": new TokenType('division', '\\/'),
    "remainder": new TokenType('remainder', '[%]'),
    'lpar': new TokenType('lpar', '\\('),
    'rpar': new TokenType('RPrparAR', '\\)'),
}

class Lexer {
    position = 0
    tokenList = []
    tokenTypesValues = Object.values(tokenTypesList)

    codeAnalysis(code) {
        this.code = code

        while (this.nextToken()) {
            continue
        }
        this.tokenList = this.tokenList.filter(token => token.type.name !== tokenTypesList.space.name)
    }

    nextToken() {
        if (this.position >= this.code.length) {
            return false
        }

        for (let i = 0; i < this.tokenTypesValues.length; i++) {
            const tokenType = this.tokenTypesValues[i]
            const regexp = new RegExp('^' + tokenType.regexp)
            const result = this.code.substr(this.position).match(regexp)
            if (result && result[0]) {
                const token = new Token(tokenType, result[0], this.position)
                this.position += result[0].length
                this.tokenList.push(token)
                return true
            }
        }

        throw new Error(`Error at ${this.position} position`)
    }
}

class ExpressionNode {}

class StatementsNode extends ExpressionNode {
    codeString = ''

    addNode(node) {
        this.codeString = node
    }
}

class NumberNode extends ExpressionNode {
    constructor(number) {
        super()
        this.number = number
    }
}

class BinOperationNode extends ExpressionNode {
    constructor(operator, leftNode, rightNode) {
        super()
        this.operator = operator
        this.leftNode = leftNode
        this.rightNode = rightNode
    }
}

class OperationNode extends ExpressionNode {
    constructor(operator, leftNode, rightNode) {
        super()
        this.operator = operator
        this.leftNode = leftNode
        this.rightNode = rightNode
    }
}

class VariableNode extends ExpressionNode {
    constructor(variable) {
        super()
        this.variable = variable;
    }
}

class Parser {
    position = 0
    scope = {};
    mathOperators = [
        tokenTypesList.minus,
        tokenTypesList.plus,
        tokenTypesList.division,
        tokenTypesList.multi,
        tokenTypesList.remainder
    ]

    match(...expected) {
        if (this.position < this.tokens.length) {
            const currentToken = this.tokens[this.position]
            if (expected.find(type => type.name === currentToken.type.name)) {
                this.position += 1;
                return currentToken
            }
        }
        return null
    }

    require(...expected) {
        const token = this.match(...expected)
        if (!token) {
            throw new Error(`${expected[0].name} expected at ${this.position} position`)
        }
        return token
    }

    parseVariableOrNumber() {
        const number = this.match(tokenTypesList.number)
        if (number != null) {
            return new NumberNode(number)
        }
        const variable = this.match(tokenTypesList.variable)
        if (variable != null) {
            return new VariableNode(variable)
        }
        throw new Error(`Expected number or variable on ${this.position} position`)
    }

    parseParentheses() {
        if (this.match(tokenTypesList.lpar) != null) {
            const node = this.parseFormula()
            this.require(tokenTypesList.rpar)
            return node;
        } else {
            return this.parseVariableOrNumber()
        }
    }

    parseFormula() {
        let leftNode = this.parseParentheses()
        let operator = this.match(...this.mathOperators)
        while (operator != null) {
            const rightNode = this.parseParentheses()
            leftNode = new BinOperationNode(operator, leftNode, rightNode)
            operator = this.match(...this.mathOperators)
        }
        return leftNode
    }

    parseOperation(variable, operator) {
        const rightNode = this.parseParentheses()
        const node = new BinOperationNode(operator, variable, rightNode)
        return node
    }

    parseExpression() {
        let variableNode = this.parseVariableOrNumber()
        const assignOperator = this.match(tokenTypesList.assign)
        if (assignOperator != null) {
            const rightFormulaNode = this.parseFormula()
            const binaryNode = new BinOperationNode(assignOperator, variableNode, rightFormulaNode)
            return binaryNode
        }
        const operator = this.match(...this.mathOperators)
        if (operator != null) {
            const operationNode = this.parseOperation(variableNode, operator)
            return operationNode
        }
        return variableNode
    }

    parseCode(tokens) {
        this.tokens = tokens
        const root = new StatementsNode();
        while (this.position < this.tokens.length) {
            const codeStringNode = this.parseExpression()
            root.addNode(codeStringNode)
        }
        return root;
    }

    run(node) {
        if (node instanceof NumberNode) {
            return parseFloat(node.number.text)
        }
        if (node instanceof BinOperationNode) {
            switch (node.operator.type.name) {
                case tokenTypesList.plus.name:
                    return this.run(node.leftNode) + this.run(node.rightNode)
                case tokenTypesList.minus.name:
                    return this.run(node.leftNode) - this.run(node.rightNode)
                case tokenTypesList.multi.name:
                    return this.run(node.leftNode) * this.run(node.rightNode)
                case tokenTypesList.division.name:
                    return this.run(node.leftNode) / this.run(node.rightNode)
                case tokenTypesList.remainder.name:
                    return this.run(node.leftNode) % this.run(node.rightNode)
                case tokenTypesList.assign.name:
                    const result = this.run(node.rightNode)
                    const variableNode = node.leftNode
                    this.scope[variableNode.variable.text] = result
                    return result
            }
        }
        if (node instanceof VariableNode) {
            if (this.scope[node.variable.text]) {
                return this.scope[node.variable.text]
            } else {
                throw new Error(`ERROR: Invalid identifier. No variable with name '${node.variable.text}' was found`)
            }
        }
        if (node instanceof StatementsNode) {
            return this.run(node.codeString)
        }
        throw new Error('Error!')
    }
}

class Interpreter {
    lexer = new Lexer()
    parser = new Parser()

    input(code) {
        this.lexer.position = 0
        this.lexer.codeAnalysis(code)
        const rootNode = this.parser.parseCode(this.lexer.tokenList)
        return this.parser.run(rootNode)
    }
}

const interpreter = new Interpreter()

console.log(interpreter.input('1 + 1'))
console.log(interpreter.input("2 - 1"));
console.log(interpreter.input("2 * 3"));
console.log(interpreter.input("8 / 4"));
console.log(interpreter.input("7 % 4"))
console.log(interpreter.input("x = 1"));
console.log(interpreter.input("x"));
console.log(interpreter.input("x + 3"));
console.log(interpreter.input("y"));
