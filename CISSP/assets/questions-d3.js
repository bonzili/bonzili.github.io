/* Domain 3 — Security Architecture and Engineering. Original practice questions. */
(window.CISSP = window.CISSP || {}).questions = (window.CISSP.questions || []).concat([
  {
    id: "d3q1", d: 3, topic: "Bell-LaPadula", diff: 2,
    stem: "A user with secret clearance wants to read a top-secret document and write a summary to an unclassified system. Under the Bell-LaPadula model, which actions are permitted?",
    options: ["Read the top-secret document and write to the unclassified system", "Read the top-secret document, but not write to the unclassified system", "Neither read the top-secret document nor write to the unclassified system", "Write to the unclassified system, but not read the top-secret document"],
    answer: 2,
    whyText: "Bell-LaPadula protects confidentiality with two rules: no read up and no write down. A secret subject cannot read top secret, and cannot write down to unclassified. Both actions are denied.",
    lens: "Write the arrows before reading the options: BLP = no read up, no write down. Biba is the mirror.",
    why: { 0: "Both actions violate the model.", 1: "Reading up is also prohibited.", 3: "Writing down is prohibited." }
  },
  {
    id: "d3q2", d: 3, topic: "Biba", diff: 2,
    stem: "An integrity model must prevent a low-integrity process from contaminating a high-integrity dataset while allowing high-integrity data to flow to lower-integrity processes. Which model directly provides these rules?",
    options: ["Bell-LaPadula", "Biba", "Brewer-Nash", "Clark-Wilson"],
    answer: 1,
    whyText: "Biba protects integrity: no read down (a high-integrity subject cannot read lower-integrity data) and no write up (a low-integrity subject cannot write to higher-integrity data).",
    lens: "Confidentiality models stop leaks upward; integrity models stop contamination upward. Biba's two rules are the mirror image of Bell-LaPadula's.",
    why: { 0: "Bell-LaPadula protects confidentiality, not integrity.", 2: "Brewer-Nash prevents conflicts of interest.", 3: "Clark-Wilson protects integrity through transactions, but the specific read/write flow rules are Biba's." }
  },
  {
    id: "d3q3", d: 3, topic: "Clark-Wilson", diff: 2,
    stem: "In the Clark-Wilson model, what is the only mechanism permitted to modify a constrained data item (CDI)?",
    options: ["Any process running with administrator rights", "An approved transformation procedure (TP)", "A direct write by the data owner", "An integrity verification procedure (IVP)"],
    answer: 1,
    whyText: "Clark-Wilson enforces integrity through well-formed transactions. Subjects act on CDIs only through approved transformation procedures; IVPs verify that the data remains in a valid state.",
    lens: "Clark-Wilson is about controlled change: CDI, TP, IVP, and separation of duties. Direct modification is the thing the model exists to prevent.",
    why: { 0: "Administrative privilege does not bypass the model's transaction rules.", 2: "The owner does not directly modify the CDI in this model.", 3: "An IVP checks integrity; it does not perform the business change." }
  },
  {
    id: "d3q4", d: 3, topic: "Brewer-Nash", diff: 2,
    stem: "A consulting firm advises competing banks. Once a consultant accesses one bank's confidential merger data, the firm must prevent that consultant from accessing a competitor's data. Which model addresses this requirement?",
    options: ["Biba", "Brewer-Nash", "Bell-LaPadula", "Harrison-Ruzzo-Ullman"],
    answer: 1,
    whyText: "Brewer-Nash, the Chinese Wall model, dynamically adjusts access based on what a subject has already accessed to prevent conflicts of interest.",
    lens: "Conflict of interest + access history = Brewer-Nash. The wall moves as the consultant's history changes.",
    why: { 0: "Biba addresses integrity levels, not conflicts of interest.", 2: "Bell-LaPadula addresses confidentiality classification, not client conflicts.", 3: "Harrison-Ruzzo-Ullman models changes to access rights, not conflict-of-interest walls." }
  },
  {
    id: "d3q5", d: 3, topic: "Reference monitor", diff: 2,
    stem: "Which property is essential for a reference monitor to enforce a security policy correctly?",
    options: ["It must be implemented inside the application it protects", "It must mediate every access and be tamper-proof", "It must log every decision, but it need not mediate every access", "It must be configurable by administrators at runtime"],
    answer: 1,
    whyText: "A reference monitor must be always invoked, tamper-proof, and small enough to be verified. It mediates every access between subjects and objects.",
    lens: "The reference monitor is an abstract requirement; the security kernel is its implementation. Always invoked, tamper-proof, verifiable.",
    why: { 0: "An in-application monitor is not independently tamper-proof.", 2: "Logging is not enforcement; the monitor must mediate every access.", 3: "Runtime configurability by administrators weakens the tamper-proof property." }
  },
  {
    id: "d3q6", d: 3, topic: "Protection rings", diff: 1,
    stem: "In a protection-ring architecture, which ring has the highest privilege?",
    options: ["Ring 0", "Ring 1", "Ring 3", "The outermost ring"],
    answer: 0,
    whyText: "Ring 0 is the most privileged and typically hosts the kernel. Higher ring numbers are less privileged.",
    lens: "Lower number, higher privilege. The kernel lives at ring 0; user applications sit further out.",
    why: { 1: "Ring 1 is less privileged than ring 0.", 2: "Ring 3 is a typical user-mode level.", 3: "The outermost ring is the least privileged." }
  },
  {
    id: "d3q7", d: 3, topic: "Common Criteria", diff: 2,
    stem: "A product has a higher Evaluation Assurance Level (EAL) than a competing product. What can be concluded?",
    options: ["It is more secure than a lower-EAL product evaluated against a different security target", "The product has been evaluated more rigorously against its security target", "It has been evaluated against a broader set of protection profiles", "It has passed a higher level of vendor penetration testing"],
    answer: 1,
    whyText: "EAL describes the depth and rigour of the evaluation against the product's security target. It does not prove absolute security or fitness for a particular environment.",
    lens: "Assurance is confidence in the evaluation, not a guarantee of security. Certification is technical; accreditation is management's decision to use it.",
    why: { 0: "EALs are only comparable within the same protection profile or security target.", 2: "EAL does not imply broader protection profiles; the target defines scope.", 3: "Vendor testing is not the same as independent Common Criteria evaluation." }
  },
  {
    id: "d3q8", d: 3, topic: "FIPS 140-3", diff: 1,
    stem: "A vendor advertises a hardware security module as 'FIPS 140-3 Level 3 validated.' A procurement manager asks what that validation actually covers. What should the security engineer explain?",
    options: ["The module's cryptographic algorithms, but not its physical tamper resistance", "Cryptographic modules and their security requirements", "The module's secure development process, but not its cryptographic implementation", "The module's resistance to side-channel attacks, but not its key management"],
    answer: 1,
    whyText: "FIPS 140-3 is the US standard for validating cryptographic modules, with increasing levels that add physical and tamper-resistance requirements.",
    lens: "FIPS 140 is about cryptographic modules, not entire systems. Common Criteria evaluates broader IT products.",
    why: { 0: "FIPS 140-3 covers more than algorithm correctness; physical requirements depend on the level.", 2: "Development process is not the object of FIPS 140-3 validation.", 3: "Side-channel resistance is one aspect; validation covers the module’s overall security requirements." }
  },
  {
    id: "d3q9", d: 3, topic: "Digital signatures", diff: 2,
    stem: "A supplier sends a digitally signed contract. The buyer wants to prove the document came from the supplier, was not altered in transit, and that the supplier cannot later deny signing it. Which properties does the signature provide?",
    options: ["Confidentiality, integrity, and availability", "Integrity, authenticity, and non-repudiation", "Confidentiality and non-repudiation only", "Availability and authentication only"],
    answer: 1,
    whyText: "A digital signature uses the sender's private key over a hash. It provides integrity, authenticity, and non-repudiation. It does not hide the message; encryption is separate.",
    lens: "Signature = integrity + authenticity + non-repudiation. If the question asks for confidentiality, the answer must involve encryption.",
    why: { 0: "Signatures do not provide confidentiality or availability.", 2: "A signature does not encrypt the message.", 3: "Availability is not a property of a signature." }
  },
  {
    id: "d3q10", d: 3, topic: "Symmetric and asymmetric", diff: 1,
    stem: "Which problem does asymmetric cryptography primarily solve that symmetric cryptography struggles with at scale?",
    options: ["Key distribution", "Non-repudiation", "Key escrow", "Certificate revocation"],
    answer: 0,
    whyText: "Asymmetric cryptography uses public and private keys, allowing secure key exchange or signatures without sharing a secret key in advance. Symmetric encryption is faster but needs a secure way to share the key.",
    lens: "Symmetric is fast but has a key-distribution problem. Asymmetric solves distribution and enables signatures but is slower.",
    why: { 1: "Non-repudiation is provided by signatures, not by the asymmetric key distribution problem.", 2: "Key escrow is a key-management policy, not the problem asymmetric cryptography solves.", 3: "Revocation is a PKI maintenance function, not the primary scaling problem." }
  },
  {
    id: "d3q11", d: 3, topic: "Password hashing", diff: 2,
    stem: "Why should a password database use a unique salt for each password before hashing?",
    options: ["To make each hash slower to compute for every user", "To prevent identical passwords from producing identical hashes and to defeat precomputed tables", "To ensure the same password produces the same hash across systems", "To allow the hash to be used directly as an encryption key"],
    answer: 1,
    whyText: "A unique salt ensures that identical passwords produce different hashes and makes precomputed rainbow tables ineffective. It does not make the hash reversible.",
    lens: "Salt defeats precomputation and duplicates; a slow hash (bcrypt, scrypt, Argon2) defeats fast brute force. Use both.",
    why: { 0: "Slowness comes from the password-hashing function, not the salt.", 2: "A salt deliberately makes identical passwords produce different hashes.", 3: "A password hash is not an encryption key." }
  },
  {
    id: "d3q12", d: 3, topic: "PKI revocation", diff: 2,
    stem: "A certificate is compromised before its expiration date. Which mechanisms allow relying parties to learn that it must no longer be trusted?",
    options: ["CRL and OCSP", "CRL and certificate pinning", "OCSP and key escrow", "Certificate renewal and CA reissuance"],
    answer: 0,
    whyText: "Certificate revocation lists (CRLs) and the Online Certificate Status Protocol (OCSP) publish revocation status so relying parties can reject a compromised certificate.",
    lens: "PKI trust requires a revocation path. CRL is a list; OCSP is an online query.",
    why: { 1: "Pinning can detect some substitution, but it is not the standard revocation mechanism.", 2: "Key escrow does not publish revocation status.", 3: "Renewal issues a new certificate; it does not tell relying parties that the old one is revoked." }
  },
  {
    id: "d3q13", d: 3, topic: "TLS scope", diff: 1,
    stem: "A web application uses HTTPS for all traffic. Which statement is correct?",
    options: ["All data stored by the application is encrypted", "Data in transit is protected, but the application can still be vulnerable to injection", "The application is immune to cross-site scripting", "The database is protected from unauthorised access"],
    answer: 1,
    whyText: "TLS protects the channel between client and server. It does not validate application logic, prevent injection, or encrypt data at rest.",
    lens: "HTTPS protects the pipe, not the code. Application-layer flaws still work over an encrypted channel.",
    why: { 0: "Data at rest needs separate encryption.", 2: "XSS is an application flaw and can occur over HTTPS.", 3: "Database access control is separate from transport encryption." }
  },
  {
    id: "d3q14", d: 3, topic: "Fire suppression", diff: 2,
    stem: "Which fire-suppression approach is generally preferred for an occupied data centre because it extinguishes fire without leaving water residue on servers?",
    options: ["Wet-pipe sprinkler", "Clean-agent suppression", "Deluge system", "Portable water extinguishers"],
    answer: 1,
    whyText: "Clean-agent systems suppress fire without water damage to electronics. Life safety still comes first, and the agent must be safe for occupied spaces.",
    lens: "For IT facilities, the trade-off is suppression effectiveness versus collateral damage. Clean agents reduce equipment damage; water is destructive to electronics.",
    why: { 0: "Wet-pipe sprinklers can cause severe water damage and electrical hazards.", 2: "A deluge system releases large volumes of water.", 3: "Water extinguishers are unsuitable for live electrical equipment." }
  },
  {
    id: "d3q15", d: 3, topic: "Fail-safe and fail-secure", diff: 2,
    stem: "When a fire alarm activates, the electronic locks on the data-centre doors release to allow evacuation. Which design principle does this illustrate?",
    options: ["Fail-secure", "Fail-safe", "Least common mechanism", "Separation of duties"],
    answer: 1,
    whyText: "A fail-safe configuration releases locks on failure or alarm, prioritising human life. Fail-secure would keep the doors locked to protect assets.",
    lens: "Life safety outranks asset protection. Fail-safe releases; fail-secure stays locked.",
    why: { 0: "Fail-secure keeps the door locked, which would impede evacuation.", 2: "Least common mechanism is about shared resources.", 3: "Separation of duties is an administrative control." }
  },
  {
    id: "d3q16", d: 3, topic: "CPTED", diff: 1,
    stem: "A facility is redesigned with clear sightlines, low hedges, and employee work areas overlooking the entrance. Which physical-security concept does this primarily apply?",
    options: ["Natural surveillance", "Territorial reinforcement", "Target hardening", "Access control"],
    answer: 0,
    whyText: "Natural surveillance is a CPTED principle that uses design to increase visibility and the perception of observation, reducing criminal opportunity.",
    lens: "CPTED has three core ideas: natural surveillance, natural access control, and territorial reinforcement.",
    why: { 1: "Territorial reinforcement uses physical boundaries and markings to signal ownership.", 2: "Target hardening makes assets harder to attack, not more visible.", 3: "Access control restricts entry; it does not rely on sightlines and observation." }
  },
  {
    id: "d3q17", d: 3, topic: "Power protection", diff: 1,
    stem: "What is the primary role of an uninterruptible power supply (UPS) in a data centre?",
    options: ["Provide backup power for the entire outage until utility power returns", "Provide short-term power and ride-through until generators start or systems shut down safely", "Condition power and protect against voltage spikes", "Provide emergency lighting during an evacuation"],
    answer: 1,
    whyText: "A UPS provides immediate short-term power to bridge the gap until a generator takes over or systems shut down cleanly. Generators handle extended outages.",
    lens: "UPS = ride-through; generator = extended runtime. They solve different durations.",
    why: { 0: "A UPS provides short-term ride-through, not indefinite power; generators cover extended outages.", 2: "Power conditioning and surge protection are related but not the UPS’s primary role.", 3: "Emergency lighting is a separate life-safety control." }
  },
  {
    id: "d3q18", d: 3, topic: "Cloud responsibility", diff: 2,
    stem: "Under the shared responsibility model for infrastructure as a service (IaaS), which task remains the customer's responsibility?",
    options: ["Physical security of the data centre", "Patching the guest operating system", "Maintaining the hypervisor", "Securing the provider's network backbone"],
    answer: 1,
    whyText: "In IaaS, the provider secures the physical facility, hypervisor, and underlying network. The customer is responsible for the guest OS, applications, identities, and data.",
    lens: "The responsibility boundary moves with the service model. IaaS leaves the most with the customer; SaaS leaves the least.",
    why: { 0: "Physical security belongs to the provider.", 2: "The hypervisor is provider-managed in IaaS.", 3: "The provider secures its backbone." }
  },
  {
    id: "d3q19", d: 3, topic: "Virtualisation threats", diff: 2,
    stem: "An attacker exploits a vulnerability in a hypervisor to execute code outside a guest virtual machine. What is this attack called?",
    options: ["VM escape", "Hypervisor introspection", "Blue pill attack", "Docker escape"],
    answer: 0,
    whyText: "A VM escape breaks the isolation boundary between a guest and the hypervisor or host, potentially compromising other guests.",
    lens: "Hypervisors are high-value targets because they concentrate trust. Container escapes are related but exploit a different boundary.",
    why: { 1: "Introspection is a monitoring technique, not an escape from the guest.", 2: "Blue pill is a virtualization rootkit technique, not the general term for hypervisor escape.", 3: "Docker escape targets containers, not the hypervisor boundary." }
  },
  {
    id: "d3q20", d: 3, topic: "Container isolation", diff: 2,
    stem: "Which statement best describes the isolation difference between containers and virtual machines?",
    options: ["Containers use hardware virtualisation, but share the guest operating system", "Containers share the host kernel, so a kernel vulnerability can affect multiple containers", "Containers rely on hypervisor-level isolation, while virtual machines use namespaces", "Containers cannot be network-segmented, so they are limited to single-host deployments"],
    answer: 1,
    whyText: "Containers share the host operating-system kernel, which makes them lighter but means kernel compromise can cross container boundaries. VMs each run a separate guest kernel.",
    lens: "Containers isolate processes, not kernels. That changes both the attack surface and the blast radius.",
    why: { 0: "Containers share the host kernel; VMs each have their own kernel.", 2: "The isolation mechanisms are reversed: containers use namespaces and cgroups, VMs use a hypervisor.", 3: "Containers can be segmented with network policies and CNI plugins." }
  }
]);
