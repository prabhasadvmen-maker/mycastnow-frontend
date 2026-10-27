/**
 * Normalizes and secures media URLs for images and videos.
 * Prevents Mixed Content errors (http://localhost:5000 on https sites)
 * and resolves relative upload paths against the backend API host.
 */
export const getMediaUrl = (url, fallback = '') => {
  if (!url || typeof url !== 'string') return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // Preserve local blob or data URLs used during file upload previews
  if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Determine production/current backend URL
  const envApiUrl = import.meta.env.VITE_API_URL || '';
  let backendUrl = envApiUrl.replace(/\/api\/?$/, '');

  // If running on an HTTPS domain (like mycastnow.com) but env points to localhost, fallback to render backend
  const isHttpsSite = typeof window !== 'undefined' && window.location.protocol === 'https:';
  if (isHttpsSite && (!backendUrl || backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1'))) {
    backendUrl = 'https://api.mycastnow.com';
  }

  // Legacy uploads saved in DB with the old Render host -> move to production API domain
  if (/^https?:\/\/mycastnow-backend\.onrender\.com/.test(trimmed)) {
    return trimmed.replace(/^https?:\/\/mycastnow-backend\.onrender\.com/, 'https://api.mycastnow.com');
  }

  // Fix URLs containing localhost:5000 or 127.0.0.1:5000
  if (trimmed.includes('localhost:5000') || trimmed.includes('127.0.0.1:5000')) {
    const targetBase = backendUrl || 'https://api.mycastnow.com';
    return trimmed.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, targetBase);
  }

  // Prepend relative paths like /api/upload/... or /uploads/...
  if (trimmed.startsWith('/api/') || trimmed.startsWith('/uploads/')) {
    const targetBase = backendUrl || 'https://api.mycastnow.com';
    return `${targetBase}${trimmed}`;
  }

  // Upgrade insecure http to https for our known backend or render host
  if (trimmed.startsWith('http://') && (trimmed.includes('onrender.com') || trimmed.includes('mycastnow.com'))) {
    return trimmed.replace(/^http:\/\//, 'https://');
  }

  return trimmed;
};
