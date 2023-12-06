from flask import Flask, request, jsonify
from waitress import serve
from predict import predict_class
import json

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10 * 1000 * 1000

@app.route("/predict", methods=['POST'])
def index():
    if request.method == 'POST':
        # Mengambil Kunci API dari Request Header
        key = request.headers.get('X-API-Key')
        # Jika Kunci API Benar
        if(key==api_key):
            # Try (jika request valid)
            try:
                image_file = request.files['image']
                image_file.save('uploaded_image.jpg')

                prediksi_label = predict_class('uploaded_image.jpg')

                result = {'predicted_class': prediksi_label}
                return jsonify(result)
            # catch (jika request tidak valid)
            except:
                return jsonify({"status": "bad request"})
        # Jika Kunci API Salah
        else:
            return jsonify({"status": "unauthorized"})

# Memulai Server
if __name__ == "__main__":
    with open('./private/key.json', 'r') as fileKey:
        api_key = json.load(fileKey).get('key')
    
    print("Server: http://0.0.0.0:8080")
    serve(app, host="0.0.0.0", port=8080)
    