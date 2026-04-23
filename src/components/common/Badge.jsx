const badgeStyles = {
  Newcomer:    { bg: '#f5f5f5',  color: '#888',    icon: '🌱' },
  'Rising Star':{ bg: '#eff6ff', color: '#2563eb', icon: '⭐' },
  Intermediate:{ bg: '#f0fdf4',  color: '#16a34a', icon: '🏅' },
  Pro:          { bg: '#fdf4ff', color: '#9333ea', icon: '💎' },
  Expert:       { bg: '#fffbeb', color: '#d97706', icon: '🏆' },
}

export default function Badge({ level }) {
  const style = badgeStyles[level] || badgeStyles['Newcomer']
  return (
    <span style={{
      ...style, fontSize: 11, fontWeight: 700, padding: '3px 10px',
      borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {style.icon} {level}
    </span>
  )
}