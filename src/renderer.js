import { GAME_CONFIG, COLORS } from './constants.js';

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = GAME_CONFIG.GRID_SIZE;
        this.tileCount = canvas.width / this.gridSize;
    }

    clear() {
        this.ctx.fillStyle = COLORS.CANVAS_BG;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid() {
        this.ctx.strokeStyle = COLORS.GRID;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.tileCount; i++) {
            // 垂直线
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            // 水平线
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }

    drawSnake(snake, direction) {
        snake.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头
                this.ctx.fillStyle = COLORS.SNAKE_HEAD;
                this.ctx.fillRect(
                    segment.x * this.gridSize, 
                    segment.y * this.gridSize, 
                    this.gridSize - 2, 
                    this.gridSize - 2
                );
                
                // 蛇头眼睛
                this.drawSnakeEyes(segment, direction);
            } else {
                // 蛇身
                this.ctx.fillStyle = COLORS.SNAKE_BODY;
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1, 
                    segment.y * this.gridSize + 1, 
                    this.gridSize - 4, 
                    this.gridSize - 4
                );
            }
        });
    }

    drawSnakeEyes(segment, direction) {
        this.ctx.fillStyle = 'white';
        const eyeSize = 3;
        const eyeOffset = 5;
        
        if (direction.x === 1) { // 向右
            this.ctx.fillRect(
                segment.x * this.gridSize + this.gridSize - eyeOffset, 
                segment.y * this.gridSize + eyeOffset, 
                eyeSize, 
                eyeSize
            );
            this.ctx.fillRect(
                segment.x * this.gridSize + this.gridSize - eyeOffset, 
                segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize, 
                eyeSize, 
                eyeSize
            );
        } else if (direction.x === -1) { // 向左
            this.ctx.fillRect(
                segment.x * this.gridSize + eyeOffset - eyeSize, 
                segment.y * this.gridSize + eyeOffset, 
                eyeSize, 
                eyeSize
            );
            this.ctx.fillRect(
                segment.x * this.gridSize + eyeOffset - eyeSize, 
                segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize, 
                eyeSize, 
                eyeSize
            );
        } else if (direction.y === 1) { // 向下
            this.ctx.fillRect(
                segment.x * this.gridSize + eyeOffset, 
                segment.y * this.gridSize + this.gridSize - eyeOffset, 
                eyeSize, 
                eyeSize
            );
            this.ctx.fillRect(
                segment.x * this.gridSize + this.gridSize - eyeOffset, 
                segment.y * this.gridSize + this.gridSize - eyeOffset, 
                eyeSize, 
                eyeSize
            );
        } else if (direction.y === -1) { // 向上
            this.ctx.fillRect(
                segment.x * this.gridSize + eyeOffset, 
                segment.y * this.gridSize + eyeOffset - eyeSize, 
                eyeSize, 
                eyeSize
            );
            this.ctx.fillRect(
                segment.x * this.gridSize + this.gridSize - eyeOffset, 
                segment.y * this.gridSize + eyeOffset - eyeSize, 
                eyeSize, 
                eyeSize
            );
        }
    }

    drawFood(food) {
        // 绘制食物
        this.ctx.fillStyle = COLORS.FOOD;
        this.ctx.beginPath();
        this.ctx.arc(
            food.x * this.gridSize + this.gridSize/2, 
            food.y * this.gridSize + this.gridSize/2, 
            this.gridSize/2 - 2, 
            0, 
            2 * Math.PI
        );
        this.ctx.fill();
        
        // 食物高光
        this.ctx.fillStyle = COLORS.FOOD_HIGHLIGHT;
        this.ctx.beginPath();
        this.ctx.arc(
            food.x * this.gridSize + this.gridSize/2 - 3, 
            food.y * this.gridSize + this.gridSize/2 - 3, 
            this.gridSize/4, 
            0, 
            2 * Math.PI
        );
        this.ctx.fill();
    }

    drawObstacles(obstacles) {
        this.ctx.fillStyle = COLORS.OBSTACLE;
        obstacles.forEach(obstacle => {
            this.ctx.fillRect(
                obstacle.x * this.gridSize + 2, 
                obstacle.y * this.gridSize + 2, 
                this.gridSize - 4, 
                this.gridSize - 4
            );
        });
    }
}
