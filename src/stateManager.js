import { GAME_CONFIG, DIRECTIONS } from './constants.js';

export class StateManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.snake = [
            {x: 10, y: 10}
        ];
        // 初始时没有移动方向，等待用户输入
        this.direction = { x: 0, y: 0 };
        this.nextDirection = { x: 0, y: 0 };
        this.obstacles = [];
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameSpeed = GAME_CONFIG.INITIAL_SPEED;
        this.difficulty = 'MEDIUM';
        this.lastRenderTime = 0;
        // 标记是否已经接收过用户输入
        this.hasUserInput = false;
    }

    setDifficulty(level) {
        this.difficulty = level;
        this.gameSpeed = GAME_CONFIG.DIFFICULTY_LEVELS[level].speed;
    }

    getDifficulty() {
        return GAME_CONFIG.DIFFICULTY_LEVELS[this.difficulty];
    }

    getDifficultyLevels() {
        return GAME_CONFIG.DIFFICULTY_LEVELS;
    }

    setDirection(newDirection) {
        // 防止蛇反向移动
        if (
            (newDirection.x === 1 && this.direction.x === -1) ||
            (newDirection.x === -1 && this.direction.x === 1) ||
            (newDirection.y === 1 && this.direction.y === -1) ||
            (newDirection.y === -1 && this.direction.y === 1)
        ) {
            return;
        }
        
        this.nextDirection = newDirection;
        // 标记用户已经输入过方向
        this.hasUserInput = true;
    }

    updateDirection() {
        this.direction = { ...this.nextDirection };
    }

    moveSnake() {
        // 如果没有用户输入且方向为0，则不移动蛇
        if (!this.hasUserInput && this.direction.x === 0 && this.direction.y === 0) {
            return;
        }
        
        const head = { 
            x: this.snake[0].x + this.direction.x, 
            y: this.snake[0].y + this.direction.y 
        };
        
        this.snake.unshift(head);
    }

    generateFood() {
        let newFood;
        let attempts = 0;
        const maxAttempts = 100; // 防止无限循环
        
        do {
            newFood = {
                x: Math.floor(Math.random() * (GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE)),
                y: Math.floor(Math.random() * (GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.GRID_SIZE))
            };
            attempts++;
            
            // 如果尝试次数过多，跳出循环
            if (attempts > maxAttempts) {
                break;
            }
        } while (
            this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
            this.obstacles.some(obstacle => obstacle.x === newFood.x && obstacle.y === newFood.y)
        );
        
        return newFood;
    }

    generateObstacles(count) {
        this.obstacles = [];
        let attempts = 0;
        const maxAttempts = 200; // 防止无限循环
        
        for (let i = 0; i < count && attempts < maxAttempts; i++) {
            let newObstacle;
            let validPosition = false;
            
            while (!validPosition && attempts < maxAttempts) {
                newObstacle = {
                    x: Math.floor(Math.random() * (GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE)),
                    y: Math.floor(Math.random() * (GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.GRID_SIZE))
                };
                
                // 检查障碍物是否与蛇或食物重叠
                const isOnSnake = this.snake.some(segment => segment.x === newObstacle.x && segment.y === newObstacle.y);
                const isOnFood = this.food.x === newObstacle.x && this.food.y === newObstacle.y;
                const isOnOtherObstacle = this.obstacles.some(obstacle => obstacle.x === newObstacle.x && obstacle.y === newObstacle.y);
                
                if (!isOnSnake && !isOnFood && !isOnOtherObstacle) {
                    validPosition = true;
                    this.obstacles.push(newObstacle);
                }
                
                attempts++;
            }
        }
    }

    removeTail() {
        this.snake.pop();
    }

    increaseScore() {
        this.score += GAME_CONFIG.SCORE_INCREMENT;
    }

    increaseSpeed() {
        if (this.gameSpeed > GAME_CONFIG.MIN_SPEED) {
            this.gameSpeed -= GAME_CONFIG.SPEED_INCREMENT;
        }
    }

    isFoodEaten() {
        const head = this.snake[0];
        return head.x === this.food.x && head.y === this.food.y;
    }

    checkCollision() {
        const head = this.snake[0];
        
        // 撞墙检测
        if (
            head.x < 0 || 
            head.x >= GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE || 
            head.y < 0 || 
            head.y >= GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.GRID_SIZE
        ) {
            return true;
        }
        
        // 撞到自己检测
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        // 撞到障碍物检测
        for (let i = 0; i < this.obstacles.length; i++) {
            if (head.x === this.obstacles[i].x && head.y === this.obstacles[i].y) {
                return true;
            }
        }
        
        return false;
    }
}
