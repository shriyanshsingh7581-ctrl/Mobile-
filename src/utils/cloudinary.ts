/**
 * Cloudinary Image & Video Upload & Optimization Service
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

export function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  return (
    lower.startsWith('data:video/') ||
    lower.includes('/video/upload/') ||
    /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(lower)
  );
}

function readAsDataUrlFallback(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read media file'));
    reader.readAsDataURL(file);
  });
}

export async function uploadMediaToCloudinary(
  file: File
): Promise<{ url: string; mediaType: 'image' | 'video' }> {
  const { cloudName, uploadPreset, isConfigured } = getCloudinaryConfig();
  const isVideoFile =
    file.type.startsWith('video/') ||
    /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
  const mediaType: 'image' | 'video' = isVideoFile ? 'video' : 'image';

  if (!isConfigured) {
    const localUrl = await readAsDataUrlFallback(file);
    return { url: localUrl, mediaType };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const endpointType = isVideoFile ? 'video' : 'image';

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${endpointType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.warn('Cloudinary API returned non-OK, using local DataURL fallback:', errText);
      const localUrl = await readAsDataUrlFallback(file);
      return { url: localUrl, mediaType };
    }

    const data = await response.json();
    if (data && data.secure_url) {
      const secureUrl = String(data.secure_url);
      return {
        url: isVideoFile ? secureUrl : optimizeCloudinaryUrl(secureUrl, 1200),
        mediaType,
      };
    }
    const localUrl = await readAsDataUrlFallback(file);
    return { url: localUrl, mediaType };
  } catch (err) {
    console.warn('Network/CORS error reaching Cloudinary, using DataURL fallback:', err);
    const localUrl = await readAsDataUrlFallback(file);
    return { url: localUrl, mediaType };
  }
}

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const result = await uploadMediaToCloudinary(file);
  return result.url;
}

export async function uploadMultipleImagesToCloudinary(
  files: FileList | File[]
): Promise<string[]> {
  const fileArray = Array.from(files);
  return Promise.all(fileArray.map((file) => uploadImageToCloudinary(file)));
}

export function optimizeCloudinaryUrl(url: string, width = 800): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (isVideoUrl(url)) return url;
  if (url.includes('/upload/f_auto')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
