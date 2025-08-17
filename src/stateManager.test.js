import { StateManager } from './stateManager.js';
import { GAME_CONFIG } from './constants.js';

// 简单的测试函数
function runTest(description, testFn) {
    try {
        testFn();
        console.log(`  ✓ ${description}`);
        return true;
    } catch (error) {
        console.log(`  ✗ ${description}`);
        console.error(`    Error: ${error.message}`);
        return false;
    }
}

function expect(actual) {
    return {
        toBe: (expected) => {
            if (actual !== expected) {
                throw new Error(`Expected ${expected} but got ${actual}`);
            }
        },
        toEqual: (expected) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
            }
        },
        toBeGreaterThan: (expected) => {
            if (actual <= expected) {
                throw new Error(`Expected ${actual} to be greater than ${expected}`);
            }
        },
        toBeLessThan: (expected) => {
            if (actual >= expected) {
                throw new Error(`Expected ${actual} to be less than ${expected}`);
            }
        },
        toBeGreaterThanOrEqual: (expected) => {
            if (actual < expected) {
                throw new Error(`Expected ${actual} to be greater than or equal to ${expected}`);
            }
        },
        toBeLessThanOrEqual: (expected) => {
            if (actual > expected) {
                throw new Error(`Expected ${actual} to be less than or equal to ${expected}`);
            }
        }
    };
}

console.log('StateManager Tests');

// 测试计数器
let passedTests = 0;
let totalTests = 0;

// 测试1: 初始化默认值
totalTests++;
passedTests += runTest('should initialize with correct default values', () => {
    const stateManager = new StateManager();
    
    expect(stateManager.snake.length).toBe(1);
    expect(stateManager.snake[0].x).toBe(10);
    expect(stateManager.snake[0].y).toBe(10);
    expect(stateManager.direction.x).toBe(0);
    expect(stateManager.direction.y).toBe(0);
    expect(stateManager.score).toBe(0);
    expect(stateManager.gameRunning).toBe(false);
    expect(stateManager.gamePaused).toBe(false);
    expect(stateManager.gameSpeed).toBe(GAME_CONFIG.INITIAL_SPEED);
});

// 测试2: 设置难度
totalTests++;
passedTests += runTest('should set difficulty correctly', () => {
    const stateManager = new StateManager();
    
    stateManager.setDifficulty('EASY');
    expect(stateManager.gameSpeed).toBe(GAME_CONFIG.DIFFICULTY_LEVELS.EASY.speed);
    
    stateManager.setDifficulty('HARD');
    expect(stateManager.gameSpeed).toBe(GAME_CONFIG.DIFFICULTY_LEVELS.HARD.speed);
});

// 测试3: 防止蛇反向移动
totalTests++;
passedTests += runTest('should prevent snake from reversing direction', () => {
    const stateManager = new StateManager();
    
    // 设置初始方向向右
    stateManager.setDirection({ x: 1, y: 0 });
    stateManager.updateDirection();
    
    // 尝试反向（向左）
    stateManager.setDirection({ x: -1, y: 0 });
    stateManager.updateDirection();
    
    // 方向应该保持向右
    expect(stateManager.direction.x).toBe(1);
    expect(stateManager.direction.y).toBe(0);
});

// 测试4: 蛇移动
totalTests++;
passedTests += runTest('should move snake correctly', () => {
    const stateManager = new StateManager();
    const initialHead = { ...stateManager.snake[0] };
    
    stateManager.setDirection({ x: 1, y: 0 });
    stateManager.updateDirection();
    stateManager.moveSnake();
    
    expect(stateManager.snake[0].x).toBe(initialHead.x + 1);
    expect(stateManager.snake[0].y).toBe(initialHead.y);
    expect(stateManager.snake.length).toBe(2);
});

// 测试5: 生成食物
totalTests++;
passedTests += runTest('should generate food at valid position', () => {
    const stateManager = new StateManager();
    const food = stateManager.generateFood();
    
    expect(food.x).toBeGreaterThanOrEqual(0);
    expect(food.x).toBeLessThan(GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE);
    expect(food.y).toBeGreaterThanOrEqual(0);
    expect(food.y).toBeLessThan(GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.GRID_SIZE);
});

// 测试6: 墙碰撞检测
totalTests++;
passedTests += runTest('should detect collision with walls', () => {
    const stateManager = new StateManager();
    
    // 将蛇移到左墙
    stateManager.snake[0] = { x: 0, y: 10 };
    stateManager.setDirection({ x: -1, y: 0 });
    stateManager.updateDirection();
    stateManager.moveSnake();
    
    expect(stateManager.checkCollision()).toBe(true);
});

// 测试7: 自身碰撞检测
totalTests++;
passedTests += runTest('should detect collision with self', () => {
    const stateManager = new StateManager();
    
    // 创建一个蛇撞到自己的情况
    stateManager.snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 9, y: 11 },
        { x: 10, y: 11 },
        { x: 11, y: 11 }
    ];
    // 将头移动到与身体重叠的位置
    stateManager.snake[0] = { x: 9, y: 10 };
    
    expect(stateManager.checkCollision()).toBe(true);
});

// 测试8: 增加分数
totalTests++;
passedTests += runTest('should increase score when food is eaten', () => {
    const stateManager = new StateManager();
    const initialScore = stateManager.score;
    
    stateManager.increaseScore();
    expect(stateManager.score).toBe(initialScore + GAME_CONFIG.SCORE_INCREMENT);
});

// 测试9: 增加速度
totalTests++;
passedTests += runTest('should increase speed when food is eaten', () => {
    const stateManager = new StateManager();
    const initialSpeed = stateManager.gameSpeed;
    
    stateManager.increaseSpeed();
    expect(stateManager.gameSpeed).toBe(initialSpeed - GAME_CONFIG.SPEED_INCREMENT);
});

// 测试10: 障碍物生成
totalTests++;
passedTests += runTest('should generate obstacles', () => {
    const stateManager = new StateManager();
    stateManager.generateObstacles(5);
    
    expect(stateManager.obstacles.length).toBe(5);
    
    // 检查所有障碍物都在有效范围内
    stateManager.obstacles.forEach(obstacle => {
        expect(obstacle.x).toBeGreaterThanOrEqual(0);
        expect(obstacle.x).toBeLessThan(GAME_CONFIG.CANVAS_WIDTH / GAME_CONFIG.GRID_SIZE);
        expect(obstacle.y).toBeGreaterThanOrEqual(0);
        expect(obstacle.y).toBeLessThan(GAME_CONFIG.CANVAS_HEIGHT / GAME_CONFIG.GRID_SIZE);
    });
});

console.log(`\n测试完成！${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
    console.log('所有测试通过！✓');
    process.exit(0);
} else {
    console.log('部分测试失败！✗');
    process.exit(1);
}
