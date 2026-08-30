import html2pdf from 'html2pdf.js';

/**
 * Downloads a DOM element as an exact, 1-page A4 PDF document (210mm x 297mm)
 * @param {HTMLElement} element 
 * @param {string} filename 
 * @returns {Promise<void>}
 */
export const downloadElementAsPdf = async (element, filename = 'document.pdf') => {
  if (!element) return;

  // Save original inline style attributes
  const origWidth = element.style.width;
  const origMinHeight = element.style.minHeight;
  const origHeight = element.style.height;
  const origPadding = element.style.padding;
  const origBoxSizing = element.style.boxSizing;

  // Force exact standard A4 paper dimensions (210mm x 297mm) for capture
  element.style.width = '210mm';
  element.style.height = '297mm';
  element.style.minHeight = '297mm';
  element.style.padding = '12mm 14mm';
  element.style.boxSizing = 'border-box';

  const opt = {
    margin: 0, // 0 margin ensures exact 1:1 210mm x 297mm A4 page mapping
    filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2, // High-resolution 300DPI equivalent crisp rendering
      useCORS: true,
      letterRendering: true,
      logging: false,
      windowWidth: 1024,
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
    window.print();
  } finally {
    // Restore original screen preview styles after PDF export
    element.style.width = origWidth;
    element.style.minHeight = origMinHeight;
    element.style.height = origHeight;
    element.style.padding = origPadding;
    element.style.boxSizing = origBoxSizing;
  }
};
