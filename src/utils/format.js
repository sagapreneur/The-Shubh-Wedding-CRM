/**
 * Formats a numeric value into Indian Rupee currency format (e.g. ₹1,50,000)
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Formats ISO date string to readable format e.g. 15 Aug 2026
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Returns Tailwind CSS class names for status badges matching PRD color system
 * @param {string} status 
 * @returns {{ bg: string, text: string, border: string, dot: string }}
 */
export const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'Paid':
      return {
        bg: 'bg-tsw-sage-light',
        text: 'text-tsw-sage-dark font-medium',
        border: 'border-tsw-sage/30',
        dot: 'bg-tsw-sage'
      };
    case 'Partially Paid':
      return {
        bg: 'bg-tsw-gold-light',
        text: 'text-tsw-gold-dark font-medium',
        border: 'border-tsw-gold/30',
        dot: 'bg-tsw-gold'
      };
    case 'Sent':
    case 'Draft':
      return {
        bg: 'bg-tsw-subtle',
        text: 'text-tsw-ink font-medium',
        border: 'border-tsw-border',
        dot: 'bg-tsw-muted'
      };
    case 'Overdue':
      return {
        bg: 'bg-tsw-brick-light',
        text: 'text-tsw-brick-dark font-medium',
        border: 'border-tsw-brick/30',
        dot: 'bg-tsw-brick'
      };
    default:
      return {
        bg: 'bg-tsw-terracotta-light',
        text: 'text-tsw-terracotta-dark font-medium',
        border: 'border-tsw-terracotta/30',
        dot: 'bg-tsw-terracotta'
      };
  }
};
