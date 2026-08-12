export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Downscale large iPhone photos to max 1024px to save bandwidth
        const MAX_WIDTH = 1024;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert any iOS format (HEIC, PNG, AVIF) into standard JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64Data = dataUrl.split(',')[1];

        resolve({ base64Data, mimeType: 'image/jpeg' });
      };

      img.onerror = () => reject(new Error('Failed to render image preview on device.'));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error('Unable to read selected image file.'));
    reader.readAsDataURL(file);
  });
}