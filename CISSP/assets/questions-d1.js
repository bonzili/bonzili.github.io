/* Domain 1 — Security and Risk Management. Original practice questions. */
(window.CISSP = window.CISSP || {}).questions = (window.CISSP.questions || []).concat([
  {
    id: "d1q1", d: 1, topic: "Risk treatment", diff: 1,
    stem: "A retailer buys business-interruption insurance to cover flood losses at its primary data centre. Which risk treatment has the retailer applied?",
    options: ["Avoidance", "Mitigation", "Transference", "Acceptance"],
    answer: 2,
    whyText: "Insurance transfers the financial consequence of the risk to a third party. The retailer still operates in the flood zone; it has shifted part of the loss to an insurer rather than reducing the likelihood or impact itself.",
    lens: "Name the treatment by what happens to the risk, not by which control is most visible. Avoidance removes the activity; mitigation reduces likelihood or impact; transfer moves the financial consequence.",
    why: { 0: "Avoidance would mean moving the data centre out of the flood plain or ending the activity.", 1: "Insurance does not reduce the likelihood or impact; it shifts the financial consequence.", 3: "Acceptance would mean acknowledging the risk with no new treatment." }
  },
  {
    id: "d1q2", d: 1, topic: "Quantitative risk analysis", diff: 2,
    stem: "An asset is valued at $500,000. A flood would destroy 40% of its value. Such a flood is expected once every two years. What is the annualised loss expectancy (ALE)?",
    options: ["$100,000", "$200,000", "$250,000", "$400,000"],
    answer: 0,
    whyText: "SLE = asset value × exposure factor = $500,000 × 0.40 = $200,000. ARO = once every two years = 0.5. ALE = SLE × ARO = $200,000 × 0.5 = $100,000.",
    lens: "Write the two formulas before touching the numbers: SLE = AV × EF, then ALE = SLE × ARO. Most errors come from treating the two-year frequency as 2 instead of 0.5.",
    why: { 1: "This is the SLE, not the annualised figure.", 2: "This treats the exposure factor as 50%, which the scenario does not state.", 3: "This multiplies the asset value by the exposure factor and then by 2 rather than 0.5." }
  },
  {
    id: "d1q3", d: 1, topic: "Due care and due diligence", diff: 2,
    stem: "A security policy requires critical patches within 30 days. An audit finds that internet-facing servers have been unpatched for six months, although the patch process is documented and staff know the requirement. Which failure does this most directly demonstrate?",
    options: ["A lack of due diligence", "A lack of due care", "An inappropriate risk appetite", "A failure of separation of duties"],
    answer: 1,
    whyText: "The organisation knew what to do and had a documented process, but did not do it. That is a failure of due care — the ongoing practice of protecting the organisation. Due diligence is the investigation and verification that produces the requirement.",
    lens: "Due diligence asks whether the organisation did its homework. Due care asks whether it acted on what it knew. A documented control that nobody operates is a due-care finding.",
    why: { 0: "Due diligence was performed: the requirement and process exist.", 2: "Risk appetite is an acceptance decision; the scenario describes a failure to execute an accepted control.", 3: "Separation of duties is not the issue; one team could still patch." }
  },
  {
    id: "d1q4", d: 1, topic: "Risk ownership", diff: 1,
    stem: "A business unit wants to launch a new customer portal despite an unresolved high-severity finding. The security team has documented the risk and proposed compensating controls. Who should formally accept the residual risk?",
    options: ["The security manager, because the finding is technical", "The development lead, because the code is theirs", "The accountable business owner or senior management", "The auditor, because the finding is independent"],
    answer: 2,
    whyText: "Risk acceptance is a business decision made by the person or body accountable for the outcome. The security team advises and documents; it does not accept business risk on the organisation's behalf.",
    lens: "Whenever an option has a technician accepting risk, eliminate it. The exam consistently places risk acceptance with senior management or the data/business owner.",
    why: { 0: "The security manager can recommend and document, but lacks the authority to accept business risk.", 1: "The development lead may own the code but not the business outcome.", 3: "An auditor provides assurance and does not own or accept operational risk." }
  },
  {
    id: "d1q5", d: 1, topic: "Business continuity", diff: 2,
    stem: "An organisation has completed a business impact analysis and identified its critical processes and recovery objectives. What should happen next in the business continuity programme?",
    options: ["Test the disaster recovery plan", "Select continuity strategies and develop the plan", "Activate the alternate site", "Conduct a penetration test"],
    answer: 1,
    whyText: "The BIA establishes impact, dependencies, and recovery objectives. The next step is to choose strategies that can meet those objectives and then document the continuity plan. Testing comes after a plan exists.",
    lens: "Follow the sequence: BIA → strategies → plan → test → maintain. Choosing a test or a site before the strategy is a common ordering trap.",
    why: { 0: "There is no plan to test yet.", 2: "Activation is an execution step during an actual disruption.", 3: "A penetration test is a security assessment, not a BCP phase." }
  },
  {
    id: "d1q6", d: 1, topic: "Recovery objectives", diff: 2,
    stem: "An online order system may lose no more than 15 minutes of transactions, and the business requires it to be operational within four hours of an outage. Which pair of objectives does this describe?",
    options: ["RTO 15 minutes, RPO 4 hours", "RPO 15 minutes, RTO 4 hours", "MTD 15 minutes, RTO 4 hours", "RPO 4 hours, MTD 15 minutes"],
    answer: 1,
    whyText: "RPO is the acceptable data loss measured in time: 15 minutes. RTO is the target time to restore the service: four hours.",
    lens: "RPO is about data; RTO is about time to service. MTD is the outer limit before the impact becomes unacceptable, which the scenario does not state.",
    why: { 0: "The values are reversed.", 2: "MTD is a maximum tolerable outage, not the target restore time.", 3: "The values are reversed and MTD is misapplied." }
  },
  {
    id: "d1q7", d: 1, topic: "Intellectual property", diff: 1,
    stem: "A beverage company protects its secret formula through confidentiality agreements, need-to-know access, and physical controls. The formula has never been patented. Which form of intellectual property is being protected?",
    options: ["Copyright", "Patent", "Trademark", "Trade secret"],
    answer: 3,
    whyText: "A trade secret is confidential business information with commercial value that is protected by reasonable secrecy measures. Patents, by contrast, require public disclosure in exchange for a limited monopoly.",
    lens: "If disclosure would destroy the protection and the owner relies on secrecy, the answer is trade secret. If the protection is a public registration, it is patent, trademark, or copyright.",
    why: { 0: "Copyright protects expression such as text, music, or software code, not a formula as such.", 1: "A patent would require public disclosure and a formal application.", 2: "A trademark protects brand identifiers, not the underlying recipe." }
  },
  {
    id: "d1q8", d: 1, topic: "Policy hierarchy", diff: 1,
    stem: "An organisation issues a mandatory requirement that all laptops use AES-256 full-disk encryption and that keys be escrowed in the approved management system. What type of document is this?",
    options: ["Policy", "Standard", "Procedure", "Guideline"],
    answer: 1,
    whyText: "A standard is a mandatory, specific requirement that supports a policy — for example, an algorithm and key-management rule. A policy states intent at a high level; a procedure gives step-by-step instructions; a guideline is recommended but not mandatory.",
    lens: "Match the level of specificity: intent = policy, mandatory specification = standard, steps = procedure, advice = guideline.",
    why: { 0: "A policy would state the organisation's commitment to protecting data, not name the algorithm.", 2: "A procedure would describe how to enable and verify encryption on a laptop.", 3: "A guideline would recommend encryption without making it mandatory." }
  },
  {
    id: "d1q9", d: 1, topic: "Control types", diff: 1,
    stem: "A mandatory phishing-awareness programme requires every employee to complete training and a simulated phishing exercise each quarter. Which control classification best describes this?",
    options: ["Technical preventive", "Administrative preventive", "Physical deterrent", "Technical detective"],
    answer: 1,
    whyText: "Awareness training is an administrative control, and it is intended to prevent successful phishing by changing behaviour. It is not a technical or physical control.",
    lens: "Classify controls on two axes: nature (administrative, technical, physical) and function (preventive, detective, corrective, deterrent, recovery, compensating).",
    why: { 0: "It is not implemented through technology.", 2: "It is not a physical control, and its purpose is prevention rather than deterrence alone.", 3: "It is not technical and does not detect events." }
  },
  {
    id: "d1q10", d: 1, topic: "Qualitative assessment", diff: 1,
    stem: "A risk workshop ranks identified scenarios as high, medium, or low based on expert judgement and group discussion. Which type of risk analysis is being performed?",
    options: ["Quantitative", "Qualitative", "Automated", "Deterministic"],
    answer: 1,
    whyText: "Qualitative analysis uses judgement and relative scales rather than monetary values. It is faster and useful for prioritisation, but less precise than quantitative analysis.",
    lens: "If the output is a rating or a ranking, it is qualitative. If the output is money and annualised loss, it is quantitative.",
    why: { 0: "Quantitative analysis would calculate monetary values such as SLE and ALE.", 2: "The method of calculation, not the tooling, defines the analysis type.", 3: "Deterministic is not the standard CISSP distinction here." }
  },
  {
    id: "d1q11", d: 1, topic: "Threat modelling", diff: 2,
    stem: "During a threat-modelling workshop, the team considers an attacker modifying order totals in transit between the web tier and the database. Which STRIDE category does this represent?",
    options: ["Spoofing", "Tampering", "Repudiation", "Information disclosure"],
    answer: 1,
    whyText: "Tampering is unauthorised modification of data, whether in transit or at rest. It violates integrity.",
    lens: "STRIDE is about the property attacked: spoofing (authentication), tampering (integrity), repudiation (non-repudiation), information disclosure (confidentiality), denial of service (availability), elevation of privilege (authorisation).",
    why: { 0: "Spoofing is impersonation of an identity.", 2: "Repudiation is denying that an action occurred.", 3: "Information disclosure is unauthorised reading, not modification." }
  },
  {
    id: "d1q12", d: 1, topic: "BCP testing", diff: 2,
    stem: "Which business continuity test provides the most realistic validation of recovery capability but also carries the greatest risk to production operations?",
    options: ["Checklist review", "Tabletop exercise", "Parallel test", "Full interruption test"],
    answer: 3,
    whyText: "A full interruption test shuts down the primary environment and relies on the recovery capability. It is the most realistic and the most disruptive, so it needs careful planning and approval.",
    lens: "Test types trade realism against risk. Review, tabletop, simulation, parallel, then full interruption. The exam wants you to recognise both ends of that scale.",
    why: { 0: "A checklist review is low-risk and low-realism.", 1: "A tabletop exercises discussion and decision-making, not actual recovery.", 2: "A parallel test runs recovery alongside production; it is realistic but less disruptive than full interruption." }
  },
  {
    id: "d1q13", d: 1, topic: "Cloud responsibility", diff: 2,
    stem: "A company uses a SaaS customer-relationship platform. The contract states that the provider secures the infrastructure and application, while the company configures users, roles, and data sharing. Who is responsible for classifying the customer data stored in the platform?",
    options: ["The SaaS provider, because it stores the data", "The customer, because it owns the data", "The platform's auditor", "The internet service provider"],
    answer: 1,
    whyText: "Under the shared responsibility model, the customer remains accountable for its data: classification, access decisions, and sharing. The provider is responsible for the platform controls it operates.",
    lens: "Cloud does not transfer data ownership. The provider secures the platform; the customer secures its identities, configuration, and data decisions.",
    why: { 0: "Storage does not transfer ownership or classification responsibility.", 2: "An auditor provides independent assurance and does not own data.", 3: "The ISP transports packets and has no role in data classification." }
  },
  {
    id: "d1q14", d: 1, topic: "Privacy roles", diff: 2,
    stem: "A payroll company processes employee data on behalf of its clients. The clients decide why the data is collected and which payroll features are used. Under a GDPR-style model, what is the payroll company?",
    options: ["Data controller", "Data processor", "Data subject", "Supervisory authority"],
    answer: 1,
    whyText: "The processor acts on the controller's instructions and does not determine the purpose or means of processing. The clients are the controllers; employees are data subjects.",
    lens: "Controller decides why and how; processor acts on instructions. The wording 'on behalf of' is the tell.",
    why: { 0: "The clients determine purpose and means, so they are the controllers.", 2: "Data subjects are the individuals the data is about.", 3: "A supervisory authority is a regulator." }
  },
  {
    id: "d1q15", d: 1, topic: "Security metrics", diff: 2,
    stem: "Which metric is the most useful key risk indicator for a vulnerability-management programme?",
    options: ["The number of vulnerability scans completed this month", "The percentage of critical vulnerabilities older than the remediation SLA", "The number of security staff trained on the scanner", "The total number of findings, regardless of severity"],
    answer: 1,
    whyText: "A KRI should indicate exposure and trend, not activity volume. Ageing critical vulnerabilities beyond SLA directly signals accumulating risk. Scan counts and training counts are activity metrics.",
    lens: "Activity metrics show effort; outcome and risk metrics show exposure. Choose the metric that would make an executive ask a question.",
    why: { 0: "This measures activity, not risk.", 2: "Training is an input, not an outcome.", 3: "Raw finding counts ignore severity and exploitability." }
  },
  {
    id: "d1q16", d: 1, topic: "Separation of duties", diff: 1,
    stem: "In a procurement system, the same administrator can create a new vendor, approve the vendor, and release payment. Which control should be implemented first?",
    options: ["Require a longer password for the administrator", "Separate the three duties across different roles", "Enable database encryption", "Increase the frequency of backups"],
    answer: 1,
    whyText: "The scenario describes a concentration of incompatible duties that enables fraud. Separation of duties directly addresses the root cause by ensuring no single person can complete the process end to end.",
    lens: "When a scenario describes one person controlling an entire sensitive transaction, the answer is usually separation of duties or dual control — not a technical hardening step.",
    why: { 0: "Password length does not prevent a single administrator from abusing legitimate authority.", 2: "Encryption protects data at rest but not the fraudulent workflow.", 3: "Backups support recovery, not fraud prevention." }
  },
  {
    id: "d1q17", d: 1, topic: "Risk response", diff: 1,
    stem: "An organisation concludes that a new service carries risk it cannot reduce to a tolerable level and decides not to launch the service. Which risk response has it chosen?",
    options: ["Mitigate", "Transfer", "Avoid", "Accept"],
    answer: 2,
    whyText: "Avoidance removes the activity that creates the risk. The organisation does not retain, reduce, or transfer the risk; it eliminates the exposure by not proceeding.",
    lens: "Avoid = stop the activity. Mitigate = reduce. Transfer = shift financial consequence. Accept = retain with awareness.",
    why: { 0: "Mitigation would launch with additional controls.", 1: "Transfer would shift the financial impact, for example through insurance.", 3: "Acceptance would proceed while retaining the risk." }
  },
  {
    id: "d1q18", d: 1, topic: "Residual risk", diff: 1,
    stem: "After implementing a new set of controls, a risk assessment shows that some risk remains. What is this remaining risk called, and what must happen to it?",
    options: ["Inherent risk; it must be eliminated", "Residual risk; it must be accepted by the appropriate owner", "Secondary risk; it must be transferred to a vendor", "Control risk; it must be audited by the security team"],
    answer: 1,
    whyText: "Residual risk is what remains after controls. It cannot always be eliminated, so the accountable owner must formally accept it or require further treatment.",
    lens: "Inherent risk exists before controls; residual risk exists after. The exam frequently asks who accepts residual risk: the business owner, not the security analyst.",
    why: { 0: "Inherent risk is the risk before controls, and it is not always eliminable.", 2: "Secondary risk is a new risk created by a control; transference is a separate response.", 3: "Control risk is not the standard term for this, and auditing does not equal acceptance." }
  },
  {
    id: "d1q19", d: 1, topic: "Evidence", diff: 2,
    stem: "In a dispute over a signed supplier agreement, which piece of evidence is generally the most reliable?",
    options: ["A colleague's recollection of the negotiation", "A photocopy of the signed agreement", "The original signed agreement", "An email summarising the agreement"],
    answer: 2,
    whyText: "The original signed document is primary evidence and is generally stronger than copies, summaries, or witness memory. Secondary evidence is used when the original is unavailable.",
    lens: "Evidence quality runs from original tangible records down to copies and recollection. Best evidence is the original.",
    why: { 0: "Witness memory is weaker and can be disputed.", 1: "A copy is secondary evidence and may be challenged.", 3: "A summary is not the agreement and may omit terms." }
  },
  {
    id: "d1q20", d: 1, topic: "Security governance", diff: 1,
    stem: "Who should approve the organisation's top-level information security policy?",
    options: ["The security operations team", "The senior management or governing body", "The internal audit function", "The IT service desk manager"],
    answer: 1,
    whyText: "A top-level security policy expresses management's intent and assigns authority across the organisation. It must be approved at the level that can commit the organisation, typically senior management or the board.",
    lens: "Policy is a management instrument. The security team drafts and advises; senior management approves and remains accountable.",
    why: { 0: "Operations implements policy but does not set organisation-wide intent.", 2: "Audit provides independent assurance and should not author policy.", 3: "The service desk is too low in the organisation to commit the enterprise." }
  }
]);
