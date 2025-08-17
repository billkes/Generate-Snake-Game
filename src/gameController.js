import { StateManager } from './stateManager.js';
import { Renderer } from './renderer.js';
import { GAME_CONFIG, KEY_MAP } from './constants.js';

export class GameController {
    constructor(canvas, uiElements) {
        this.canvas = canvas;
        this.ui = uiElements;
        
        this.stateManager = new StateManager();
        this.renderer = new Renderer(canvas);
        
        this.highScore = 0;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadHighScore();
        this.updateScoreDisplay();
        this.updateStatusText('按"开始游戏"按钮开始');
        this.draw();
    }

    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // UI按钮事件
        this.ui.startBtn.addEventListener('click', () => this.startGame());
        this.ui.pauseBtn.addEventListener('click', () => this.togglePause());
        this.ui.resetBtn.addEventListener('click', () => this.resetGame());
        
        // 难度选择事件
        if (this.ui.difficultySelect) {
            this.ui.difficultySelect.addEventListener('change', (e) => {
                this.setDifficulty(e.target.value);
            });
        }
    }

    handleKeyPress(e) {
        if (!this.stateManager.gameRunning || this.stateManager.gamePaused) return;
        
        const key = e.key;
        if (KEY_MAP[key]) {
            switch (KEY_MAP[key]) {
                case 'UP':
                    this.stateManager.setDirection({ x: 0, y: -1 });
                    break;
                case 'DOWN':
                    this.stateManager.setDirection({ x: 0, y: 1 });
                    break;
                case 'LEFT':
                    this.stateManager.setDirection({ x: -1, y: 0 });
                    break;
                case 'RIGHT':
                    this.stateManager.setDirection({ x: 1, y: 0 });
                    break;
            }
        }
    }

    setDifficulty(level) {
        this.stateManager.setDifficulty(level);
        // 更新UI显示当前难度
        if (this.ui.difficultyDisplay) {
            this.ui.difficultyDisplay.textContent = this.stateManager.getDifficulty().name;
        }
    }

    startGame() {
        if (!this.stateManager.gameRunning) {
            // 根据难度设置障碍物
            const difficulty = this.stateManager.difficulty;
            let obstacleCount = 0;
            
            switch (difficulty) {
                case 'MEDIUM':
                    obstacleCount = 3;
                    break;
                case 'HARD':
                    obstacleCount = 5;
                    break;
                case 'EXPERT':
                    obstacleCount = 8;
                    break;
            }
            
            if (obstacleCount > 0) {
                this.stateManager.generateObstacles(obstacleCount);
            }
            
            this.stateManager.gameRunning = true;
            this.stateManager.gamePaused = false;
            this.ui.startBtn.disabled = true;
            this.ui.pauseBtn.disabled = false;
            this.updateStatusText('游戏进行中...');
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }

    togglePause() {
        if (this.stateManager.gameRunning) {
            this.stateManager.gamePaused = !this.stateManager.gamePaused;
            if (this.stateManager.gamePaused) {
                this.updateStatusText('游戏暂停');
                this.ui.pauseBtn.textContent = '继续';
            } else {
                this.updateStatusText('游戏进行中...');
                this.ui.pauseBtn.textContent = '暂停';
                requestAnimationFrame((time) => this.gameLoop(time));
            }
        }
    }

    resetGame() {
        this.stateManager.reset();
        this.ui.startBtn.disabled = false;
        this.ui.pauseBtn.disabled = true;
        this.ui.pauseBtn.textContent = '暂停';
        this.updateScoreDisplay();
        this.updateStatusText('按"开始游戏"按钮开始');
        this.draw();
    }

    gameLoop(currentTime) {
        if (!this.stateManager.gameRunning || this.stateManager.gamePaused) return;
        
        if (currentTime - this.stateManager.lastRenderTime >= this.stateManager.gameSpeed) {
            this.update();
            this.draw();
            this.stateManager.lastRenderTime = currentTime;
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    update() {
        // 更新蛇的移动方向
        this.stateManager.updateDirection();
        
        // 移动蛇
        this.stateManager.moveSnake();
        
        // 检查碰撞
        if (this.stateManager.checkCollision()) {
            this.gameOver();
            return;
        }
        
        // 检查是否吃到食物
        if (this.stateManager.isFoodEaten()) {
            this.stateManager.increaseScore();
            this.updateScoreDisplay();
            this.stateManager.food = this.stateManager.generateFood();
            this.stateManager.increaseSpeed();
        } else {
            this.stateManager.removeTail();
        }
    }

    draw() {
        this.renderer.clear();
        this.renderer.drawGrid();
        this.renderer.drawSnake(this.stateManager.snake, this.stateManager.direction);
        this.renderer.drawFood(this.stateManager.food);
        this.renderer.drawObstacles(this.stateManager.obstacles);
    }

    gameOver() {
        this.stateManager.gameRunning = false;
        this.ui.startBtn.disabled = false;
        this.ui.pauseBtn.disabled = true;
        this.ui.pauseBtn.textContent = '暂停';
        this.updateStatusText('游戏结束！');
        
        if (this.stateManager.score > this.highScore) {
            this.highScore = this.stateManager.score;
            this.saveHighScore();
            this.updateScoreDisplay();
            alert(`恭喜！新纪录：${this.stateManager.score}分！`);
        } else {
            alert(`游戏结束！得分：${this.stateManager.score}分`);
        }
    }

    updateScoreDisplay() {
        if (this.ui.scoreElement) {
            this.ui.scoreElement.textContent = this.stateManager.score;
        }
        if (this.ui.highScoreElement) {
            this.ui.highScoreElement.textContent = this.highScore;
        }
    }

    updateStatusText(text) {
        if (this.ui.statusText) {
            this.ui.statusText.textContent = text;
        }
    }

    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore.toString());
    }

    loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        this.highScore = saved ? parseInt(saved) : 0;
    }
}
