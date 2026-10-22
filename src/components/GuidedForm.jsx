import './guided.css'

export function ReviewRow({ label, value }) {
  return (
    <div className="guided-review-row">
      <span>{label}</span>
      <b>{value || '—'}</b>
    </div>
  )
}

export default function GuidedForm({
  id,
  className = '',
  title,
  titleId,
  subtitle,
  pill = '4 pasos',
  steps,
  step,
  onNext,
  onPrev,
  onSubmit,
  submitLabel = 'Enviar',
  isSubmitting = false,
  error = '',
  formRef,
  headExtra,
}) {
  const total = steps.length
  const current = steps[step - 1]
  const isLast = step === total

  function handleSubmit(event) {
    event.preventDefault()
    if (!isLast) {
      onNext()
      return
    }
    onSubmit(event)
  }

  return (
    <form
      id={id}
      className={`guided-form ${className}`.trim()}
      onSubmit={handleSubmit}
      ref={formRef}
      noValidate
      aria-labelledby={titleId}
    >
      <div className="guided-head">
        <div>
          <h3 id={titleId}>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="guided-pill">{pill}</span>
      </div>

      {headExtra}

      <div className="guided-stepper" aria-hidden="true">
        {steps.map((item, index) => {
          const number = index + 1
          const isDone = number < step
          const isActive = number === step
          return (
            <div className="guided-step-item" key={item.label}>
              <div
                className={`guided-step-head${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
              >
                <span className="guided-step-circle">{isDone ? '✓' : number}</span>
                <span className="guided-step-label">{item.label}</span>
              </div>
              {number < total && <span className="guided-step-line" />}
            </div>
          )
        })}
      </div>

      <div
        className="guided-progress"
        role="progressbar"
        aria-label="Paso del formulario"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
      >
        <span style={{ width: `${(step / total) * 100}%` }} />
      </div>

      <div className="guided-step">
        <h4 className="guided-title">{current.title}</h4>
        {current.subtitle && <p className="guided-sub">{current.subtitle}</p>}
        {current.content}
      </div>

      <p className="form-error" role="alert" aria-live="polite">
        {error || '\u00A0'}
      </p>

      <div className="guided-actions">
        {step > 1 && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onPrev}
            disabled={isSubmitting}
          >
            Anterior
          </button>
        )}
        <span className="guided-spacer" />
        {isLast ? (
          <button
            type="submit"
            className="btn btn-primary guided-next"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? 'Enviando…' : submitLabel}
          </button>
        ) : (
          <button type="button" className="btn btn-primary guided-next" onClick={onNext}>
            Continuar
          </button>
        )}
      </div>
    </form>
  )
}
