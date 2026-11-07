/* ==========================================================================
   CISSP Field Manual — domain register and condensed notes
   Original summaries written for this study aid, aligned to the 2026 outline.
   ========================================================================== */

window.CISSP = window.CISSP || {};

CISSP.meta = {
  title: "CISSP Field Manual",
  outline: "2026 exam outline",
  passMark: 700,
  examQuestions: 125,
  examMinutes: 180,
  examDate: "2026-11-30",
  updated: "November 2026"
};

CISSP.examWeights = [16, 10, 13, 13, 13, 12, 13, 10];

CISSP.domains = [
  {
    id: 1,
    name: "Security and Risk Management",
    short: "Risk & Governance",
    weight: 16,
    blurb: "The management domain. Governance, risk, law, continuity, and the people controls that hold the programme together.",
    ask: "Expect questions about who decides, which framework applies, how risk is measured, and what a manager does first.",
    sections: [
      {
        title: "Confidentiality, integrity, availability",
        lead: "Every control in the exam traces back to one of three properties — or to the accountability that makes them enforceable.",
        points: [
          "<strong>Confidentiality</strong> keeps data from unauthorised disclosure. Encryption in transit (TLS) and at rest (AES-256) are the standard answers.",
          "<strong>Integrity</strong> prevents improper modification and supports authenticity and non-repudiation. Hashes, digital signatures, and change controls protect it.",
          "<strong>Availability</strong> keeps data and services reachable when authorised users need them. Redundancy, backups, and DDoS protection protect it.",
          "The opposite of CIA is <strong>DAD</strong>: disclosure, alteration, destruction. Name the property under attack before choosing a control.",
          "<strong>IAAA</strong> — identification, authentication, authorization, accountability — is the chain that turns a claim of identity into an auditable action.",
          "Controls are also classified by <strong>function</strong> (preventive, detective, corrective, deterrent, recovery, compensating, directive) and by <strong>nature</strong> (administrative, technical, physical)."
        ],
        terms: [
          { t: "Non-repudiation", d: "Assurance that a party cannot credibly deny an action. Digital signatures provide it; encryption alone does not." },
          { t: "DAD triad", d: "Disclosure, alteration, destruction — the failures that oppose confidentiality, integrity, and availability." },
          { t: "Defence in depth", d: "Layering controls so the failure of one does not expose the asset." }
        ]
      },
      {
        title: "Governance and the security programme",
        lead: "Governance decides what the organisation will accept. Management approves; the security function advises and enables.",
        points: [
          "The document hierarchy runs <strong>policy → standard → procedure → guideline</strong>. Policy is mandatory and high-level; standards are mandatory and specific; procedures are step-by-step; guidelines are discretionary.",
          "A <strong>policy</strong> states intent and assigns responsibility. It does not describe product settings — that is a standard or baseline.",
          "Senior management owns risk appetite and accepts residual risk. The <strong>CISO</strong> runs the programme but does not unilaterally accept business risk.",
          "<strong>Due care</strong> is the ongoing practice of protecting the organisation; <strong>due diligence</strong> is the investigation and verification behind it. Exam questions often ask which one is missing.",
          "Useful frameworks: ISO/IEC 27001 (management system), ISO/IEC 27002 (controls), NIST CSF (five functions: identify, protect, detect, respond, recover), NIST RMF, COBIT (IT governance), COSO (internal control).",
          "Metrics should be tied to business objectives. A count of patched servers is an activity metric; a falling mean time to remediate is an outcome metric.",
          "The security strategy must align with the business strategy, not the reverse. Strategic plans are long-range, tactical plans are shorter, operational plans are day-to-day."
        ],
        terms: [
          { t: "Risk appetite", d: "The amount and type of risk senior management is willing to pursue or retain." },
          { t: "Due care", d: "The ongoing duty to act reasonably and protect the organisation — the practice, not just the paperwork." },
          { t: "Due diligence", d: "The investigation, review, and verification that informs due care." },
          { t: "Security steering committee", d: "Cross-functional body that aligns security investment with business priorities." }
        ]
      },
      {
        title: "Risk management",
        lead: "Risk is the probability and impact of a threat exploiting a vulnerability. You cannot eliminate it; you bring it to a tolerable level.",
        points: [
          "Core vocabulary: an <strong>asset</strong> has value; a <strong>vulnerability</strong> is a weakness; a <strong>threat</strong> is a potential cause; a <strong>threat agent</strong> carries it out; an <strong>exploit</strong> is the instance; <strong>risk</strong> is the probability of loss.",
          "The risk process: identify, analyse, evaluate, treat, monitor. Treatment options are <strong>avoid, mitigate, transfer, accept</strong> — sometimes remembered as MART.",
          "Quantitative analysis uses money: <strong>SLE = asset value × exposure factor</strong>; <strong>ALE = SLE × annualised rate of occurrence (ARO)</strong>.",
          "Qualitative analysis uses judgement and scales (high/medium/low). It is faster but less defensible; use it to prioritise, not to justify a precise budget.",
          "Controls reduce likelihood or impact. The risk that remains after controls is <strong>residual risk</strong> — and it must be accepted by the appropriate owner.",
          "Risk registers, KRIs, and regular reassessment keep risk management continuous. A risk assessment is a snapshot; risk management is the loop.",
          "Third-party and supply-chain risk belongs here: vendors, cloud providers, and integrators inherit your obligations through contracts and assurance."
        ],
        terms: [
          { t: "SLE", d: "Single loss expectancy = asset value × exposure factor. The expected loss from one incident." },
          { t: "ALE", d: "Annualised loss expectancy = SLE × ARO. Used to compare the cost of risk with the cost of a control." },
          { t: "Residual risk", d: "Risk remaining after existing controls are applied." },
          { t: "Risk register", d: "Living record of identified risks, owners, ratings, treatments, and review dates." }
        ]
      },
      {
        title: "Law, regulation, and contracts",
        lead: "The exam asks you to recognise the source of an obligation and the appropriate response — not to practise law.",
        points: [
          "<strong>Criminal law</strong> protects society and can result in imprisonment; <strong>civil law</strong> addresses wrongs between parties and usually results in compensation; <strong>administrative/regulatory law</strong> governs how industries and officers must act.",
          "Intellectual property: copyright protects expression, patents protect inventions, trademarks protect brand identifiers, trade secrets protect confidential business information. A trade secret dies on disclosure; a patent is public by design.",
          "Privacy and sector laws to recognise: GDPR (EU data protection and data-subject rights), HIPAA (US health information), SOX (financial reporting controls), GLBA (financial privacy), PCI DSS (contractual card-payment standard, not a law).",
          "Cross-border transfers need a lawful mechanism and an understanding of jurisdiction. Data location, sovereignty, and conflicting legal demands are management problems, not just technical ones.",
          "Contracts allocate liability: SLAs, NDAs, data processing agreements, right-to-audit clauses, and breach-notification timelines.",
          "Computer crime concepts: unauthorised access, unauthorised alteration or destruction, and malicious code. Evidence must be relevant, sufficient, reliable, and lawfully obtained."
        ],
        terms: [
          { t: "GDPR", d: "EU regulation giving data subjects rights and imposing duties on controllers and processors. Breach notification is generally 72 hours." },
          { t: "PCI DSS", d: "Payment Card Industry Data Security Standard — a contractual standard enforced by the card brands, not legislation." },
          { t: "Trade secret", d: "Protected confidential information with commercial value; protection depends on reasonable secrecy." }
        ]
      },
      {
        title: "Business continuity and disaster recovery",
        lead: "BCP keeps the business alive; DRP restores the technology. Both start with a business impact analysis.",
        points: [
          "The <strong>BIA</strong> identifies critical processes, dependencies, and the impact of outage over time. It produces recovery objectives, not technical designs.",
          "<strong>RTO</strong> is the target time to restore a function; <strong>RPO</strong> is the acceptable amount of data loss measured in time; <strong>MTD</strong> is the maximum tolerable downtime before unacceptable harm.",
          "<strong>MTBF</strong> is mean time between failures (reliability); <strong>MTTR</strong> is mean time to repair (maintainability).",
          "Recovery strategies trade cost against speed: hot site (ready now), warm site (partially equipped), cold site (space and power only), plus mobile sites and reciprocal agreements.",
          "Plan contents: scope, priorities, roles, communications, succession, vital records, recovery procedures, and testing. A plan that has never been tested is an assumption.",
          "Test types rise in disruption: checklist review, tabletop, simulation, parallel test, full interruption. Full interruption is the most realistic and the riskiest.",
          "BCP is business-owned and long-lived; DRP is technology-focused and invoked by the BCP. Both need maintenance after major change."
        ],
        terms: [
          { t: "RTO", d: "Recovery time objective — target duration to restore a process or system." },
          { t: "RPO", d: "Recovery point objective — maximum tolerable data loss, expressed as time." },
          { t: "MTD", d: "Maximum tolerable downtime — the point after which the impact becomes unacceptable." },
          { t: "Hot site", d: "Fully equipped alternate facility able to take over quickly, at the highest cost." }
        ]
      },
      {
        title: "People, awareness, and third parties",
        lead: "Most incidents begin with a person. Administrative controls change behaviour; technical controls only constrain it.",
        points: [
          "<strong>Least privilege</strong> grants the minimum access needed, for the minimum time. <strong>Need to know</strong> narrows that to specific information.",
          "<strong>Separation of duties</strong> splits a sensitive task so no single person can complete it alone. <strong>Dual control</strong> requires two people to act together. <strong>Split knowledge</strong> means neither holds the full secret.",
          "<strong>Job rotation</strong> and <strong>mandatory vacations</strong> create opportunities to detect fraud and reduce single-person dependency.",
          "Awareness training should change behaviour, not just transfer facts. Phishing simulations, clean-desk checks, and role-based training are more useful than annual slide decks.",
          "Social engineering targets authority, urgency, familiarity, and helpfulness. Verify through an independent channel; never rely on the contact details supplied by the requester.",
          "Vendor risk: classify the data and service criticality, apply proportionate due diligence, contract the security obligations, and monitor continuously. The organisation remains accountable for its data."
        ],
        terms: [
          { t: "Separation of duties", d: "No single person has end-to-end control of a sensitive process." },
          { t: "Dual control", d: "Two authorised people must act together to complete an action." },
          { t: "Mandatory vacation", d: "Required absence that gives the organisation a chance to detect irregularities." },
          { t: "Supply-chain risk", d: "Risk introduced by vendors, service providers, software, and their own dependencies." }
        ]
      }
    ],
    traps: [
      "A threat is not a vulnerability. Phishing is a threat; an untrained user is a vulnerability.",
      "Risk acceptance belongs to senior management or the data owner — never to the security analyst.",
      "Due care is doing the work; due diligence is verifying it. One without the other is a finding.",
      "RTO is how long you can be down; RPO is how much data you can lose. Do not swap them.",
      "A BIA comes before a BCP; a BCP comes before a DRP. Choosing DRP first is a classic distractor."
    ],
    mnemonic: {
      label: "Carry this",
      text: "CIA protects; DAD attacks. People before process before technology. Risk is managed, not eliminated."
    }
  },

  {
    id: 2,
    name: "Asset Security",
    short: "Asset Security",
    weight: 10,
    blurb: "Classify what you have, decide who owns it, protect it through its life, and destroy it so nothing survives.",
    ask: "Expect classification levels, owner-versus-custodian duties, retention, and the difference between clearing, purging, and destruction.",
    sections: [
      {
        title: "Classification and ownership",
        lead: "Classification is a business decision about value. Ownership and custody are different jobs.",
        points: [
          "Classify by <strong>value, usefulness, age, and association</strong>. The data owner sets the classification; the custodian implements the controls.",
          "Military-style levels: top secret, secret, confidential, sensitive but unclassified, unclassified. Private-sector labels vary but usually run confidential, private, sensitive, public.",
          "Labels drive handling: storage, transmission, sharing, printing, and disposal. A label with no handling rules is decoration.",
          "<strong>Data owner</strong> — senior manager accountable for the data, classification, and access decisions. <strong>Data steward</strong> — day-to-day quality and policy compliance. <strong>Data custodian</strong> — technical protection, backups, and access implementation. <strong>User</strong> — follows the rules.",
          "The <strong>system owner</strong> is accountable for a system, including its security posture; the <strong>administrator</strong> operates it within policy.",
          "Data must be classified at creation and reclassified when its value or context changes. Declassification is an owner decision."
        ],
        terms: [
          { t: "Data owner", d: "Business role accountable for classification, access rules, and destruction decisions." },
          { t: "Data custodian", d: "Operational role that implements and maintains the owner's controls." },
          { t: "Labeling", d: "Attaching the classification to the asset so handling rules can follow it." }
        ]
      },
      {
        title: "Privacy and personal data",
        lead: "Privacy is about the person, not the file. Understand who decides why data is processed and who processes it on their behalf.",
        points: [
          "PII identifies a person directly or indirectly; PHI is health information tied to an individual. Both need minimisation, access control, and purpose limitation.",
          "Under GDPR, the <strong>controller</strong> decides the purpose and means of processing; the <strong>processor</strong> acts on the controller's instructions. Both have obligations, but they are not interchangeable.",
          "Data-subject rights typically include access, correction, erasure, restriction, portability, and objection. Respond within the legal timeline.",
          "Privacy by design: minimise collection, limit purpose, constrain retention, protect by default, and document decisions.",
          "Cross-border transfers need a lawful basis and appropriate safeguards. Data sovereignty can conflict with a vendor's global architecture.",
          "Privacy impact assessments (PIAs/DPIAs) are performed before new processing or major change, not after an incident."
        ],
        terms: [
          { t: "Controller", d: "Entity that determines why and how personal data is processed." },
          { t: "Processor", d: "Entity that processes personal data on the controller's behalf." },
          { t: "Data minimisation", d: "Collect and retain only what the stated purpose requires." }
        ]
      },
      {
        title: "Retention and legal hold",
        lead: "Keep what you must, for as long as you must, and be able to prove both.",
        points: [
          "A retention schedule maps record types to minimum and maximum retention periods, based on legal, regulatory, contractual, and business needs.",
          "A <strong>legal hold</strong> suspends normal destruction when litigation, investigation, or audit is reasonably anticipated. It overrides the retention schedule.",
          "Records management covers the lifecycle: creation, distribution, use, maintenance, and disposition. Archives preserve records that are no longer active but still required.",
          "Over-retention increases discovery cost and breach impact. Under-retention creates legal and operational risk. Both are governance failures.",
          "Destruction must be authorised, documented, and consistent across replicas, backups, and archives — subject to legal hold."
        ],
        terms: [
          { t: "Retention schedule", d: "Policy defining how long each record class is kept and when it is destroyed." },
          { t: "Legal hold", d: "Directive to preserve potentially relevant information, suspending normal deletion." },
          { t: "Data remanence", d: "Residual data left on media after deletion or attempted erasure." }
        ]
      },
      {
        title: "Sanitisation and destruction",
        lead: "Deleting a file is not destroying data. The exam tests the level of assurance each method provides.",
        points: [
          "<strong>Clearing</strong> removes data so it cannot be recovered by ordinary means; it is suitable for reuse in a lower-classification environment.",
          "<strong>Purging</strong> provides stronger assurance against laboratory recovery; it is required before media leaves the organisation's control.",
          "<strong>Destruction</strong> makes the media unusable — shredding, disintegration, incineration, or certified physical destruction.",
          "Methods: overwriting (including zero fill), degaussing (magnetic media only), cryptographic erasure (destroy the key), and physical destruction.",
          "<strong>SSDs, flash, and some firmware</strong> complicate overwriting and degaussing because of wear levelling and spare blocks. Crypto-erase or physical destruction is often the reliable answer.",
          "Follow NIST SP 800-88 for media sanitisation decisions and verification. Document the method, the operator, and the verification result.",
          "Reuse, donation, resale, and return-to-vendor all require sanitisation proportional to the data's classification and the next user's trust level."
        ],
        terms: [
          { t: "Clearing", d: "Removes data to resist ordinary recovery; suitable for reuse at a lower classification." },
          { t: "Purging", d: "Stronger sanitisation that resists laboratory-level recovery." },
          { t: "Degaussing", d: "Uses a strong magnetic field to erase magnetic media; ineffective on solid-state media." },
          { t: "Crypto-erase", d: "Destroys the encryption key so the remaining ciphertext is unrecoverable." }
        ]
      },
      {
        title: "Protecting data in every state",
        lead: "The same data needs different controls at rest, in motion, and in use.",
        points: [
          "At rest: encryption, access control, secure configuration, backups, and physical protection.",
          "In transit: TLS, IPsec, SSH, and secure email. Protect both the channel and the endpoints.",
          "In use: memory protection, screen locks, clean-desk policy, least privilege, and preventing unauthorised capture or exfiltration.",
          "Data loss prevention (DLP) inspects content and context to block or log exfiltration. It is a detective/preventive control, not a classification scheme.",
          "Tokenisation replaces sensitive values with non-sensitive tokens; masking redacts portions of data; both reduce exposure without always removing the data.",
          "Baselines such as NIST SP 800-53 are scoped and tailored to the system. Selecting every control is not a strategy.",
          "Cloud access security brokers (CASBs) and secure web gateways extend data controls to SaaS and web traffic."
        ],
        terms: [
          { t: "DLP", d: "Content-aware control that detects and can block sensitive data leaving its authorised boundary." },
          { t: "Tokenisation", d: "Substitutes a sensitive value with a token that is meaningless outside the tokenisation system." },
          { t: "Scoping and tailoring", d: "Selecting and adjusting a control baseline for the system's actual risk and context." }
        ]
      }
    ],
    traps: [
      "The data owner classifies; the custodian implements. If the question asks who decides the label, it is the owner.",
      "Clearing is for reuse; purging is for leaving organisational control; destruction is for end of life.",
      "Degaussing does not work on SSDs. Crypto-erase or physical destruction is the safe answer.",
      "A legal hold overrides the retention schedule — do not destroy just because the timer expired.",
      "The controller decides purpose; the processor follows instructions. Do not reverse them."
    ],
    mnemonic: {
      label: "Carry this",
      text: "Owner classifies. Custodian protects. Steward governs. User handles. Nothing leaves without a sanitisation decision."
    }
  },

  {
    id: 3,
    name: "Security Architecture and Engineering",
    short: "Architecture",
    weight: 13,
    blurb: "How secure systems are designed: models, cryptography, evaluation, physical protection, and the trust boundaries between them.",
    ask: "Expect model direction rules, cryptographic primitives, evaluation levels, and physical/environmental controls.",
    sections: [
      {
        title: "Architecture principles",
        lead: "Good architecture limits what any one failure can reach.",
        points: [
          "<strong>Layering</strong> creates defence in depth; <strong>abstraction</strong> hides implementation detail; <strong>encapsulation</strong> protects object internals; <strong>modularity</strong> limits blast radius.",
          "<strong>Least common mechanism</strong> avoids sharing that could leak data between subjects. <strong>Fail-safe defaults</strong> deny access when the system fails.",
          "The <strong>trusted computing base (TCB)</strong> is the set of components that must be trusted. Smaller is better. The <strong>reference monitor</strong> mediates every access; the <strong>security kernel</strong> implements it in hardware, firmware, and software.",
          "Protection rings: ring 0 is the most privileged (kernel), outer rings are less privileged. Modern systems use user mode and kernel mode plus virtualization extensions.",
          "<strong>Trust boundaries</strong> mark where data or control passes between components with different trust. Validate at every crossing.",
          "Secure design assumes compromise, not perfection: least privilege, separation, isolation, and monitoring."
        ],
        terms: [
          { t: "TCB", d: "Everything that must be trusted to enforce the security policy." },
          { t: "Reference monitor", d: "Abstract mechanism that checks every access against policy; must be tamper-proof and always invoked." },
          { t: "Protection ring", d: "Privilege level in a CPU architecture; lower numbers are more privileged." }
        ]
      },
      {
        title: "Security models",
        lead: "Models formalise a policy. Learn the direction of each rule — exam questions rarely give you a second chance.",
        points: [
          "<strong>Bell-LaPadula</strong> protects confidentiality: no read up, no write down. A secret subject cannot read top secret and cannot write down to unclassified.",
          "<strong>Biba</strong> protects integrity: no read down, no write up. It is the mirror of Bell-LaPadula.",
          "<strong>Clark-Wilson</strong> protects integrity through well-formed transactions. Subjects act on constrained data items (CDIs) only through approved transformation procedures (TPs); integrity verification procedures (IVPs) check consistency.",
          "<strong>Brewer-Nash</strong> (Chinese Wall) prevents conflicts of interest using dynamically changing access based on what a subject has already accessed.",
          "<strong>Graham-Denning</strong> defines eight primitive protection rights; <strong>Harrison-Ruzzo-Ullman</strong> models how access rights can be changed; <strong>Take-Grant</strong> models how rights propagate.",
          "The <strong>state machine model</strong> checks every state transition against policy. <strong>Non-interference</strong> prevents high-level actions from affecting low-level observations.",
          "<strong>Lipner</strong> combines Biba and Bell-LaPadula ideas for commercial integrity. <strong>Clark-Wilson</strong> is about separation of duties and transaction integrity, not secrecy."
        ],
        terms: [
          { t: "Bell-LaPadula", d: "Confidentiality model: no read up, no write down." },
          { t: "Biba", d: "Integrity model: no read down, no write up." },
          { t: "Clark-Wilson", d: "Integrity model built on CDIs, TPs, IVPs, and separation of duties." },
          { t: "Brewer-Nash", d: "Chinese Wall model that changes access to prevent conflicts of interest." }
        ]
      },
      {
        title: "Evaluation and assurance",
        lead: "Certification evaluates the system; accreditation authorises it for use in a specific environment.",
        points: [
          "<strong>TCSEC</strong> (Orange Book) was the US standard; <strong>ITSEC</strong> was the European equivalent. Both are historical.",
          "<strong>Common Criteria</strong> (ISO/IEC 15408) evaluates products against a protection profile and security target. <strong>EAL</strong> levels 1–7 describe assurance in the evaluation, not the product's absolute security.",
          "A higher EAL does not automatically mean a more secure product. It means more confidence that the product meets its stated security target.",
          "<strong>FIPS 140-3</strong> validates cryptographic modules. Levels 1–4 add physical security and tamper resistance.",
          "Certification is the technical evaluation; accreditation is management's formal authorisation to operate, accepting residual risk.",
          "Assurance also comes from testing, code review, formal methods, and operational monitoring — not only from certificates."
        ],
        terms: [
          { t: "Common Criteria", d: "International standard for evaluating IT security products against a security target." },
          { t: "EAL", d: "Evaluation assurance level, 1–7; depth of evaluation, not a score of absolute security." },
          { t: "FIPS 140-3", d: "US validation standard for cryptographic modules, with four increasing levels." },
          { t: "Accreditation", d: "Management authorisation to operate a system and accept its residual risk." }
        ]
      },
      {
        title: "Cryptography",
        lead: "Choose the primitive by the property you need: secrecy, integrity, authenticity, or non-repudiation.",
        points: [
          "<strong>Symmetric</strong> encryption (AES, ChaCha20) is fast and needs a shared key. <strong>Asymmetric</strong> encryption (RSA, ECC) solves key distribution and enables signatures, but is slower.",
          "Key size is not comparable across algorithms. AES-128, RSA-3072, and ECC-256 offer broadly similar security levels; do not compare raw bit counts.",
          "<strong>Hashing</strong> (SHA-256, SHA-3) provides a fixed-length digest and is one-way. It does not encrypt. MD5 and SHA-1 are broken for collision resistance.",
          "<strong>HMAC</strong> combines a hash with a shared key for integrity and authenticity. A <strong>digital signature</strong> uses the sender's private key and provides integrity, authenticity, and non-repudiation.",
          "Digital signature process: hash the message, encrypt the hash with the private key, send message plus signature; the receiver decrypts with the public key and compares hashes.",
          "<strong>PKI</strong> binds public keys to identities through certificates signed by a trusted certificate authority. Revocation uses CRLs or OCSP; the chain of trust must be validated.",
          "Key management covers generation, distribution, storage, rotation, recovery, and destruction. The weakest part of most cryptosystems is key handling.",
          "Post-quantum cryptography is a migration and inventory problem: find long-lived secrets and hard-coded algorithms before they become urgent."
        ],
        terms: [
          { t: "AES", d: "Symmetric block cipher; 128-, 192-, or 256-bit keys. The default for data at rest." },
          { t: "RSA", d: "Asymmetric algorithm used for key transport and signatures; security depends on factoring difficulty." },
          { t: "ECC", d: "Asymmetric cryptography with smaller keys and lower overhead than RSA at comparable strength." },
          { t: "HMAC", d: "Keyed hash used for message integrity and authenticity." },
          { t: "Digital signature", d: "Private-key operation over a hash; provides integrity, authenticity, and non-repudiation." },
          { t: "Certificate revocation", d: "Invalidates a certificate before expiry via CRL or OCSP." }
        ]
      },
      {
        title: "Physical and environmental security",
        lead: "Logical controls are irrelevant if someone can walk out with the server.",
        points: [
          "<strong>CPTED</strong> — crime prevention through environmental design — uses natural surveillance, natural access control, and territorial reinforcement.",
          "Perimeter layers: site selection, fencing, lighting, bollards, locks, mantraps, guards, and intrusion detection. Each layer buys time and evidence.",
          "Locks: mechanical, electromechanical, and biometric. Fail-safe locks release on power loss (life safety); fail-secure locks stay locked (asset protection).",
          "CCTV should be monitored and retained; footage is evidence only if the chain of custody is maintained.",
          "Fire: detect early, suppress appropriately, and protect people first. Water-based suppression can destroy equipment; clean agents reduce collateral damage but have safety limits.",
          "Power: UPS for ride-through, generators for extended outage, surge protection, and separate power circuits. Test the transfer, not just the battery.",
          "HVAC controls temperature, humidity, and particulate contamination. EMI and TEMPEST concerns require shielding, distance, and filtering."
        ],
        terms: [
          { t: "Mantrap", d: "Two-door controlled entry that admits one person at a time and prevents tailgating." },
          { t: "Fail-safe", d: "A lock that releases on failure, prioritising life safety." },
          { t: "Fail-secure", d: "A lock that remains locked on failure, prioritising asset protection." },
          { t: "CPTED", d: "Design approach that reduces crime through surveillance, access control, and territoriality." }
        ]
      },
      {
        title: "Sites, virtualization, and cloud",
        lead: "Architecture now spans facilities and providers. Understand where the responsibility boundary sits.",
        points: [
          "Site selection weighs hazards, utilities, communications, transport, and jurisdiction. Geographic diversity protects against regional failure but adds latency and complexity.",
          "Cloud models: IaaS, PaaS, SaaS. The provider secures the platform; the customer secures identities, data, configuration, and whatever they build on top.",
          "The <strong>shared responsibility model</strong> is contractual and service-specific. 'The cloud is secure' is never a complete answer.",
          "Virtualisation risks: hypervisor compromise, VM escape, resource contention, and snapshot sprawl. Containers share the host kernel, so isolation depends on configuration and runtime security.",
          "Serverless shifts patching to the provider but leaves code, permissions, secrets, and event inputs with the customer.",
          "Design for tenancy: strong isolation, per-tenant keys, logging, and explicit data-residency controls."
        ],
        terms: [
          { t: "Shared responsibility", d: "Division of security duties between cloud provider and customer, varying by service model." },
          { t: "Hypervisor", d: "Software layer that creates and isolates virtual machines; a high-value attack target." },
          { t: "Container", d: "Isolated application environment sharing the host OS kernel; lighter than a VM but with different isolation risks." }
        ]
      }
    ],
    traps: [
      "Bell-LaPadula is confidentiality; Biba is integrity. Write the direction arrows down before answering.",
      "Hashing is not encryption. A hash cannot be decrypted, and a digital signature is not the same as encrypting the message.",
      "A higher EAL means more assurance in the evaluation, not a guarantee that the product is secure in your environment.",
      "Certification is technical evaluation; accreditation is management authorisation to operate.",
      "Fail-safe prioritises people; fail-secure prioritises assets. Life safety wins.",
      "TLS protects data in transit; it does not protect data at rest or prove the endpoint is trustworthy."
    ],
    mnemonic: {
      label: "Carry this",
      text: "BLP: no read up, no write down. Biba: no read down, no write up. Signature proves; hash verifies; encryption hides."
    }
  },

  {
    id: 4,
    name: "Communication and Network Security",
    short: "Network Security",
    weight: 13,
    blurb: "How data moves, where it can be intercepted, and which control belongs at which layer.",
    ask: "Expect OSI-layer mapping, protocol selection, wireless authentication, and the difference between detecting and preventing.",
    sections: [
      {
        title: "OSI and TCP/IP",
        lead: "Know the layer to know the control. Most network questions are really layer questions.",
        points: [
          "OSI layers, bottom to top: physical, data link, network, transport, session, presentation, application. Mnemonic: <em>Please Do Not Throw Sausage Pizza Away</em>.",
          "PDUs: bits (physical), frames (data link), packets (network), segments (transport), data (upper layers).",
          "TCP is connection-oriented and reliable; UDP is connectionless and best-effort. Choose based on tolerance for loss, latency, and overhead.",
          "IP provides addressing and routing without reliability. ARP resolves IPv4 addresses to MAC addresses; NDP does the equivalent for IPv6.",
          "Common ports to recognise: 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 123 NTP, 389 LDAP, 443 HTTPS, 445 SMB, 636 LDAPS, 3389 RDP.",
          "Encapsulation moves data down the stack; de-encapsulation reverses it. Tunnelling encapsulates one protocol inside another and changes the trust boundary."
        ],
        terms: [
          { t: "OSI model", d: "Seven-layer reference model for network functions and protocols." },
          { t: "Encapsulation", d: "Adding protocol headers as data moves down the stack." },
          { t: "TCP", d: "Connection-oriented transport with sequencing, acknowledgements, and retransmission." }
        ]
      },
      {
        title: "Architecture, addressing, and segmentation",
        lead: "Segmentation limits lateral movement. A flat network is a single blast radius.",
        points: [
          "Topologies: star (central device), mesh (redundant paths), bus, ring, and hybrid. Redundancy increases availability and cost.",
          "IPv4 subnetting uses a network portion and host portion; CIDR notation expresses the mask. NAT translates addresses and hides internal structure, but is not a security boundary by itself.",
          "VLANs segment at layer 2; routing and firewalls enforce policy between segments. VLAN hopping is a real attack, so do not treat a VLAN as a hard boundary.",
          "Software-defined networking separates the control plane from the data plane. The controller becomes a high-value asset.",
          "Zero trust replaces implicit network trust with explicit verification of identity, device, and context for every request.",
          "Microsegmentation applies policy to workloads rather than physical locations. It is a containment strategy.",
          "Remote access: VPNs encrypt the channel; split tunnelling changes what traffic uses it; always-on and posture checks strengthen assurance."
        ],
        terms: [
          { t: "VLAN", d: "Logical layer-2 segmentation that groups ports independently of physical location." },
          { t: "NAT", d: "Translates private addresses to public addresses; conserves IPv4 space and obscures internal addressing." },
          { t: "Zero trust", d: "Security model that verifies every request rather than trusting a network location." },
          { t: "Microsegmentation", d: "Fine-grained workload-level network policy that limits lateral movement." }
        ]
      },
      {
        title: "Secure protocols and services",
        lead: "Match the protocol to the property: confidentiality, integrity, authentication, or all three.",
        points: [
          "<strong>TLS</strong> protects application traffic with encryption, integrity, and server authentication. It is the foundation of HTTPS; it does not protect the application from its own flaws.",
          "<strong>IPsec</strong> operates at layer 3. <strong>AH</strong> provides integrity and authentication but no encryption; <strong>ESP</strong> provides confidentiality plus integrity and authentication. Transport mode protects the payload; tunnel mode protects the whole packet.",
          "<strong>SSH</strong> replaces cleartext remote shells and can tunnel other traffic. Restrict it, key it, and log it.",
          "<strong>DNSSEC</strong> signs DNS records to provide integrity and authenticity; it does not encrypt queries. DNS over HTTPS/TLS encrypts the query path.",
          "Email: <strong>S/MIME</strong> and <strong>PGP</strong> provide encryption and signing. SPF, DKIM, and DMARC authenticate the sending domain and reduce spoofing.",
          "SNMPv3 adds authentication and encryption; older versions send community strings in clear text. Disable or restrict legacy management protocols.",
          "File transfer: prefer SFTP/SCP over FTP; HTTPS over HTTP. Telnet and unencrypted LDAP are findings, not options."
        ],
        terms: [
          { t: "IPsec ESP", d: "Encapsulating Security Payload: confidentiality plus integrity and authentication." },
          { t: "IPsec AH", d: "Authentication Header: integrity and authentication, no encryption." },
          { t: "DNSSEC", d: "Cryptographically signs DNS data to prevent forgery; does not provide confidentiality." },
          { t: "DMARC", d: "Email policy that uses SPF and DKIM results to tell receivers how to handle spoofed mail." }
        ]
      },
      {
        title: "Wireless security",
        lead: "Wireless is a shared medium. Authentication and encryption choices matter more than signal strength.",
        points: [
          "<strong>WPA2</strong> uses AES-CCMP; <strong>WPA3</strong> strengthens handshakes, adds forward secrecy, and improves protection for open networks. WEP and WPA are obsolete.",
          "<strong>WPA2-Personal</strong> uses a pre-shared key for everyone. <strong>WPA2-Enterprise</strong> uses 802.1X with an authentication server (usually RADIUS), giving per-user credentials and certificates.",
          "EAP variants: EAP-TLS uses certificates on both sides and is strongest; PEAP and EAP-TTLS tunnel an inner authentication method. Avoid EAP-MD5.",
          "Rogue access points, evil twins, and deauthentication attacks target client behaviour. Use WIDS/WIPS, certificate validation, and client isolation.",
          "Disable WPS. It is convenient and repeatedly weak. Change default credentials and management settings.",
          "Bluetooth: pair deliberately, disable discoverability, update firmware, and treat Bluetooth peripherals as untrusted input devices.",
          "Site surveys establish coverage and detect interference or unauthorised radios. Coverage should be sufficient but not excessive."
        ],
        terms: [
          { t: "802.1X", d: "Port-based network access control that authenticates a device or user before admitting it." },
          { t: "RADIUS", d: "Central authentication, authorization, and accounting server commonly used for enterprise Wi-Fi and VPN." },
          { t: "EAP-TLS", d: "Strong EAP method using certificates on both client and server." },
          { t: "Evil twin", d: "Rogue access point impersonating a legitimate network to capture credentials or traffic." }
        ]
      },
      {
        title: "Attacks and defences",
        lead: "Most network attacks are versions of interception, impersonation, or exhaustion.",
        points: [
          "Sniffing captures traffic on a shared or compromised segment. Encryption and segmentation reduce exposure.",
          "ARP poisoning and DNS poisoning redirect traffic by corrupting resolution. Dynamic inspection, static mappings, and DNSSEC help.",
          "MITM and session hijacking steal or alter an existing session. TLS with certificate validation, short-lived tokens, and binding sessions to context help.",
          "DDoS exhausts bandwidth, connections, or application capacity. Combine upstream scrubbing, rate limiting, caching, and autoscaling.",
          "Spoofing and replay abuse trust in an identifier or a captured message. Nonces, timestamps, and mutual authentication counter them.",
          "Firewall generations: packet filter, stateful inspection, application proxy, and next-generation firewall with application awareness and IPS.",
          "IDS detects and alerts; IPS sits inline and blocks. A WAF protects web applications; NAC controls endpoint admission; honeypots observe attackers without exposing production.",
          "Defence in depth: segment, filter, inspect, authenticate, encrypt, monitor, and rehearse."
        ],
        terms: [
          { t: "Stateful firewall", d: "Tracks connection state and permits return traffic for established sessions." },
          { t: "WAF", d: "Web application firewall that inspects HTTP traffic for application-layer attacks." },
          { t: "NAC", d: "Network access control that checks endpoint posture before admission." },
          { t: "Honeypot", d: "Decoy system used to detect, divert, and study attackers." }
        ]
      }
    ],
    traps: [
      "AH does not encrypt. If confidentiality is required, ESP is in the answer.",
      "IDS detects; IPS prevents. Read the question for the required outcome.",
      "DNSSEC provides integrity and authenticity, not confidentiality.",
      "WPA2-Personal shares one key; WPA2-Enterprise authenticates each user through 802.1X.",
      "TLS protects the channel, not the application logic. Injection still works over HTTPS.",
      "NAT is not a firewall. It obscures addressing; it does not enforce policy."
    ],
    mnemonic: {
      label: "Carry this",
      text: "Please Do Not Throw Sausage Pizza Away. AH authenticates, ESP encrypts. IDS watches, IPS stops."
    }
  },

  {
    id: 5,
    name: "Identity and Access Management",
    short: "Identity & Access",
    weight: 13,
    blurb: "Prove who someone is, give them only what the job needs, and be able to prove what they did.",
    ask: "Expect factor types, biometric error rates, access-control models, and federation protocol selection.",
    sections: [
      {
        title: "Identity lifecycle and IAAA",
        lead: "Identity is a lifecycle, not a login. Most exam scenarios are about the lifecycle going wrong.",
        points: [
          "<strong>Identification</strong> is the claim; <strong>authentication</strong> validates it; <strong>authorization</strong> determines access; <strong>accountability</strong> ties actions back to the identity through logs.",
          "Registration and identity proofing establish the account. The strength of proofing should match the risk of the account.",
          "Provisioning creates and grants access; deprovisioning removes it promptly. Orphaned and dormant accounts are common findings.",
          "Access reviews recertify entitlements on a schedule and after role changes. The manager or resource owner attests; the security team does not rubber-stamp.",
          "Unique identifiers are required for accountability. Shared accounts destroy attribution and should be exceptional and tightly controlled.",
          "Access should be deny-by-default: what is not explicitly granted is denied."
        ],
        terms: [
          { t: "IAAA", d: "Identification, authentication, authorization, accountability." },
          { t: "Identity proofing", d: "Verifying that a person is who they claim to be before issuing credentials." },
          { t: "Orphaned account", d: "Account whose owner has left or changed roles but whose access remains." }
        ]
      },
      {
        title: "Digital identity lifecycle",
        lead: "The lifecycle is ordered. The exam often asks what comes next, who approves the step, or what failed when a step was skipped.",
        points: [
          "The six stages: <strong>create identity → provision account → provision access → authenticate → manage access → deprovision access</strong>. Keep the order; each stage answers a different question.",
          "<strong>Create identity.</strong> Registration and identity proofing establish that the person is who they claim to be. Use evidence proportionate to the account's risk and issue a unique identifier. The identity record is not yet an account or an entitlement.",
          "<strong>Provision the account.</strong> Create the account object and credentials, assign an owner, and record the approved request. The account can exist with no resource access.",
          "<strong>Provision access.</strong> Grant entitlements through roles, groups, permissions, or attributes after the resource or application owner approves. Apply least privilege, need-to-know, and separation of duties; never copy a predecessor's access without reviewing the current role.",
          "<strong>Authenticate.</strong> The user proves the claimed identity with one or more factors. Authentication succeeds or fails; it does not by itself authorize a resource. A valid login with no entitlement is still denied.",
          "<strong>Manage access.</strong> Joiner-mover-leaver changes, access reviews and recertification, role changes, privileged access, and time-bound or just-in-time entitlements. The manager or resource owner attests to continued need; security facilitates but does not rubber-stamp.",
          "<strong>Deprovision access.</strong> Revoke access, sessions, tokens, keys, and shared secrets; disable the account; transfer ownership; then remove or retain the record under policy and legal hold. Deleting the account before revoking access can leave live credentials.",
          "Lifecycle failures are common findings: <strong>orphaned accounts</strong> (owner left), <strong>dormant accounts</strong> (no use), <strong>entitlement creep</strong> (access accumulates), and <strong>shared accounts</strong> (no accountability). Provisioning workflows, periodic reviews, and prompt deprovisioning are the controls.",
          "The IAAA chain (identification, authentication, authorization, accountability) describes the access decision; the lifecycle describes the account's life. A federation trust relationship is a trust agreement between domains, not a stage of the individual identity lifecycle."
        ],
        terms: [
          { t: "Digital identity lifecycle", d: "Create identity → provision account → provision access → authenticate → manage access → deprovision access." },
          { t: "Account provisioning", d: "Creating the account record and credentials and assigning an owner. It does not by itself grant resource access." },
          { t: "Access provisioning", d: "Granting entitlements after approval, based on the current role and least privilege. It is a separate step from account creation." },
          { t: "Entitlement", d: "A specific right or permission granted to an identity, often through a role, group, or attribute." },
          { t: "Access recertification", d: "Periodic or event-driven attestation by the manager or resource owner that an entitlement is still required." },
          { t: "Joiner-mover-leaver (JML)", d: "The events that trigger account and access changes. A mover must lose old entitlements while gaining new ones; a leaver must be deprovisioned promptly." },
          { t: "Deprovisioning", d: "Revoking access and credentials, disabling the account, and removing or retaining the record under policy." }
        ]
      },
      {
        title: "Authentication factors",
        lead: "A factor is a category, not a count. Two passwords are still one factor.",
        points: [
          "Factors: <strong>something you know</strong> (password, PIN), <strong>something you have</strong> (token, smart card, phone), <strong>something you are</strong> (biometrics), and increasingly <strong>somewhere you are</strong> or <strong>something you do</strong>.",
          "MFA requires factors from different categories. A password plus a security question is not MFA.",
          "Passwords should be salted and hashed with a slow, memory-hard algorithm (bcrypt, scrypt, Argon2). Never store reversible encryption for authentication secrets.",
          "Attacks: brute force, dictionary, credential stuffing, rainbow tables, spraying, phishing, and interception. Rate limiting, lockout, MFA, and breach monitoring reduce risk.",
          "One-time passwords may be time-based (TOTP), counter-based (HOTP), or challenge-response. Push notifications need number matching or phishing-resistant design.",
          "FIDO2/WebAuthn passkeys bind credentials to an origin and resist phishing. They are the preferred answer for strong, usable authentication.",
          "Adaptive authentication evaluates device, location, behaviour, and risk to step up assurance."
        ],
        terms: [
          { t: "Salt", d: "Unique random value added before hashing so identical passwords produce different hashes." },
          { t: "Credential stuffing", d: "Replaying breached username/password pairs across other services." },
          { t: "FIDO2/WebAuthn", d: "Phishing-resistant public-key authentication standard bound to an origin." },
          { t: "TOTP", d: "Time-based one-time password derived from a shared secret and the current time." }
        ]
      },
      {
        title: "Biometrics",
        lead: "Biometrics are convenient but probabilistic. The exam cares about which error you are measuring.",
        points: [
          "<strong>Enrollment</strong> captures a reference sample; <strong>feature extraction</strong> turns it into a template. The template should not be reversible to the original biometric.",
          "<strong>False rejection rate (FRR)</strong> — a valid user is rejected (type 1 error). <strong>False acceptance rate (FAR)</strong> — an invalid user is accepted (type 2 error).",
          "<strong>Crossover error rate (CER)</strong> is where FAR equals FRR. Lower CER means a more accurate system.",
          "Tuning the threshold trades one error for the other. For high-security access, bias toward low FAR; for usability, bias toward low FRR.",
          "Physiological: fingerprint, iris, retina, face, hand geometry. Behavioural: voice, keystroke dynamics, signature dynamics.",
          "Biometrics are not secrets. A compromised biometric cannot be reset like a password, so protect templates and combine with another factor."
        ],
        terms: [
          { t: "FAR", d: "False acceptance rate — invalid users accepted; type 2 error." },
          { t: "FRR", d: "False rejection rate — valid users rejected; type 1 error." },
          { t: "CER", d: "Crossover error rate where FAR equals FRR; lower is more accurate." }
        ]
      },
      {
        title: "Authorization models",
        lead: "The model should match the business question: who owns this, what role is this, or what context applies?",
        points: [
          "<strong>DAC</strong> — the resource owner grants access, often through ACLs. Flexible, but inconsistent and prone to entitlement creep.",
          "<strong>MAC</strong> — access is based on security labels and clearances. The system enforces policy; users cannot override it.",
          "<strong>RBAC</strong> — access is granted to roles and roles are assigned to users. Good for stable job functions; requires role engineering and reviews.",
          "<strong>ABAC</strong> — decisions use attributes of subject, resource, action, and environment. More expressive, more complex to govern.",
          "<strong>Rule-based</strong> access applies global rules (for example, time-of-day restrictions). <strong>Risk-based</strong> access adapts to context.",
          "An <strong>access control matrix</strong> maps subjects to objects. Rows can be viewed as capabilities (subject-focused); columns as ACLs (object-focused).",
          "Authorization must support least privilege, separation of duties, and periodic review. A model without governance becomes a mess."
        ],
        terms: [
          { t: "DAC", d: "Discretionary access control: the resource owner decides who gets access." },
          { t: "MAC", d: "Mandatory access control: labels and clearances enforced by the system." },
          { t: "RBAC", d: "Role-based access control: permissions are assigned to roles, not individuals." },
          { t: "ABAC", d: "Attribute-based access control: policy evaluates attributes and context." }
        ]
      },
      {
        title: "Federation, SSO, and privileged access",
        lead: "Federation extends identity across trust domains. It concentrates risk in the identity provider.",
        points: [
          "<strong>SSO</strong> authenticates once and reuses the session across applications. It improves usability and reduces password sprawl, but a compromised session or IdP has wide impact.",
          "<strong>Kerberos</strong> uses symmetric keys and a key distribution centre (KDC). The authentication server issues a TGT; the ticket-granting service issues service tickets. Time synchronisation matters.",
          "<strong>SAML</strong> exchanges XML assertions between an identity provider and a service provider, commonly for browser-based enterprise SSO.",
          "<strong>OAuth 2.0</strong> is an authorization framework for delegated access; it issues access tokens. It is not an authentication protocol on its own.",
          "<strong>OpenID Connect (OIDC)</strong> adds an identity layer on OAuth 2.0 using signed ID tokens (JWT). Use OIDC when the question is about authenticating the user.",
          "RADIUS and TACACS+ centralise network device authentication; TACACS+ separates authentication, authorization, and accounting and encrypts the full payload.",
          "<strong>Privileged access management (PAM)</strong> vaults credentials, brokers sessions, records activity, and supports just-in-time elevation. Break-glass access must be monitored and reviewed.",
          "Federation trust requires metadata exchange, certificate management, attribute mapping, and a plan for IdP outage."
        ],
        terms: [
          { t: "SAML", d: "XML-based federation standard for exchanging authentication and authorization assertions." },
          { t: "OAuth 2.0", d: "Delegated authorization framework issuing access tokens; not itself user authentication." },
          { t: "OIDC", d: "Identity layer on OAuth 2.0 that authenticates users with signed ID tokens." },
          { t: "PAM", d: "Privileged access management: vaulting, brokering, and recording elevated access." },
          { t: "Kerberos TGT", d: "Ticket-granting ticket issued after authentication and used to obtain service tickets." }
        ]
      },
      {
        title: "Sessions and accountability",
        lead: "Access ends when the session ends — if you designed it correctly.",
        points: [
          "Session tokens must be unpredictable, transmitted only over protected channels, scoped, and expired. Bind them to context where practical.",
          "Idle timeout ends an inactive session; absolute timeout caps total session age. Logout must invalidate server-side state, not just clear the browser.",
          "Concurrent session limits reduce credential sharing. Re-authentication for sensitive actions limits session hijack impact.",
          "Log authentication successes and failures, privilege changes, and administrative actions. Protect logs from tampering and synchronise time.",
          "Account lockout must balance brute-force resistance with denial-of-service risk. Prefer progressive delays and MFA over permanent lockout.",
          "Periodic entitlement reviews and prompt deprovisioning are the strongest controls against accumulated access."
        ],
        terms: [
          { t: "Idle timeout", d: "Ends a session after a period of inactivity." },
          { t: "Absolute timeout", d: "Ends a session after a fixed maximum duration regardless of activity." },
          { t: "Session fixation", d: "Attack that forces a known session identifier on a victim; prevented by issuing a new ID at login." }
        ]
      }
    ],
    traps: [
      "Two passwords are one factor. MFA requires different categories.",
      "OAuth 2.0 authorises; OIDC authenticates. Read whether the question asks about access delegation or identity.",
      "FAR is the security error (wrong person in); FRR is the usability error (right person out).",
      "DAC lets the owner decide; MAC lets labels decide; RBAC lets the role decide; ABAC lets attributes decide.",
      "Kerberos is symmetric and time-sensitive. Clock skew is a real exam answer.",
      "SSO reduces password fatigue but increases the impact of a compromised identity provider.",
      "Provisioning an account is not provisioning access. The lifecycle order is create identity → account → access → authentication → manage → deprovision.",
      "Authentication proves identity; authorization grants access. A valid login with no entitlement is still denied.",
      "A mover must lose the old role's entitlements while gaining the new ones. Access reviews are how that gets caught.",
      "Deprovision access before deleting the account. Live sessions, tokens, and credentials can outlive the record.",
      "A federation trust relationship is not a lifecycle stage; it is a trust agreement between domains."
    ],
    mnemonic: {
      label: "Carry this",
      text: "Know, have, are. OAuth delegates, OIDC identifies, SAML federates. Lifecycle: create → account → access → authenticate → manage → deprovision. Lower CER is better."
    }
  },

  {
    id: 6,
    name: "Security Assessment and Testing",
    short: "Assessment & Testing",
    weight: 12,
    blurb: "How you find out whether the controls actually work — and how you prove it without breaking the business.",
    ask: "Expect scope and authorisation, scan-versus-test distinctions, testing types, and audit evidence.",
    sections: [
      {
        title: "Assessment strategy and governance",
        lead: "The first control in any test is permission. The second is scope.",
        points: [
          "Define the objective, scope, rules of engagement, constraints, contacts, and escalation path in writing before testing.",
          "A vulnerability assessment identifies weaknesses; a penetration test exploits them to demonstrate impact; an audit checks conformity against a standard.",
          "Independence matters. The team that built or operates the system should not be the sole evaluator of its security.",
          "Sampling must be representative and documented. A clean sample of the wrong population proves nothing.",
          "Testing can disrupt operations, corrupt data, or trigger safety issues. Agree windows, rollback, and stop conditions.",
          "Findings need owners, severity, evidence, and remediation dates. A report with no tracked actions is shelfware."
        ],
        terms: [
          { t: "Rules of engagement", d: "Documented boundaries, methods, timing, and escalation for a security test." },
          { t: "Vulnerability assessment", d: "Systematic discovery and ranking of weaknesses, usually without exploitation." },
          { t: "Audit", d: "Independent examination of evidence against defined criteria." }
        ]
      },
      {
        title: "Vulnerability management",
        lead: "Scanning is a detection activity. Vulnerability management is the remediation loop.",
        points: [
          "Discovery inventories assets and services. You cannot manage what you cannot see.",
          "Authenticated (credentialed) scans see installed software and configuration; unauthenticated scans see what an outside attacker sees. Use both.",
          "CVSS gives a severity score for a vulnerability, but organisational risk also depends on exposure, asset criticality, and compensating controls.",
          "CVE identifies a specific vulnerability; NVD enriches it with scoring and references. Vendor advisories add affected versions and fixes.",
          "False positives waste remediation effort; false negatives leave risk. Validate findings and tune scanners.",
          "Prioritise by exploitability and business impact. A critical score on an isolated lab host is not the same as a medium on an internet-facing payment server.",
          "Track age, SLA compliance, exception approvals, and re-test results. Patch, compensate, isolate, or accept — with an owner."
        ],
        terms: [
          { t: "CVSS", d: "Common Vulnerability Scoring System; severity, not a complete risk decision." },
          { t: "CVE", d: "Unique identifier for a publicly known vulnerability." },
          { t: "Authenticated scan", d: "Scan using credentials to inspect configuration and installed packages." },
          { t: "False negative", d: "A real vulnerability the scanner fails to detect." }
        ]
      },
      {
        title: "Penetration testing",
        lead: "A penetration test is a controlled simulation with a business question behind it.",
        points: [
          "Knowledge levels: <strong>black box</strong> (no internal knowledge), <strong>gray box</strong> (partial), <strong>white box</strong> (full knowledge and access).",
          "Awareness levels: <strong>blind</strong> (testers know little, defenders know), <strong>double-blind</strong> (neither side knows), <strong>targeted</strong> (both know).",
          "Phases: planning and reconnaissance, scanning and enumeration, exploitation, post-exploitation and persistence, reporting, and cleanup.",
          "Red teams emulate adversaries over time; blue teams defend; purple teams improve collaboration. A bug bounty is continuous, scoped, external testing.",
          "Never test beyond authorisation. A tester who finds a neighbouring system in scope must stop and report.",
          "Reports should explain impact in business terms, include reproducible evidence, and separate technical detail from executive summary."
        ],
        terms: [
          { t: "Black-box test", d: "Tester has no prior knowledge of the target." },
          { t: "Double-blind test", d: "Neither testers nor most defenders know the test is happening." },
          { t: "Red team", d: "Adversary-emulation team that tests detection and response, not just vulnerabilities." }
        ]
      },
      {
        title: "Software and application testing",
        lead: "Static looks at code; dynamic looks at behaviour; both are more useful together.",
        points: [
          "<strong>SAST</strong> analyses source or binaries without executing them. It finds coding flaws early but produces false positives and misses runtime issues.",
          "<strong>DAST</strong> tests a running application from the outside. It finds exploitable behaviour but may miss code paths and needs good coverage.",
          "<strong>IAST</strong> instruments the running application to combine code-level insight with runtime behaviour.",
          "<strong>SCA</strong> inventories third-party components and maps them to known vulnerabilities and licences.",
          "<strong>Fuzzing</strong> sends malformed or unexpected input to find crashes and validation failures. Mutation-based and generation-based approaches differ in input construction.",
          "Code review is a human control. Fagan inspections are formal, phased reviews with defined roles and follow-up.",
          "Test levels: unit, integration, system, acceptance, regression. Verification asks whether it was built right; validation asks whether the right thing was built."
        ],
        terms: [
          { t: "SAST", d: "Static application security testing; analyses code without running it." },
          { t: "DAST", d: "Dynamic application security testing; probes a running application." },
          { t: "SCA", d: "Software composition analysis; inventories dependencies and known vulnerabilities." },
          { t: "Regression testing", d: "Confirms that changes did not break existing behaviour." }
        ]
      },
      {
        title: "Logging, monitoring, and audit evidence",
        lead: "If it was not logged, it cannot be reconstructed; if the log can be edited, it cannot be trusted.",
        points: [
          "Log authentication, authorisation, configuration changes, data access, and administrative actions. Include who, what, when, where, and outcome.",
          "Centralise logs, normalise time with NTP, restrict access, and protect integrity. Retain for legal, regulatory, and investigative needs.",
          "SIEM correlates events across sources and supports detection and investigation. It is not a substitute for tuned detection content.",
          "Audit trails support accountability and forensics. Protect them from the administrators they record.",
          "Evidence must be relevant, sufficient, reliable, and lawfully obtained. Preserve original media and document every transfer.",
          "SOC 1 and SOC 2 reports provide independent assurance over controls; SOC 2 Type II covers a period, Type I a point in time. Read the scope and exceptions, not just the opinion.",
          "Metrics: coverage, mean time to detect, mean time to remediate, repeat findings, and percentage of assets scanned."
        ],
        terms: [
          { t: "SIEM", d: "Security information and event management; central correlation and alerting." },
          { t: "SOC 2 Type II", d: "Independent report on controls over a period, with testing of operating effectiveness." },
          { t: "Audit trail", d: "Chronological record of activity that supports accountability and investigation." }
        ]
      }
    ],
    traps: [
      "A vulnerability scan finds; a penetration test exploits. Do not promise exploitation from a scan.",
      "SAST needs code; DAST needs a running target. The question's constraint tells you which.",
      "A CVSS 9.8 on an unreachable test host may be lower business risk than a CVSS 6.5 on a payment API.",
      "Certification is a technical evaluation; accreditation is authorisation to operate.",
      "Audit independence is compromised if the auditor reports to the function being audited.",
      "A clean scan is not proof of security — coverage and false negatives matter."
    ],
    mnemonic: {
      label: "Carry this",
      text: "Scan wide, test deep, audit independently. SAST reads, DAST pokes, SCA inventories."
    }
  },

  {
    id: 7,
    name: "Security Operations",
    short: "Operations",
    weight: 13,
    blurb: "Running security day to day: incidents, forensics, backups, monitoring, physical operations, and change.",
    ask: "Expect incident order, evidence handling, backup differences, and the operational control that best prevents recurrence.",
    sections: [
      {
        title: "Operational discipline",
        lead: "Operations is where policy meets reality. Consistency is the control.",
        points: [
          "Least privilege, separation of duties, job rotation, and mandatory vacations apply to administrators as much as users.",
          "Change management: request, assess impact and risk, approve, test, implement, verify, and document. Emergency changes still need retrospective approval.",
          "Configuration management maintains known-good baselines, tracks drift, and supports rollback. It is not the same as change management.",
          "Patch management prioritises by exposure and criticality, not by vendor release date. Compensating controls cover the gap.",
          "Asset inventory and ownership are prerequisites for patching, monitoring, and incident response.",
          "Service levels, MTBF/MTTR, and capacity planning keep availability predictable."
        ],
        terms: [
          { t: "Change management", d: "Controlled process for approving, testing, and recording changes." },
          { t: "Configuration baseline", d: "Approved known-good configuration used to detect drift." },
          { t: "Compensating control", d: "Alternative control that reduces risk when the preferred control is not feasible." }
        ]
      },
      {
        title: "Incident response",
        lead: "Contain first, understand second, restore third — but never at the cost of evidence.",
        points: [
          "The lifecycle: <strong>Prepare, Identify, Contain, Eradicate, Recover, Lessons learned</strong> (PICERL). Some models add detection and reporting as separate steps.",
          "Preparation covers plans, roles, tools, communications, playbooks, and exercises. An incident response plan discovered during the incident is not a plan.",
          "Identification confirms whether an event is an incident, scopes it, and assigns severity. Avoid premature conclusions.",
          "Containment limits spread. Short-term containment isolates; long-term containment stabilises while eradication is planned.",
          "Eradication removes the cause; recovery restores trusted service; lessons learned improves the programme.",
          "Preserve evidence during containment. Pulling the plug can destroy volatile evidence; follow the forensic plan.",
          "Communications must include legal, privacy, executive, and regulator timelines. Do not speculate publicly.",
          "Tabletop exercises and retros reveal gaps that documents hide."
        ],
        terms: [
          { t: "PICERL", d: "Prepare, Identify, Contain, Eradicate, Recover, Lessons learned." },
          { t: "CSIRT", d: "Computer security incident response team with defined roles and authority." },
          { t: "Containment", d: "Actions that stop an incident from spreading while preserving evidence." }
        ]
      },
      {
        title: "Digital forensics",
        lead: "Evidence is fragile. Document everything and change nothing you do not have to.",
        points: [
          "Chain of custody records who handled evidence, when, where, and why. A break in the chain weakens admissibility.",
          "Order of volatility: CPU registers and cache, RAM, swap, network state, running processes, disk, backups, archival media. Collect the most volatile first.",
          "Image media with a write blocker, hash before and after, and work from copies. Document the tool and version.",
          "Evidence types: primary versus secondary, direct versus circumstantial, corroborative, hearsay, and conclusive. Originals are stronger than copies.",
          "Locard's exchange principle: contact leaves traces. Assume the investigator changes the scene.",
          "Legal hold and eDiscovery preserve and collect relevant data under legal authority. Enticement (honeypot) is generally lawful; entrapment induces a crime and is not.",
          "Forensics supports HR, civil, criminal, and regulatory matters. Engage counsel early when privilege and jurisdiction matter."
        ],
        terms: [
          { t: "Chain of custody", d: "Documented record of evidence handling that supports integrity and admissibility." },
          { t: "Order of volatility", d: "Priority for collecting evidence from most to least transient." },
          { t: "Write blocker", d: "Device that prevents writes to evidence media during acquisition." },
          { t: "Entrapment", d: "Inducing a person to commit a crime they had no predisposition to commit; unlawful." }
        ]
      },
      {
        title: "Backup and recovery",
        lead: "A backup is only a backup when it has been restored and verified.",
        points: [
          "<strong>Full</strong> backup copies everything. <strong>Incremental</strong> copies changes since the last backup of any type. <strong>Differential</strong> copies changes since the last full backup.",
          "Restore: full + latest differential needs two sets; full + all incrementals since the full needs the chain. Lose one incremental and the chain breaks.",
          "The 3-2-1 rule: three copies, two media or locations, one offsite. Add offline or immutable copies for ransomware resilience.",
          "Snapshots are not backups; they share the source system and can be corrupted or deleted with it.",
          "Test restores on a schedule and measure whether RTO and RPO are actually met.",
          "Encrypt backups and protect keys separately. A backup is a copy of the data and inherits its classification.",
          "Retention must balance recovery needs, legal hold, cost, and privacy obligations."
        ],
        terms: [
          { t: "Incremental backup", d: "Copies data changed since the last backup of any type; smallest backup, longest restore chain." },
          { t: "Differential backup", d: "Copies data changed since the last full backup; larger than incremental, simpler restore." },
          { t: "Immutable backup", d: "Backup that cannot be altered or deleted during its retention period." },
          { t: "3-2-1 rule", d: "Three copies, two media/locations, one offsite." }
        ]
      },
      {
        title: "Monitoring, detection, and response",
        lead: "Detection depends on a baseline. Without normal, everything looks like an anomaly.",
        points: [
          "Define baselines for network, system, application, and user behaviour. Alert on meaningful deviation, not noise.",
          "Clipping levels set the threshold at which an event becomes noteworthy. Tune to reduce false positives while preserving coverage.",
          "SIEM, IDS/IPS, EDR, and UEBA provide different views. Correlate them; do not drown in duplicate alerts.",
          "NTP synchronisation is essential for correlation and forensics. Inconsistent time undermines both.",
          "Log retention must satisfy investigation, legal, and regulatory needs. Protect logs from tampering and unauthorised access.",
          "Honeypots and canary tokens provide high-signal detection with low false-positive rates.",
          "Threat intelligence should be actionable and contextual. IoCs age quickly; TTPs last longer."
        ],
        terms: [
          { t: "Clipping level", d: "Threshold used to distinguish reportable events from background noise." },
          { t: "UEBA", d: "User and entity behaviour analytics; detects anomalies against learned baselines." },
          { t: "IoCs", d: "Indicators of compromise such as hashes, domains, and IP addresses." }
        ]
      },
      {
        title: "Physical operations and malware",
        lead: "Operations includes the building, the media, and the code running on the endpoint.",
        points: [
          "Control visitor access, escort guests, log entry and exit, and separate public, working, and restricted areas.",
          "Media handling: label, track, store securely, sanitise before reuse, and destroy at end of life.",
          "Fire detection and suppression must match the environment. People first; protect equipment second.",
          "Power and cooling failures cause outages and data corruption. Monitor, alarm, test, and maintain.",
          "Malware categories: virus (needs a host), worm (self-propagating), trojan (disguised), ransomware (extortion), rootkit (stealth), spyware (collection), logic bomb (triggered).",
          "Controls: patching, allowlisting, EDR, email filtering, sandboxing, user awareness, least privilege, and segmentation.",
          "Supply-chain attacks target trust in updates and vendors. Verify signatures, pin dependencies, and monitor supplier advisories."
        ],
        terms: [
          { t: "Rootkit", d: "Malware that hides its presence, often at kernel, boot, or firmware level." },
          { t: "Application allowlisting", d: "Permits only approved executables to run; strong against unknown malware." },
          { t: "Logic bomb", d: "Malicious code triggered by a condition or date." }
        ]
      }
    ],
    traps: [
      "Incremental is since the last backup of any type; differential is since the last full. Restore chains differ.",
      "Collect volatile evidence first — RAM before disk, disk before backups.",
      "Enticement is a honeypot; entrapment induces the crime. Only one is lawful.",
      "Containment comes before eradication. Do not rebuild before you understand scope.",
      "A snapshot is not an independent backup.",
      "Emergency change still requires documentation and retrospective approval."
    ],
    mnemonic: {
      label: "Carry this",
      text: "PICERL. Volatile first: registers, RAM, swap, network, disk. Full + differential = two sets; full + incrementals = a chain."
    }
  },

  {
    id: 8,
    name: "Software Development Security",
    short: "Software Security",
    weight: 10,
    blurb: "Building security into the lifecycle instead of bolting it on after release.",
    ask: "Expect SDLC models, OWASP-class flaws, testing types, database risks, and change control.",
    sections: [
      {
        title: "SDLC and delivery models",
        lead: "Every model has a place. The exam asks which one fits the risk and feedback profile.",
        points: [
          "<strong>Waterfall</strong> is linear and document-heavy; each phase completes before the next. It is predictable but slow to change.",
          "<strong>V-shaped</strong> pairs each development phase with a verification or validation activity. Testing is planned early.",
          "<strong>Spiral</strong> is iterative and risk-driven; each loop includes risk analysis. Good for large, uncertain projects.",
          "<strong>Agile</strong> delivers in increments with continuous feedback. Security must be embedded in backlog refinement and definition of done.",
          "DevOps merges development and operations; DevSecOps adds security as a shared, automated responsibility across the pipeline.",
          "CI/CD automates build, test, and deployment. Security gates must be fast, deterministic, and hard to bypass.",
          "Shift left means finding issues earlier, where they are cheaper and less risky to fix — not adding a single scan at the end."
        ],
        terms: [
          { t: "SDLC", d: "Structured lifecycle for requirements, design, build, test, deploy, and maintain." },
          { t: "DevSecOps", d: "Integration of security practices and automation into DevOps delivery." },
          { t: "Shift left", d: "Moving security activities earlier in the lifecycle." }
        ]
      },
      {
        title: "Requirements, design, and threat modelling",
        lead: "Threat modelling is structured imagination: what can go wrong, and what will we do about it?",
        points: [
          "Security requirements should be testable: confidentiality, integrity, availability, authentication, authorization, logging, and privacy.",
          "<strong>STRIDE</strong>: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.",
          "Threat modelling steps: understand the system, identify threats, assess likelihood and impact, decide mitigations, and track them.",
          "Attack surface is the set of reachable entry points. Reduce it before defending it.",
          "Privacy by design: minimise data, limit purpose, embed controls, and default to the most protective setting.",
          "Security gates in the pipeline: dependency review, secret scanning, SAST, container scanning, policy checks, and approval for high-risk changes.",
          "Architecture review catches missing trust boundaries that code scanning cannot see."
        ],
        terms: [
          { t: "STRIDE", d: "Threat classification: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege." },
          { t: "Attack surface", d: "All points where an attacker can interact with the system." },
          { t: "Security gate", d: "Automated or manual checkpoint that must pass before delivery proceeds." }
        ]
      },
      {
        title: "Secure coding and application threats",
        lead: "Most application breaches use valid functionality in an invalid way. Validate input, encode output, and enforce authorization server-side.",
        points: [
          "<strong>Injection</strong> (SQL, command, LDAP) occurs when untrusted input becomes code or a query. Use parameterised queries and allowlists.",
          "<strong>XSS</strong> injects script into pages viewed by others. Encode output, use a strict content security policy, and avoid unsafe DOM APIs.",
          "<strong>CSRF</strong> makes a logged-in browser perform an unintended action. Use anti-CSRF tokens and SameSite cookies.",
          "<strong>SSRF</strong> tricks the server into making requests to internal or metadata endpoints. Validate destinations and restrict egress.",
          "<strong>IDOR</strong> exposes objects by predictable identifiers. Enforce authorization on every object access, not just the route.",
          "Insecure deserialization, broken access control, security misconfiguration, vulnerable components, and credential stuffing round out the OWASP risk set.",
          "Never store secrets in source or images. Use a secret manager, rotate on exposure, and scan history as well as the working tree.",
          "Supply chain: generate an SBOM, pin and verify dependencies, review licences, and monitor advisories."
        ],
        terms: [
          { t: "Parameterised query", d: "Query where input is bound as data, not concatenated into code; prevents SQL injection." },
          { t: "CSP", d: "Content Security Policy; restricts which scripts and resources a page may load." },
          { t: "SBOM", d: "Software bill of materials; inventory of components and dependencies." },
          { t: "IDOR", d: "Insecure direct object reference; missing authorization on an object identifier." }
        ]
      },
      {
        title: "Testing and assurance",
        lead: "No single test finds everything. Combine code review, automated analysis, runtime testing, and human curiosity.",
        points: [
          "SAST at commit, SCA on dependencies, secret scanning on every push, DAST against a running environment, and manual testing for business logic.",
          "Test the security requirements, not just the happy path. Abuse cases and negative tests reveal missing controls.",
          "Code review is most effective when the reviewer did not write the code. Use checklists for common flaw classes and authorisation paths.",
          "Fuzzing and property-based testing find input-handling defects that example-based tests miss.",
          "Acceptance testing confirms the system meets requirements and is fit for operation; regression testing confirms change did not break it.",
          "Verification: are we building the product right? Validation: are we building the right product?",
          "Production monitoring and vulnerability disclosure close the loop after release."
        ],
        terms: [
          { t: "Abuse case", d: "Test scenario describing how an attacker could misuse a feature." },
          { t: "Fuzzing", d: "Automated testing with malformed or unexpected inputs." },
          { t: "Verification", d: "Confirms the implementation matches specifications." },
          { t: "Validation", d: "Confirms the product meets the user's actual need." }
        ]
      },
      {
        title: "Data and database security",
        lead: "Databases concentrate value, so they concentrate risk. Understand the transaction and the query.",
        points: [
          "<strong>ACID</strong>: atomicity (all or nothing), consistency (valid state transitions), isolation (concurrent transactions do not interfere), durability (committed data survives failure).",
          "<strong>Aggregation</strong> combines separately authorised data to reveal more than either piece. <strong>Inference</strong> deduces restricted information from permitted results.",
          "Controls for aggregation and inference: cell suppression, generalisation, k-anonymity, query limits, and polyinstantiation.",
          "<strong>Polyinstantiation</strong> stores multiple versions at different classification levels to prevent inference and update conflicts.",
          "Database views restrict rows and columns; stored procedures encapsulate logic; least-privilege accounts limit impact.",
          "Normalisation reduces redundancy and update anomalies; denormalisation can improve performance but increases inconsistency risk. Neither is a security control by itself.",
          "Encrypt data at rest, protect backups, audit privileged queries, and mask data in non-production environments.",
          "Data warehousing combines sources for analysis; data mining finds patterns. Both increase the value of aggregation and the need for governance."
        ],
        terms: [
          { t: "ACID", d: "Atomicity, consistency, isolation, durability — transaction guarantees." },
          { t: "Aggregation", d: "Combining data from multiple sources to derive information the user is not entitled to." },
          { t: "Inference", d: "Deducing restricted information from authorised query results." },
          { t: "Polyinstantiation", d: "Maintaining multiple classified versions of the same record." }
        ]
      },
      {
        title: "Change, configuration, and acquired software",
        lead: "Most production incidents are changes. Control the change and you control much of the risk.",
        points: [
          "Change control: request, impact assessment, approval, testing, implementation, verification, and documentation. Emergency changes are reviewed after the fact.",
          "Configuration management tracks versions, baselines, and drift. Infrastructure as code should be reviewed and versioned like application code.",
          "Release control confirms that only approved changes reach production. Separation of duties between developer and deployer reduces risk.",
          "Acquired software: assess the vendor, review contracts and assurance reports, test in isolation, and plan for updates and end of life.",
          "Open-source components carry licence, maintenance, and vulnerability obligations. A component without an owner is a liability.",
          "Software escrow protects continuity if a vendor fails, but it is not a substitute for due diligence.",
          "Decommissioning must remove data, credentials, integrations, and DNS records — not just power off the server."
        ],
        terms: [
          { t: "Change control", d: "Formal process for assessing, approving, and verifying changes." },
          { t: "Release control", d: "Ensures only approved, tested changes are deployed." },
          { t: "Software escrow", d: "Third-party custody of source code or materials for continuity if a vendor fails." },
          { t: "COTS", d: "Commercial off-the-shelf software; acquired, configured, and maintained rather than built." }
        ]
      }
    ],
    traps: [
      "Aggregation combines data; inference deduces from results. Both are disclosure risks.",
      "SAST reads code; DAST exercises a running app; SCA inventories dependencies. Match the constraint.",
      "Verification is 'built right'; validation is 'right thing built'.",
      "Input validation helps, but output encoding is the defence against XSS.",
      "Authentication is not authorization. IDOR is an authorization failure.",
      "A snapshot is not a backup, and a scan is not a penetration test."
    ],
    mnemonic: {
      label: "Carry this",
      text: "Build it in, don't bolt it on. Validate input, encode output, authorize every object. ACID keeps transactions honest."
    }
  }
];

