// src/hooks/useToastAlert.js
import { toast } from 'sonner'

export default function useToastAlert() {
  const toastSuccess = (message = 'Success', title) =>
    toast.success(message, {
      description: title,
    })

  const toastError = (message = 'Something went wrong', title) =>
    toast.error(message, {
      description: title,
    })

  const toastInfo = (message = 'Info', title) =>
    toast(message, {
      description: title,
    })

  return { toastSuccess, toastError, toastInfo }
}
