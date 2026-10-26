export function Asset({ image, className = '', children, ...props }) {
  return (
    <div
      {...props}
      className={`asset ${className}${image ? ' has-image' : ''}`}
      style={image ? { backgroundImage: `url(${JSON.stringify(image)})` } : undefined}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, children, note, actions }) {
  return (
    <div className="section-heading">
      <div><p className="eyebrow">{eyebrow}</p><h2 className="section-title">{children}</h2></div>
      {note && <span className="section-note">{note}</span>}
      {actions}
    </div>
  );
}

export function Wordmark() {
  return <a className="wordmark" href="#" aria-label="블랙컴뱃 홈">BLACK<span className="brand-mark">◆</span>COMBAT<small>BEYOND THE FIGHT</small></a>;
}
