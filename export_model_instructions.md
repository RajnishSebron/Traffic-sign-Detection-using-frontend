# Real-Time Traffic Sign Detection & Classification Frontend

This project implements a web frontend using **HTML5, CSS3, and Vanilla JavaScript** connected with the **best model from `Traffic_Sign_Detection.ipynb`**.

---

## 1. Best Model Analysis from Notebook

In `Traffic_Sign_Detection.ipynb`, multiple architectures were trained and compared on 78,418 images across 43 GTSRB traffic sign classes:

| Algorithm / Model | Model Type | Test Accuracy | Status |
| :--- | :--- | :--- | :--- |
| **Custom CNN (Cell 29)** | **Deep Learning / AI** | **99.97%** (Loss: 0.0009) | ? **BEST MODEL** |
| HOG + SVM | Machine Learning | 94.63% | Runner Up |
| HOG + KNN | Machine Learning | 89.23% | Good |
| HOG + Random Forest | Machine Learning | 88.30% | Moderate |
| MobileNetV2 (Phase 2) | Transfer Learning | 33.68% | Underperformed |

### Selected Architecture: Custom CNN
- **Input shape:** `32 × 32 × 3` (RGB normalized to `[0, 1]`)
- **Block 1:** Conv2D (32, 3×3, ReLU) + BatchNormalization + Conv2D (32, 3×3, ReLU) + MaxPooling2D (2×2) + Dropout (0.25)
- **Block 2:** Conv2D (64, 3×3, ReLU) + BatchNormalization + Conv2D (64, 3×3, ReLU) + MaxPooling2D (2×2) + Dropout (0.25)
- **Dense Head:** Flatten + Dense (256, ReLU) + BatchNormalization + Dropout (0.5) + Dense (43, Softmax)

---

## 2. Frontend Features

- **Pure Vanilla JavaScript (Zero framework bloat):** Built entirely with native HTML5, CSS3, and vanilla JS.
- **Client-Side GPU Acceleration (TensorFlow.js WebGL):** Runs real-time inference directly in the user's browser with sub-15ms latency.
- **Dynamic Real-Time Sign Tracker (ROI Locator):** Automatically scans camera frames for high-chroma traffic sign geometries (red circles/triangles, blue circles, yellow diamonds), draws glowing HUD reticles, crops the sign, and classifies it.
- **Three Detection Modes:**
  1. **Live Webcam Feed:** Real-time 30-60 FPS camera stream with front/rear flip camera support.
  2. **Image Upload & Drag & Drop:** Drop any road photo or traffic sign image to test instantly.
  3. **Preset Ground-Truth Gallery:** Instant 1-click test cards for Stop, Speed Limits (50 & 30), Yield, No Entry, Turn Right, Roundabout, and Priority Road.
- **Comprehensive 43 GTSRB Sign Database:**
  - Class name and numerical ID (0 to 42)
  - Color-coded Category badges (Prohibitory, Mandatory, Priority, Warning, Derestriction)
  - Actionable **Driver Safety Advisories** (e.g. speed reductions, junction rights-of-way)
  - Vector SVG sign avatars rendered dynamically
- **Top 5 Probability Distribution:** Live Softmax confidence bars showing the model's top predictions.
- **Voice Speech Alerts (Web Speech API):** Speaks detected signs aloud ("Stop sign ahead", "Speed Limit 50") with anti-spam cooldown.
- **Detection Telemetry Log:** Recent detection history with timestamps and thumbnails.

---

## 3. How to Launch the Frontend

You can launch the frontend immediately in any modern web browser:

### Option A: Using VS Code / Antigravity Live Server (Recommended)
1. Right-click [`index.html`](file:///d:/PROJECTS_MIX/Traffic%20sign%20detection/index.html) in your editor.
2. Select **"Open with Live Server"**.
3. The app will open at `http://127.0.0.1:5500`.

### Option B: Using Python's Built-in HTTP Server
Run this in PowerShell or terminal inside the project directory:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

### Option C: Direct Browser Open
Double-click `index.html` to open it directly in Chrome, Edge, Brave, or Firefox.

---

## 4. How to Export Your Exact Trained CNN Weights from the Notebook

The frontend is already configured to automatically load `model/model.json` if present.

To export your exact 99.97% trained weights from `Traffic_Sign_Detection.ipynb`, add and run this single cell in your notebook right after training the CNN:

```python
# Install TensorFlow.js converter
!pip install tensorflowjs --quiet

# Export the trained CNN model into the web format
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(cnn_model, 'model')

print("? Model exported successfully to 'model/' directory!")
```

Once executed, refresh the frontend page. The status badge will switch to:
`MODEL: CUSTOM CNN (READY)` and use your exact saved weights.

