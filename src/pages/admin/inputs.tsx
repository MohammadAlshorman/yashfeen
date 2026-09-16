import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Yashfeen-styled admin form primitives (design.md §2 tokens): surface inputs with
 * hairline borders, danger error text, mood focus rings (global :focus-visible),
 * 44px minimum targets. All controls inherit theme + RTL from the document.
 */

export const inputClass =
  'min-h-[44px] w-full rounded-sm border border-line bg-surface px-4 py-2.5 text-body text-ink placeholder:text-ink-muted transition-colors duration-instant ease-soft'

export const inputErrorClass = 'border-danger'

const errorTextClass = 'mt-1.5 text-small text-danger'
const hintTextClass = 'mt-1.5 text-small text-ink-muted'

interface FieldShellProps {
  id: string
  label: string
  required?: boolean
  requiredLabel?: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

/** Label + control + hint/error stack for single (non-paired) fields. */
export function FieldShell({
  id,
  label,
  required = false,
  requiredLabel = 'Required',
  error,
  hint,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline gap-2 text-small font-semibold text-ink">
        {label}
        {required && <span className="text-micro font-medium text-danger">{requiredLabel}</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={errorTextClass} role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className={hintTextClass}>{hint}</p>
      ) : null}
    </div>
  )
}

interface TextFieldProps {
  id: string
  value: string
  onChange: (v: string) => void
  error?: boolean
  dir?: 'ltr' | 'rtl'
  arabic?: boolean
  placeholder?: string
  ariaLabel?: string
}

export function TextField({ id, value, onChange, error, dir, arabic, placeholder, ariaLabel }: TextFieldProps) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      dir={dir}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(inputClass, arabic && 'font-ar', error && inputErrorClass)}
    />
  )
}

export function TextAreaField({ id, value, onChange, error, dir, arabic, placeholder, ariaLabel, rows = 4 }: TextFieldProps & { rows?: number }) {
  return (
    <textarea
      id={id}
      value={value}
      dir={dir}
      rows={rows}
      placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(inputClass, 'min-h-[96px] resize-y leading-relaxed', arabic && 'font-ar', error && inputErrorClass)}
    />
  )
}

interface SelectFieldProps {
  id: string
  value: string
  onChange: (v: string) => void
  error?: boolean
  options: readonly { value: string; label: string }[]
  placeholder?: string
}

export function SelectField({ id, value, onChange, error, options, placeholder }: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputClass, 'appearance-none bg-surface pe-10', error && inputErrorClass)}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-ink-muted"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}

export function DateField({ id, value, onChange, error }: Omit<TextFieldProps, 'dir' | 'arabic' | 'placeholder'>) {
  return (
    <input
      id={id}
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(inputClass, error && inputErrorClass)}
    />
  )
}

interface NumberFieldProps {
  id: string
  value: string
  onChange: (v: string) => void
  error?: boolean
  min?: number
  placeholder?: string
}

export function NumberField({ id, value, onChange, error, min, placeholder }: NumberFieldProps) {
  return (
    <input
      id={id}
      type="number"
      inputMode="numeric"
      min={min}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={error || undefined}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(inputClass, error && inputErrorClass)}
    />
  )
}

interface ToggleFieldProps {
  id: string
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  onLabel: string
  offLabel: string
}

/** Boolean switch (role="switch", 44px target) in mood accent when on. */
export function ToggleField({ id, label, checked, onChange, onLabel, offLabel }: ToggleFieldProps) {
  return (
    <div className="flex min-h-[44px] items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-7 w-12 shrink-0 items-center rounded-pill border transition-colors duration-fast ease-soft',
          checked ? 'border-transparent bg-mood-deep' : 'border-line bg-surface',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-block h-5 w-5 transform rounded-full bg-cream-text shadow-card transition-transform duration-fast ease-soft',
            checked ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1',
            !checked && 'bg-ink-muted',
          )}
        />
      </button>
      <span className="text-small font-semibold text-ink">
        {label}
        <span className="ms-2 font-medium text-ink-muted">{checked ? onLabel : offLabel}</span>
      </span>
    </div>
  )
}
