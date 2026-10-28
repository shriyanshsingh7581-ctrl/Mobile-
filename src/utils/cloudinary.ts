/**
 * Cloudinary Image Upload & Optimization Service
 * Pre-configured with Charlie Mobile's official Cloudinary Cloud Name (dxeuzdwkz)
 * and Upload Preset (charliemobile), with admin override support.
 */

const CLOUDINARY_STORAGE_KEY = 'charlie_mobile_cloudinary_v1';
export const DEFAULT_CLOUDINARY_CLOUD_NAME = 'dxeuzdwkz';
export const DEFAULT_CLOUDINARY_UPLOAD_PRESET = 'charliemobile';

export function getCloudinaryConfig() {
  let savedCloud = '';
  let savedPreset = '';
  try {
    const raw = localStorage.getItem(CLOUDINARY_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      savedCloud = (parsed.cloudName || '').trim();
      savedPreset = (parsed.uploadPreset || '').trim();
    }
  } catch {
    // ignore storage parse error
  }

  const envCloud = (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim();
  const envPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim();

  const cloudName = savedCloud || envCloud || DEFAULT_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = savedPreset || envPreset || DEFAULT_CLOUDINARY_UPLOAD_PRESET;

  return {
    cloudName,
    uploadPreset,
    isConfigured: Boolean(cloudName && uploadPreset),
  };
}

export function saveCloudinaryConfig(cloudName: string, uploadPreset: string) {
  try {
    localStorage.setItem(
      CLOUDINARY_STORAGE_KEY,
      JSON.stringify({
        cloudName: cloudName.trim() || DEFAULT_CLOUDINARY_CLOUD_NAME,
        uploadPreset: uploadPreset.trim() || DEFAULT_CLOUDINARY_UPLOAD_PRESET,
      })
    );
  } catch {
    // ignore
  }
}

function readAsDataUrlFallback(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const { cloudName, uploadPreset, isConfigured } = getCloudinaryConfig();

  if (!isConfigured) {
    return readAsDataUrlFallback(file);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Cloudinary API returned non-OK, using local DataURL fallback:', errText);
      return readAsDataUrlFallback(file);
    }

    const data = await response.json();
    if (data && data.secure_url) {
      return optimizeCloudinaryUrl(String(data.secure_url), 1000);
    }
    return readAsDataUrlFallback(file);
  } catch (err) {
    console.warn('Network/CORS error reaching Cloudinary, using DataURL fallback:', err);
    return readAsDataUrlFallback(file);
  }
}

export async function uploadMultipleImagesToCloudinary(
  files: FileList | File[]
): Promise<string[]> {
  const fileArray = Array.from(files);
  return Promise.all(fileArray.map((file) => uploadImageToCloudinary(file)));
}

export function optimizeCloudinaryUrl(url: string, width = 800): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('/upload/f_auto')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
