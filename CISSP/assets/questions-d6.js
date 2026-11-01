/* Domain 6 — Security Assessment and Testing. Original practice questions. */
(window.CISSP = window.CISSP || {}).questions = (window.CISSP.questions || []).concat([
  {
    id: "d6q1", d: 6, topic: "Assessment types", diff: 1,
    stem: "A team runs an automated tool that inventories missing patches and weak configurations but does not attempt to exploit them. What type of activity is this?",
    options: ["Penetration test", "Vulnerability assessment", "Red team exercise", "Security audit"],
    answer: 1,
    whyText: "A vulnerability assessment discovers and ranks weaknesses, usually without exploitation. A penetration test attempts to exploit them to demonstrate impact.",
    lens: "Scanning finds; exploitation proves. Match the activity to whether the team is allowed to exploit.",
    why: { 0: "A penetration test would attempt exploitation.", 2: "A red team emulates an adversary and tests detection and response.", 3: "An audit evaluates conformity against criteria." }
  },
  {
    id: "d6q2", d: 6, topic: "Rules of engagement", diff: 1,
    stem: "Before a penetration test begins, what should be agreed and documented first?",
    options: ["The list of vulnerabilities the testers expect to find", "The scope, authorisation, timing, constraints, and escalation contacts", "The final risk rating of each finding", "The remediation budget"],
    answer: 1,
    whyText: "Written authorisation and rules of engagement define what may be tested, when, how, and whom to contact if something goes wrong. Without them, the test is unauthorised activity.",
    lens: "The first control in any test is permission. Scope and authorisation precede tools.",
    why: { 0: "Testers cannot know findings in advance.", 2: "Ratings are an output, not a precondition.", 3: "Budget may be separate and does not authorise testing." }
  },
  {
    id: "d6q3", d: 6, topic: "Scan types", diff: 2,
    stem: "A security team needs to identify missing patches and insecure settings inside the operating system. Which scan type is most appropriate?",
    options: ["Unauthenticated external scan", "Authenticated internal scan with read-only credentials", "Passive network capture", "Wireless site survey"],
    answer: 1,
    whyText: "Authenticated scans use credentials to inspect installed software, patch levels, and configuration. Unauthenticated scans see only externally observable services.",
    lens: "Externally visible risk and internal configuration are different views. Use both, but match the question's need.",
    why: { 0: "An external unauthenticated scan cannot see internal patch state reliably.", 2: "Passive capture observes traffic but does not inventory patches.", 3: "A site survey maps wireless coverage." }
  },
  {
    id: "d6q4", d: 6, topic: "Scan accuracy", diff: 2,
    stem: "A scanner reports a critical vulnerability on a server, but manual validation shows the affected service is not installed. What is this finding?",
    options: ["A false negative", "A false positive", "A true positive", "A compensating control"],
    answer: 1,
    whyText: "A false positive is a reported vulnerability that does not actually exist. A false negative is a real vulnerability the scanner misses.",
    lens: "False positive wastes remediation effort; false negative leaves unnoticed risk. Both require tuning and validation.",
    why: { 0: "A false negative would be a missed real vulnerability.", 2: "A true positive would be a confirmed real finding.", 3: "A compensating control reduces risk; it is not a scan result." }
  },
  {
    id: "d6q5", d: 6, topic: "CVSS", diff: 2,
    stem: "A vulnerability on an isolated lab server has a CVSS base score of 9.8. A vulnerability on an internet-facing payment API has a score of 7.5. Which statement best reflects a risk-based prioritisation?",
    options: ["The lab server must be fixed first because 9.8 is higher", "The payment API may warrant earlier action because exposure and business impact are greater", "CVSS scores already include business context, so the order is fixed", "Neither finding matters until an exploit is public"],
    answer: 1,
    whyText: "CVSS measures technical severity, not organisational risk. Exposure, asset criticality, data sensitivity, and compensating controls can make a lower-scored finding more urgent.",
    lens: "CVSS is an input. Risk is severity plus context. The exam repeatedly rewards the contextual answer.",
    why: { 0: "The higher score does not automatically mean higher organisational risk.", 2: "CVSS base scores do not include your business context.", 3: "Known exploitation raises urgency, but absence of a public exploit does not make a finding irrelevant." }
  },
  {
    id: "d6q6", d: 6, topic: "Vulnerability identifiers", diff: 1,
    stem: "What is the role of a CVE identifier?",
    options: ["It scores the business risk of a vulnerability", "It provides a unique public identifier for a specific vulnerability", "It certifies that a product is secure", "It lists every affected customer"],
    answer: 1,
    whyText: "CVE assigns a unique identifier to a publicly known vulnerability. CVSS provides severity scoring, and NVD enriches CVE records with references and scores.",
    lens: "CVE names; CVSS scores; NVD enriches. Do not confuse the identifier with the risk decision.",
    why: { 0: "CVSS handles severity scoring, not CVE.", 2: "No identifier certifies a product as secure.", 3: "CVE does not list affected customers." }
  },
  {
    id: "d6q7", d: 6, topic: "Penetration test types", diff: 2,
    stem: "In which penetration test does the defensive team have little or no warning, while the testers also start with limited knowledge of the environment?",
    options: ["White-box test", "Blind test", "Double-blind test", "Targeted test"],
    answer: 2,
    whyText: "A double-blind test hides the exercise from both the testers (limited knowledge) and most defenders (no warning). A blind test hides information from testers but defenders know.",
    lens: "Blind = testers in the dark. Double-blind = testers and defenders in the dark. Targeted = both informed.",
    why: { 0: "White-box testers have full knowledge.", 1: "Blind testers lack knowledge, but defenders are aware.", 3: "A targeted test is known to both sides." }
  },
  {
    id: "d6q8", d: 6, topic: "Penetration phases", diff: 2,
    stem: "During a penetration test, the team gains access to a web server and begins looking for credentials and paths to other systems. Which phase is this?",
    options: ["Reconnaissance", "Post-exploitation", "Reporting", "Cleanup"],
    answer: 1,
    whyText: "Post-exploitation covers actions after initial access: privilege escalation, lateral movement, data access, and persistence. Reconnaissance precedes exploitation.",
    lens: "Know the sequence: plan, recon, scan/enumerate, exploit, post-exploit, report, cleanup.",
    why: { 0: "Reconnaissance gathers information before exploitation.", 2: "Reporting documents findings after testing.", 3: "Cleanup removes artifacts and restores systems." }
  },
  {
    id: "d6q9", d: 6, topic: "Red teams", diff: 2,
    stem: "What primarily distinguishes a red team exercise from a conventional penetration test?",
    options: ["A red team only uses automated scanners", "A red team emulates an adversary over time and evaluates detection and response, not just vulnerabilities", "A red team never documents its findings", "A red team tests only physical security"],
    answer: 1,
    whyText: "Red teams emulate realistic adversaries, often with stealth and persistence, to test people, processes, detection, and response. A penetration test typically focuses on identifying and exploiting vulnerabilities within a defined scope.",
    lens: "Pen test asks 'can we get in?' Red team asks 'would you notice, and how would you respond?'",
    why: { 0: "Red teams use a broad mix of techniques, not only scanners.", 2: "Findings are documented; otherwise the exercise has no value.", 3: "Red teams can include physical, social, and cyber vectors." }
  },
  {
    id: "d6q10", d: 6, topic: "SAST and DAST", diff: 2,
    stem: "A third-party application is only available as a running service; the organisation has no access to its source code. Which testing approach is still possible?",
    options: ["Static application security testing", "Dynamic application security testing", "Source-code review", "Compile-time analysis"],
    answer: 1,
    whyText: "DAST probes a running application from the outside and does not require source code. SAST and code review require access to code or binaries.",
    lens: "No source? Test behaviour with DAST. Source available? Add SAST and review for earlier, line-level findings.",
    why: { 0: "SAST analyses source or binaries, which are unavailable.", 2: "Code review requires the code.", 3: "Compile-time analysis requires build access." }
  },
  {
    id: "d6q11", d: 6, topic: "SAST limitations", diff: 2,
    stem: "Which limitation is most characteristic of static application security testing?",
    options: ["It cannot inspect source code", "It can produce false positives and may miss runtime or configuration-dependent issues", "It requires a fully running production environment", "It can only test network protocols"],
    answer: 1,
    whyText: "SAST analyses code without executing it, so it can flag patterns that are not exploitable in context and can miss issues that appear only at runtime or in deployment configuration.",
    lens: "Static sees the code path, not the live system. Combine it with DAST and runtime testing.",
    why: { 0: "SAST specifically inspects source or binaries.", 2: "It does not need a running environment.", 3: "It analyses code, not just network traffic." }
  },
  {
    id: "d6q12", d: 6, topic: "IAST", diff: 2,
    stem: "Which testing approach instruments a running application to combine code-level insight with runtime behaviour?",
    options: ["SAST", "DAST", "IAST", "SCA"],
    answer: 2,
    whyText: "Interactive application security testing (IAST) instruments the running application, combining runtime observation with code context to improve accuracy.",
    lens: "SAST = static code. DAST = external behaviour. IAST = instrumented runtime. SCA = dependencies.",
    why: { 0: "SAST does not execute the application.", 1: "DAST observes behaviour from outside without instrumentation.", 3: "SCA inventories components and vulnerabilities." }
  },
  {
    id: "d6q13", d: 6, topic: "Software composition", diff: 2,
    stem: "A development team wants to identify vulnerable open-source libraries and their licences in an application. Which tool category is designed for this?",
    options: ["Software composition analysis", "Dynamic application security testing", "Fuzz testing", "Static code review"],
    answer: 0,
    whyText: "SCA inventories third-party components and maps them to known vulnerabilities and licence obligations. SBOMs support this visibility.",
    lens: "Modern applications are mostly dependencies. SCA and SBOMs answer what is inside and what is known about it.",
    why: { 1: "DAST tests the running application's behaviour, not dependency inventory.", 2: "Fuzzing sends malformed inputs.", 3: "Code review examines first-party logic." }
  },
  {
    id: "d6q14", d: 6, topic: "Fuzzing", diff: 2,
    stem: "A tester sends large volumes of malformed and unexpected input to a file parser to find crashes and validation failures. What technique is this?",
    options: ["Fuzzing", "Regression testing", "Unit testing", "Interface testing"],
    answer: 0,
    whyText: "Fuzzing supplies malformed or unexpected inputs to discover crashes, memory errors, and inadequate validation. Mutation-based and generation-based fuzzing differ in how inputs are produced.",
    lens: "Fuzzing is a dynamic technique aimed at input handling and robustness, especially where code parses complex formats.",
    why: { 1: "Regression testing checks that changes did not break existing behaviour.", 2: "Unit testing verifies small code units.", 3: "Interface testing verifies module contracts." }
  },
  {
    id: "d6q15", d: 6, topic: "Code review", diff: 2,
    stem: "Why should code review be performed by someone other than the author?",
    options: ["To increase the author's velocity", "To reduce blind spots and provide an independent check on logic and security", "To avoid the need for testing", "To transfer accountability for defects to the reviewer"],
    answer: 1,
    whyText: "Independent review catches assumptions and mistakes the author cannot see. It complements testing but does not replace it, and accountability for the code remains with the author and team.",
    lens: "Independence improves detection. It does not transfer ownership of quality.",
    why: { 0: "Review can slow delivery; the benefit is quality, not velocity.", 2: "Review and testing find different classes of defects.", 3: "The author and team remain accountable." }
  },
  {
    id: "d6q16", d: 6, topic: "Audit sampling", diff: 2,
    stem: "An auditor selects 40 purchase orders from a population of 10,000 to test approval controls. What is the most important characteristic of the sample?",
    options: ["It must include only the largest transactions", "It must be representative of the population and the selection method documented", "It must be chosen by the department being audited", "It must include every transaction from the last week"],
    answer: 1,
    whyText: "Sampling supports a conclusion only if the sample is representative and the method is documented and defensible. Bias or management selection undermines the evidence.",
    lens: "Audit conclusions inherit the quality of the sample. Independence and documentation are part of the evidence.",
    why: { 0: "Selecting only large items biases the sample and may miss control failures.", 2: "The audited function should not control selection.", 3: "An arbitrary recent window may not represent the audit period." }
  },
  {
    id: "d6q17", d: 6, topic: "Assurance reports", diff: 2,
    stem: "A vendor provides a SOC 2 Type II report. What does the Type II designation indicate?",
    options: ["The controls were tested for operating effectiveness over a period of time", "The report covers only the design of controls at a single point in time", "The vendor's software has no vulnerabilities", "The vendor is certified by ISC2"],
    answer: 0,
    whyText: "SOC 2 Type II reports on controls over a period, including testing of operating effectiveness. Type I covers design at a point in time.",
    lens: "Type I = design at a date. Type II = operating effectiveness over time. Read the scope and exceptions, not just the opinion.",
    why: { 1: "That describes Type I.", 2: "No assurance report proves the absence of vulnerabilities.", 3: "SOC reports are issued by independent auditors, not ISC2." }
  },
  {
    id: "d6q18", d: 6, topic: "Logging", diff: 1,
    stem: "Why is consistent time synchronisation across network devices important for security monitoring?",
    options: ["It encrypts log data", "It allows events from different sources to be correlated accurately during investigation", "It reduces the size of log files", "It prevents administrators from editing logs"],
    answer: 1,
    whyText: "Accurate, consistent timestamps allow a SIEM and investigators to place events in the correct order across systems. Clock skew can make an attack sequence appear impossible or hide causality.",
    lens: "Correlation depends on time. NTP is a security control, not just an operations convenience.",
    why: { 0: "NTP does not encrypt logs.", 2: "Synchronisation does not reduce log volume.", 3: "Integrity controls, not NTP, protect logs from editing." }
  },
  {
    id: "d6q19", d: 6, topic: "Security metrics", diff: 2,
    stem: "Which pair of metrics best measures how quickly an organisation detects and contains incidents?",
    options: ["Number of scans run and number of policies written", "Mean time to detect and mean time to respond or remediate", "Number of employees trained and number of firewalls deployed", "Total log volume and number of alerts"],
    answer: 1,
    whyText: "Mean time to detect (MTTD) and mean time to respond/remediate (MTTR) measure the speed and effectiveness of detection and response. Activity counts do not.",
    lens: "Prefer outcome metrics over activity metrics. The exam rewards measures that reflect risk reduction.",
    why: { 0: "These measure activity, not detection speed.", 2: "These are input measures.", 3: "Volume and alert count can indicate noise, not effectiveness." }
  },
  {
    id: "d6q20", d: 6, topic: "Scan interpretation", diff: 2,
    stem: "A vulnerability scan of a subnet reports no critical findings. What is the most appropriate conclusion?",
    options: ["The subnet is fully secure", "The scan found no critical issues it was configured and able to detect, so coverage and false negatives still need consideration", "No further testing is required", "All assets on the subnet are patched"],
    answer: 1,
    whyText: "A clean scan is bounded by scope, credentials, signatures, and tool coverage. It does not prove security. Validate coverage, review false negatives, and combine with other testing.",
    lens: "Absence of evidence is not evidence of absence. Always ask what the scan could not see.",
    why: { 0: "No scan proves a network secure.", 2: "Other controls and testing may still be needed.", 3: "Patch state may be invisible to an unauthenticated scan." }
  }
]);
