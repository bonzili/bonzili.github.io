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
    options: ["Move all security review to a final gate before release", "Make security a shared, automated responsibility throughout delivery", "Automate all security decisions so humans are removed from release approval", "Centralise security ownership in a dedicated team"],
    answer: 1,
    whyText: "DevSecOps integrates security activities and automated checks into the delivery pipeline so issues are found continuously and ownership is shared across development, operations, and security.",
    lens: "Shift left does not mean a single scanner at the end. It means security is part of the definition of done and the pipeline.",
    why: { 0: "A final gate is the opposite of continuous integration.", 2: "Automation supports DevSecOps; it does not remove human accountability.", 3: "DevSecOps distributes security responsibility rather than centralising it." }
  },
  {
    id: "d8q4", d: 8, topic: "Attack surface", diff: 1,
    stem: "A team is designing a new public API. Which action most directly reduces the attack surface?",
    options: ["Add debugging endpoints behind authentication", "Expose only the endpoints and data fields required by the business", "Disable detailed error messages in production", "Require API keys for all endpoints"],
    answer: 1,
    whyText: "Reducing the number of reachable interfaces, features, and data fields reduces the opportunities an attacker can target. Unnecessary debug endpoints and over-broad data fields expand exposure.",
    lens: "Attack surface is everything reachable. Remove it before defending it.",
    why: { 0: "Debugging endpoints expand the attack surface even when authenticated.", 2: "Error handling is good practice but does not reduce the API’s exposed surface.", 3: "API keys are access control, not a reduction in exposed endpoints and fields." }
  },
  {
    id: "d8q5", d: 8, topic: "Injection", diff: 1,
    stem: "Which coding practice most effectively prevents SQL injection?",
    options: ["Escaping quotes and concatenating input into the query", "Using parameterised queries or prepared statements", "Using stored procedures that build dynamic SQL from input", "Hiding database error messages from users"],
    answer: 1,
    whyText: "Parameterised queries bind input as data, so it cannot change the query structure. Escaping alone is fragile; error hiding is only defence in depth.",
    lens: "The fix for injection is separation of code and data. Do not rely on blocklists or quote escaping.",
    why: { 0: "Escaping is error-prone; parameterisation separates code from data.", 2: "Dynamic SQL inside a procedure can still be injectable.", 3: "Error hiding reduces information leakage but does not fix injection." }
  },
  {
    id: "d8q6", d: 8, topic: "Cross-site scripting", diff: 2,
    stem: "A web application reflects user-supplied text into an HTML page without encoding it, allowing script to execute in other users' browsers. Which control most directly addresses the root cause?",
    options: ["Output encoding appropriate to the HTML context, plus a restrictive content security policy", "Input validation that rejects angle brackets", "HTTP-only cookies and a longer session timeout", "A web application firewall in blocking mode"],
    answer: 0,
    whyText: "XSS occurs when untrusted data is interpreted as code. Context-appropriate output encoding prevents that interpretation; CSP limits the impact of any remaining injection.",
    lens: "Input validation helps, but output encoding is the primary XSS defence. A WAF is a compensating control, not the root-cause fix.",
    why: { 1: "Input validation helps but output encoding is the root-cause fix for XSS.", 2: "Cookie flags and timeouts do not stop script execution.", 3: "A WAF is a compensating control, not the root-cause fix." }
  },
  {
    id: "d8q7", d: 8, topic: "CSRF", diff: 2,
    stem: "An application allows a logged-in user's browser to perform state-changing requests from another site. Which control best prevents this?",
    options: ["Anti-CSRF tokens validated server-side and SameSite cookie attributes", "SameSite cookies alone", "Origin and Referer header validation", "Requiring re-authentication for every request"],
    answer: 0,
    whyText: "CSRF abuses the browser's automatic inclusion of credentials. Anti-CSRF tokens prove the request originated from the application, and SameSite cookies reduce cross-site transmission.",
    lens: "CSRF is an authorization-of-origin problem. Tokens and SameSite are the direct controls.",
    why: { 1: "SameSite helps but is not sufficient alone for all browser and flow cases.", 2: "Header validation is a useful defense but can be bypassed; tokens are stronger.", 3: "Re-authentication is disruptive and does not prevent the forged request." }
  },
  {
    id: "d8q8", d: 8, topic: "SSRF", diff: 2,
    stem: "An application accepts a URL and fetches it server-side. An attacker supplies the cloud metadata address to obtain credentials. Which control is most effective?",
    options: ["Allowlist permitted destination hosts and block internal and metadata ranges", "Validate the URL scheme and block redirects", "Use a web application firewall to block metadata URLs", "Run the fetcher in a container with outbound internet access"],
    answer: 0,
    whyText: "SSRF makes the server issue requests to unintended destinations. Restricting destinations to an allowlist and blocking internal/metadata ranges prevents the request from reaching sensitive endpoints.",
    lens: "SSRF is about where the server can go. Egress control and destination allowlists are the core defences.",
    why: { 1: "Scheme validation is insufficient; destination allowlisting is needed.", 2: "A WAF can help but is bypassable; allowlisting is stronger.", 3: "Outbound internet access increases SSRF exposure." }
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
    options: ["Rotate the key but leave the commit history unchanged", "Revoke and rotate the key, remove it from history where appropriate, and move secrets to a managed store", "Add the key to .gitignore and force-push the repository", "Move the key to an environment variable in the same repository"],
    answer: 1,
    whyText: "Once a secret is public it must be treated as compromised. Revoke and rotate first, then remediate history and prevent recurrence with a secret manager and scanning.",
    lens: "Deleting the visible file does not delete the secret from clones, caches, or attacker copies. Rotation is mandatory.",
    why: { 0: "The exposed key must be revoked; history may still contain it.", 2: "Force-pushing does not guarantee removal from caches or forks.", 3: "An environment variable in the repo can still be committed or exposed." }
  },
  {
    id: "d8q11", d: 8, topic: "Deserialization", diff: 2,
    stem: "A web service accepts serialized objects from untrusted clients and reconstructs them on the server. A tester warns that this could execute attacker-controlled code. Why is deserializing untrusted data dangerous?",
    options: ["It can bypass input validation because the serialized object is trusted", "It can instantiate attacker-controlled objects and trigger code execution or privilege escalation", "It can allow an attacker to modify the object graph before validation", "It forces the server to use a different serialization format"],
    answer: 1,
    whyText: "Unsafe deserialization can turn attacker-controlled input into object state or method invocation, leading to remote code execution and other serious flaws. Avoid untrusted serialization formats or enforce strict type and integrity controls.",
    lens: "Treat serialized data as code, not data, unless the format and library are designed to be safe.",
    why: { 0: "Bypassing validation is a risk, but the defining danger is attacker-controlled object instantiation and code execution.", 2: "Object-graph manipulation can contribute, but the primary risk is code execution.", 3: "Serialization format is not the security issue." }
  },
  {
    id: "d8q12", d: 8, topic: "Supply chain", diff: 1,
    stem: "What is the primary purpose of a software bill of materials (SBOM)?",
    options: ["To document the marketing features of an application", "To inventory components and dependencies so vulnerabilities and licences can be tracked", "To document the licences of proprietary code only", "To replace software composition analysis"],
    answer: 1,
    whyText: "An SBOM lists the components and versions in a product, enabling vulnerability response, licence compliance, and supply-chain visibility.",
    lens: "You cannot patch or assess what you cannot inventory. SBOM is the dependency inventory.",
    why: { 0: "An SBOM is technical, not marketing material.", 2: "An SBOM covers components and dependencies, including open source, not just proprietary licences.", 3: "An SBOM is an input to SCA; it does not replace it." }
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
    stem: "A user is not authorized to see individual salary records, but can deduce a colleague's salary from the totals in several permitted aggregate reports. Which risk is this?",
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
    options: ["A database view", "A stored procedure that returns a fixed query", "A foreign key constraint", "A materialized view"],
    answer: 0,
    whyText: "A view presents a restricted subset of a table. Granting access to the view rather than the base table limits what users can see and modify.",
    lens: "Views are an authorization convenience at the database layer, but they are not a substitute for application-level checks.",
    why: { 1: "A stored procedure can restrict access but is not the standard row and column abstraction.", 2: "A foreign key enforces referential integrity, not access control.", 3: "A materialized view stores data and does not by itself solve the access requirement." }
  },
  {
    id: "d8q18", d: 8, topic: "Release control", diff: 2,
    stem: "What is the primary purpose of release control in a software organisation?",
    options: ["To ensure only approved, tested changes are deployed to production", "To ensure every change is approved by the change advisory board", "To maintain a known-good baseline and detect drift", "To verify that developers follow secure coding standards"],
    answer: 0,
    whyText: "Release control confirms that the change is approved, tested, and authorized before it reaches production. It complements change and configuration management.",
    lens: "Change control approves; release control deploys the approved thing; configuration management records what is running.",
    why: { 1: "Release control governs what is deployed; change advisory approval is a related but broader process.", 2: "Configuration management maintains baselines; release control controls deployment.", 3: "Secure coding standards are a development control, not release control." }
  },
  {
    id: "d8q19", d: 8, topic: "Software escrow", diff: 2,
    stem: "A company depends on a small vendor for a business-critical application. What does a software escrow arrangement primarily provide?",
    options: ["A guarantee of continued vendor support during a merger", "Access to source code or materials if the vendor fails or breaches the agreement", "A licence to use the software after the contract ends", "A service-level agreement for bug fixes"],
    answer: 1,
    whyText: "Software escrow places source code or build materials with a neutral third party, released under defined conditions such as vendor insolvency, to support continuity.",
    lens: "Escrow is a continuity control for vendor failure. It is not a security assurance or defect warranty.",
    why: { 0: "Support continuity is a contractual matter, not the purpose of escrow.", 2: "Escrow provides access to materials, not a free licence.", 3: "An SLA covers support; escrow covers access to source or materials on failure." }
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
