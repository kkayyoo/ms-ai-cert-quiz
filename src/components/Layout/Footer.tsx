export default function Footer() {
  return (
    <footer style={{
      background: '#fff',
      borderTop: '1px solid var(--color-border)',
      padding: '16px 0',
      fontSize: '13px',
      color: 'var(--color-text-secondary)',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <span>MS AI Cert Quiz — Practice for AI-900 &amp; AI-102</span>
        <span>
          <a href="https://learn.microsoft.com/en-us/credentials/" target="_blank" rel="noopener noreferrer">
            Microsoft Certifications
          </a>
        </span>
      </div>
    </footer>
  )
}
