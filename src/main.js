import { GameController } from './gameController.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 获取画布元素
    const canvas = document.getElementById('gameCanvas');
    
    // 获取UI元素
    const uiElements = {
        scoreElement: document.getElementById('score'),
        highScoreElement: document.getElementById('high-score'),
        statusText: document.getElementById('gameStatusText'),
        startBtn: document.getElementById('startBtn'),
        pauseBtn: document.getElementById('pauseBtn'),
        resetBtn: document.getElementById('resetBtn'),
        difficultySelect: document.getElementById('difficultySelect'),
        difficultyDisplay: document.getElementById('difficultyDisplay')
    };
    
    // 初始化游戏控制器
    new GameController(canvas, uiElements);
});
