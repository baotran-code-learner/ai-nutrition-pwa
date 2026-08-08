export function cleanBase64String(base64Data) {
  if (typeof base64Data !== 'string') {
    throw new TypeError('Expected a base64 string');
  }

  return base64Data
    .trim()
    .replace(/^data:[^;]+;base64,/, '')
    .replace(/\s+/g, '');
}

export function bufferToBase64(buffer) {
  if (!Buffer.isBuffer(buffer)) {
    throw new TypeError('Expected a Buffer');
  }

  return buffer.toString('base64');
}

export async function fileToBase64(file) {
  if (typeof File !== 'undefined' && file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    return bufferToBase64(Buffer.from(arrayBuffer));
  }

  if (file && typeof file.arrayBuffer === 'function') {
    const arrayBuffer = await file.arrayBuffer();
    return bufferToBase64(Buffer.from(arrayBuffer));
  }

  if (file && typeof file.pipe === 'function') {
    const chunks = [];
    for await (const chunk of file) {
      chunks.push(chunk);
    }
    return bufferToBase64(Buffer.concat(chunks));
  }

  throw new TypeError('Unsupported file input. Provide a Browser File, Blob, ReadableStream, or Node.js stream.');
}
