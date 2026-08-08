export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== 'string') {
        reject(new Error('Failed to convert file to Base64.'));
        return;
      }

      const commaIndex = result.indexOf(',');
      const base64Data = commaIndex >= 0 ? result.slice(commaIndex + 1) : result;
      resolve({ base64Data, mimeType: file.type || 'image/png' });
    };

    reader.onerror = () => {
      reject(new Error('Unable to read the selected image file.'));
    };

    reader.readAsDataURL(file);
  });
}
