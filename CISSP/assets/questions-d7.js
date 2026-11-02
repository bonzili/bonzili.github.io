/* Domain 7 — Security Operations. Original practice questions. */
(window.CISSP = window.CISSP || {}).questions = (window.CISSP.questions || []).concat([
  {
    id: "d7q1", d: 7, topic: "Incident response", diff: 1,
    stem: "Ransomware is actively spreading across file servers. The incident response team has confirmed the scope and identified affected hosts. What should the team do next?",
    options: ["Rebuild all affected servers", "Contain the spread by isolating affected network segments", "Notify the media", "Conduct a full forensic analysis of every host"],
    answer: 1,
    whyText: "After identification, containment limits further damage. Eradication and recovery come after the spread is controlled and evidence is preserved.",
    lens: "PICERL: prepare, identify, contain, eradicate, recover, lessons learned. Do not rebuild before you contain.",
    why: { 0: "Rebuilding is a recovery action and may destroy evidence before containment.", 2: "External communications need a planned, authorised message.", 3: "Full analysis can follow containment; it should not delay stopping the spread." }
  },
  {
    id: "d7q2", d: 7, topic: "Order of volatility", diff: 2,
    stem: "A forensic team arrives at a compromised server that is still running. Which evidence should be collected first?",
    options: ["The backup tapes from last week", "The contents of RAM and running process state", "The server's hard disk image", "The archived log files"],
    answer: 1,
    whyText: "Volatile evidence disappears when power is lost or the system changes. Collect registers, cache, RAM, and running process state before disk and archival media.",
    lens: "Order of volatility: registers/cache → RAM → swap → network state → disk → backups → archives.",
    why: { 0: "Backup tapes are stable and can be collected later.", 2: "The disk is less volatile than memory.", 3: "Archived logs are already stored elsewhere." }
  },
  {
    id: "d7q3", d: 7, topic: "Chain of custody", diff: 1,
    stem: "What is the primary purpose of a chain-of-custody record?",
    options: ["To prove that evidence is relevant to the case", "To document who handled evidence, when, where, and why, preserving its integrity", "To encrypt the evidence", "To identify the suspect"],
    answer: 1,
    whyText: "The chain of custody is an auditable record of control over evidence. It supports integrity and admissibility by showing that the evidence was not altered or accessed without documentation.",
    lens: "Relevance and reliability are separate questions. Chain of custody answers whether the evidence can be trusted as the same item collected.",
    why: { 0: "Relevance is a legal attribute of the evidence, not the purpose of the chain record.", 2: "Encryption may protect evidence but does not document custody.", 3: "The chain does not identify the suspect." }
  },
  {
    id: "d7q4", d: 7, topic: "Evidence preservation", diff: 2,
    stem: "A compromised workstation is still running, and the responder wants to preserve volatile evidence while stopping further malicious activity. Which action is most appropriate?",
    options: ["Pull the power cord immediately", "Disconnect the network cable and follow the forensic collection procedure", "Reinstall the operating system", "Delete the suspicious files"],
    answer: 1,
    whyText: "Disconnecting the network stops remote command and control and lateral movement while preserving memory and running state. Powering off destroys volatile evidence.",
    lens: "Contain the network, preserve the host. Pulling the plug is fast but forensically destructive.",
    why: { 0: "Powering off loses RAM and process state.", 2: "Reinstalling destroys evidence.", 3: "Deleting files destroys evidence and may trigger attacker countermeasures." }
  },
  {
    id: "d7q5", d: 7, topic: "Backup types", diff: 2,
    stem: "A backup job copies only the files changed since the most recent backup of any type. What type of backup is this?",
    options: ["Full", "Incremental", "Differential", "Snapshot"],
    answer: 1,
    whyText: "An incremental backup captures changes since the last backup of any type. A differential backup captures changes since the last full backup.",
    lens: "Incremental = since any backup. Differential = since the last full. Restore chains differ accordingly.",
    why: { 0: "A full backup copies all selected data.", 2: "A differential is cumulative since the last full.", 3: "A snapshot captures a point-in-time state and is not a backup type in this sense." }
  },
  {
    id: "d7q6", d: 7, topic: "Restore chains", diff: 2,
    stem: "A full backup runs on Sunday. Differential backups run Monday, Tuesday, and Wednesday. The system fails on Thursday morning. Which sets are needed to restore Wednesday's state?",
    options: ["Sunday full only", "Sunday full and Wednesday differential", "Sunday full and every differential from Monday through Wednesday", "Wednesday differential only"],
    answer: 1,
    whyText: "A differential contains all changes since the last full backup, so the full plus the latest differential restores the state through Wednesday. Incremental backups would require the full and each incremental in sequence.",
    lens: "Differential restore = full + latest differential. Incremental restore = full + every incremental since the full.",
    why: { 0: "The full alone loses Monday through Wednesday changes.", 2: "That describes an incremental chain, not differentials.", 3: "A differential requires the base full backup." }
  },
  {
    id: "d7q7", d: 7, topic: "Backup strategy", diff: 1,
    stem: "A small firm keeps three nightly backups on the same RAID array in the same server room. A consultant says the design does not meet the 3-2-1 rule. What does the rule recommend?",
    options: ["Three administrators, two passwords, one backup", "Three copies of data, on two different media or locations, with one copy offsite", "Three full backups per week and two differentials", "Three sites, two clouds, one tape"],
    answer: 1,
    whyText: "3-2-1 means three copies, two media or locations, and one offsite. Many programmes add an offline or immutable copy for ransomware resilience.",
    lens: "The rule is about redundancy across copies and locations, not a schedule.",
    why: { 0: "The numbers refer to copies and media, not people or passwords.", 2: "The rule is not a weekly backup schedule.", 3: "It is not a prescribed mix of site types." }
  },
  {
    id: "d7q8", d: 7, topic: "Snapshots", diff: 2,
    stem: "Why is a storage snapshot not a complete backup strategy?",
    options: ["Snapshots cannot be restored", "Snapshots typically depend on the same storage system and can be lost or corrupted with the source", "Snapshots are always unencrypted", "Snapshots can only be taken once a year"],
    answer: 1,
    whyText: "Snapshots provide fast point-in-time recovery but usually reside on or depend on the same platform. Ransomware or storage failure can affect both the source and the snapshots, so independent copies are still required.",
    lens: "A snapshot is a recovery convenience, not an independent copy. Ask where it lives and who can delete it.",
    why: { 0: "Snapshots are restorable.", 2: "Encryption depends on configuration.", 3: "Frequency is not the defining limitation." }
  },
  {
    id: "d7q9", d: 7, topic: "Change management", diff: 2,
    stem: "A critical vulnerability requires an emergency production change outside the normal approval window. What is the most appropriate approach?",
    options: ["Skip all documentation because it is urgent", "Implement under the emergency change procedure with authorised approval and retrospective documentation", "Wait for the next monthly change board", "Let the developer deploy without notifying operations"],
    answer: 1,
    whyText: "Emergency changes still need an accountable approval path, testing proportionate to risk, and documentation. The emergency procedure exists to compress timelines without eliminating control.",
    lens: "Urgency changes the process timing, not the need for accountability. Retrospective review is still review.",
    why: { 0: "Undocumented changes destroy traceability and increase risk.", 2: "Waiting may leave a critical exposure open.", 3: "Uncoordinated deployment creates operational and security risk." }
  },
  {
    id: "d7q10", d: 7, topic: "Configuration management", diff: 2,
    stem: "Which activity is the primary purpose of configuration management?",
    options: ["Approving changes to production", "Maintaining known-good baselines and detecting configuration drift", "Encrypting backups", "Testing incident response plans"],
    answer: 1,
    whyText: "Configuration management defines, tracks, and verifies the configuration of systems against approved baselines. Change management governs changes; the two are complementary.",
    lens: "Change management asks permission; configuration management proves the resulting state and detects drift.",
    why: { 0: "That is change management.", 2: "Backup encryption is a data-protection control.", 3: "Plan testing belongs to incident response and BCP." }
  },
  {
    id: "d7q11", d: 7, topic: "Patch prioritisation", diff: 2,
    stem: "A team has limited maintenance time and must choose among four patches. Which should generally be prioritised first?",
    options: ["A low-risk patch for an internal reporting tool", "A critical remote-code-execution patch for an internet-facing service", "A cosmetic update for a developer workstation", "A patch that is difficult to test"],
    answer: 1,
    whyText: "Prioritise by exposure and impact. An internet-facing critical remote-code-execution flaw is both reachable and severe. Testing difficulty is a constraint, not a reason to defer a critical exposure.",
    lens: "Patch priority = severity × exposure × asset criticality. Internet-facing critical flaws rise to the top.",
    why: { 0: "Low risk and internal exposure make this lower priority.", 2: "Cosmetic changes do not reduce meaningful risk.", 3: "Difficulty is a planning issue, not a severity signal." }
  },
  {
    id: "d7q12", d: 7, topic: "Physical safety", diff: 1,
    stem: "A fire is detected in a data centre. What is the first priority?",
    options: ["Protect the servers from water damage", "Evacuate people and account for them", "Preserve forensic evidence", "Notify the insurance company"],
    answer: 1,
    whyText: "Life safety always outranks asset protection. Evacuation and accounting for personnel come first; suppression and recovery follow.",
    lens: "People, then mission, then data, then systems. An answer that risks a person to save equipment is wrong.",
    why: { 0: "Equipment protection is secondary to human safety.", 2: "Evidence preservation is important but not before evacuation.", 3: "Insurance notification follows the emergency response." }
  },
  {
    id: "d7q13", d: 7, topic: "Malware types", diff: 1,
    stem: "Which type of malware self-propagates across networks without requiring a host file or user action?",
    options: ["Virus", "Worm", "Trojan", "Logic bomb"],
    answer: 1,
    whyText: "A worm self-propagates by exploiting network services or user behaviour, without attaching to a host file. A virus requires a host and often user action.",
    lens: "Virus needs a host; worm spreads on its own; trojan disguises; logic bomb waits for a trigger.",
    why: { 0: "A virus attaches to a host file and typically needs execution.", 2: "A trojan disguises itself as legitimate software.", 3: "A logic bomb triggers on a condition or date." }
  },
  {
    id: "d7q14", d: 7, topic: "Ransomware resilience", diff: 2,
    stem: "Which backup characteristic best protects an organisation from ransomware that encrypts connected systems?",
    options: ["Backups stored on the same domain with domain-admin access", "Immutable, offline copies that cannot be altered or deleted during retention", "Backups compressed to save space", "Backups taken once a year"],
    answer: 1,
    whyText: "Ransomware often targets backups and credentials. Immutable, offline copies resist deletion or encryption and allow recovery without paying.",
    lens: "Assume the attacker will reach your backup system. Design a copy they cannot change.",
    why: { 0: "Domain-admin access makes the backups a likely target.", 2: "Compression does not protect against deletion or encryption.", 3: "Annual backups are far too infrequent." }
  },
  {
    id: "d7q15", d: 7, topic: "Rootkits", diff: 2,
    stem: "Why is a rootkit difficult to detect with antivirus software running on the infected host?",
    options: ["It only affects network devices", "It can hide its presence by subverting the operating system or firmware", "It is always encrypted with AES-256", "It only runs after a user logs in"],
    answer: 1,
    whyText: "Rootkits operate at kernel, boot, or firmware level and can intercept the very mechanisms used to detect them. Offline scanning, trusted boot, and integrity verification are valuable.",
    lens: "You cannot trust a compromised host to report its own compromise. Verify from outside or below.",
    why: { 0: "Rootkits commonly target endpoints and servers.", 2: "Encryption is not the defining evasion technique.", 3: "Rootkits can load before login." }
  },
  {
    id: "d7q16", d: 7, topic: "SIEM", diff: 1,
    stem: "What is the primary value of a security information and event management (SIEM) system?",
    options: ["It replaces the need for endpoint protection", "It centralises and correlates events across sources to support detection and investigation", "It encrypts all network traffic", "It automatically patches operating systems"],
    answer: 1,
    whyText: "A SIEM collects and normalises logs from many sources, correlates events, and supports alerting and investigation. It depends on good data and tuned detection content.",
    lens: "SIEM is correlation and visibility, not prevention. It is only as good as the logs and rules it receives.",
    why: { 0: "Endpoint protection remains necessary.", 2: "SIEM does not encrypt traffic.", 3: "Patch management is a separate control." }
  },
  {
    id: "d7q17", d: 7, topic: "Clipping levels", diff: 2,
    stem: "What is the purpose of a clipping level in event monitoring?",
    options: ["To encrypt log entries", "To set a threshold above which events are considered noteworthy and actionable", "To delete old logs automatically", "To block all traffic above a bandwidth limit"],
    answer: 1,
    whyText: "A clipping level establishes a baseline threshold for reportable events, reducing noise while preserving detection of meaningful deviations.",
    lens: "Too low a threshold drowns the team; too high misses attacks. Clipping levels are a tuning decision.",
    why: { 0: "Encryption is separate from thresholding.", 2: "Retention is governed by log-management policy.", 3: "Network rate limiting is a different control." }
  },
  {
    id: "d7q18", d: 7, topic: "Enticement and entrapment", diff: 2,
    stem: "An organisation deploys a honeypot that appears to contain valuable data, hoping an intruder will access it and reveal their methods. Which statement is correct?",
    options: ["This is entrapment and is always illegal", "This is enticement and is generally lawful when it does not induce the initial crime", "It is illegal because honeypots collect personal data", "It is lawful only if the intruder is an employee"],
    answer: 1,
    whyText: "Enticement lures someone who is already predisposed to intrude. Entrapment induces a person to commit a crime they would not otherwise commit. A honeypot is generally enticement.",
    lens: "Enticement = opportunity. Entrapment = creation of the criminal intent. Keep the distinction clean.",
    why: { 0: "A honeypot is not automatically entrapment.", 2: "Honeypots can be designed to avoid collecting personal data, but that is not the core legal distinction.", 3: "The rule is not limited to employees." }
  },
  {
    id: "d7q19", d: 7, topic: "Recovery sites", diff: 1,
    stem: "Which recovery site is fully equipped with hardware, software, and network connectivity and can take over operations quickly?",
    options: ["Cold site", "Warm site", "Hot site", "Reciprocal agreement"],
    answer: 2,
    whyText: "A hot site is ready to operate with minimal setup. It is the fastest and most expensive option. Warm sites are partially equipped; cold sites provide space and basic infrastructure.",
    lens: "Hot = ready now; warm = partial; cold = space and power. Cost rises with readiness.",
    why: { 0: "A cold site lacks the equipment needed for immediate operation.", 1: "A warm site is partially equipped and needs more setup.", 3: "A reciprocal agreement shares another organisation's facility and may not be immediately available." }
  },
  {
    id: "d7q20", d: 7, topic: "Lessons learned", diff: 1,
    stem: "After an incident is contained and service is restored, what should happen during the lessons-learned phase?",
    options: ["Delete all incident records to reduce liability", "Review the response, identify root causes and gaps, and update plans and controls", "Immediately discipline the responders", "Publish the names of affected users"],
    answer: 1,
    whyText: "Lessons learned turns the incident into improvement: timeline review, root cause, control gaps, communication effectiveness, and tracked actions. Documentation also supports legal and regulatory needs.",
    lens: "Recovery is not the end of the lifecycle. The last step is where the next incident becomes cheaper.",
    why: { 0: "Records may be required for legal, regulatory, and learning purposes.", 2: "Discipline without analysis is premature and discourages reporting.", 3: "Publishing affected identities would create additional harm." }
  }
]);
