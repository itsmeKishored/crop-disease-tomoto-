from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np

app = Flask(__name__)

# Initialize CORS
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins (for development purposes)

# Load the model
model = tf.keras.models.load_model('model/tomato_classifier.h5')

# Define a route to handle image uploads and predictions
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'image' not in data:
        return jsonify({'error': 'No image data provided'}), 400

    # Decode the base64 image
    import base64
    from io import BytesIO
    from PIL import Image

    image_data = data['image']
    image_data = image_data.split(",")[1]  # Remove data URL scheme
    image_bytes = base64.b64decode(image_data)
    img = Image.open(BytesIO(image_bytes))
    img = img.resize((128, 128))
    img = np.array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255.0

    # Make prediction
    prediction = model.predict(img)
    predicted_class = np.argmax(prediction, axis=1)[0]

    # Load class labels
    import json
    with open('class_labels.json') as f:
        class_labels = json.load(f)

    disease_name = class_labels.get(str(predicted_class), "Unknown Disease")

    return jsonify({'disease': disease_name})

if __name__ == '__main__':
    app.run(debug=True)
