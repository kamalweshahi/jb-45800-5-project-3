import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import './SpinnerButton.css'

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }>

export default function SpinnerButton({ loading, children, disabled, ...props }: Props) {
  return (
    <button {...props} disabled={disabled || loading}>
      <span className="spinner-button-label">{loading ? 'Please wait...' : children}</span>
    </button>
  )
}
