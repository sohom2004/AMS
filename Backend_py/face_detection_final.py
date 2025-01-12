import cv2
import numpy as np
import os
import dlib
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from datetime import datetime
import shutil
import requests
from scipy.spatial import distance
from pymongo import MongoClient

# Defining Flask App
app = Flask(__name__)
CORS(app)

port_app = 8000
app.config["MONGO_URI"] = "mongodb+srv://yourmongouri"  # Update with your MongoDB URI
mongo = PyMongo(app)

client = MongoClient("mongodb+srv://sohom:4iW3Tfhdr0Ndch6P@cluster0.b4z1n.mongodb.net/")
db = client["test"]

shape_predictor_path = "shape_predictor_68_face_landmarks.dat"
face_rec_model_path = "dlib_face_recognition_resnet_model_v1.dat"

# Helper function to download files
def download_file(urls, file_path):
    if not os.path.isfile(file_path):
        for url in urls:
            try:
                response = requests.get(url, stream=True)
                response.raise_for_status()
                with open(file_path, 'wb') as f:
                    shutil.copyfileobj(response.raw, f)
                return
            except requests.RequestException as e:
                print(f"Error downloading from {url}: {e}")
        exit(1)

# Downloading required models
download_file([
    "https://raw.githubusercontent.com/italojs/facial-landmarks-recognition/master/shape_predictor_68_face_landmarks.dat"
], shape_predictor_path)
download_file([
    "https://github.com/ageitgey/face_recognition_models/raw/master/face_recognition_models/models/dlib_face_recognition_resnet_model_v1.dat"
], face_rec_model_path)

# Initialize dlib's face detector and face recognition model
face_detector = dlib.get_frontal_face_detector()
shape_predictor = dlib.shape_predictor(shape_predictor_path)
face_rec_model = dlib.face_recognition_model_v1(face_rec_model_path)

def load_known_faces():
    try:
        known_embeddings = []
        known_labels = []
        students = db.students.find()
        for student in students:
            if 'embeddings' in student and 'registrationNumber' in student:
                # Flatten nested embeddings
                flattened_embeddings = [np.array(emb[0]) if isinstance(emb, list) and len(emb) == 1 else np.array(emb) for emb in student['embeddings']]
                known_embeddings.extend(flattened_embeddings)
                known_labels.extend([student['registrationNumber']] * len(flattened_embeddings))
            else:
                print(f"Skipping invalid student record: {student}")

        if not known_embeddings:
            print("No embeddings found in 'students' collection.")
            return None, None

        return known_embeddings, known_labels

    except Exception as e:
        print(f"Error loading known faces: {e}")
        return None, None


    except Exception as e:
        print(f"Error loading known faces: {e}")
        return None, None


# Recognize face in the input image
def recognize_face(embedding, known_embeddings, known_labels):
    # Compare with known embeddings
    min_distance = float("inf")
    best_match = "Unidentified"
    for known_emb, label in zip(known_embeddings, known_labels):
        dist = distance.euclidean(embedding, known_emb)
        if dist < min_distance:
            min_distance = dist
            best_match = label

    # Return match if within threshold
    threshold = 0.6  # Adjust threshold as needed
    if min_distance < threshold:
        return best_match
    else:
        return "Unidentified"

@app.route('/add', methods=['POST'])
def add():
    try:
        # Parsing form data
        name = request.form.get('name')
        registration_number = request.form.get('registrationNumber')
        email = request.form.get('email')
        department = request.form.get('department')
        domain = request.form.get('domain')
        year = request.form.get('year')
        
        print(name)
        # Validate required fields
        if not name or not registration_number:
            return jsonify({"message": "Name and Registration Number are required."}), 400

        # Check and process uploaded images
        if 'images' not in request.files:
            return jsonify({"message": "No image files provided."}), 400

        uploaded_files = request.files.getlist('images')
        embeddings = []

        for image_file in uploaded_files:
            img = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
            if img is None:
                return jsonify({"message": f"Invalid image format for {image_file.filename}"}), 400

            # Convert the image to RGB format
            rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # Detect faces in the image
            detections = face_detector(rgb_img, 1)

            if len(detections) == 0:
                return jsonify({"message": f"No face detected in {image_file.filename}"}), 400

            if len(detections) > 1:
                return jsonify({"message": f"Multiple faces detected in {image_file.filename}. Please upload images with a single face."}), 400

            # Compute the embedding for the detected face
            try:
                shape = shape_predictor(rgb_img, detections[0])
                embedding = np.array(face_rec_model.compute_face_descriptor(rgb_img, shape)).tolist()
                embeddings.append(embedding)
            except Exception as e:
                return jsonify({"message": f"Error processing {image_file.filename}", "error": str(e)}), 500

        # Save data to MongoDB
        # mongo.db.students.insert_one({
        #     "name": name,
        #     "registrationNumber": registration_number,
        #     "email": email,
        #     "department": department,
        #     "domain": domain,
        #     "year": year,
        #     "embeddings": embeddings,
        #     "createdAt": datetime.utcnow()
        # })

        return jsonify({"name": name, "registrationNumber": registration_number, "embeddings": embeddings}), 200

    except Exception as e:
        return jsonify({"message": "An error occurred.", "error": str(e)}), 500

@app.route('/start', methods=['GET', 'POST'])
def start():
    try:
        # Log form data for debugging
        print("Request Form Data:", request.form)

        # Ensure an image file is provided in the request
        image_file = request.files.get('image')
        if not image_file:
            return jsonify({"message": "No image file provided."}), 400

        # Read the uploaded image as a numpy array
        img = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({"message": "Invalid image format."}), 400

        # Convert the image to RGB format
        rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        # Detect faces in the image
        detections = face_detector(rgb_img, 1)
        print(f"Number of faces detected: {len(detections)}")

        if len(detections) == 0:
            return jsonify({"message": "No face detected in the image."}), 400

        if len(detections) > 1:
            return jsonify({"message": "Multiple faces detected. Please upload an image with a single face."}), 400

        # Compute the embedding for the detected face
        try:
            known_embeddings, known_labels = load_known_faces()
            if known_embeddings is None or known_labels is None:
                return jsonify({"message": "No known faces loaded. Please check your data setup."}), 500

            shape = shape_predictor(rgb_img, detections[0])
            embedding = np.array(face_rec_model.compute_face_descriptor(rgb_img, shape)).tolist()

            # Recognize the face
            result = recognize_face(embedding, known_embeddings, known_labels)
            if result:
                print(result)
                return jsonify({"status": "matched", "registrationNumber": result}), 200
            else:
                return jsonify({"status": "unmatched"}), 200

        except Exception as e:
            print(f"Error during face recognition: {e}")
            return jsonify({"message": "Error processing the image.", "error": str(e)}), 500

    except Exception as e:
        print(f"Unexpected server error: {e}")
        return jsonify({"message": "Internal server error.", "error": str(e)}), 500


if __name__ == "__main__":
    print(f"Python server is running at {port_app}")
    app.run(port=port_app)
