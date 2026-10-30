/**
 * Real-Time Traffic Sign Region-Of-Interest (ROI) Detector
 * Performs fast chromatic segmentation (Red, Blue, Yellow) and contour bounding-box
 * extraction to locate traffic signs in the camera feed before feeding them to the CNN.
 */

class TrafficSignDetector {
    constructor() {
        this.minBoxSize = 36;
        this.maxBoxSize = 420;
        this.downsampleFactor = 4; // Downscale video for fast 60fps color analysis
        this.processingCanvas = document.createElement('canvas');
        this.processingCtx = this.processingCanvas.getContext('2d', { willReadFrequently: true });
    }

    /**
     * Finds potential traffic sign bounding boxes in video/image
     * Returns { x, y, width, height, confidence, type } or null
     */
    detectSign(sourceElement) {
        const srcW = sourceElement.videoWidth || sourceElement.naturalWidth || sourceElement.width;
        const srcH = sourceElement.videoHeight || sourceElement.naturalHeight || sourceElement.height;
        if (!srcW || !srcH) return null;

        // Scale down for ultra-fast color segmentation
        const procW = Math.floor(srcW / this.downsampleFactor);
        const procH = Math.floor(srcH / this.downsampleFactor);
        this.processingCanvas.width = procW;
        this.processingCanvas.height = procH;

        this.processingCtx.drawImage(sourceElement, 0, 0, procW, procH);
        const imgData = this.processingCtx.getImageData(0, 0, procW, procH);
        const data = imgData.data;

        // Binary mask for potential sign pixels (Red or Blue or Yellow)
        const mask = new Uint8Array(procW * procH);
        let matchCount = 0;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const pxIndex = i >> 2;

            // Chromatic rules for European / GTSRB traffic signs:
            // 1. Red (Stop, Speed limit ring, Warning triangles)
            const isRed = (r > 130) && (r > g * 1.45) && (r > b * 1.45);
            // 2. Blue (Mandatory directions, Roundabout)
            const isBlue = (b > 120) && (b > r * 1.35) && (b > g * 1.15);
            // 3. Yellow (Priority diamond)
            const isYellow = (r > 160) && (g > 140) && (b < 100) && (Math.abs(r - g) < 45);

            if (isRed || isBlue || isYellow) {
                mask[pxIndex] = 1;
                matchCount++;
            }
        }

        // If very few pixels matched, default to center reticle
        if (matchCount < 40) {
            return this.getCenterROI(srcW, srcH);
        }

        // Find connected bounding regions using grid projection
        const rowSums = new Int32Array(procH);
        const colSums = new Int32Array(procW);

        for (let y = 0; y < procH; y++) {
            const rowOffset = y * procW;
            for (let x = 0; x < procW; x++) {
                if (mask[rowOffset + x] === 1) {
                    rowSums[y]++;
                    colSums[x]++;
                }
            }
        }

        // Find bounds of largest active cluster
        let minX = 0, maxX = procW - 1, minY = 0, maxY = procH - 1;
        const colThreshold = Math.max(3, procH * 0.04);
        const rowThreshold = Math.max(3, procW * 0.04);

        while (minX < maxX && colSums[minX] < colThreshold) minX++;
        while (maxX > minX && colSums[maxX] < colThreshold) maxX--;
        while (minY < maxY && rowSums[minY] < rowThreshold) minY++;
        while (maxY > minY && rowSums[maxY] < rowThreshold) maxY--;

        const detectedW = (maxX - minX) * this.downsampleFactor;
        const detectedH = (maxY - minY) * this.downsampleFactor;

        // Check aspect ratio (traffic signs are roughly square: 0.7 to 1.35)
        const aspectRatio = detectedW / (detectedH || 1);
        if (
            detectedW >= this.minBoxSize &&
            detectedH >= this.minBoxSize &&
            detectedW <= this.maxBoxSize &&
            detectedH <= this.maxBoxSize &&
            aspectRatio >= 0.65 &&
            aspectRatio <= 1.45
        ) {
            // Expand box slightly (15%) for full sign context
            const pad = Math.round(Math.max(detectedW, detectedH) * 0.15);
            const finalSize = Math.max(detectedW, detectedH) + pad * 2;
            const centerX = (minX * this.downsampleFactor) + (detectedW / 2);
            const centerY = (minY * this.downsampleFactor) + (detectedH / 2);

            let x = Math.max(0, Math.round(centerX - finalSize / 2));
            let y = Math.max(0, Math.round(centerY - finalSize / 2));
            let w = Math.min(srcW - x, finalSize);
            let h = Math.min(srcH - y, finalSize);

            return {
                x, y, width: w, height: h,
                isAutoDetected: true,
                confidence: 0.88
            };
        }

        // Fallback to center HUD target
        return this.getCenterROI(srcW, srcH);
    }

    /**
     * Center ROI (Target Reticle)
     */
    getCenterROI(srcW, srcH) {
        const size = Math.min(srcW, srcH) * 0.52;
        const x = (srcW - size) / 2;
        const y = (srcH - size) / 2;
        return {
            x: Math.round(x),
            y: Math.round(y),
            width: Math.round(size),
            height: Math.round(size),
            isAutoDetected: false,
            confidence: 0.60
        };
    }

    /**
     * Extracts and normalizes the cropped sign region to 32x32 tensor
     */
    extractSignTensor(sourceElement, roi) {
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = 32;
        cropCanvas.height = 32;
        const cropCtx = cropCanvas.getContext('2d');

        cropCtx.drawImage(
            sourceElement,
            roi.x, roi.y, roi.width, roi.height,
            0, 0, 32, 32
        );

        if (typeof tf === 'undefined') return null;

        return tf.tidy(() => {
            // Create tensor from 32x32 canvas (shape: [32, 32, 3])
            const tensor = tf.browser.fromPixels(cropCanvas, 3);
            // Normalize to [0, 1] exactly as in notebook: img_array = np.array(img) / 255.0
            const normalized = tensor.toFloat().div(tf.scalar(255.0));
            // Add batch dimension: [1, 32, 32, 3]
            return normalized.expandDims(0);
        });
    }
}

if (typeof window !== 'undefined') {
    window.TrafficSignDetector = TrafficSignDetector;
}

