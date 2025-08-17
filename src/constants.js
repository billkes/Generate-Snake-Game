export const GAME_CONFIG = {
    GRID_SIZE: 20,
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 400,
    INITIAL_SPEED: 150,
    MIN_SPEED: 80,
    SPEED_INCREMENT: 5,
    SCORE_INCREMENT: 10,
    DIFFICULTY_LEVELS: {
        EASY: { name: '简单', speed: 200 },
        MEDIUM: { name: '中等', speed: 150 },
        HARD: { name: '困难', speed: 100 },
        EXPERT: { name: '专家', speed: 70 }
    }
};

export const DIRECTIONS = {
    UP: { x: 0, y: -1 },
    DOWN: { x: 0, y: 1 },
    LEFT: { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 }
};

export const KEY_MAP = {
    'ArrowUp': 'UP',
    'w': 'UP',
    'W': 'UP',
    'ArrowDown': 'DOWN',
    's': 'DOWN',
    'S': 'DOWN',
    'ArrowLeft': 'LEFT',
    'a': 'LEFT',
    'A': 'LEFT',
    'ArrowRight': 'RIGHT',
    'd': 'RIGHT',
    'D': 'RIGHT'
};

export const COLORS = {
    CANVAS_BG: '#f8f9fa',
    GRID: '#e9ecef',
    SNAKE_HEAD: '#764ba2',
    SNAKE_BODY: '#667eea',
    FOOD: '#ff6b6b',
    FOOD_HIGHLIGHT: '#ff8787',
    OBSTACLE: '#333333'
};
