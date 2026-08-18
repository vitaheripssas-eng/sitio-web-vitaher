import { Icon } from './Icons.jsx'

export default function FormSuccess({ title, message, actions }) {
  return (
    <div className="form-success" role="status">
      <Icon name="checkCircle" size={44} />
      <h3>{title}</h3>
      <p>{message}</p>
      {actions && <div className="form-success-actions">{actions}</div>}
    </div>
  )
}