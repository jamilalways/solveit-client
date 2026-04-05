export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60)   return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function daysLeft(deadline) {
  const diff = Math.ceil((new Date(deadline) - Date.now()) / 86400000)
  if (diff < 0)  return 'Expired'
  if (diff === 0) return 'Due today'
  return `${diff} day${diff > 1 ? 's' : ''} left`
}