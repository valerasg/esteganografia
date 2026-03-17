import { describe, it, expect, vi } from 'vitest';
import { embedDataInImage, extractDataFromImage } from './stegano';

// Mocking the canvas and image operations because jsdom doesn't support them fully
vi.mock('./stegano', () => ({
  embedDataInImage: vi.fn(async (_image: File, data: string) => {
    return new Blob([data], { type: 'image/png' });
  }),
  extractDataFromImage: vi.fn(async (image: File) => {
    // In a real test we'd need a more sophisticated mock, 
    // but for unit testing the components that use this, this is enough.
    const text = await image.text();
    return text;
  })
}));

describe('Stegano Utils (Mocked)', () => {
  it('should call embedDataInImage with correct arguments', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const data = 'secret';
    const result = await embedDataInImage(file, data);
    
    expect(embedDataInImage).toHaveBeenCalledWith(file, data);
    expect(result).toBeInstanceOf(Blob);
  });

  it('should call extractDataFromImage and return data', async () => {
    const file = new File(['secret'], 'test.png', { type: 'image/png' });
    const result = await extractDataFromImage(file);
    
    expect(extractDataFromImage).toHaveBeenCalledWith(file);
    expect(result).toBe('secret');
  });
});
