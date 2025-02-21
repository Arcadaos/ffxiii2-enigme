
# parameters : table clock with the translation values
# I need 3 things :
# - Current element I'm on
# - Where I went to see if I already went on the clock face (tuple to search with O(1) if something is in there)
# - My path I will return (a List)
# The searching is with a FIFO order, new elements are put to the end and I look at first value
# I need to calculate the neighbours of each clock face : for the face i with the value v the neighbours are (i-v) mod nb_faces and (i+v) mod nb_faces
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def solve_clock(clock_faces):
    """
    Find an Eulerian Path for given dials from a clock with the translation values on each dial

    Args:
        clock_faces (list[int]): dials from the clock

    Returns:
        list[int] or None: The path with the number of each dial to recreate an Eulerian Path or None if there isn't any Eulerian path 
    """
    nb_faces = len(clock_faces)
    connections = {face: [(face + clock_faces[face]) % nb_faces, (face - clock_faces[face]) % nb_faces] for face in range(nb_faces)}
    for start in range(nb_faces):
        stack = [(start, [start], {start})] # (current_index, path, visited)
        while stack : # while there's something to look at
            current, path, visited = stack.pop()
            if (len(path) == nb_faces):
                return path
            for neighbor in connections[current]:
                if not neighbor in visited:
                    stack.append((neighbor, path + [neighbor], visited | {neighbor}))
    return None

print(solve_clock([2, 3, 1, -2, 4]))

@app.route("/solve", methods=["POST"])
def solve():
    data = request.json
    
    if not data or "dials" not in data:
        return jsonify({"error": "Invalid input"}), 400
    dials = data["dials"]
    
    # validate input
    if not isinstance(dials, list) or not all(isinstance(x, int) for x in dials):
        return jsonify({"error": "Dials must be a list of integers."}), 400
    
    # solve the problem
    result = solve_clock(dials)
    
    return jsonify({"result": result if result is not None else "No valid path found"})

if __name__ == "__main__":
    app.run(debug=True)