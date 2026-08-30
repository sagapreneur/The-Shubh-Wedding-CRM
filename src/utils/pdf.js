import html2pdf from 'html2pdf.js';

/**
 * Downloads a DOM element as a crisp, un-clipped A4 PDF document on all devices (mobile & desktop)
 * @param {HTMLElement} element 
 * @param {string} filename 
 * @returns {Promise<void>}
 */
export const downloadElementAsPdf = async (element, filename = 'document.pdf') => {
  if (!element) return;

  const opt = {
    margin: [8, 8, 8, 8], // top, left, bottom, right in mm
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // High resolution crisp rendering
      useCORS: true,
      letterRendering: true,
      logging: false,
      windowWidth: 1200, // Forces desktop layout viewport during capture on mobile
      scrollX: 0,
      scrollY: 0
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
