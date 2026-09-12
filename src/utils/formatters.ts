// Utilidades para formato de moneda colombiana / latinoamericana y textos

export function formatPrice(amount?: number | string | null): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
  if (amount === undefined || amount === null || isNaN(numericAmount)) {
    return '$0';
  }
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '');
}