/* --------------------------------------------------------------------------
   Mindset primer — the part most practice questions actually test
   -------------------------------------------------------------------------- */

CISSP.mindset = {
  intro: "CISSP is a management exam wearing a technical vocabulary. Many candidates know the technology and still fail because they answer as an engineer. The exam wants the best decision for the business, in the role described, at the point in the process the question asks about.",
  rules: [
    {
      title: "Read the role before the technology",
      body: "Ask who is speaking. A security analyst, a data owner, a CISO, and a CEO have different authority. If the question asks what the security manager should do, the answer is rarely to configure a device personally. It is to advise, document, escalate, or ensure someone accountable decides."
    },
    {
      title: "People, then process, then technology",
      body: "When several answers would work, prefer the one that addresses the human or governance cause. A policy, training programme, or role clarification usually outranks a new tool — especially when the question describes a repeated behaviour or an unclear responsibility."
    },
    {
      title: "Choose the most complete answer",
      body: "If all four options are true, the best answer is usually the most general one that includes the others. 'Implement a risk management programme' can outrank 'buy an IPS' because the programme covers the IPS decision. Watch for answers that solve one symptom."
    },
    {
      title: "Answer the question that was asked",
      body: "FIRST, BEST, PRIMARY, MOST, LEAST, and NEXT are different questions. The first step in incident response is not eradication. The primary purpose of a control may not be its most obvious effect. Underline the operative word before evaluating options."
    },
    {
      title: "Prefer prevention, but do not force it",
      body: "Preventive controls usually beat corrective ones when the question asks how to reduce the likelihood of recurrence. But when an incident is in progress, containment beats prevention. When the question asks what to do first, assessment often beats action."
    },
    {
      title: "Risk decisions belong to the business",
      body: "The security team identifies and quantifies risk. Senior management or the data owner accepts it. If an option has a technician accepting residual risk, it is wrong no matter how sensible it sounds."
    },
    {
      title: "Assess before you act",
      body: "Questions that begin with a new regulation, a merger, or an unfamiliar system usually want an assessment, gap analysis, or BIA before a control. You cannot scope a solution until you know the risk and the requirement."
    },
    {
      title: "Do not confuse compliance with security",
      body: "A passed audit is evidence, not immunity. The best answer protects the asset and satisfies the obligation. An answer that only produces a document, or only buys a tool, is usually incomplete."
    },
    {
      title: "Protect life, then mission, then data",
      body: "Physical safety outranks property. Business continuity outranks a tidy investigation. When options conflict, the order is people, critical operations, data, then systems. An answer that risks a person to save a server is wrong."
    },
    {
      title: "Beware absolutes and attractive specifics",
      body: "Words like always, never, only, and immediately are often traps. So is the answer that names a specific product when the question is about governance. The exam rewards proportionate, defensible judgment, not heroic action."
    }
  ],
  verbs: [
    { verb: "FIRST", meaning: "The earliest correct action in a sequence — often assess, document, notify, or contain, not fix." },
    { verb: "BEST", meaning: "The most appropriate option given the role, constraints, and business context. Several may be true." },
    { verb: "PRIMARY", meaning: "The main purpose or owner. Do not choose a secondary benefit." },
    { verb: "MOST", meaning: "The greatest contribution to the stated outcome, not the most technical option." },
    { verb: "LEAST", meaning: "The option that is least appropriate or least likely. Read it twice; candidates often answer MOST by habit." },
    { verb: "NEXT", meaning: "The immediate following step in an established process." }
  ],
  technical: [
    {
      title: "You see the vulnerability. The exam sees a risk decision.",
      body: "Your instinct is to patch, block, or exploit. The exam first asks who owns the asset, what the business impact is, and who accepts the residual risk. When the question says FIRST, assessment or escalation usually beats remediation."
    },
    {
      title: "You know the fix. The exam asks who decides.",
      body: "A security engineer can recommend, design, and implement. A data owner or senior manager accepts risk. If an option has a technician accepting residual risk, eliminate it even when the technical action is correct."
    },
    {
      title: "You choose the tool. The exam wants the programme.",
      body: "When all four options would work, the most complete governance answer often wins: policy, training, risk assessment, architecture review, or a management programme. A specific product is usually a distractor unless the question asks for a control at that layer."
    },
    {
      title: "You answer like a red teamer. The exam wants a blue-team manager.",
      body: "Do not hack back, do not go heroically around change control, and do not trade a person's safety for an asset. Detect, contain, report, recover, and improve. The best answer is defensible, proportionate, and boring."
    }
  ],
  worked: {
    stem: "A developer deploys an application that stores customer records without encryption. The security manager discovers the issue after go-live. What should the security manager do FIRST?",
    options: [
      { letter: "A", text: "Encrypt the database immediately.", note: "Technically desirable, but the manager may not own the change and has not assessed scope or risk." },
      { letter: "B", text: "Assess the exposure, data sensitivity, and applicable obligations, then escalate to the data owner.", note: "Correct. The manager establishes facts and routes the risk decision to the accountable owner before committing to a fix." },
      { letter: "C", text: "Suspend the developer pending investigation.", note: "Punitive and premature; the facts do not yet establish misconduct." },
      { letter: "D", text: "Report the company to the regulator.", note: "There is no evidence that notification thresholds are met, and internal escalation comes first." }
    ],
    note: "Notice the pattern: the best answer is not the most technical. It assesses, respects ownership, and keeps the manager in the manager's lane."
  }
};

