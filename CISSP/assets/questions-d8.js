/* Domain 8 — Software Development Security. Original practice questions. */
(window.CISSP = window.CISSP || {}).questions = (window.CISSP.questions || []).concat([
  {
    id: "d8q1", d: 8, topic: "SDLC security", diff: 1,
    stem: "At which phase of the software development lifecycle is it generally least expensive to address a missing security requirement?",
    options: ["Requirements and design", "Coding", "System testing", "Post-deployment operations"],
    answer: 0,
    whyText: "Security requirements and design decisions are cheapest to change before code exists. The cost of correction rises through coding, testing, and production.",
    lens: "Shift left is an economic argument as much as a security one. Fix the requirement, not the production incident.",
    why: { 1: "Coding changes are more expensive than design changes.", 2: "Testing finds issues after implementation, when rework is costlier.", 3: "Production remediation carries outage, data, and reputation risk." }
  },
  {
    id: "d8q2", d: 8, topic: "Development models", diff: 2,
    stem: "Which development model explicitly performs risk analysis in every iteration and is well suited to large projects with significant uncertainty?",
    options: ["Waterfall", "Spiral", "Build and fix", "V-shaped"],
    answer: 1,
    whyText: "The spiral model is iterative and risk-driven. Each loop includes risk analysis before proceeding, which suits large, uncertain efforts.",
    lens: "Spiral is the model with risk analysis at its centre. Waterfall is linear; V focuses on verification and validation.",
    why: { 0: "Waterfall is sequential and does not emphasize iterative risk analysis.", 2: "Build and fix is reactive and unstructured.", 3: "The V-model pairs phases with testing but is not primarily risk-driven." }
  },
  {
    id: "d8q3", d: 8, topic: "DevSecOps", diff: 2,
    stem: "What is the primary security objective of DevSecOps?",
    options: ["Move all security review to a final gate before release", "Make security a shared, automated responsibility throughout delivery", "Replace developers with security engineers", "Eliminate the need for change management"],
    answer: 1,
    whyText: "DevSecOps integrates security activities and automated checks into the delivery pipeline so issues are found continuously and ownership is shared across development, operations, and security.",
    lens: "Shift left does not mean a single scanner at the end. It means security is part of the definition of done and the pipeline.",
    why: { 0: "A final gate is the opposite of continuous integration.", 2: "Security enables delivery; it does not replace developers.", 3: "Change control still exists, though it may be automated." }
  },
  {
    id: "d8q4", d: 8, topic: "Attack surface", diff: 1,
    stem: "A team is designing a new public API. Which action most directly reduces the attack surface?",
    options: ["Add more debugging endpoints for convenience", "Expose only the endpoints and data fields required by the business", "Disable all logging to reduce information leakage", "Use the same administrative interface for public and internal users"],
    answer: 1,
    whyText: "Reducing the number of reachable interfaces, features, and data fields reduces the opportunities an attacker can target. Unnecessary debug endpoints and shared administrative interfaces expand exposure.",
    lens: "Attack surface is everything reachable. Remove it before defending it.",
    why: { 0: "Debug endpoints often expose sensitive information and should not be public.", 2: "Logging is a detection control; disabling it reduces visibility.", 3: "Sharing administrative and public interfaces increases exposure and blast radius." }
  },
  {
    id: "d8q5", d: 8, topic: "Injection", diff: 1,
    stem: "Which coding practice most effectively prevents SQL injection?",
    options: ["Concatenating user input into the query after escaping quotes", "Using parameterised queries or prepared statements", "Hiding the database error messages", "Storing the database password in the application code"],
    answer: 1,
    whyText: "Parameterised queries bind input as data, so it cannot change the query structure. Escaping alone is fragile; error hiding is only defence in depth.",
    lens: "The fix for injection is separation of code and data. Do not rely on blocklists or quote escaping.",
    why: { 0: "Manual escaping is error-prone and easy to bypass.", 2: "Hiding errors helps reconnaissance but does not prevent injection.", 3: "Hard-coded credentials worsen the exposure." }
  },
  {
    id: "d8q6", d: 8, topic: "Cross-site scripting", diff: 2,
    stem: "A web application reflects user-supplied text into an HTML page without encoding it, allowing script to execute in other users' browsers. Which control most directly addresses the root cause?",
    options: ["Output encoding appropriate to the HTML context, plus a restrictive content security policy", "Encrypting the page with TLS", "Increasing the session timeout", "Using HTTP-only cookies only"],
    answer: 0,
    whyText: "XSS occurs when untrusted data is interpreted as code. Context-appropriate output encoding prevents that interpretation; CSP limits the impact of any remaining injection.",
    lens: "Input validation helps, but output encoding is the primary XSS defence. TLS does not stop script execution.",
    why: { 1: "TLS protects the channel, not the page's handling of untrusted data.", 2: "Session timeout is unrelated.", 3: "HTTP-only cookies protect cookie theft but do not stop script execution or DOM manipulation." }
  },
  {
    id: "d8q7", d: 8, topic: "CSRF", diff: 2,
    stem: "An application allows a logged-in user's browser to perform state-changing requests from another site. Which control best prevents this?",
    options: ["Anti-CSRF tokens validated server-side and SameSite cookie attributes", "Longer passwords", "Encrypting the database", "Disabling HTTP compression"],
    answer: 0,
    whyText: "CSRF abuses the browser's automatic inclusion of credentials. Anti-CSRF tokens prove the request originated from the application, and SameSite cookies reduce cross-site transmission.",
    lens: "CSRF is an authorization-of-origin problem. Tokens and SameSite are the direct controls.",
    why: { 1: "Password strength does not stop a logged-in browser from sending a request.", 2: "Database encryption does not verify request origin.", 3: "Compression settings are unrelated." }
  },
  {
    id: "d8q8", d: 8, topic: "SSRF", diff: 2,
    stem: "An application accepts a URL and fetches it server-side. An attacker supplies the cloud metadata address to obtain credentials. Which control is most effective?",
    options: ["Allowlist permitted destination hosts and block internal and metadata ranges", "Increase the server's memory", "Encode the URL in the response", "Log the request after it completes"],
    answer: 0,
    whyText: "SSRF makes the server issue requests to unintended destinations. Restricting destinations to an allowlist and blocking internal/metadata ranges prevents the request from reaching sensitive endpoints.",
    lens: "SSRF is about where the server can go. Egress control and destination allowlists are the core defences.",
    why: { 1: "Memory has no effect on request destination.", 2: "Encoding affects output, not server-side fetching.", 3: "Logging is detection, not prevention." }
  },
  {
    id: "d8q9", d: 8, topic: "Broken access control", diff: 2,
    stem: "A user changes an order identifier in a URL and views another customer's order. What is the flaw and the best fix?",
    options: ["SQL injection; use parameterised queries", "Insecure direct object reference; enforce server-side authorization on each object access", "Cross-site scripting; encode output", "Race condition; add a database lock"],
    answer: 1,
    whyText: "The application trusts a user-controlled object identifier without checking whether the requester is authorized for that object. Authorization must be enforced server-side on every access.",
    lens: "Authentication is not authorization. Hiding the identifier is not a control.",
    why: { 0: "The scenario is unauthorized object access, not query manipulation.", 2: "No script execution is described.", 3: "There is no concurrency issue described." }
  },
  {
    id: "d8q10", d: 8, topic: "Secrets management", diff: 2,
    stem: "A developer commits an API key to a public repository. What is the most appropriate response?",
    options: ["Delete the commit and assume the key is safe", "Revoke and rotate the key, remove it from history where appropriate, and move secrets to a managed store", "Change the repository name", "Add the key to .gitignore only"],
    answer: 1,
    whyText: "Once a secret is public it must be treated as compromised. Revoke and rotate first, then remediate history and prevent recurrence with a secret manager and scanning.",
    lens: "Deleting the visible file does not delete the secret from clones, caches, or attacker copies. Rotation is mandatory.",
    why: { 0: "History and copies may retain the key.", 2: "Renaming does not revoke exposure.", 3: "Ignoring prevents future commits but does not fix this one." }
  },
  {
    id: "d8q11", d: 8, topic: "Deserialization", diff: 2,
    stem: "Why is deserializing untrusted data dangerous?",
    options: ["It always increases network latency", "It can instantiate attacker-controlled objects and trigger code execution or privilege escalation", "It removes data integrity checks", "It prevents the use of encryption"],
    answer: 1,
    whyText: "Unsafe deserialization can turn attacker-controlled input into object state or method invocation, leading to remote code execution and other serious flaws. Avoid untrusted serialization formats or enforce strict type and integrity controls.",
    lens: "Treat serialized data as code, not data, unless the format and library are designed to be safe.",
    why: { 0: "Performance is not the security concern.", 2: "Integrity checks are a separate control.", 3: "Serialization and encryption are independent." }
  },
  {
    id: "d8q12", d: 8, topic: "Supply chain", diff: 1,
    stem: "What is the primary purpose of a software bill of materials (SBOM)?",
    options: ["To document the marketing features of an application", "To inventory components and dependencies so vulnerabilities and licences can be tracked", "To replace penetration testing", "To encrypt the build pipeline"],
    answer: 1,
    whyText: "An SBOM lists the components and versions in a product, enabling vulnerability response, licence compliance, and supply-chain visibility.",
    lens: "You cannot patch or assess what you cannot inventory. SBOM is the dependency inventory.",
    why: { 0: "An SBOM is technical, not marketing material.", 2: "It supports vulnerability management but does not replace testing.", 3: "It does not encrypt anything." }
  },
  {
    id: "d8q13", d: 8, topic: "ACID", diff: 1,
    stem: "A database transaction transfers funds between two accounts. If the debit succeeds but the credit fails, the entire transaction is rolled back. Which ACID property does this illustrate?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    answer: 0,
    whyText: "Atomicity treats the transaction as all-or-nothing. If any part fails, the whole transaction is rolled back.",
    lens: "Atomicity = all or nothing. Consistency = valid state. Isolation = concurrent transactions do not interfere. Durability = committed data survives failure.",
    why: { 1: "Consistency ensures the database moves between valid states.", 2: "Isolation concerns concurrent transactions.", 3: "Durability concerns persistence after commit." }
  },
  {
    id: "d8q14", d: 8, topic: "Inference", diff: 2,
    stem: "A user is not authorized to see individual salary records, but can deduce a colleague's salary by combining permitted aggregate reports. Which risk is this?",
    options: ["Aggregation", "Inference", "Polyinstantiation", "Normalization"],
    answer: 1,
    whyText: "Inference derives restricted information from authorized results. Aggregation combines data sources; inference reasons from the results. Both are disclosure risks.",
    lens: "Aggregation is combining; inference is deducing. The exam uses both to describe indirect disclosure.",
    why: { 0: "Aggregation combines separate data items; here the user reasons from aggregates.", 2: "Polyinstantiation maintains multiple classified versions.", 3: "Normalization is a database design technique." }
  },
  {
    id: "d8q15", d: 8, topic: "Aggregation", diff: 2,
    stem: "An analyst with access to several separate, individually low-sensitivity datasets combines them to reveal a sensitive pattern. Which concept best describes the risk?",
    options: ["Aggregation", "Inference", "Encryption", "Tokenisation"],
    answer: 0,
    whyText: "Aggregation is the risk that combining individually permitted data produces a more sensitive result than any single source. Controls include need-to-know, query limits, and data minimisation.",
    lens: "Aggregation combines sources; inference deduces from results. Both mean that individual authorizations can add up to a disclosure.",
    why: { 1: "Inference deduces from query results, while this scenario emphasizes combining datasets.", 2: "Encryption protects data but does not address the analytical combination.", 3: "Tokenisation replaces sensitive values." }
  },
  {
    id: "d8q16", d: 8, topic: "Polyinstantiation", diff: 2,
    stem: "A database keeps separate versions of the same record at different classification levels so that a lower-level user cannot infer the existence of a higher-level value. What is this called?",
    options: ["Normalization", "Polyinstantiation", "Aggregation", "Sharding"],
    answer: 1,
    whyText: "Polyinstantiation stores multiple versions of a record at different classification levels, preventing inference and update conflicts in multilevel databases.",
    lens: "Polyinstantiation is a multilevel database control: multiple versions, different classifications, no inference.",
    why: { 0: "Normalization reduces redundancy in relational design.", 2: "Aggregation combines data to reveal more.", 3: "Sharding distributes data across systems." }
  },
  {
    id: "d8q17", d: 8, topic: "Database views", diff: 1,
    stem: "A database administrator wants to restrict a group of users to specific rows and columns without granting access to the base tables. Which mechanism is most appropriate?",
    options: ["A database view", "A full backup", "A stored hash", "A foreign key"],
    answer: 0,
    whyText: "A view presents a restricted subset of a table. Granting access to the view rather than the base table limits what users can see and modify.",
    lens: "Views are an authorization convenience at the database layer, but they are not a substitute for application-level checks.",
    why: { 1: "A backup is a copy, not an access mechanism.", 2: "A hash is a one-way digest.", 3: "A foreign key enforces referential integrity." }
  },
  {
    id: "d8q18", d: 8, topic: "Release control", diff: 2,
    stem: "What is the primary purpose of release control in a software organisation?",
    options: ["To ensure only approved, tested changes are deployed to production", "To write all application code", "To replace configuration management", "To eliminate the need for testing"],
    answer: 0,
    whyText: "Release control confirms that the change is approved, tested, and authorized before it reaches production. It complements change and configuration management.",
    lens: "Change control approves; release control deploys the approved thing; configuration management records what is running.",
    why: { 1: "Development writes code; release control governs deployment.", 2: "Configuration management tracks state; it is complementary.", 3: "Testing is an input to release, not something release control removes." }
  },
  {
    id: "d8q19", d: 8, topic: "Software escrow", diff: 2,
    stem: "A company depends on a small vendor for a business-critical application. What does a software escrow arrangement primarily provide?",
    options: ["A guarantee that the software has no defects", "Access to source code or materials if the vendor fails or breaches the agreement", "Free penetration testing by the vendor", "Automatic compliance with privacy law"],
    answer: 1,
    whyText: "Software escrow places source code or build materials with a neutral third party, released under defined conditions such as vendor insolvency, to support continuity.",
    lens: "Escrow is a continuity control for vendor failure. It is not a security assurance or defect warranty.",
    why: { 0: "No escrow agreement guarantees defect-free software.", 2: "Testing is a separate service.", 3: "Escrow does not create regulatory compliance." }
  },
  {
    id: "d8q20", d: 8, topic: "Verification and validation", diff: 1,
    stem: "A team checks that the software was built according to its specifications, and separately confirms that it meets the users' actual business need. Which pair of terms describes these activities?",
    options: ["Verification and validation", "Validation and verification", "Testing and debugging", "Static and dynamic analysis"],
    answer: 0,
    whyText: "Verification asks whether the product was built right against specifications. Validation asks whether the right product was built to meet the user's need.",
    lens: "Verification = specifications. Validation = fitness for purpose. Remember 'right thing' versus 'built right'.",
    why: { 1: "The order is reversed.", 2: "Testing supports both, but the terms are specific.", 3: "Static and dynamic are analysis methods, not these concepts." }
  }
]);
