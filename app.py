from flask import request, Flask, render_template, json, jsonify

app = Flask(__name__)

coords = None

@app.route("/")
def main():
    return render_template("start.html")

@app.route("/fields")
def fields():
    global coords
    return render_template("fields.html", coords=None, contourbutton='disabled')

@app.route("/fields", methods=['POST'])
def fieldsearch():
    global coords
    lng = float(request.form['lng'])
    #markery = float(request.form['markery'])
    #print(y)
    lat = float(request.form['lat'])
    #markerx = float(request.form['markerx'])
    #print(x)
    zoom = float(request.form['zoom'])
    #print(type(zoom))
    #coords = json.dumps({'lng':lng, 'lat':lat, 'markerx':markerx, 'markery':markery, 'zoom':zoom})
    coords = json.dumps({'lng':lng, 'lat':lat, 'zoom':zoom})
    print(coords)
    #print(type(coords))
    return coords

@app.route("/contours")
def contours():
    global coords
    #coords = {'lat': coord1, 'lng': coord2, 'zoom': zoom}
    print(coords)
    return render_template("contours.html", coords=coords, map_class='', none_import_class='', import_class='invisible')

'''@app.route("/contours/<coord1>/<coord2>/<zoom>")
def contours(coord1, coord2, zoom):
    #global coords
    #print(coords)
    coords = {'lat': coord1, 'lng': coord2, 'zoom': zoom}
    print(coords)
    return render_template("contours.html", coords=coords, map_class='', none_import_class='', import_class='invisible')'''

@app.route("/import_contours")
def import_contours():
    global coords
    #print(coords)
    return render_template("contours.html", coords=coords, map_class='disabled', none_import_class='disabled', import_class='')

'''@app.route("/contours", methods=['POST'])
def contoursearch():
    global coords
    lng = float(request.form['lng'])
    #markery = float(request.form['markery'])
    #print(y)
    lat = float(request.form['lat'])
    #markerx = float(request.form['markerx'])
    #print(x)
    zoom = float(request.form['zoom'])
    #print(type(zoom))
    #coords = json.dumps({'lng':lng, 'lat':lat, 'markerx':markerx, 'markery':markery, 'zoom':zoom})
    coords = json.dumps({'lng':lng, 'lat':lat, 'zoom':zoom})
    print(coords)
    #print(type(coords))
    return coords'''

'''@app.route("/plan")
def plan():
    return render_template("plan.html")'''

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=80)
