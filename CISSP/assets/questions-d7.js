/* Domain 7 — Security Operations. Original practice questions. */
(window.CISSP = window.CISSP || {}).questions = (window.CISSP.questions || []).concat([
  {
    id: "d7q1", d: 7, topic: "Incident response", diff: 1,
    stem: "Ransomware is actively spreading across file servers. The incident response team has confirmed the scope and identified affected hosts. What should the team do next?",
    options: ["Rebuild all affected servers", "Contain the spread by isolating affected network segments", "Shut down all servers to prevent further encryption", "Conduct a full forensic analysis of every host"],
    answer: 1,
    whyText: "After identification, containment limits further damage. Eradication and recovery come after the spread is controlled and evidence is preserved.",
    lens: "PICERL: prepare, identify, contain, eradicate, recover, lessons learned. Do not rebuild before you contain.",
    why: { 0: "Rebuilding is a recovery action and may destroy evidence before containment.", 2: "Shutting down all servers may disrupt containment and recovery; isolate affected segments instead.", 3: "Full analysis can follow containment; it should not delay stopping the spread." }
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
    options: ["To prove that evidence is relevant to the case", "To document who handled evidence, when, where, and why, preserving its integrity", "To establish the admissibility and reliability of the evidence", "To record the suspect's access rights"],
    answer: 1,
    whyText: "The chain of custody is an auditable record of control over evidence. It supports integrity and admissibility by showing that the evidence was not altered or accessed without documentation.",
    lens: "Relevance and reliability are separate questions. Chain of custody answers whether the evidence can be trusted as the same item collected.",
    why: { 0: "Relevance is a legal attribute of the evidence, not the purpose of the chain record.", 2: "Admissibility is a benefit, but the record’s primary purpose is integrity and documented custody.", 3: "Custody records track evidence handling, not the suspect’s permissions." }
  },
  {
    id: "d7q4", d: 7, topic: "Evidence preservation", diff: 2,
    stem: "A compromised workstation is still running, and the responder wants to preserve volatile evidence while stopping further malicious activity. Which action is most appropriate?",
    options: ["Take a memory image, then power off the workstation", "Disconnect the network cable and follow the forensic collection procedure", "Isolate the workstation at the switch and leave it running for analysis", "Reimage the workstation after capturing a disk image"],
    answer: 1,
    whyText: "Disconnecting the network stops remote command and control and lateral movement while preserving memory and running state. Powering off destroys volatile evidence.",
    lens: "Contain the network, preserve the host. Pulling the plug is fast but forensically destructive.",
    why: { 0: "Powering off loses volatile evidence; capture memory first and follow the collection procedure.", 2: "Leaving it running may allow further malicious activity; isolate and follow procedure.", 3: "Reimaging destroys evidence and is a recovery step, not preservation." }
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
    options: ["Three backups per week, two offsite, one onsite", "Three copies of data, on two different media or locations, with one copy offsite", "Three sites, two recovery tiers, one test per year", "Three copies, two cloud providers, one encryption key"],
    answer: 1,
    whyText: "3-2-1 means three copies, two media or locations, and one offsite. Many programmes add an offline or immutable copy for ransomware resilience.",
    lens: "The rule is about redundancy across copies and locations, not a schedule.",
    why: { 0: "3-2-1 is about copies, media or locations, and one offsite copy, not backup frequency.", 2: "Sites and recovery tiers are not the 3-2-1 rule.", 3: "Cloud providers and keys are not the rule’s dimensions." }
  },
  {
    id: "d7q8", d: 7, topic: "Snapshots", diff: 2,
    stem: "Why is a storage snapshot not a complete backup strategy?",
    options: ["Snapshots consume production storage and can affect performance", "Snapshots typically depend on the same storage system and can be lost or corrupted with the source", "Snapshots do not provide point-in-time recovery", "Snapshots are not application-consistent"],
    answer: 1,
    whyText: "Snapshots provide fast point-in-time recovery but usually reside on or depend on the same platform. Ransomware or storage failure can affect both the source and the snapshots, so independent copies are still required.",
    lens: "A snapshot is a recovery convenience, not an independent copy. Ask where it lives and who can delete it.",
    why: { 0: "Performance impact is real but not why snapshots are incomplete backups.", 2: "Snapshots do provide point-in-time recovery, but on the same storage system.", 3: "Application consistency is a design concern, not the fundamental limitation." }
  },
  {
    id: "d7q9", d: 7, topic: "Change management", diff: 2,
    stem: "A critical vulnerability requires an emergency production change outside the normal approval window. What is the most appropriate approach?",
    options: ["Deploy immediately and document at the next change board", "Implement under the emergency change procedure with authorised approval and retrospective documentation", "Wait for the next monthly change board", "Ask the developer to deploy it as a hotfix without operations involvement"],
    answer: 1,
    whyText: "Emergency changes still need an accountable approval path, testing proportionate to risk, and documentation. The emergency procedure exists to compress timelines without eliminating control.",
    lens: "Urgency changes the process timing, not the need for accountability. Retrospective review is still review.",
    why: { 0: "Emergency changes still require authorization and retrospective documentation.", 2: "Waiting may leave a critical exposure open.", 3: "Operations involvement is necessary for a production change, even an emergency one." }
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
    options: ["A high-severity privilege escalation on an internal HR system", "A critical remote-code-execution patch for an internet-facing service", "A medium-severity XSS on a public marketing site", "A low-severity information disclosure on a development server"],
    answer: 1,
    whyText: "Prioritise by exposure and impact. An internet-facing critical remote-code-execution flaw is both reachable and severe. Testing difficulty is a constraint, not a reason to defer a critical exposure.",
    lens: "Patch priority = severity × exposure × asset criticality. Internet-facing critical flaws rise to the top.",
    why: { 0: "Internal privilege escalation is serious but less exposed than an internet-facing RCE.", 2: "XSS is important but lower impact than a critical RCE on an exposed service.", 3: "A development server has lower exposure and severity." }
  },
  {
    id: "d7q12", d: 7, topic: "Physical safety", diff: 1,
    stem: "A fire is detected in a data centre. What is the first priority?",
    options: ["Activate the clean-agent suppression system", "Evacuate people and account for them", "Shut down the servers gracefully", "Preserve the forensic image of the affected servers"],
    answer: 1,
    whyText: "Life safety always outranks asset protection. Evacuation and accounting for personnel come first; suppression and recovery follow.",
    lens: "People, then mission, then data, then systems. An answer that risks a person to save equipment is wrong.",
    why: { 0: "Suppression is important, but life safety comes first.", 2: "Graceful shutdown is secondary to evacuation.", 3: "Forensics is a later priority." }
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
    options: ["Backups encrypted with a key stored on the same domain", "Immutable, offline copies that cannot be altered or deleted during retention", "Backups replicated to a second array in the same data centre", "Backups verified by restoring one file each quarter"],
    answer: 1,
    whyText: "Ransomware often targets backups and credentials. Immutable, offline copies resist deletion or encryption and allow recovery without paying.",
    lens: "Assume the attacker will reach your backup system. Design a copy they cannot change.",
    why: { 0: "A key on the same domain can be compromised with the backups.", 2: "A second array in the same data centre is not isolated from ransomware.", 3: "Restore testing is valuable but does not make backups immutable." }
  },
  {
    id: "d7q15", d: 7, topic: "Rootkits", diff: 2,
    stem: "Why is a rootkit difficult to detect with antivirus software running on the infected host?",
    options: ["It encrypts its files with a stolen certificate", "It can hide its presence by subverting the operating system or firmware", "It only activates after a reboot", "It hides in user-mode processes that antivirus cannot inspect"],
    answer: 1,
    whyText: "Rootkits operate at kernel, boot, or firmware level and can intercept the very mechanisms used to detect them. Offline scanning, trusted boot, and integrity verification are valuable.",
    lens: "You cannot trust a compromised host to report its own compromise. Verify from outside or below.",
    why: { 0: "Encryption is not the hiding mechanism.", 2: "Rootkits can be active before or after reboot.", 3: "Rootkits often operate in kernel mode or firmware, not just user mode." }
  },
  {
    id: "d7q16", d: 7, topic: "SIEM", diff: 1,
    stem: "What is the primary value of a security information and event management (SIEM) system?",
    options: ["It provides a single dashboard for compliance reporting", "It centralises and correlates events across sources to support detection and investigation", "It replaces the need for log retention", "It automates incident containment across endpoints"],
    answer: 1,
    whyText: "A SIEM collects and normalises logs from many sources, correlates events, and supports alerting and investigation. It depends on good data and tuned detection content.",
    lens: "SIEM is correlation and visibility, not prevention. It is only as good as the logs and rules it receives.",
    why: { 0: "Reporting is a benefit, but the primary value is correlation for detection and investigation.", 2: "A SIEM consumes logs; it does not replace retention.", 3: "Containment may be integrated, but it is not the primary value." }
  },
  {
    id: "d7q17", d: 7, topic: "Clipping levels", diff: 2,
    stem: "What is the purpose of a clipping level in event monitoring?",
    options: ["To reduce log volume by discarding events below a threshold", "To set a threshold above which events are considered noteworthy and actionable", "To set the retention period for audit logs", "To classify events by severity for the SIEM"],
    answer: 1,
    whyText: "A clipping level establishes a baseline threshold for reportable events, reducing noise while preserving detection of meaningful deviations.",
    lens: "Too low a threshold drowns the team; too high misses attacks. Clipping levels are a tuning decision.",
    why: { 0: "Discarding events is not the purpose; clipping sets an alerting threshold.", 2: "Retention is a separate log-management decision.", 3: "Severity classification is useful but not what a clipping level is." }
  },
  {
    id: "d7q18", d: 7, topic: "Enticement and entrapment", diff: 2,
    stem: "An organisation deploys a honeypot that appears to contain valuable data, hoping an intruder will access it and reveal their methods. Which statement is correct?",
    options: ["This is entrapment because the honeypot invites access", "This is enticement and is generally lawful when it does not induce the initial crime", "It is lawful only if the honeypot is outside the organisation's network", "It is unlawful because it collects data without consent"],
    answer: 1,
    whyText: "Enticement lures someone who is already predisposed to intrude. Entrapment induces a person to commit a crime they would not otherwise commit. A honeypot is generally enticement.",
    lens: "Enticement = opportunity. Entrapment = creation of the criminal intent. Keep the distinction clean.",
    why: { 0: "Enticement does not induce the initial crime; entrapment does.", 2: "Location does not determine legality; conduct does.", 3: "Honeypots can be designed to avoid personal data; consent is not the key issue." }
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
    options: ["Assign blame to the responders and update the disciplinary policy", "Review the response, identify root causes and gaps, and update plans and controls", "Close the incident and resume normal operations without changes", "Publish a sanitised incident report to customers"],
    answer: 1,
    whyText: "Lessons learned turns the incident into improvement: timeline review, root cause, control gaps, communication effectiveness, and tracked actions. Documentation also supports legal and regulatory needs.",
    lens: "Recovery is not the end of the lifecycle. The last step is where the next incident becomes cheaper.",
    why: { 0: "Lessons learned is blameless and improvement-focused.", 2: "Closing without changes misses the point of the review.", 3: "Customer communication may be required, but it is not the lessons-learned phase." }
  }
]);
