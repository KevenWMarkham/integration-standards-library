# ISL-04: Data Classification & Sensitivity Framework

**Module ID:** ISL-04
**Target:** Data classification tiers, sensitivity labeling, handling requirements, and compliance alignment
**Productivity Gain:** 50–60% reduction in classification standards creation effort
**Engagement Deployment Effort:** 25–40 hours to adapt templates to client context
**Reusability:** Global — deployed at every engagement with industry-specific compliance overlays

---

## Overview

Data classification framework defining sensitivity tiers, labeling requirements, handling rules, and access control alignment. Pre-mapped to Microsoft Purview Information Protection labels and Azure security controls. Includes manufacturing-specific extensions for trade secrets, process IP, and export-controlled data (ITAR/EAR).

Data classification is often the most politically sensitive standards deliverable — it directly affects who can access what data and triggers compliance obligations. This module provides a defensible, industry-standard framework that accelerates client alignment by starting from proven tier definitions rather than open-ended workshops.

---

## How It Works

### Step 1: Identify Regulatory Drivers
Map client's compliance landscape to classification requirements:
- **SOX:** Financial data requiring auditability and access controls
- **GDPR/CCPA:** Personal data requiring consent tracking and right-to-erasure support
- **ITAR/EAR:** Export-controlled technical data requiring citizenship-based access restrictions
- **HIPAA:** Protected health information requiring encryption and audit trails
- **Industry-specific:** Trade secrets, proprietary manufacturing processes, competitive intelligence

### Step 2: Configure Classification Tiers
Adapt the 4-tier model to client terminology and organizational culture:

| Tier | Default Label | Description | Typical Data Examples |
|------|--------------|-------------|----------------------|
| **Tier 1** | Public | No restrictions on access or distribution | Marketing materials, published product specs, public financial filings |
| **Tier 2** | Internal | Restricted to employees and authorized contractors | Internal reports, org charts, project plans, general business data |
| **Tier 3** | Confidential | Restricted to specific roles/teams with business need | Customer data, financial forecasts, HR records, vendor contracts, PII |
| **Tier 4** | Restricted | Highest sensitivity — named individuals only | Trade secrets, M&A data, ITAR technical data, executive compensation, SSN/financial account numbers |

### Step 3: Define Handling Requirements
Map each tier to specific technical and procedural controls:
- Storage requirements (encryption at rest, key management)
- Transmission requirements (encryption in transit, approved channels)
- Sharing requirements (internal vs. external, DLP policies)
- Retention and disposal requirements
- Access control patterns (RBAC, ABAC, just-in-time access)

### Step 4: Align to Microsoft Purview Labels
Configure Purview Information Protection sensitivity labels that map to classification tiers:
- Auto-labeling policies for structured data (SQL columns, Fabric tables)
- Manual labeling guidelines for unstructured data (documents, emails)
- Label inheritance rules (child objects inherit parent classification)
- Cross-platform label enforcement (Office 365, SharePoint, Fabric, Power BI)

### Step 5: Deploy Classification Decision Support
Provide data stewards with:
- Classification decision tree (flowchart)
- Examples per tier per data domain
- Edge case resolution guidelines
- Escalation process for disputed classifications

---

## Template Inventory

| Template | File | Description | Adaptation Effort |
|----------|------|-------------|-------------------|
| Classification Tier Definitions | `templates/classification-tier-definitions.md` | 4-tier model with criteria, examples, and decision guidelines per tier | 3–5 hours |
| Sensitivity Labeling Standards | `templates/sensitivity-labeling-standards.md` | Purview label taxonomy, auto-labeling rules, manual labeling guidelines, label inheritance | 4–6 hours |
| Data Handling Requirements | `templates/data-handling-requirements.md` | Per-tier rules for storage, transmission, sharing, retention, and disposal | 3–5 hours |
| Access Control Alignment | `templates/access-control-alignment.md` | RBAC patterns per tier, Entra ID group mapping, Fabric workspace security, row-level security patterns | 4–8 hours |
| Compliance Mapping Matrix | `templates/compliance-mapping-matrix.md` | Classification-to-regulation mapping (SOX, GDPR, CCPA, ITAR, HIPAA) with control requirements per tier | 4–6 hours |
| Classification Decision Tree | `templates/classification-decision-tree.md` | Visual flowchart for data stewards to consistently classify new data assets with edge case guidance | 2–3 hours |

