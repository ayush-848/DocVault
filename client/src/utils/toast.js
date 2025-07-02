import { toast as sonnerToast } from 'sonner'

const base =
  'backdrop-blur-md shadow-md font-mono px-4 py-2 rounded-md border'

const styleMap = {
  success: 'bg-green-500/20 border-green-500 text-green-300',
  error: 'bg-red-500/20 border-red-500 text-red-300',
}

const toast = {
  success: (message, options = {}) =>
    sonnerToast(message, {
      icon: null,
      className: `${base} ${styleMap.success}`,
      duration: 3000,
      ...options,
    }),

  error: (message, options = {}) =>
    sonnerToast(message, {
      icon: null,
      className: `${base} ${styleMap.error}`,
      duration: 3000,
      ...options,
    }),
}

export default toast
