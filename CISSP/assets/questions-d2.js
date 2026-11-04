/* Domain 2 — Asset Security. Original practice questions. */
(window.CISSP = window.CISSP || {}).questions = (window.CISSP.questions || []).concat([
  {
    id: "d2q1", d: 2, topic: "Data ownership", diff: 1,
    stem: "A new dataset containing customer contract terms is created. Who is accountable for deciding its classification level and who may access it?",
    options: ["The data steward", "The data owner", "The system owner", "The data custodian"],
    answer: 1,
    whyText: "The data owner is the business role accountable for the data's classification, access rules, and destruction decisions. Administrators and custodians implement those decisions.",
    lens: "Owner decides; custodian implements; user complies. If the question asks who decides classification or access, the answer is the owner.",
    why: { 0: "A data steward maintains quality and metadata; classification accountability stays with the owner.", 2: "A system owner is accountable for the system, not the business data’s classification.", 3: "A custodian implements controls; it does not decide classification or access." }
  },
  {
    id: "d2q2", d: 2, topic: "Custodian duties", diff: 1,
    stem: "A data owner has classified a dataset as confidential. Which task belongs primarily to the data custodian?",
    options: ["Deciding which business partners may receive the data", "Implementing encryption, backups, and access controls", "Approving the organisation's retention policy", "Determining the data's value to the business"],
    answer: 1,
    whyText: "The custodian implements and maintains the technical and operational controls selected by the owner, including encryption, backup, and access enforcement.",
    lens: "The owner makes business decisions. The custodian keeps the controls running. Do not promote a custodian into an ownership decision.",
    why: { 0: "Sharing decisions belong to the data owner.", 2: "Policy approval is a senior management and governance responsibility.", 3: "Value and classification are owner decisions." }
  },
  {
    id: "d2q3", d: 2, topic: "Classification levels", diff: 1,
    stem: "Which sequence correctly orders these classifications from most restrictive to least restrictive?",
    options: ["Confidential, secret, top secret, sensitive but unclassified, unclassified", "Top secret, secret, confidential, sensitive but unclassified, unclassified", "Unclassified, sensitive but unclassified, confidential, secret, top secret", "Secret, top secret, confidential, sensitive but unclassified, unclassified"],
    answer: 1,
    whyText: "The military-style order is top secret, secret, confidential, sensitive but unclassified, then unclassified. Sensitivity decreases from left to right in the correct option.",
    lens: "Remember the hierarchy, not the label names in isolation. Top secret is the highest; unclassified is the lowest.",
    why: { 0: "This reverses the order of the top three.", 2: "This runs from least to most restrictive.", 3: "Top secret outranks secret." }
  },
  {
    id: "d2q4", d: 2, topic: "Data remanence", diff: 1,
    stem: "After files are deleted and the drive is formatted, residual data can still be recovered with forensic tools. What is this condition called?",
    options: ["Data remanence", "Data persistence", "Data aggregation", "Data inference"],
    answer: 0,
    whyText: "Data remanence is the residual representation of data that remains after deletion, formatting, or incomplete sanitisation.",
    lens: "Deletion removes the pointer, not the data. Remanence is why sanitisation standards exist.",
    why: { 1: "Persistence usually refers to data surviving a restart, not deleted-file residue.", 2: "Aggregation is combining data sources to reveal more.", 3: "Inference is deducing restricted data from permitted results." }
  },
  {
    id: "d2q5", d: 2, topic: "Media sanitisation", diff: 2,
    stem: "An organisation is retiring solid-state drives that stored confidential data and will donate them to a school. Which approach provides the strongest assurance that the data cannot be recovered?",
    options: ["Degauss the drives", "Run a single-pass overwrite", "Cryptographically erase the drives and verify, or physically destroy them", "Delete the partitions and reformat"],
    answer: 2,
    whyText: "SSDs use wear levelling and spare blocks, so overwriting and degaussing do not reliably reach all cells. Crypto-erase with verification, or physical destruction, gives the strongest assurance before the drives leave organisational control.",
    lens: "Match media type to sanitisation method. Magnetic media supports degaussing; solid-state media generally does not.",
    why: { 0: "Degaussing is ineffective on solid-state media.", 1: "A single pass may miss remapped or spare blocks.", 3: "Deleting and reformatting leaves recoverable data." }
  },
  {
    id: "d2q6", d: 2, topic: "Clearing versus purging", diff: 2,
    stem: "A laptop is being reassigned from a finance user to an intern in the same organisation at a lower classification. Which sanitisation level is normally appropriate?",
    options: ["Clearing", "Purging", "Destruction", "Degaussing"],
    answer: 0,
    whyText: "Clearing removes data so it resists ordinary recovery and is appropriate when media is reused at a lower classification within the same organisation. Purging is stronger and is used when media leaves organisational control.",
    lens: "Clearing = reuse inside the organisation. Purging = reuse outside organisational control or higher assurance. Destruction = end of life.",
    why: { 1: "Purging is stronger than required for an internal, lower-classification reuse.", 2: "Destruction is unnecessary and wasteful for internal reuse.", 3: "Degaussing applies to magnetic media, not the laptop's SSD." }
  },
  {
    id: "d2q7", d: 2, topic: "Legal hold", diff: 2,
    stem: "The retention schedule says a set of emails should be destroyed after three years. Litigation is reasonably anticipated, and counsel issues a legal hold. What should the organisation do?",
    options: ["Destroy the emails on schedule to comply with the retention policy", "Preserve the emails until the hold is released, then resume disposition", "Continue the retention schedule but retain a copy in the backup system", "Encrypt the emails and delete the decryption keys held by IT"],
    answer: 1,
    whyText: "A legal hold suspends normal destruction and overrides the retention schedule. Data must be preserved until counsel releases the hold, after which normal disposition can resume.",
    lens: "When litigation or investigation is reasonably anticipated, preservation beats the retention timer. Destroying in the face of a hold can be sanctions-level misconduct.",
    why: { 0: "The retention schedule is overridden by the hold.", 2: "A backup copy does not satisfy a legal hold and may not be retrievable in a defensible way.", 3: "Encryption with destroyed keys is destruction, not preservation; the hold requires the records to remain available." }
  },
  {
    id: "d2q8", d: 2, topic: "Retention risk", diff: 1,
    stem: "A records team proposes keeping every email and document indefinitely because storage is inexpensive. Legal has not issued a hold. What is the primary security risk of this over-retention?",
    options: ["Higher storage and search costs, with no material security effect", "Greater exposure in a breach and broader discovery obligations", "A larger backup window and higher media costs", "Less need for data classification because the archive is centralised"],
    answer: 1,
    whyText: "Over-retention enlarges the data footprint available to an attacker and increases the scope and cost of legal discovery. It also conflicts with privacy minimisation principles.",
    lens: "Retention is a risk decision, not just a storage decision. Keep what the law and the business require; dispose of the rest defensibly.",
    why: { 0: "Cost is real, but over-retention also increases breach exposure and discovery scope.", 2: "Backup performance is an operational concern, not the primary security risk.", 3: "Centralised storage does not reduce the need to classify and limit data." }
  },
  {
    id: "d2q9", d: 2, topic: "Personal data", diff: 1,
    stem: "Which item is the clearest example of protected health information (PHI)?",
    options: ["A patient's appointment time with no name or identifier", "A patient's name combined with a diagnosis and treatment record", "A patient's postcode and admission date without a name", "A hospital's staff roster with names and roles"],
    answer: 1,
    whyText: "PHI is health information linked to an identifiable individual. A name plus diagnosis and treatment is the classic combination.",
    lens: "The identifier is what turns health data into PHI. Aggregated, properly anonymised counts are not personal health information.",
    why: { 0: "An appointment time without an identifier is not tied to an individual.", 2: "A postcode and admission date can be identifying when combined, but a name plus diagnosis and treatment is the clearest PHI example.", 3: "A staff roster is workforce data, not patient health information." }
  },
  {
    id: "d2q10", d: 2, topic: "Data subject rights", diff: 2,
    stem: "A customer asks an organisation to erase their personal data. The organisation is legally required to retain transaction records for seven years. What is the most appropriate response?",
    options: ["Delete everything immediately to satisfy the request", "Refuse all requests permanently", "Explain the legal retention obligation and erase only data not subject to it", "Retain all data under a legitimate-interest exception and close the request"],
    answer: 2,
    whyText: "Data-subject rights are not absolute. The organisation should honour the request where it can and explain the legal basis for retaining the subset it must keep, limiting further processing.",
    lens: "Privacy requests meet legal obligations. The mature answer is scoped compliance with a documented rationale, not blanket deletion or blanket refusal.",
    why: { 0: "Deleting legally required records creates compliance and litigation risk.", 1: "A blanket refusal ignores the rights that do apply.", 3: "A legitimate-interest claim does not override a legal retention obligation or erase the need to respond to the request." }
  },
  {
    id: "d2q11", d: 2, topic: "Data loss prevention", diff: 2,
    stem: "A security team wants to detect and block outbound email containing customer credit-card numbers. Which control is designed for this purpose?",
    options: ["A web application firewall", "Data loss prevention", "A network intrusion prevention system", "Full-disk encryption"],
    answer: 1,
    whyText: "DLP inspects content and context to detect sensitive data leaving its authorised boundary and can block or quarantine it. Encryption at rest does not stop an authorised user from emailing the data.",
    lens: "DLP protects data in motion and in use based on content. A WAF protects web applications; an IPS blocks network attacks; encryption protects stored data.",
    why: { 0: "A WAF protects web applications from HTTP attacks, not outbound email content.", 2: "An IPS detects network attack patterns, not data classification.", 3: "Full-disk encryption protects data at rest on a lost device." }
  },
  {
    id: "d2q12", d: 2, topic: "Tokenisation", diff: 2,
    stem: "An online store replaces stored card numbers with random tokens and keeps the real values in a segregated vault. What is the primary security benefit?",
    options: ["It makes the card numbers mathematically unrecoverable forever", "It reduces the exposure and compliance scope of the production environment", "It allows the production system to store the real card numbers in a separate schema", "It guarantees PCI DSS compliance without network segmentation"],
    answer: 1,
    whyText: "Tokenisation keeps sensitive values out of systems that do not need them, reducing breach exposure and the scope of payment-card compliance. The vault still requires strong protection.",
    lens: "Tokenisation reduces where the sensitive data lives. It does not make the underlying data unrecoverable, and it does not remove other controls.",
    why: { 0: "The token maps back to the real value in the vault, so the data is recoverable by design.", 2: "Moving the real values to another schema does not reduce scope or exposure.", 3: "Tokenisation helps scope, but compliance still requires segmentation and other controls." }
  },
  {
    id: "d2q13", d: 2, topic: "Data states", diff: 1,
    stem: "A clinician steps away from a workstation without signing out, leaving patient records visible on screen and in memory. Which control most directly protects data in use on the endpoint?",
    options: ["TLS for network transmission", "AES-256 encryption of the disk", "Screen locking and memory protection", "Offsite backup replication"],
    answer: 2,
    whyText: "Data in use is in memory and on screen. Screen locks, memory protection, and restricted capture reduce exposure during active use. Disk encryption protects data at rest; TLS protects data in transit.",
    lens: "Classify the state first: at rest, in motion, or in use. Then choose the control that operates in that state.",
    why: { 0: "TLS protects data in transit.", 1: "Disk encryption protects data at rest.", 3: "Replication supports availability and recovery." }
  },
  {
    id: "d2q14", d: 2, topic: "Classification criteria", diff: 1,
    stem: "Which set of criteria is most commonly used to determine how data should be classified?",
    options: ["Value, usefulness, age, and association", "Colour, format, and file size", "Server location and operating system", "Number of copies and backup frequency"],
    answer: 0,
    whyText: "Classification weighs the data's value to the organisation, its usefulness, its age, and its association with other sensitive data.",
    lens: "Classification is about business value and sensitivity, not technical properties such as file type or server.",
    why: { 1: "Format and size say nothing about sensitivity.", 2: "Technical location does not determine business classification.", 3: "Copy count is a handling detail, not a classification criterion." }
  },
  {
    id: "d2q15", d: 2, topic: "Data stewardship", diff: 2,
    stem: "Which role is most likely responsible for ensuring that a dataset's content is accurate, complete, and used in accordance with the owner's policy on a day-to-day basis?",
    options: ["Data steward", "Data custodian", "Network administrator", "Chief information security officer"],
    answer: 0,
    whyText: "The data steward handles day-to-day data quality, definition, and policy compliance. The custodian focuses on technical protection and operations.",
    lens: "Steward = content and policy compliance. Custodian = technical safeguards. Owner = accountability and classification.",
    why: { 1: "The custodian protects the systems and media, not the semantic quality of the data.", 2: "The network administrator manages infrastructure.", 3: "The CISO owns the security programme, not individual data quality." }
  },
  {
    id: "d2q16", d: 2, topic: "Labeling", diff: 2,
    stem: "A document is classified as internal. Who is accountable for ensuring the label accurately reflects the data's sensitivity when the content later changes?",
    options: ["The user who edits the document", "The data owner", "The records-management vendor", "The help desk"],
    answer: 1,
    whyText: "The data owner is accountable for classification and reclassification. Users may apply labels operationally, but the owner remains accountable for the decision.",
    lens: "Operational application of a label does not transfer accountability. Reclassification is an owner decision.",
    why: { 0: "An editor may notice a change, but accountability stays with the owner.", 2: "A vendor may store records but does not own the data.", 3: "The help desk supports users and does not classify business data." }
  },
  {
    id: "d2q17", d: 2, topic: "Destruction records", diff: 1,
    stem: "Which artefact best demonstrates that retired storage media were destroyed in accordance with policy?",
    options: ["A verbal confirmation from the administrator", "A certificate of destruction from the vendor or facility", "A screenshot of the delete command", "A copy of the retention schedule"],
    answer: 1,
    whyText: "A certificate of destruction documents the method, date, asset identifiers, and responsible party, providing auditable evidence that destruction occurred.",
    lens: "For destruction, evidence matters as much as the act. A certificate creates the audit trail.",
    why: { 0: "Verbal confirmation is not auditable evidence.", 2: "A delete command does not prove physical destruction.", 3: "The schedule states policy, not that this media was destroyed." }
  },
  {
    id: "d2q18", d: 2, topic: "Privacy by design", diff: 2,
    stem: "A product team is designing a new loyalty programme. Which choice best applies the principle of data minimisation?",
    options: ["Collect a broad set of attributes and rely on access controls to limit use", "Collect only the attributes needed for the stated loyalty benefits", "Retain data for the maximum period permitted by law to preserve optionality", "Share the full dataset with partners that accept the privacy notice"],
    answer: 1,
    whyText: "Data minimisation limits collection and retention to what the stated purpose requires. Optional future uses need a separate lawful basis and a new decision.",
    lens: "Privacy by design is mostly restraint: collect less, keep it briefly, restrict the purpose, and default to the protective setting.",
    why: { 0: "Access controls do not cure over-collection; minimisation limits what is collected.", 2: "Retention limits are part of minimisation; keeping data for optional future use is not necessary.", 3: "Sharing the full dataset is the opposite of minimisation and purpose limitation." }
  },
  {
    id: "d2q19", d: 2, topic: "Asset lifecycle", diff: 2,
    stem: "At which point in the data lifecycle should classification and handling requirements first be assigned?",
    options: ["When the data is first migrated to a shared repository", "When the data is created or acquired", "When the data owner approves the retention schedule", "When the data is indexed for search"],
    answer: 1,
    whyText: "Classification at creation or acquisition ensures the correct handling controls follow the data from the beginning. Retrofitting classification later leaves periods of uncontrolled use.",
    lens: "Security follows the data from birth to destruction. Assign the label when the asset appears, not after it has moved.",
    why: { 0: "Migration is a later lifecycle event; classification should precede handling.", 2: "Retention approval may follow classification; it is not the first assignment point.", 3: "Indexing is a processing step that should already be governed by a classification." }
  },
  {
    id: "d2q20", d: 2, topic: "Baselines", diff: 2,
    stem: "A security team is selecting controls from NIST SP 800-53 for a new system. What does 'scoping and tailoring' mean in this context?",
    options: ["Adopting the full baseline without change and documenting any exceptions", "Selecting and adjusting controls to fit the system's risk, architecture, and obligations", "Selecting controls only from the system's impact level", "Deferring tailoring until after the system is deployed"],
    answer: 1,
    whyText: "Scoping and tailoring adapt a control baseline to the system's actual context. The goal is appropriate coverage, not maximum control count.",
    lens: "A baseline is a starting point. Tailoring is a documented risk decision, not an excuse to delete inconvenient controls.",
    why: { 0: "Implementing the full baseline ignores system-specific risk and cost.", 2: "Impact level is an input, not the whole scoping decision.", 3: "Tailoring after deployment leaves gaps during the riskiest period." }
  }
]);
