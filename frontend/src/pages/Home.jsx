import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="section container">
        <h1>Know your market. Know your loan.<br />Before you borrow a rupee.</h1>
        <p>
          GramVyapaar AI turns three simple inputs — your village, your available
          capital, and your business idea — into a hyper-local feasibility report
          and an exact financial roadmap: project cost, loan eligibility, scheme
          match, and repayment schedule.
        </p>
        <div style={{ marginTop: 28 }}>
          <Link to="/advisor" className="btn btn-primary">Start your business plan</Link>
        </div>
      </section>

      <section className="section container">
        <div className="stat-row">
          <div className="stat">
            <div className="stat-value">10%</div>
            <div className="stat-label">Your margin money contribution</div>
          </div>
          <div className="stat">
            <div className="stat-value">90%</div>
            <div className="stat-label">Concessional loan from the Channelizing Agency</div>
          </div>
          <div className="stat">
            <div className="stat-value">2 schemes</div>
            <div className="stat-label">Micro Finance (≤₹1.4L) or Term Loan (≤₹50L), auto-selected</div>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2>What you get</h2>
        <div className="swot-grid" style={{ marginTop: 20 }}>
          <div className="swot-box">
            <h4>Hyper-local feasibility report</h4>
            <p>Market reach, competitor density, SWOT, threats, and a recommended
            price range — specific to your village and business category.</p>
          </div>
          <div className="swot-box">
            <h4>Smart financial calculator</h4>
            <p>Your exact project cost, loan eligibility, matched scheme, and a
            quarter-by-quarter repayment schedule including your moratorium.</p>
          </div>
        </div>
      </section>
    </>
  )
}
