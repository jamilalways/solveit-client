export default function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http') || path.startsWith('blob:')) return path;
  
  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001';
  const normalizedPath = path.replace(/\\/g, '/');
  return `${apiBase}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}
