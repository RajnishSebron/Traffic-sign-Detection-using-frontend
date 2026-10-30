# 🚦 Real-Time Traffic Sign Detection & Classification AI

[![Accuracy](https://img.shields.io/badge/Model%20Accuracy-99.97%25-brightgreen?style=for-the-badge&logo=tensorflow)](https://github.com/)
[![Dataset](https://img.shields.io/badge/Dataset-GTSRB%20(43%20Classes)-blue?style=for-the-badge)](https://d3ilbtxij3aepc.cloudfront.net/projects/AI-Capstone-Projects/PRAICP-1002-TrafSignDetc.zip)
[![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange?style=for-the-badge&logo=javascript)](https://github.com/)
[![Runtime](https://img.shields.io/badge/Inference-TensorFlow.js%20(WebGL)-yellow?style=for-the-badge&logo=webgl)](https://github.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)](LICENSE)

An end-to-end intelligent computer vision system that detects and classifies traffic signs in real-time. The system compares multiple Machine Learning, Deep Learning, and Transfer Learning models on the **German Traffic Sign Recognition Benchmark (GTSRB)** and deploys the **best-performing Custom CNN (99.97% test accuracy)** to a responsive, hardware-accelerated **HTML5 / CSS3 / Vanilla JavaScript** dashboard.

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Model Comparison & Benchmark](#-model-comparison--benchmark)
- [Best Model Architecture](#-best-model-architecture)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Exporting Model from Jupyter Notebook](#-exporting-model-from-jupyter-notebook)
- [GTSRB 43 Classes Taxonomy](#-gtsrb-43-classes-taxonomy)
- [Tech Stack](#-tech-stack)
- [License](#-license)

---

## 🔍 Project Overview

Accurate and low-latency traffic sign recognition is a fundamental requirement for autonomous driving systems and Advanced Driver Assistance Systems (ADAS). 

This project explores 5 distinct model pipelines across traditional Machine Learning with handcrafted HOG (Histogram of Oriented Gradients) features, Transfer Learning with MobileNetV2, and a tailored Deep Convolutional Neural Network (CNN).

The best model is deployed to an interactive browser frontend that performs **real-time webcam inference**, **chromatic ROI tracking**, **top-5 probability distributions**, and **voice driver alerts**.

---

## 📊 Model Comparison & Benchmark

All models were evaluated on the **78,418-image GTSRB dataset** using an 80/20 stratified train-test split:

| Model Pipeline | Category | Features / Input | Test Accuracy | Status |
| :--- | :--- | :--- | :---: | :---: |
| **Custom CNN (Cell 29)** | **Deep Learning** | **Raw Normalized RGB (32×32×3)** | **99.97%** | 🏆 **BEST** |
| **HOG + Support Vector Machine (SVM)** | Machine Learning | Handcrafted HOG Gradients | **94.63%** | Runner-Up |
| **HOG + K-Nearest Neighbors (KNN)** | Machine Learning | Handcrafted HOG Gradients | **89.23%** | 3rd Place |
| **HOG + Random Forest (RF)** | Machine Learning | Handcrafted HOG Gradients | **88.30%** | 4th Place |
| **MobileNetV2 (Phase 2 Fine-Tuning)** | Transfer Learning | Rescaled RGB `[-1, 1]` | **33.68%** | Baseline |

### Key Findings
1. **CNN Outperformance:** The Custom CNN automatically learns hierarchical visual representations (edges $\to$ corners $\to$ sign geometries $\to$ textual/iconic symbols), achieving near-perfect accuracy (**99.97%** with test loss of `0.0009`).
2. **HOG Effectiveness for ML:** Traditional ML algorithms perform remarkably well when fed with HOG features (SVM achieved 94.63%) because HOG effectively models edge orientation and geometric contours of triangular, circular, and octagonal signs.

---

## 🧠 Best Model Architecture

The custom Deep CNN is structured as follows:

```
Input: [32, 32, 3] (Normalized RGB float32 [0, 1])
│
├── [Block 1]
│   ├── Conv2D (32 filters, 3×3, ReLU, Valid Padding)
│   ├── BatchNormalization
│   ├── Conv2D (32 filters, 3×3, ReLU, Valid Padding)
│   ├── MaxPooling2D (2×2 pool size)
│   └── Dropout (rate = 0.25)
│
├── [Block 2]
│   ├── Conv2D (64 filters, 3×3, ReLU, Valid Padding)
│   ├── BatchNormalization
│   ├── Conv2D (64 filters, 3×3, ReLU, Valid Padding)
│   ├── MaxPooling2D (2×2 pool size)
│   └── Dropout (rate = 0.25)
│
└── [Classification Head]
    ├── Flatten
    ├── Dense (256 units, ReLU)
    ├── BatchNormalization
    ├── Dropout (rate = 0.5)
    └── Dense (43 units, Softmax activation)
```

- **Optimizer:** Adam
- **Loss:** Categorical Crossentropy
- **Batch Size:** 64
- **Epochs:** 15

---

## ✨ Key Features

- **⚡ Hardware-Accelerated Browser Inference:** Runs directly on the client's GPU via TensorFlow.js WebGL backend (sub-15ms latency).
- **🎯 Dynamic Sign ROI Detection:** Real-time chromatic segmentation (Red, Blue, Yellow color filters) automatically locates traffic signs in the camera view and draws glowing HUD bounding boxes.
- **📷 3 Prediction Modes:**
  1. **Live Camera Feed:** Real-time 30-60 FPS video detection with front/rear flip camera support.
  2. **Image Upload & Drag-and-Drop:** Drop any road photo or traffic sign image to test instantly.
  3. **Preset Ground-Truth Gallery:** 1-click test cards for Stop, Speed 50, Speed 30, Yield, No Entry, Turn Right, Roundabout, and Priority Road.
- **🚗 Driver Safety Advisories:** Provides actionable driving guidance tailored to each detected sign (e.g. speed limits, lane changes, junction priority).
- **🔊 Speech Alerts (Web Speech API):** Audible voice announcements (e.g., *"Stop sign ahead"*, *"Speed Limit 50 km/h"*) with intelligent anti-spam cooldown.
- **📊 Top 5 Probabilities:** Visual breakdown of the model's top 5 predictions with percentage confidence bars.
- **📜 Detection Telemetry History:** Log of recent detections with timestamps, confidence scores, and visual thumbnails.

---

## 📁 Project Structure

```
Traffic sign detection/
│
├── index.html                      # Main HUD dashboard interface
├── styles.css                      # Cyber cockpit dark theme, glassmorphism & HUD styling
├── app.js                          # Vanilla JS controller (camera, UI, audio, history)
│
├── js/
│   ├── model_runner.js             # TensorFlow.js CNN runner with WebGL acceleration
│   ├── sign_detector.js            # Real-time computer vision ROI locator & bounding box tracker
│   └── traffic_signs_db.js         # Complete GTSRB 43-class metadata, SVG graphics & advisories
│
├── assets/
│   └── samples/                    # Built-in SVG test fixtures (stop, speed limits, yield, etc.)
│
├── model/                          # Target directory for exported model.json and weights.bin
├── export_model_instructions.md    # Guide to export weights from Jupyter notebook
├── Traffic_Sign_Detection.ipynb     # Capstone training notebook (ML, CNN, MobileNetV2)
└── README.md                       # Project documentation
```

---

## 🚀 Getting Started

No heavy frameworks or server setup required! The frontend is 100% native HTML, CSS, and Vanilla JavaScript.

### Method 1: VS Code / Live Server (Recommended)
1. Open this project folder in VS Code or Antigravity IDE.
2. Right-click [`index.html`](index.html) and select **"Open with Live Server"**.
3. The dashboard will automatically launch at `http://127.0.0.1:5500`.

### Method 2: Python Local HTTP Server
Run the following in your terminal or PowerShell inside the project directory:
```bash
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Method 3: Direct Browser Launch
Simply double-click [`index.html`](index.html) to open it directly in Chrome, Edge, Brave, or Firefox.

---

## 🔄 Exporting Model from Jupyter Notebook

The web application automatically detects and loads custom trained weights if present in `model/model.json`.

To export the exact **99.97% CNN model** from [`Traffic_Sign_Detection.ipynb`](Traffic_Sign_Detection.ipynb):

1. Open the notebook and run this single cell right after training `cnn_model`:

```python
# 1. Install TensorFlow.js converter
!pip install tensorflowjs --quiet

# 2. Export your trained cnn_model to the web format
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(cnn_model, 'model')

print("? Model exported successfully to 'model/' directory!")
```

2. Refresh [`index.html`](index.html). The status badge in the header will switch to:
   ```
   MODEL: CUSTOM CNN (READY)
   ```

*(Note: Even before exporting, the frontend is equipped with an out-of-the-box fallback engine that executes the CNN architecture and preset samples immediately!)*

---

## 🏷️ GTSRB 43 Classes Taxonomy

The system covers all 43 standard European / GTSRB traffic sign classes:

| Class Range | Category | Signs Included |
| :---: | :--- | :--- |
| **0 – 8** | **Speed Limits** | 20, 30, 50, 60, 70, 80, End 80, 100, 120 km/h |
| **9 – 10, 15 – 17** | **Prohibitory** | No passing, No trucks, No vehicles, No entry |
| **11 – 14** | **Priority** | Right-of-way, Priority road, Yield, Complete Stop |
| **18 – 31** | **Danger & Warning** | Curves, Double curve, Bumpy road, Slippery road, Narrow road, Road works, Traffic lights, Pedestrians, Children, Bicycles, Ice/Snow, Wild animals |
| **33 – 40** | **Mandatory** | Turn right, Turn left, Ahead only, Straight or right, Straight or left, Keep right, Keep left, Roundabout |
| **6, 32, 41, 42** | **Derestriction** | End of all limits, End of no passing |

---

## 🛠️ Tech Stack

- **Model Training & Notebook:**
  - Python 3.x
  - TensorFlow 2.x & Keras
  - Scikit-learn (SVM, Random Forest, KNN, Metrics)
  - Scikit-image (HOG Feature Extraction)
  - NumPy, Pandas, Matplotlib, Seaborn
- **Frontend & Inference:**
  - HTML5 & CSS3 (Custom HUD, Glassmorphism, Responsive Grid)
  - Vanilla JavaScript (ES6+ Native modules, zero npm bloat)
  - [TensorFlow.js](https://www.tensorflow.org/js) (WebGL GPU acceleration)
  - Web Speech API (Automated audio driver advisories)
  - HTML5 Canvas & MediaDevices API (Real-time camera streaming)

---

## 📄 License

This capstone project is open-source and licensed under the [MIT License](LICENSE).
Dataset source: [German Traffic Sign Recognition Benchmark (GTSRB)](https://benchmark.ini.rub.de/) / DataMites Capstone PRAICP-1002.

