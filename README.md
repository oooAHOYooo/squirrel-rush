# 🐿️ Squirrel Dash - 3D Endless Runner

A high-speed 3D endless runner game where players control a squirrel navigating through treetop branches, collecting acorns and avoiding obstacles.

## Features

- **3D Graphics**: Built with Three.js for smooth 3D gameplay
- **Branch Navigation**: Three-lane system on tree branches
- **Dynamic Obstacles**: Spikes and hazards that require quick reflexes  
- **Collectibles**: Acorns that boost your score
- **Leaderboard**: Global high scores with real-time updates
- **Responsive Design**: Works on desktop and mobile devices
- **Sound Effects**: Web Audio API powered sound system
- **Local Storage**: Persistent high scores and settings

## Technology Stack

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **3D Engine**: Three.js
- **Deployment**: Render.com
- **Styling**: Custom CSS with modern effects

## Project Structure

```
squirrel-rush/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── render.yaml           # Render deployment config
├── Procfile              # Process file for Heroku-style deployment
├── .gitignore            # Git ignore file
├── templates/
│   ├── index.html        # Marketing homepage
│   ├── game.html         # 3D game page
│   └── leaderboard.html  # Leaderboard page
├── static/
│   ├── css/
│   │   └── style.css     # Additional styles
│   └── js/
│       └── game.js       # Game utilities and helpers
└── README.md
```

## Local Development

1. Clone the repository
2. Install dependencies: `pip install -r requirements.txt`
3. Run the app: `python app.py`
4. Open `http://localhost:5001` (Note: Port 5001 to avoid conflicts with AirPlay)

## Deployment

### Render.com Deployment:
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Use the `render.yaml` configuration
4. Deploy automatically on every push

### Heroku Deployment:
1. Create a Heroku app
2. Deploy using the `Procfile`
3. Set environment variables as needed

## Game Controls

- **Arrow Keys / A,D**: Switch between branches (lanes)
- **Arrow Up / W / Space**: Jump over obstacles
- **Objective**: Collect acorns, avoid spikes, survive as long as possible

## Scoring System

- Distance traveled: +1 point per frame
- Acorns collected: +150 points each
- Survival bonus: Game speed increases over time

## API Endpoints

- `GET /` - Homepage
- `GET /game` - Game page
- `GET /leaderboard` - Leaderboard page
- `POST /api/save-score` - Save player score
- `GET /api/get-scores` - Get high scores
- `GET /api/game-stats` - Get game statistics

## Features in Detail

### 3D Game Engine
- Built with Three.js for smooth 3D rendering
- Procedural obstacle and acorn generation
- Collision detection system
- Smooth camera movement and lighting

### Score System
- Real-time score tracking
- Persistent high score storage
- Global leaderboard with rankings
- Distance and acorn collection tracking

### Responsive Design
- Mobile-optimized controls
- Adaptive UI for different screen sizes
- Touch-friendly interface elements

---

Created with ❤️ for endless branch-running fun!