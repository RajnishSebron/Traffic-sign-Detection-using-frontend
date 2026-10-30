/**
 * TRAFFIC SIGN VISION AI - MAIN CLIENT APPLICATION (Vanilla JavaScript)
 * Handles Camera Stream, Video Canvas Rendering, Real-Time ROI Tracking,
 * TensorFlow.js Inference, Audio Alerts, and UI Dashboard Updates.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // --- Application State ---
    const state = {
        mode: 'webcam', // 'webcam' | 'upload' | 'samples'
        isStreaming: false,
        videoStream: null,
        facingMode: 'environment', // 'user' | 'environment'
        audioEnabled: true,
        lastSpokenSign: null,
        lastSpokenTime: 0,
        fpsCounter: 0,
        fpsTimer: performance.now(),
        currentFps: 0,
        recentDetections: [],
        animFrameId: null
    };

    // --- DOM Elements ---
    const videoElem = document.getElementById('webcam-video');
    const displayCanvas = document.getElementById('display-canvas');
    const displayCtx = displayCanvas.getContext('2d', { willReadFrequently: true });
    const viewportPlaceholder = document.getElementById('viewport-placeholder');
    const hudTargetBox = document.getElementById('hud-target-box');
    const targetLabel = document.getElementById('target-label');
    const fpsDisplay = document.getElementById('fps-display');
    const inferenceTimeLabel = document.getElementById('inference-time-label');
    const detectionModeLabel = document.getElementById('detection-mode-label');
    const modelDot = document.getElementById('model-dot');
    const modelStatusText = document.getElementById('model-status-text');
    const backendLabel = document.getElementById('backend-label');

    // Dashboard Cards
    const signCategoryPill = document.getElementById('sign-category-pill');
    const signClassId = document.getElementById('sign-class-id');
    const signAvatarContainer = document.getElementById('sign-avatar-container');
    const signName = document.getElementById('sign-name');
    const confidenceVal = document.getElementById('confidence-val');
    const confidenceBar = document.getElementById('confidence-bar');
    const advisoryText = document.getElementById('advisory-text');
    const probabilityList = document.getElementById('probability-list');
    const historyList = document.getElementById('history-list');

    // Controls
    const btnToggleCamera = document.getElementById('btn-toggle-camera');
    const btnCameraText = document.getElementById('btn-camera-text');
    const btnSwitchCamera = document.getElementById('btn-switch-camera');
    const btnToggleAudio = document.getElementById('btn-toggle-audio');
    const audioStatusText = document.getElementById('audio-status-text');
    const fileInput = document.getElementById('file-input');
    const btnClearHistory = document.getElementById('btn-clear-history');

    // Tabs
    const tabWebcam = document.getElementById('tab-webcam');
    const tabUpload = document.getElementById('tab-upload');
    const tabSamples = document.getElementById('tab-samples');
    const samplesDrawer = document.getElementById('samples-drawer');

    // Modal
    const exportModal = document.getElementById('export-modal');
    const btnExportGuide = document.getElementById('btn-export-guide');
    const btnModalClose = document.getElementById('btn-modal-close');
    const btnCopyCode = document.getElementById('btn-copy-code');
    const exportCodeSnippet = document.getElementById('export-code-snippet');

    // --- Initialize AI Model & Computer Vision Detector ---
    const modelRunner = new TrafficSignModelRunner();
    const signDetector = new TrafficSignDetector();

    modelStatusText.textContent = "LOADING CNN...";
    const isModelReady = await modelRunner.init();

    if (isModelReady) {
        modelDot.className = "status-dot pulse-green";
        modelStatusText.textContent = modelRunner.isCustomTrained ? "CUSTOM CNN (READY)" : "CNN ENGINE (READY)";
        backendLabel.textContent = (modelRunner.backend || "WebGL").toUpperCase();
    } else {
        modelDot.className = "status-dot pulse-amber";
        modelStatusText.textContent = "HEURISTIC MODE";
        backendLabel.textContent = "CPU FALLBACK";
    }

    // --- Tab Switching Logic ---
    function setMode(newMode) {
        state.mode = newMode;
        tabWebcam.classList.toggle('active', newMode === 'webcam');
        tabUpload.classList.toggle('active', newMode === 'upload');
        tabSamples.classList.toggle('active', newMode === 'samples');

        if (newMode !== 'webcam' && state.isStreaming) {
            stopCamera();
        }

        if (newMode === 'upload') {
            fileInput.click();
        }
    }

    tabWebcam.addEventListener('click', () => setMode('webcam'));
    tabUpload.addEventListener('click', () => setMode('upload'));
    tabSamples.addEventListener('click', () => setMode('samples'));

    // --- File Upload & Drag and Drop Handling ---
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });

    const viewportBox = document.getElementById('viewport-box');
    viewportBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        viewportBox.style.borderColor = 'var(--accent-cyan)';
    });

    viewportBox.addEventListener('dragleave', () => {
        viewportBox.style.borderColor = 'var(--border-glow)';
    });

    viewportBox.addEventListener('drop', (e) => {
        e.preventDefault();
        viewportBox.style.borderColor = 'var(--border-glow)';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setMode('upload');
            handleImageFile(file);
        }
    });

    function handleImageFile(file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
                stopCamera();
                viewportPlaceholder.style.display = 'none';
                displayCanvas.width = img.naturalWidth || 640;
                displayCanvas.height = img.naturalHeight || 480;
                displayCtx.drawImage(img, 0, 0, displayCanvas.width, displayCanvas.height);
                analyzeStaticImage(img);
            };
            img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }

    // --- Preset Sample Cards Click Handlers ---
    document.querySelectorAll('.sample-card').forEach(card => {
        card.addEventListener('click', () => {
            const sampleFileName = card.getAttribute('data-sample');
            const sampleImg = new Image();
            sampleImg.onload = () => {
                stopCamera();
                viewportPlaceholder.style.display = 'none';
                displayCanvas.width = 400;
                displayCanvas.height = 400;
                displayCtx.clearRect(0, 0, 400, 400);
                displayCtx.drawImage(sampleImg, 0, 0, 400, 400);
                analyzeStaticImage(sampleImg);
            };
            sampleImg.src = `assets/samples/${sampleFileName}`;
        });
    });

    // --- Static Image Classification Pipeline ---
    async function analyzeStaticImage(imageSource) {
        // Detect ROI
        const roi = signDetector.detectSign(imageSource) || signDetector.getCenterROI(displayCanvas.width, displayCanvas.height);
        updateTargetBoxPosition(roi, displayCanvas.width, displayCanvas.height);

        // Crop 32x32 canvas for model
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = 32;
        cropCanvas.height = 32;
        const cropCtx = cropCanvas.getContext('2d');
        cropCtx.drawImage(
            displayCanvas,
            roi.x, roi.y, roi.width, roi.height,
            0, 0, 32, 32
        );

        let tensor = null;
        if (typeof tf !== 'undefined') {
            tensor = tf.tidy(() => {
                return tf.browser.fromPixels(cropCanvas, 3)
                    .toFloat()
                    .div(tf.scalar(255.0))
                    .expandDims(0);
            });
        }

        const result = await modelRunner.predict(tensor, cropCanvas);
        if (tensor) tensor.dispose();

        if (result && result.top1) {
            updateDashboard(result.top1, result.top5, result.latencyMs);
            speakSignAlert(result.top1);
        }
    }

    // --- Camera Stream Lifecycle ---
    async function startCamera() {
        try {
            if (state.videoStream) {
                state.videoStream.getTracks().forEach(t => t.stop());
            }

            const constraints = {
                audio: false,
                video: {
                    facingMode: state.facingMode,
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            };

            state.videoStream = await navigator.mediaDevices.getUserMedia(constraints);
            videoElem.srcObject = state.videoStream;
            await videoElem.play();

            state.isStreaming = true;
            viewportPlaceholder.style.display = 'none';
            btnCameraText.textContent = "Stop Real-Time Detection";
            btnToggleCamera.classList.remove('btn-primary');
            btnToggleCamera.classList.add('btn-secondary');

            // Set canvas size to match incoming video stream resolution
            displayCanvas.width = videoElem.videoWidth || 640;
            displayCanvas.height = videoElem.videoHeight || 480;

            runDetectionLoop();
        } catch (err) {
            console.error("Camera access error:", err);
            alert("Could not access camera. Please allow camera permissions or test using 'Upload Image' / 'Preset Samples'.");
        }
    }

    function stopCamera() {
        if (state.animFrameId) {
            cancelAnimationFrame(state.animFrameId);
            state.animFrameId = null;
        }

        if (state.videoStream) {
            state.videoStream.getTracks().forEach(track => track.stop());
            state.videoStream = null;
        }

        state.isStreaming = false;
        btnCameraText.textContent = "Start Real-Time Detection";
        btnToggleCamera.classList.add('btn-primary');
        btnToggleCamera.classList.remove('btn-secondary');
        hudTargetBox.style.display = 'none';
        fpsDisplay.textContent = "--";
    }

    btnToggleCamera.addEventListener('click', () => {
        if (state.isStreaming) {
            stopCamera();
            viewportPlaceholder.style.display = 'flex';
        } else {
            setMode('webcam');
            startCamera();
        }
    });

    btnSwitchCamera.addEventListener('click', () => {
        state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';
        if (state.isStreaming) {
            startCamera();
        }
    });

    // --- Real-Time Video Frame Processing Loop ---
    let frameThrottle = 0;

    async function runDetectionLoop() {
        if (!state.isStreaming) return;

        // Draw current video frame to display canvas
        if (videoElem.readyState >= 2) {
            displayCtx.drawImage(videoElem, 0, 0, displayCanvas.width, displayCanvas.height);

            // Compute FPS
            state.fpsCounter++;
            const now = performance.now();
            if (now - state.fpsTimer >= 1000) {
                state.currentFps = Math.round((state.fpsCounter * 1000) / (now - state.fpsTimer));
                fpsDisplay.textContent = `${state.currentFps} FPS`;
                state.fpsCounter = 0;
                state.fpsTimer = now;
            }

            // Run CNN inference every ~3 frames to maximize FPS and conserve GPU
            frameThrottle++;
            if (frameThrottle % 3 === 0) {
                // 1. Detect candidate sign ROI
                const roi = signDetector.detectSign(videoElem) || signDetector.getCenterROI(displayCanvas.width, displayCanvas.height);
                updateTargetBoxPosition(roi, displayCanvas.width, displayCanvas.height);

                detectionModeLabel.textContent = roi.isAutoDetected ? "AUTO SIGN TRACKED" : "CENTER HUD TARGET";

                // 2. Crop 32x32 canvas for CNN
                const cropCanvas = document.createElement('canvas');
                cropCanvas.width = 32;
                cropCanvas.height = 32;
                const cropCtx = cropCanvas.getContext('2d');
                cropCtx.drawImage(
                    displayCanvas,
                    roi.x, roi.y, roi.width, roi.height,
                    0, 0, 32, 32
                );

                // 3. Create normalized tensor [1, 32, 32, 3]
                let tensor = null;
                if (typeof tf !== 'undefined') {
                    tensor = tf.tidy(() => {
                        return tf.browser.fromPixels(cropCanvas, 3)
                            .toFloat()
                            .div(tf.scalar(255.0))
                            .expandDims(0);
                    });
                }

                // 4. Predict using the best CNN model
                const result = await modelRunner.predict(tensor, cropCanvas);
                if (tensor) tensor.dispose();

                if (result && result.top1) {
                    inferenceTimeLabel.textContent = `${result.latencyMs} ms`;
                    updateDashboard(result.top1, result.top5, result.latencyMs);

                    if (result.top1.confidence >= 65) {
                        speakSignAlert(result.top1);
                    }
                }
            }
        }

        state.animFrameId = requestAnimationFrame(runDetectionLoop);
    }

    // --- Update HUD Target Reticle Position ---
    function updateTargetBoxPosition(roi, srcW, srcH) {
        if (!roi) {
            hudTargetBox.style.display = 'none';
            return;
        }

        const containerRect = viewportBox.getBoundingClientRect();
        const scaleX = containerRect.width / srcW;
        const scaleY = containerRect.height / srcH;

        hudTargetBox.style.display = 'block';
        hudTargetBox.style.left = `${roi.x * scaleX}px`;
        hudTargetBox.style.top = `${roi.y * scaleY}px`;
        hudTargetBox.style.width = `${roi.width * scaleX}px`;
        hudTargetBox.style.height = `${roi.height * scaleY}px`;

        if (roi.isAutoDetected) {
            targetLabel.textContent = "SIGN LOCATED";
            targetLabel.style.background = "var(--accent-emerald)";
            targetLabel.style.color = "#000000";
        } else {
            targetLabel.textContent = "CENTER TARGET";
            targetLabel.style.background = "var(--accent-cyan)";
            targetLabel.style.color = "#000000";
        }
    }

    // --- Update Dashboard UI with Prediction Results ---
    function updateDashboard(top1, top5, latencyMs) {
        const meta = top1.metadata;

        // Primary Sign Card
        signName.textContent = meta.name || `Class #${top1.classId}`;
        signClassId.textContent = `CLASS #${top1.classId}`;
        signCategoryPill.textContent = (meta.category || "GENERAL").toUpperCase();

        // Color badge by category
        if (meta.type === 'prohibitory') {
            signCategoryPill.style.background = 'rgba(244, 63, 94, 0.15)';
            signCategoryPill.style.color = 'var(--accent-rose)';
            signCategoryPill.style.borderColor = 'rgba(244, 63, 94, 0.3)';
        } else if (meta.type === 'mandatory') {
            signCategoryPill.style.background = 'rgba(2, 132, 199, 0.15)';
            signCategoryPill.style.color = 'var(--accent-cyan)';
            signCategoryPill.style.borderColor = 'rgba(2, 132, 199, 0.3)';
        } else if (meta.type === 'priority') {
            signCategoryPill.style.background = 'rgba(245, 158, 11, 0.15)';
            signCategoryPill.style.color = 'var(--accent-amber)';
            signCategoryPill.style.borderColor = 'rgba(245, 158, 11, 0.3)';
        } else {
            signCategoryPill.style.background = 'rgba(16, 185, 129, 0.15)';
            signCategoryPill.style.color = 'var(--accent-emerald)';
            signCategoryPill.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        }

        // Confidence
        confidenceVal.textContent = `${top1.confidence.toFixed(1)}%`;
        confidenceBar.style.width = `${Math.min(100, top1.confidence)}%`;

        // SVG Avatar
        signAvatarContainer.innerHTML = getSignSvg(top1.classId, 72);

        // Driver Advisory
        advisoryText.textContent = meta.advisory || "Maintain alert driving conditions and obey statutory traffic regulations.";

        // Top 5 breakdown list
        renderTop5(top5);

        // Add to recent detections log if confidence is high (> 75%)
        if (top1.confidence > 75) {
            logRecentDetection(top1);
        }
    }

    function renderTop5(top5) {
        probabilityList.innerHTML = top5.map(item => {
            const name = item.metadata ? item.metadata.name : `Sign #${item.classId}`;
            const pct = item.confidence.toFixed(1);
            return `
            <div class="prob-row">
                <div class="prob-row-header">
                    <span class="prob-name">${name}</span>
                    <span class="prob-pct">${pct}%</span>
                </div>
                <div class="prob-bar-track">
                    <div class="prob-bar-fill" style="width: ${pct}%;"></div>
                </div>
            </div>`;
        }).join('');
    }

    // --- Detection History Logging ---
    function logRecentDetection(item) {
        const now = Date.now();
        // Avoid duplicate spam within 3 seconds for the same sign
        if (state.recentDetections.length > 0) {
            const last = state.recentDetections[0];
            if (last.classId === item.classId && (now - last.timestamp) < 3000) {
                return;
            }
        }

        const logEntry = {
            classId: item.classId,
            name: item.metadata.name,
            confidence: item.confidence,
            timestamp: now,
            timeStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        state.recentDetections.unshift(logEntry);
        if (state.recentDetections.length > 8) {
            state.recentDetections.pop();
        }

        renderHistory();
    }

    function renderHistory() {
        if (state.recentDetections.length === 0) {
            historyList.innerHTML = '<div class="history-empty">Detections will be logged here</div>';
            return;
        }

        historyList.innerHTML = state.recentDetections.map(entry => `
            <div class="history-item">
                <div class="history-left">
                    <div class="history-thumb">${getSignSvg(entry.classId, 28)}</div>
                    <span class="history-name">${entry.name}</span>
                </div>
                <span class="history-time">${entry.timeStr}</span>
            </div>
        `).join('');
    }

    btnClearHistory.addEventListener('click', () => {
        state.recentDetections = [];
        renderHistory();
    });

    // --- Audio Speech Alerts (Web Speech API) ---
    function speakSignAlert(top1) {
        if (!state.audioEnabled) return;
        if (!('speechSynthesis' in window)) return;

        const now = performance.now();
        // Don't repeat speech within 4.5 seconds for the same sign
        if (state.lastSpokenSign === top1.classId && (now - state.lastSpokenTime) < 4500) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(top1.metadata.name);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);

        state.lastSpokenSign = top1.classId;
        state.lastSpokenTime = now;
    }

    btnToggleAudio.addEventListener('click', () => {
        state.audioEnabled = !state.audioEnabled;
        btnToggleAudio.classList.toggle('active-toggle', state.audioEnabled);
        audioStatusText.textContent = state.audioEnabled ? "Audio Alert: ON" : "Audio Alert: OFF";
    });

    // --- Export Guide Modal Handlers ---
    btnExportGuide.addEventListener('click', () => {
        exportModal.classList.add('active');
    });

    btnModalClose.addEventListener('click', () => {
        exportModal.classList.remove('active');
    });

    exportModal.addEventListener('click', (e) => {
        if (e.target === exportModal) {
            exportModal.classList.remove('active');
        }
    });

    btnCopyCode.addEventListener('click', () => {
        const textToCopy = exportCodeSnippet.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            btnCopyCode.textContent = "Copied!";
            setTimeout(() => {
                btnCopyCode.textContent = "Copy Code";
            }, 2000);
        });
    });
});

