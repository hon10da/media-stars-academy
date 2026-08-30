// Matches the exact input styling already established in RegistrationForm.jsx / ContactForm.jsx.

export function FormField({ label, children, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-bold text-navy">{label}</label>
      {children}
    </div>
  )
}

const inputClass =
  'rounded-lg border border-navy/15 px-4 py-3 text-sm focus:border-[var(--color-gold)] outline-none transition-colors'

export function TextInput(props) {
  return <input {...props} className={`${inputClass} ${props.className || ''}`} />
}

export function TextArea(props) {
  return <textarea {...props} className={`${inputClass} resize-none ${props.className || ''}`} />
}

export function Select({ children, ...props }) {
  return (
    <select {...props} className={`${inputClass} bg-white ${props.className || ''}`}>
      {children}
    </select>
  )
}

// Multi-select rendered as a checkbox list — simpler and more RTL/mobile-friendly
// than a native multi-select for the small option counts in this project (services, etc.)
export function CheckboxGroup({ options, value = [], onChange, labelKey = 'name', valueKey = '_id' }) {
  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
    } else {
      onChange([...value, id])
    }
  }

  if (!options || options.length === 0) {
    return <p className="text-xs text-muted">لا توجد خيارات متاحة حاليًا.</p>
  }

  return (
    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border border-navy/10 rounded-lg p-3">
      {options.map((opt) => (
        <label key={opt[valueKey]} className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={value.includes(opt[valueKey])}
            onChange={() => toggle(opt[valueKey])}
            className="accent-[var(--color-gold)] w-4 h-4"
          />
          {opt[labelKey]}
        </label>
      ))}
    </div>
  )
}
