interface ImageDataInfo {
  imageData: ImageData;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

async function getImageContext(imageFile: File): Promise<ImageDataInfo> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context not available');

  const image = await loadImage(imageFile);
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return {
    imageData,
    canvas,
    ctx,
  };
}

export async function embedDataInImage(imageFile: File, payloadStr: string): Promise<Blob> {
  // Convert the Base64 payload string to a byte array
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(payloadStr);

  // We prefix the payload with a 4-byte (32-bit) integer indicating its length
  const lengthBuffer = new ArrayBuffer(4);
  const lengthView = new DataView(lengthBuffer);
  lengthView.setUint32(0, payloadBytes.length, false); // Big Endian
  const lengthBytes = new Uint8Array(lengthBuffer);

  // Concatenate length bytes and payload bytes
  const totalBytes = new Uint8Array(lengthBytes.length + payloadBytes.length);
  totalBytes.set(lengthBytes, 0);
  totalBytes.set(payloadBytes, lengthBytes.length);

  // Load image onto a canvas
  const { imageData, canvas, ctx } = await getImageContext(imageFile);
  const data = imageData.data;

  // Max capacity: 3 color channels per pixel (skipping Alpha), 8 bits per byte
  const maxBytes = Math.floor((data.length / 4 * 3) / 8);
  if (totalBytes.length > maxBytes) {
    throw new Error(`Message too large for this image. Max capacity: ${maxBytes} bytes, but tried to store ${totalBytes.length} bytes.`);
  }

  // Embed the data into the LSBs of the RGB channels
  let byteIndex = 0;
  let bitIndex = 0;

  for (let i = 0; i < data.length; i += 4) {
    if (byteIndex >= totalBytes.length) break;

    // Iterate through R, G, B channels (indices i, i+1, i+2)
    for (let j = 0; j < 3; j++) {
      if (byteIndex >= totalBytes.length) break;

      // Extract the specific bit from our payload byte
      const bit = (totalBytes[byteIndex] >> (7 - bitIndex)) & 1;
      
      // Clear the LSB of the color channel and set it to our bit
      data[i + j] = (data[i + j] & 0xFE) | bit;

      bitIndex++;
      if (bitIndex === 8) {
        bitIndex = 0;
        byteIndex++;
      }
    }
  }

  // Put modified data back onto canvas
  ctx.putImageData(imageData, 0, 0);

  // Convert canvas to a PNG Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create Blob from canvas'));
    }, 'image/png');
  });
}

export async function extractDataFromImage(imageFile: File): Promise<string> {
  const { imageData } = await getImageContext(imageFile);
  const data = imageData.data;

  let p = 0; // index traversing the imageData.data array

  // Helper to extract the next bit hidden in the image
  function getNextBit() {
    if (p >= data.length) throw new Error('Reached end of image before fully extracting data.');
    
    // Check which channel we are on (R=0, G=1, B=2, A=3)
    const channel = p % 4;
    if (channel === 3) { 
      // Skip the Alpha channel and move to the next pixel
      p++; 
      return getNextBit(); 
    }
    
    const bit = data[p] & 1;
    p++;
    return bit;
  }

  // Read the first 4 bytes to get the payload length
  const lengthBytes = new Uint8Array(4);
  for (let i = 0; i < 4; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | getNextBit();
    }
    lengthBytes[i] = byte;
  }

  const lengthView = new DataView(lengthBytes.buffer);
  const payloadLength = lengthView.getUint32(0, false);

  if (payloadLength === 0 || payloadLength > data.length) {
    throw new Error('Invalid payload length. The image might not contain a hidden message or is corrupted.');
  }

  // Read the actual payload
  const payloadBytes = new Uint8Array(payloadLength);
  for (let i = 0; i < payloadLength; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | getNextBit();
    }
    payloadBytes[i] = byte;
  }

  const decoder = new TextDecoder();
  return decoder.decode(payloadBytes);
}

// Helper to safely load an image from a File
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image file.'));
    };
    img.src = URL.createObjectURL(file);
  });
}
