import { useState, useRef } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import InputForm from '../components/InputForm.jsx'
import FeasibilityCard from '../components/FeasibilityCard.jsx'
import FinancialPlanCard from '../components/FinancialPlanCard.jsx'
import { getAdvisory } from '../api/client.js'

const initialForm = {
  village: '',
  block: '',
  district: '',
  state: '',
  pincode: '',
  available_margin_capital: '',
  business_category: 'Dairy',
  business_category_other: '',
  applicant_gender: '',
  applicant_age: '',
  is_first_time_entrepreneur: true,
  language: 'en',
}

export default function Advisor() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const reportRef = useRef(null)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload = {
        ...form,
        available_margin_capital: Number(form.available_margin_capital),
        applicant_age: form.applicant_age ? Number(form.applicant_age) : null,
      }
      const data = await getAdvisory(payload)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please check the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  async function downloadPDF() {
    if (!reportRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff' // Force white background for PDF
      });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // If content is longer than one page, it will just scale down to fit on one long page for now,
      // or we can add logic for multipage, but scaling to width is usually fine for these reports.
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`GramVyapaar_Report_${form.district}_${form.business_category}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="container section">
      <h1>Build your business plan</h1>
      <p>Enter your location, available capital, and business idea. We'll calculate your
      exact loan eligibility, match your scheme, and generate a local feasibility report.</p>

      <div style={{ maxWidth: 640, marginTop: 24 }}>
        <InputForm form={form} setForm={setForm} onSubmit={handleSubmit} loading={loading} />
      </div>

      {error && (
        <div className="error-box" style={{ marginTop: 24, maxWidth: 640 }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button 
              className="btn btn-primary" 
              onClick={downloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? 'Generating PDF...' : '📄 Download PDF Report'}
            </button>
          </div>
          
          <div ref={reportRef} style={{ background: 'var(--color-bg)', padding: '20px', borderRadius: '16px' }}>
            <FeasibilityCard report={result.feasibility_report} />
            <FinancialPlanCard plan={result.financial_plan} />
            <div className="disclaimer" style={{ marginTop: 24 }}>
              {result.disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
