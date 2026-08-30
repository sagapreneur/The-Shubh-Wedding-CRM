import html2pdf from 'html2pdf.js';

/**
 * Downloads a DOM element as a crisp A4 PDF document
 * @param {HTMLElement} element 
 * @param {string} filename 
 * @returns {Promise<void>}
 */
export const downloadElementAsPdf = async (element, filename = 'document.pdf') => {
  if (!element) return;

  const opt = {
    margin: [10, 10, 10, 10], // top, left, bottom, right in mm
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // High resolution crisp rendering
      useCORS: true,
      letterRendering: true,
      logging: false
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback print dialog if html2pdf fails
    window.print();
  }
};
