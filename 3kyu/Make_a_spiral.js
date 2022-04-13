class Spiral {
    constructor(size) {
        this.size = size
        this.rotations = 0
        this.matrix = (new Array(size))
            .fill(null)
            .map(() => (new Array(size)).fill(0))
        this.directions = ['right', 'down', 'left', 'top']
    }

    create() {
        if (this.size < 5) {
            return "Such a small size!"
        }
        return this.#changeDirection()
    }

    #changeDirection(x = 0, y = 0) {
        if (this.rotations === this.size) {
            return this.matrix
        }

        const direction = this.directions[this.rotations % 4]

        switch (direction) {
            case 'right': {
                for (let j = y, i = x; j < this.size; j++) {
                    this.matrix[i][j] = 1
                    if (this.matrix[i][j+2] === 1 || this.matrix[i][j+1] === undefined) {
                        this.rotations++
                        return this.#changeDirection(i, j)
                    }
                }
            }

            case 'down': {
                for (let j = y, i = x; i < this.size; i++) {
                    this.matrix[i][j] = 1
                    if (this.matrix[j][i+2] === 1 || this.matrix[j][i+1] === undefined) {
                        this.rotations++
                        return this.#changeDirection(i, j)
                    }
                }
            }

            case 'left': {
                for (let j = y, i = x; j >= 0; j--) {
                    this.matrix[i][j] = 1
                    if (this.matrix[i][j-2] === 1 || this.matrix[i][j-1] === undefined) {
                        this.rotations++
                        return this.#changeDirection(i, j)
                    }
                }
            }

            case 'top': {
                for (let j = y, i = x; i >= 0; i--) {
                    this.matrix[i][j] = 1
                    if (this.matrix[i-2][j] === 1 || this.matrix[i-1][j] === undefined) {
                        this.rotations++
                        return this.#changeDirection(i, j)
                    }
                }
            }

            default:
                return 'Something went wrong'
        }
    }
}

function spiralize(n) {
  return new Spiral(n).create()
}