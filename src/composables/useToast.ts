import { ref } from 'vue'

type IToastMessage = {
  id: number
  text: string
  icon: string
}

const toasts = ref<IToastMessage[]>([])
let nextId = 0

function showToast (text: string, icon = 'info'): void {
  toasts.value.push({ id: nextId++, text, icon })
}

function dismissToast (id: number): void {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function useToast () {
  return { toasts, showToast, dismissToast }
}

export { useToast }
