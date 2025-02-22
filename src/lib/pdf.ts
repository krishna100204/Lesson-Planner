import html2pdf from 'html2pdf.js'; 

export async function generatePDF(content: string, filename: string) {
  const element = document.createElement('div');
  
  // Format the content with proper styling
  element.innerHTML = `
    <div style="
      font-family: 'Arial', sans-serif;
      color: #000000;
      background-color: #ffffff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    ">
      <div style="
        border-bottom: 2px solid #2563eb;
        padding-bottom: 20px;
        margin-bottom: 30px;
      ">
        <h1 style="
          color: #1e40af;
          font-size: 24px;
          margin: 0;
        ">${filename.replace('-lesson-plan.pdf', '').replace(/-/g, ' ')} - Lesson Plan</h1>
      </div>
      
      <div style="
        white-space: pre-wrap;
        line-height: 1.6;
        font-size: 14px;
      ">
        ${content
          .replace(/\n\n/g, '</p><p>')
          .replace(/\n/g, '<br>')
          .split('</p><p>')
          .map(paragraph => `<p style="margin: 0 0 16px 0;">${paragraph}</p>`)
          .join('')}
      </div>
      
      <div style="
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        font-size: 12px;
        color: #6b7280;
        text-align: center;
      ">
        Generated with Lesson Planner
      </div>
    </div>
  `;
  
  const opt = {
    margin: [0.5, 0.5],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait',
      putOnlyUsedFonts: true
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
}