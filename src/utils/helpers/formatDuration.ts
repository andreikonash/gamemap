function formatDuration (minutes: number, locale?: string): string {
  const roundedToHalfHour = Math.round((minutes / 60) * 2) / 2
  const hourFormatter = new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: 'hour',
    unitDisplay: 'narrow',
    maximumFractionDigits: 1
  })
  return hourFormatter.format(roundedToHalfHour)
}

export { formatDuration }
