import { format } from 'date-fns'

export function formatDate(date: string | Date): string {
  if (!date) return ''
  return format(new Date(date), 'dd/MM/yyyy')
}

export function formatDateTime(date: string | Date): string {
  if (!date) return ''
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function calculateBMI(peso_kg: number, altezza_cm: number): number {
  const altezza_m = altezza_cm / 100
  return Number((peso_kg / (altezza_m * altezza_m)).toFixed(1))
}

export function calculateAge(dataNascita: Date): number {
  const oggi = new Date()
  let eta = oggi.getFullYear() - dataNascita.getFullYear()
  const m = oggi.getMonth() - dataNascita.getMonth()
  if (m < 0 || (m === 0 && oggi.getDate() < dataNascita.getDate())) {
    eta--
  }
  return eta
}