/* --------------------------------------------------------------------------
   Four-week study route for a candidate sitting the exam in 28 days
   -------------------------------------------------------------------------- */

CISSP.studyPlan = {
  intro: "The final four weeks are for retrieval, simulation, and repair — not for starting a new textbook. You already have the material. This route turns it into decisions under time pressure.",
  weeks: [
    {
      theme: "Risk, governance, and the asset register",
      focus: "Domains 1–2 · 26% of the exam",
      domains: [1, 2],
      summary: "Build the management spine first. Risk language, ownership, continuity, and privacy decisions show up inside questions from every other domain.",
      actions: [
        "Read the Domain 1 and 2 notes. Close the page and say the traps out loud.",
        "Take the 20-question diagnostic now, before the week fills up. Write down the two weakest domains.",
        "Run one 15-question domain drill after each set of notes, then re-answer every miss.",
        "Start the card queue at 24 a day. Keep the definitions precise — the exam uses them as traps."
      ],
      milestone: "You can explain risk treatment, BIA/RTO/RPO, data ownership, retention, and sanitisation without looking."
    },
    {
      theme: "Architecture, networks, and identity",
      focus: "Domains 3–5 · 39% of the exam",
      domains: [3, 4, 5],
      summary: "This is the technical middle of the exam. Learn the direction rules and protocol choices cold, then practise choosing them inside a scenario.",
      actions: [
        "Read Domains 3–5. Sketch Bell-LaPadula vs Biba, AH vs ESP, and WPA2-Personal vs Enterprise from memory.",
        "Do one 15-question drill after each domain. If a question surprises you, bookmark it and revisit it in three days.",
        "Use the official study guide's end-of-chapter questions if you have them. Log every miss by domain, not by page.",
        "Keep 24 cards a day. Add the terms you keep confusing to your bookmarks."
      ],
      milestone: "You can choose the right model, protocol, and access-control scheme in a scenario — and explain why the other three are worse."
    },
    {
      theme: "Assessment, operations, software — and the first full mock",
      focus: "Domains 6–8 · 35% of the exam",
      domains: [6, 7, 8],
      summary: "Finish the coverage, then find out what the exam actually does to your timing. The first mock is a diagnostic, not a verdict.",
      actions: [
        "Read Domains 6–8. Focus on PICERL, order of volatility, backup types, ACID, and the OWASP-class flaws.",
        "Take one timed 125-question mock this week — the site mock or one official practice test. Use the three-hour limit and no notes.",
        "Review every miss, not just the score. Sort them into 'did not know', 'knew but misread', and 'narrowed to two and chose wrong'.",
        "Read the manager's-lens primer once before bed. It changes how you read the next set."
      ],
      milestone: "You have a timed baseline, a domain breakdown, and a named list of the three domains that need the final week."
    },
    {
      theme: "Repair, simulate, taper",
      focus: "Your weakest domains · the whole register",
      domains: [],
      summary: "Stop adding new material. Repair the misses, protect your sleep, and rehearse the timing plan you will use on exam day.",
      actions: [
        "Spend the first four days on your two weakest domains and the missed-question log.",
        "Take a second timed mock by midweek — use a different official practice test if you have one. After it, do not start another new topic.",
        "Re-read the traps, mnemonics, and the manager's lens. Keep the card queue to 24 a day.",
        "Final two days: confirm the appointment, ID, and travel; sleep; do one light 10-question drill. No all-nighters."
      ],
      milestone: "You arrive rested with a repeatable plan: answer every question, flag only when the interface allows it, and never leave a blank."
    }
  ],
  daily: [
    { time: "20 min", title: "Read one section", body: "Then close the page and explain it without looking. If you cannot, that section is tomorrow's first review." },
    { time: "20 min", title: "Run ten questions", body: "Mixed or weak-area. Write one sentence for every miss: the property, the role, or the operative verb you missed." },
    { time: "10 min", title: "Clear 24 cards", body: "Grade honestly. Again means the definition was not on the tip of your tongue; it returns tomorrow." },
    { time: "10 min", title: "Repair two misses", body: "Re-answer two questions from yesterday before starting anything new. Spaced repair beats rereading." }
  ],
  examDay: [
    "The English CISSP is a computerised adaptive test: 100–150 questions, three hours, pass mark 700/1000.",
    "The real CAT does not let you go back and change answers. Treat every answer as final. The flag button on this site is a practice aid, not a CAT feature.",
    "Pace at roughly 70–90 seconds per question. If a question is taking too long, choose the best answer, submit, and move.",
    "Read the role and the operative verb first. If all four options are true, choose the most complete one.",
    "People before process before technology. Risk is accepted by the business, not the analyst.",
    "Peace of Mind is insurance, not a study plan. Prepare for 30 November as if it is the only attempt."
  ]
};
