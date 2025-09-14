from flask import Flask, render_template, jsonify, request
import os
import json
from datetime import datetime

app = Flask(__name__)

# Simple in-memory storage (replace with database in production)
HIGH_SCORES = [
    {"name": "BranchMaster", "score": 25420, "timestamp": "2024-01-15"},
    {"name": "AcornHunter", "score": 22890, "timestamp": "2024-01-14"},
    {"name": "TreeRunner", "score": 21650, "timestamp": "2024-01-13"},
    {"name": "NutCollector", "score": 19870, "timestamp": "2024-01-12"},
    {"name": "SquirrelKing", "score": 18900, "timestamp": "2024-01-11"},
    {"name": "ForestDash", "score": 17800, "timestamp": "2024-01-10"},
    {"name": "BranchJumper", "score": 16500, "timestamp": "2024-01-09"},
    {"name": "SpeedSquirrel", "score": 15200, "timestamp": "2024-01-08"},
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/leaderboard')
def leaderboard():
    # Sort scores and get top 10
    sorted_scores = sorted(HIGH_SCORES, key=lambda x: x['score'], reverse=True)[:10]
    return render_template('leaderboard.html', scores=sorted_scores)

@app.route('/api/save-score', methods=['POST'])
def save_score():
    try:
        data = request.get_json()
        player_name = data.get('name', f'Player{len(HIGH_SCORES) + 1}')
        score = int(data.get('score', 0))
        
        new_score = {
            "name": player_name,
            "score": score,
            "timestamp": datetime.now().strftime("%Y-%m-%d")
        }
        
        HIGH_SCORES.append(new_score)
        # Keep only top 20 scores
        HIGH_SCORES.sort(key=lambda x: x['score'], reverse=True)
        if len(HIGH_SCORES) > 20:
            HIGH_SCORES[:] = HIGH_SCORES[:20]
            
        return jsonify({"status": "success", "rank": HIGH_SCORES.index(new_score) + 1})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/api/get-scores')
def get_scores():
    sorted_scores = sorted(HIGH_SCORES, key=lambda x: x['score'], reverse=True)[:10]
    return jsonify(sorted_scores)

@app.route('/api/game-stats')
def game_stats():
    total_players = len(HIGH_SCORES)
    total_score = sum(score['score'] for score in HIGH_SCORES)
    avg_score = total_score // total_players if total_players > 0 else 0
    
    return jsonify({
        "total_players": total_players,
        "games_played": total_players * 15,  # Estimate
        "total_acorns": total_score // 150,  # Assuming 150 points per acorn
        "total_distance": total_score // 10   # Assuming 10 points per meter
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)
