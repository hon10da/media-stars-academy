import { useState } from 'react'

// Shared submit-state hook for RegistrationForm / ContactForm.
// Wires to the backend API in Phase 2 — for now it exposes the same
// status machine (idle -> submitting -> success/error) the real API call will use.
export default function useSubmitForm(submitFn) {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('')

  const submit = async (payload) => {
    setStatus('submitting')
    setErrorMessage('')
    try {
      await submitFn(payload)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err?.response?.data?.message || 'حدث خطأ أثناء الإرسال، برجاء المحاولة مرة أخرى.')
    }
  }

  const reset = () => setStatus('idle')

  return { status, errorMessage, submit, reset }
}
