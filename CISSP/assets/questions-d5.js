/* Domain 5 — Identity and Access Management. Original practice questions. */
(window.CISSP = window.CISSP || {}).questions = (window.CISSP.questions || []).concat([
  {
    id: "d5q1", d: 5, topic: "Authentication factors", diff: 1,
    stem: "A bank issues employees a smart card and requires a password before the card can be used. A manager asks whether this is true multi-factor authentication. Which combination describes the factors?",
    options: ["A password and a security question", "A password and a smart card", "A PIN and a password", "Two different passwords"],
    answer: 1,
    whyText: "MFA requires factors from different categories. A password is something you know; a smart card is something you have. Two passwords, or a password and a security question, remain in the knowledge category.",
    lens: "Count categories, not prompts. Knowledge + knowledge is still single-factor.",
    why: { 0: "A security question is also knowledge-based.", 2: "A PIN and a password are both knowledge factors.", 3: "Two passwords are the same category." }
  },
  {
    id: "d5q2", d: 5, topic: "Biometric errors", diff: 2,
    stem: "A biometric system is configured for a high-security facility where admitting an unauthorised person is the primary concern. Which tuning objective is most appropriate?",
    options: ["Minimise the false rejection rate", "Minimise the false acceptance rate", "Maximise the crossover error rate", "Tune to the crossover error rate"],
    answer: 1,
    whyText: "False acceptance is the security failure: an invalid user is admitted. For high security, bias the threshold toward minimising FAR, accepting that some valid users may be falsely rejected.",
    lens: "FAR is the security error; FRR is the usability error. CER is a comparison point, not a target to maximise.",
    why: { 0: "Minimising FRR improves usability but may increase false acceptance.", 2: "A lower CER is better; maximising it is wrong.", 3: "The CER balances FAR and FRR; a high-security facility should bias toward a lower FAR." }
  },
  {
    id: "d5q3", d: 5, topic: "Crossover error rate", diff: 1,
    stem: "What does the crossover error rate (CER) of a biometric system represent?",
    options: ["The point at which the system's sensitivity is highest", "The point where the false acceptance rate equals the false rejection rate", "The rate at which false accepts exceed false rejects", "The maximum error rate the system allows before lockout"],
    answer: 1,
    whyText: "CER is the threshold at which FAR and FRR are equal. A lower CER indicates a more accurate biometric system.",
    lens: "Lower CER is better. It is a single comparison number, not a measure of throughput.",
    why: { 0: "Sensitivity is a tuning setting, not the CER.", 2: "CER is where FAR equals FRR, not where one exceeds the other.", 3: "The CER is not a lockout threshold." }
  },
  {
    id: "d5q4", d: 5, topic: "Access control models", diff: 1,
    stem: "In which access control model does the owner of a resource decide who may access it, often through an access control list?",
    options: ["Mandatory access control", "Discretionary access control", "Role-based access control", "Rule-based access control"],
    answer: 1,
    whyText: "Discretionary access control gives the resource owner discretion to grant or revoke access. MAC uses system-enforced labels; RBAC uses roles; rule-based uses global rules.",
    lens: "Owner discretion = DAC. Labels and clearances = MAC. Job function = RBAC. Conditions = rule-based or ABAC.",
    why: { 0: "MAC decisions are based on labels and clearances, not owner discretion.", 2: "RBAC grants access through roles.", 3: "Rule-based access applies organisational rules." }
  },
  {
    id: "d5q5", d: 5, topic: "MAC", diff: 1,
    stem: "A document is labeled top secret, and only users with top-secret clearance may read it. Which access control model is being enforced?",
    options: ["Discretionary access control", "Mandatory access control", "Role-based access control", "Capability-based access control"],
    answer: 1,
    whyText: "Mandatory access control enforces access based on security labels and clearances. The user cannot override the system's decision.",
    lens: "Labels plus clearances, enforced by the system = MAC. The owner does not grant exceptions.",
    why: { 0: "DAC would let the resource owner decide access.", 2: "RBAC would map access to a role, not a label.", 3: "Capability-based access uses unforgeable tokens for objects." }
  },
  {
    id: "d5q6", d: 5, topic: "RBAC", diff: 2,
    stem: "An employee moves from accounts payable to procurement. Which access control approach makes it easiest to remove the old permissions and grant the new ones consistently?",
    options: ["Discretionary access control with per-user ACLs", "Role-based access control with defined roles", "Mandatory access control with labels", "Attribute-based access control with department attributes"],
    answer: 1,
    whyText: "RBAC assigns permissions to roles, and users are moved between roles. This makes entitlement changes consistent and reviewable. Per-user ACLs accumulate and are harder to clean up.",
    lens: "Job changes are the classic RBAC argument. Role engineering plus access reviews beats ad hoc ACLs.",
    why: { 0: "Per-user ACLs create entitlement creep during transfers.", 2: "MAC labels solve clearance, not job-function changes.", 3: "ABAC can work, but role-based access is the most direct way to remove old permissions and grant new ones consistently." }
  },
  {
    id: "d5q7", d: 5, topic: "ABAC", diff: 2,
    stem: "A policy grants access only if the user is a manager, the resource is in the same department, the request occurs during business hours, and the device is managed. Which model is this?",
    options: ["Role-based access control", "Attribute-based access control", "Discretionary access control", "Mandatory access control"],
    answer: 1,
    whyText: "ABAC evaluates attributes of the subject, resource, action, and environment. The policy combines several contextual conditions, which is beyond a simple role check.",
    lens: "Multiple contextual attributes = ABAC. A single job function = RBAC.",
    why: { 0: "RBAC could handle the manager role but not the full context set by itself.", 2: "DAC is owner discretion.", 3: "MAC is label-based." }
  },
  {
    id: "d5q8", d: 5, topic: "Kerberos", diff: 2,
    stem: "Users authenticate to a realm and receive a ticket-granting ticket. After a domain controller's clock drifts by ten minutes, authentications begin to fail. Which statement about the protocol explains the failure?",
    options: ["It uses asymmetric keys for service tickets and depends on the KDC's certificate chain", "It uses a key distribution centre and symmetric keys, and depends on reasonably synchronised clocks", "It uses time-based one-time passwords that expire after ten minutes", "It relies on a shared secret that is rotated every ten minutes"],
    answer: 1,
    whyText: "Kerberos uses a KDC, symmetric keys, and time-stamped tickets. Clock skew can cause authentication failures because tickets have validity windows.",
    lens: "Kerberos: symmetric, ticket-based, time-sensitive, SSO. The KDC is the trust anchor.",
    why: { 0: "Kerberos service tickets use symmetric keys; clock skew is the issue.", 2: "Kerberos does not use TOTP for ticket validity.", 3: "The shared secret is not rotated every ten minutes; ticket lifetime and clock skew matter." }
  },
  {
    id: "d5q9", d: 5, topic: "Federation protocols", diff: 2,
    stem: "A company needs browser-based single sign-on between its on-premises identity provider and a third-party enterprise application that exchanges XML assertions. Which protocol is the best fit?",
    options: ["OAuth 2.0", "SAML 2.0", "RADIUS", "TACACS+"],
    answer: 1,
    whyText: "SAML 2.0 exchanges XML authentication and authorization assertions between an identity provider and a service provider, commonly for browser-based enterprise SSO.",
    lens: "SAML = XML assertions, enterprise browser SSO. OIDC = JSON/JWT, modern apps. OAuth = delegated authorization, not authentication.",
    why: { 0: "OAuth 2.0 is an authorization framework and does not itself provide authentication assertions.", 2: "RADIUS authenticates network access.", 3: "TACACS+ centralises device administration." }
  },
  {
    id: "d5q10", d: 5, topic: "OAuth and OIDC", diff: 2,
    stem: "A mobile application wants to authenticate users through a third-party identity provider and receive a signed token containing identity claims. Which standard should it use?",
    options: ["OAuth 2.0 alone", "OpenID Connect", "SAML 1.1", "Kerberos"],
    answer: 1,
    whyText: "OpenID Connect adds an identity layer to OAuth 2.0, issuing a signed ID token with claims about the authenticated user. OAuth 2.0 alone is for delegated authorization.",
    lens: "If the question asks who the user is, choose OIDC. If it asks what the app may access on the user's behalf, choose OAuth 2.0.",
    why: { 0: "OAuth 2.0 issues access tokens for delegated access, not identity authentication by itself.", 2: "SAML 1.1 is obsolete and XML-based.", 3: "Kerberos is an internal ticket-based protocol, not a modern mobile identity standard." }
  },
  {
    id: "d5q11", d: 5, topic: "OAuth delegation", diff: 2,
    stem: "A user wants a third-party calendar application to read their calendar without sharing their password. Which mechanism is designed for this delegated access?",
    options: ["OAuth 2.0 authorization code flow", "SAML assertion", "Kerberos service ticket", "RADIUS access request"],
    answer: 0,
    whyText: "OAuth 2.0 lets the resource owner authorize a client to access a scoped set of resources without sharing credentials, using access tokens.",
    lens: "Delegated access with scopes and tokens = OAuth 2.0. Do not confuse it with authentication.",
    why: { 1: "SAML is for federated authentication assertions, not API delegation.", 2: "Kerberos is for domain authentication and service tickets inside a realm.", 3: "RADIUS authenticates network sessions." }
  },
  {
    id: "d5q12", d: 5, topic: "Device administration", diff: 2,
    stem: "A network team wants centralised authentication for administrative access to routers and switches, with separate authorization and full encryption of the session payload. Which protocol best fits?",
    options: ["RADIUS", "TACACS+", "LDAP", "Kerberos"],
    answer: 1,
    whyText: "TACACS+ separates authentication, authorization, and accounting and encrypts the entire payload, making it well suited to network-device administration. RADIUS combines authentication and authorization and encrypts only the password.",
    lens: "TACACS+ for device administration and granular command authorization; RADIUS for network access authentication.",
    why: { 0: "RADIUS is common for network access but does not separate all three AAA functions or encrypt the full payload.", 2: "LDAP is a directory protocol, not the AAA protocol described.", 3: "Kerberos provides authentication but not TACACS+'s separate authorization and full session encryption." }
  },
  {
    id: "d5q13", d: 5, topic: "SSO risk", diff: 2,
    stem: "What is the most significant security trade-off of enterprise single sign-on?",
    options: ["It requires users to remember more credentials across applications", "Compromise of the primary identity or session can grant broad access to many applications", "It prevents centralized access reviews", "It makes deprovisioning slower across applications"],
    answer: 1,
    whyText: "SSO reduces password sprawl and improves usability, but it concentrates trust. A compromised identity provider or session can unlock many connected applications.",
    lens: "SSO is a concentration of both convenience and risk. Protect the IdP, the session, and the recovery path.",
    why: { 0: "SSO reduces credential sprawl; the trade-off is concentrated risk.", 2: "SSO can improve centralized review by consolidating identity.", 3: "SSO can speed deprovisioning if the primary identity is disabled." }
  },
  {
    id: "d5q14", d: 5, topic: "Credential attacks", diff: 2,
    stem: "Attackers use username and password pairs stolen from an unrelated breach to log in to a company's service. What is this attack called?",
    options: ["Password spraying", "Credential stuffing", "Rainbow table attack", "Brute force"],
    answer: 1,
    whyText: "Credential stuffing replays breached credential pairs across other services, exploiting password reuse. It differs from spraying, which tries a few common passwords across many accounts.",
    lens: "Stuffing = reuse of breached pairs. Spraying = one or few passwords across many accounts to avoid lockout.",
    why: { 0: "Spraying uses a small set of common passwords across many accounts.", 2: "A rainbow table reverses hashes; it does not log in with a breached pair.", 3: "Brute force tries many combinations against one account." }
  },
  {
    id: "d5q15", d: 5, topic: "Session management", diff: 2,
    stem: "An attacker sends a victim a link containing a known session identifier. The victim logs in, and the attacker reuses the identifier to access the account. Which control most directly prevents this?",
    options: ["Issuing a new session identifier after successful authentication", "Rotating the session identifier on every request", "Binding the session to the user's IP address", "Using a longer session timeout with HttpOnly cookies"],
    answer: 0,
    whyText: "Session fixation works by forcing a known session ID on a victim. Issuing a fresh, unpredictable session ID after login invalidates the attacker's known value.",
    lens: "Authentication should rotate the session. The pre-login identifier must never become the authenticated one.",
    why: { 1: "Rotation on every request can break legitimate flows and does not fix fixation at login.", 2: "IP binding can help but is not the primary defense against session fixation.", 3: "HttpOnly helps against theft, not fixation." }
  },
  {
    id: "d5q16", d: 5, topic: "Privileged access", diff: 2,
    stem: "An organisation wants administrators to check out elevated credentials only when needed, with session recording and automatic rotation. Which capability should it implement?",
    options: ["Privileged access management", "Single sign-on for all users", "A password complexity policy", "Biometric authentication for all staff"],
    answer: 0,
    whyText: "PAM vaults privileged credentials, brokers and records sessions, supports just-in-time elevation, and rotates secrets after use.",
    lens: "PAM is about controlling and observing elevated access, not just making login convenient.",
    why: { 1: "SSO improves usability but does not provide credential checkout or session recording.", 2: "Complexity policy alone does not control privileged use.", 3: "Biometrics authenticate identity but do not broker privileged sessions." }
  },
  {
    id: "d5q17", d: 5, topic: "Access reviews", diff: 1,
    stem: "Who is best positioned to attest that a user still needs access to a specific business application during an access review?",
    options: ["The user's manager or the application owner", "The security operations analyst", "The database vendor", "The help desk technician"],
    answer: 0,
    whyText: "Access recertification is a business decision. The manager understands the user's current duties; the application or resource owner understands the entitlement's sensitivity.",
    lens: "Security facilitates the review; the business attests to need. Rubber-stamping by security defeats the control.",
    why: { 1: "The SOC can detect anomalies but does not own business need.", 2: "A vendor does not decide employee access.", 3: "The help desk executes requests, not entitlement decisions." }
  },
  {
    id: "d5q18", d: 5, topic: "Account lifecycle", diff: 1,
    stem: "An audit finds active accounts for several former employees. Which control failed most directly?",
    options: ["Password complexity enforcement", "Deprovisioning during the joiner-mover-leaver process", "Session timeout configuration", "Log retention"],
    answer: 1,
    whyText: "Deprovisioning should remove or disable access promptly when someone leaves. Orphaned accounts are a direct lifecycle failure.",
    lens: "Most identity incidents are lifecycle failures, not cryptography failures. Prompt deprovisioning is a high-value control.",
    why: { 0: "Complexity does not remove accounts.", 2: "Timeouts limit sessions but leave the account active.", 3: "Log retention is unrelated." }
  },
  {
    id: "d5q19", d: 5, topic: "Account lockout", diff: 2,
    stem: "A service desk wants to set a very low account-lockout threshold to stop brute-force attacks. What is the main risk of an aggressive lockout policy?",
    options: ["It enables an attacker to cause a denial of service by locking out legitimate users", "It increases the risk of credential stuffing", "It weakens password hashing", "It creates more help-desk resets but no security risk"],
    answer: 0,
    whyText: "Lockout can be abused to deny service to valid users. Progressive delays, risk-based challenges, and MFA can reduce brute-force success without handing attackers a trivial denial-of-service lever.",
    lens: "Every control has a failure mode. Lockout trades brute-force resistance for availability risk.",
    why: { 1: "Lockout does not make passwords easier to guess; it creates a denial-of-service risk.", 2: "Lockout policy does not affect hashing.", 3: "Help-desk load is real, but the security risk is denial of service." }
  },
  {
    id: "d5q20", d: 5, topic: "Identity proofing", diff: 2,
    stem: "A financial institution is onboarding customers for a high-value account. Which control best ensures that the person claiming an identity is the real person?",
    options: ["Asking the user to choose a strong password", "Identity proofing with government-issued identity and liveness verification", "Knowledge-based questions based on credit history", "Email verification with a one-time code"],
    answer: 1,
    whyText: "Identity proofing verifies the claimed identity using evidence such as a government identity document and a liveness check, proportionate to the account's risk.",
    lens: "Authentication assumes an identity already exists. Proofing decides whether the identity should exist at all.",
    why: { 0: "A password protects an account but does not prove identity.", 2: "Knowledge-based questions are weak and often compromised.", 3: "Email verification proves control of an address, not that the person is who they claim." }
  }
]);
