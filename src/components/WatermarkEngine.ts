/**
 * Client-Side Image Watermarking Engine
 * Draws a professional, semi-transparent watermark grid using HTML5 Canvas
 */
export function watermarkImage(
  imageDataUrl: string,
  inventorName: string,
  timestamp: string,
  certId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(imageDataUrl);
          return;
        }

        // Set high resolution canvas dimensions to support printing and high quality screens
        canvas.width = img.naturalWidth || img.width || 800;
        canvas.height = img.naturalHeight || img.height || 600;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Save state before styling watermarks
        ctx.save();

        // 1. Draw a prominent top-heavy legal warning bar at the bottom
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

        ctx.fillStyle = "#ffffff";
        ctx.font = `bold ${Math.max(12, Math.floor(canvas.width * 0.016))}px Inter, sans-serif`;
        ctx.textAlign = "left";
        const warningText = `INDIA IDEA HUB SECURED • COPYING IS STRICTLY PROHIBITED BY LAW • REG ID: ${certId}`;
        ctx.fillText(warningText, 20, canvas.height - 20);

        // 2. Draw modern diagonal watermark grid
        ctx.rotate(-25 * Math.PI / 180);
        ctx.fillStyle = "rgba(239, 68, 68, 0.16)"; // semi-transparent red-accent
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
        
        const fontSize = Math.max(14, Math.floor(canvas.width * 0.024));
        ctx.font = `bold ${fontSize}px "JetBrains Mono", Courier, monospace`;
        
        ctx.textAlign = "center";
        
        const text = `PROPRIETARY INTELLECTUAL PROPERTY • ${inventorName.toUpperCase()} • CERT:${certId}`;
        
        // Populate the entire grid by stepping through widths/heights
        const stepX = canvas.width * 0.8;
        const stepY = canvas.height * 0.25;
        
        // Since we rotated, we want to cover coordinates beyond normal bounds
        for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
          for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
            ctx.fillText(text, x, y);
            ctx.strokeText(text, x, y);
            
            // Subtitle with timestamp under each primary watermark item
            ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
            ctx.font = `${Math.max(10, fontSize - 4)}px sans-serif`;
            ctx.fillText(`TIMESTAMPED: ${timestamp}`, x, y + 18);
            
            ctx.fillStyle = "rgba(239, 68, 68, 0.16)";
            ctx.font = `bold ${fontSize}px "JetBrains Mono", Courier, monospace`;
          }
        }

        ctx.restore();
        
        // Output high quality PNG data URL
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        console.error("Watermark generation failed, reverting to original image:", err);
        resolve(imageDataUrl);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load source image for watermarking."));
    };
    img.src = imageDataUrl;
  });
}

// Generates a mock fingerprint styled visual representation of a SHA-256 hash
export function generateSHA256Mock(textToHash: string): string {
  let hash = 0;
  for (let i = 0; i < textToHash.length; i++) {
    const char = textToHash.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padEnd(8, "f");
  return `02x${hex}da892c900e5${hex.slice(0, 4)}f23bb6e90145c2ea0f1882${hex.slice(4)}bfdc998d`;
}

// Generates a random standard Certificate serial number
export function generateCertificateId(): string {
  const years = [2026, 2027];
  const selectedYear = years[Math.floor(Math.random() * years.length)];
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `IIH-${selectedYear}-${randomNum}`;
}
