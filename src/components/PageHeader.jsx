export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <header className="topbar">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
      {action}
    </header>
  )
}
