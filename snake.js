class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.statusText = document.getElementById('gameStatusText');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.reset();
        this.bindEvents();
        this.loadHighScore();
        this.draw();
    }
    
    reset() {
        this.snake = [
            {x: 10, y: 10}
        ];
        this.dx = 0;
        this.dy = 0;
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameSpeed = 150;
        this.lastRenderTime = 0;
        
        this.updateScore();
        this.updateStatusText('按"开始游戏"按钮开始');
    }
    
    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        return newFood;
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const key = e.key.toLowerCase();
        
        switch(key) {
            case 'arrowup':
            case 'w':
                if (this.dy !== 1) {
                    this.dx = 0;
                    this.dy = -1;
                }
                break;
            case 'arrowdown':
            case 's':
                if (this.dy !== -1) {
                    this.dx = 0;
                    this.dy = 1;
                }
                break;
            case 'arrowleft':
            case 'a':
                if (this.dx !== 1) {
                    this.dx = -1;
                    this.dy = 0;
                }
                break;
            case 'arrowright':
            case 'd':
                if (this.dx !== -1) {
                    this.dx = 1;
                    this.dy = 0;
                }
                break;
        }
    }
    
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.updateStatusText('游戏进行中...');
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
    
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            if (this.gamePaused) {
                this.updateStatusText('游戏暂停');
                this.pauseBtn.textContent = '继续';
            } else {
                this.updateStatusText('游戏进行中...');
                this.pauseBtn.textContent = '暂停';
                requestAnimationFrame((time) => this.gameLoop(time));
            }
        }
    }
    
    resetGame() {
        this.reset();
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '暂停';
        this.draw();
    }
    
    gameLoop(currentTime) {
        if (!this.gameRunning || this.gamePaused) return;
        
        if (currentTime - this.lastRenderTime >= this.gameSpeed) {
            this.update();
            this.draw();
            this.lastRenderTime = currentTime;
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update() {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // 检查碰撞
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
            
            // 增加游戏速度
            if (this.gameSpeed > 80) {
                this.gameSpeed -= 5;
            }
        } else {
            this.snake.pop();
        }
    }
    
    checkCollision(head) {
        // 撞墙检测
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // 撞到自己检测
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    gameOver() {
        this.gameRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '暂停';
        this.updateStatusText('游戏结束！');
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
            this.updateScore();
            alert(`恭喜！新纪录：${this.score}分！`);
        } else {
            alert(`游戏结束！得分：${this.score}分`);
        }
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制蛇
        this.ctx.fillStyle = '#667eea';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头
                this.ctx.fillStyle = '#764ba2';
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, 
                                this.gridSize - 2, this.gridSize - 2);
                
                // 蛇头眼睛
                this.ctx.fillStyle = 'white';
                const eyeSize = 3;
                const eyeOffset = 5;
                
                if (this.dx === 1) { // 向右
                    this.ctx.fillRect(segment.x * this.gridSize + this.gridSize - eyeOffset, 
                                    segment.y * this.gridSize + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + this.gridSize - eyeOffset, 
                                    segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                } else if (this.dx === -1) { // 向左
                    this.ctx.fillRect(segment.x * this.gridSize + eyeOffset - eyeSize, 
                                    segment.y * this.gridSize + eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + eyeOffset - eyeSize, 
                                    segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
                } else if (this.dy === 1) { // 向下
                    this.ctx.fillRect(segment.x * this.gridSize + eyeOffset, 
                                    segment.y * this.gridSize + this.gridSize - eyeOffset, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + this.gridSize - eyeOffset, 
                                    segment.y * this.gridSize + this.gridSize - eyeOffset, eyeSize, eyeSize);
                } else if (this.dy === -1) { // 向上
                    this.ctx.fillRect(segment.x * this.gridSize + eyeOffset, 
                                    segment.y * this.gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                    this.ctx.fillRect(segment.x * this.gridSize + this.gridSize - eyeOffset, 
                                    segment.y * this.gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                }
            } else {
                // 蛇身
                this.ctx.fillStyle = '#667eea';
                this.ctx.fillRect(segment.x * this.gridSize + 1, segment.y * this.gridSize + 1, 
                                this.gridSize - 4, this.gridSize - 4);
            }
        });
        
        // 绘制食物
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(this.food.x * this.gridSize + this.gridSize/2, 
                    this.food.y * this.gridSize + this.gridSize/2, 
                    this.gridSize/2 - 2, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 食物高光
        this.ctx.fillStyle = '#ff8787';
        this.ctx.beginPath();
        this.ctx.arc(this.food.x * this.gridSize + this.gridSize/2 - 3, 
                    this.food.y * this.gridSize + this.gridSize/2 - 3, 
                    this.gridSize/4, 0, 2 * Math.PI);
        this.ctx.fill();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#e9ecef';
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
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        this.highScoreElement.textContent = this.highScore;
    }
    
    updateStatusText(text) {
        this.statusText.textContent = text;
    }
    
    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore.toString());
    }
    
    loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        this.highScore = saved ? parseInt(saved) : 0;
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});