export function formatBDT(amount) {
  return `৳ ${Number(amount).toLocaleString('en-IN')}`
}

export function formatUSD(amount) {
  return `$${Number(amount).toFixed(2)}`
}