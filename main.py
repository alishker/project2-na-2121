from flask import Flask, request, send_from_directory
from flask_cors import CORS
import requests
import numpy as np
import sys
sys.path.insert(1, 'Integrate/oops')
from game import *
import ast
import os

app = Flask(__name__, static_folder='Frontend/build')
CORS(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    path_dir = os.path.abspath("Frontend/build") #path react build
    if path != "" and os.path.exists(os.path.join(path_dir, path)):
        return send_from_directory(os.path.join(path_dir), path)
    else:
        return send_from_directory(os.path.join(path_dir),'index.html')

@app.route('/agent-turn', methods=['GET'])
def agent_turn():
    args = request.args
    board = args['board']
    board = ast.literal_eval(board)
    board = np.array(board, dtype = str)
    depth = int(args['depth'])
    beginner = args['gameBeginner']
    if beginner == "HUMAN":
        is_max = False
    else:
        is_max = True
    g.use_bigtree(is_max)
    r,c,win = g.agent_next_move(board,depth, is_max)
    return {"r": r, "c":c, "win": win}

@app.route('/agent-turn-ultimate', methods=['GET'])
def agent_turn_ultimate():
    args = request.args
    board = args['board']
    board = ast.literal_eval(board)
    board = np.array(board, dtype = str)
    checkboard = args['checkboard']
    checkboard = ast.literal_eval(checkboard)
    checkboard = np.array(checkboard, dtype = str)
    previous_move = args['previous_move']
    previous_move = ast.literal_eval(previous_move)
    arr = g.agent_next_move_ultimate(board,checkboard,previous_move)
    return {"agent-move": arr}


if __name__ == "__main__": 
    g = Game()
    g.initialize_bigtree()
    app.run(host='0.0.0.0', port = sys.argv[1])
