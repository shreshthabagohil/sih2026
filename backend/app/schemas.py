"""
Pydantic schemas — the contract between frontend and backend.
These map 1:1 onto the inputs/outputs named in the SIH26091 problem statement.
"""
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class BusinessCategory(str, Enum):
    dairy = "Dairy"
    retail = "Retail"
    textiles = "Textiles"
    food_processing = "Food Processing"
    poultry = "Poultry"
    handicrafts = "Handicrafts"
    agri_input_store = "Agri Input Store"
    tailoring = "Tailoring"
    other = "Other"


class SchemeName(str, Enum):
    micro_finance = "Micro Finance Scheme"
    term_loan = "Term Loan Scheme"
    not_eligible = "Not Eligible (Project cost exceeds Rs. 50 Lakh)"


class ConfidenceLevel(str, Enum):
    high = "High"
    medium = "Medium"
    low = "Low"


# ---------------------------------------------------------------------------
# Request: the three inputs named explicitly in the PS
# ---------------------------------------------------------------------------

class AdvisoryRequest(BaseModel):
    village: str = Field(..., description="Village / Town name")
    block: Optional[str] = Field(None, description="Block / Tehsil name")
    district: str = Field(..., description="District name")
    state: str = Field(..., description="State name")
    pincode: Optional[str] = Field(None, description="6-digit PIN code, improves geo lookups")

    available_margin_capital: float = Field(
        ..., gt=0, description="Beneficiary's own contribution, e.g. 100000 (Rs. 1,00,000)"
    )
    business_category: BusinessCategory
    business_category_other: Optional[str] = Field(
        None, description="Free text if business_category == 'Other'"
    )

    applicant_gender: Optional[str] = None
    applicant_age: Optional[int] = None
    is_first_time_entrepreneur: Optional[bool] = True
    language: str = Field("en", description="ISO code for report language: en, hi, etc.")


# ---------------------------------------------------------------------------
# Module 2 — Financial Structuring & Scheme Router (fully deterministic)
# ---------------------------------------------------------------------------

class RepaymentInstallment(BaseModel):
    period_label: str          # e.g. "Quarter 5"
    opening_balance: float
    principal_component: float
    interest_component: float
    installment_amount: float
    closing_balance: float


class FinancialPlan(BaseModel):
    available_margin_capital: float
    margin_percentage: float = 10.0
    project_cost: float
    max_loan_amount: float
    loan_percentage: float = 90.0

    selected_scheme: SchemeName
    interest_rate_percent: float
    tenure_years: int
    moratorium_months: int

    quarterly_installment_amount: float
    total_interest_payable: float
    total_repayable: float

    repayment_schedule: List[RepaymentInstallment]

    scheme_explanation: str  # "Why this scheme?" — plain-language justification
    warnings: List[str] = []  # e.g. project cost exceeds Rs 50L ceiling


# ---------------------------------------------------------------------------
# Module 1 — Hyper-Local Business Feasibility Report
# ---------------------------------------------------------------------------

class SWOTAnalysis(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]


class CompetitorMapping(BaseModel):
    estimated_similar_businesses_nearby: int
    density_rating: str          # "Low" / "Moderate" / "High"
    nearest_competitor_distance_km: Optional[float] = None
    data_source: str
    confidence: ConfidenceLevel


class PricingRecommendation(BaseModel):
    suggested_price_range_min: float
    suggested_price_range_max: float
    unit: str                     # e.g. "per litre", "per piece"
    predicted_local_market_value: float
    pricing_rationale: str
    data_source: str
    confidence: ConfidenceLevel


class OpportunityAnalysis(BaseModel):
    underserved_niches: List[str]
    rationale: str


class ThreatFlag(BaseModel):
    threat: str
    severity: str  # Low / Medium / High
    mitigation: str


class MarketReach(BaseModel):
    radius_km: float
    estimated_consumer_base: int
    primary_distribution_channels: List[str]
    data_source: str
    confidence: ConfidenceLevel


class FeasibilityReport(BaseModel):
    business_opportunity_score: int = Field(..., ge=0, le=100)
    overall_confidence: ConfidenceLevel

    market_reach: MarketReach
    opportunity_analysis: OpportunityAnalysis
    swot: SWOTAnalysis
    threats: List[ThreatFlag]
    competitor_mapping: CompetitorMapping
    pricing: PricingRecommendation

    narrative_summary: str  # short AI-generated plain-language summary
    actionable_next_steps: List[str]


# ---------------------------------------------------------------------------
# Combined response
# ---------------------------------------------------------------------------

class AdvisoryResponse(BaseModel):
    request_echo: AdvisoryRequest
    feasibility_report: FeasibilityReport
    financial_plan: FinancialPlan
    disclaimer: str = (
        "This report is an AI-generated advisory tool to aid decision-making. "
        "It does not constitute an official loan sanction or government approval. "
        "Final eligibility is determined by the concerned Channelizing Agency (CA/SCA)."
    )