---

## Examples

| Example | File | Description |
|---------|------|-------------|
| Manufacturing Classification | `examples/manufacturing-classification.md` | Complete classification scheme for manufacturing client with ITAR overlay, trade secret protection, and IoT/OT data tiers |
| Fabric Security Model | `examples/fabric-security-model.md` | Mapping of classification tiers to Fabric workspace RBAC, OneLake access controls, and Power BI RLS/OLS patterns |
| Purview Label Configuration | `examples/purview-label-configuration.md` | Step-by-step Purview sensitivity label setup with auto-labeling policies for common manufacturing data patterns |

---

## Manufacturing Industry Overlays

### ITAR/EAR Compliance
- Export-controlled technical data identification criteria
- Citizenship-based access restrictions (US Person verification)
- Physical and logical separation requirements for ITAR data
- Audit trail requirements for ITAR data access and distribution
- Marking requirements for ITAR-controlled documents and datasets

### Trade Secret Protection
- Welding process parameters and proprietary alloy compositions
- Manufacturing process IP (equipment settings, quality thresholds)
- Competitive intelligence (pricing strategies, market analysis)
- R&D data (patent-pending innovations, experimental results)

### IoT/OT Data Sensitivity
- Safety-critical data (emergency shutdowns, safety interlock data) → Tier 3/4
- Operational data (production rates, equipment status) → Tier 2/3
- Analytical data (aggregated metrics, trend analysis) → Tier 1/2
- Edge device credentials and configuration → Tier 4

### Supply Chain Data
- Vendor pricing and contractual terms → Tier 3
- Sourcing strategies and supplier evaluations → Tier 3
- Supply chain risk assessments → Tier 2/3
- Logistics and shipping data → Tier 2

---

## Impact Metrics

| Metric | Baseline (No Accelerator) | With Accelerator | Savings |
|--------|--------------------------|-------------------|---------|
| Hours to create classification standards | 60–100 hrs | 25–40 hrs | 35–60 hrs |
| Time to first draft | 3–4 weeks | 1 week | 2–3 weeks |
| Compliance coverage gaps | 20–30% (typical miss) | <5% (pre-mapped) | Significant risk reduction |
| Stakeholder alignment cycles | 3–5 review rounds | 1–2 review rounds | Faster approval |

---

## Dependencies

- **ISL-01 (API Governance):** API security standards reference classification tiers for data-in-transit controls
- **ISL-02 (Metadata & Lineage):** Classification labels stored as metadata attributes in catalog
- **ISL-03 (Naming Conventions):** Classification tier may be encoded in naming conventions (e.g., `_restricted` suffix)
- **ISL-06 (Data Quality):** Quality rules may differ by classification tier (higher quality thresholds for Tier 3/4 data)
- **ACC-04 (Governance Maturity Assessment):** Maturity level determines classification enforcement depth

---

## Directory Structure

```
data-classification/
├── README.md              ← This file
├── templates/
│   ├── classification-tier-definitions.md
│   ├── sensitivity-labeling-standards.md
│   ├── data-handling-requirements.md
│   ├── access-control-alignment.md
│   ├── compliance-mapping-matrix.md
│   └── classification-decision-tree.md
└── examples/
    ├── manufacturing-classification.md
    ├── fabric-security-model.md
    └── purview-label-configuration.md
```

---

*Module Owner: DMTSP Cybersecurity & Data Governance Practice | Engagement Phase: Phase 1 — Foundation Standards Deployment*
