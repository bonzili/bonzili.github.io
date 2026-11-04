/* Domain 4 — Communication and Network Security. Original practice questions. */
(window.CISSP = window.CISSP || {}).questions = (window.CISSP.questions || []).concat([
  {
    id: "d4q1", d: 4, topic: "OSI model", diff: 1,
    stem: "At which OSI layer does a router primarily operate when it forwards packets between networks?",
    options: ["Data link layer", "Network layer", "Transport layer", "Session layer"],
    answer: 1,
    whyText: "Routers operate at the network layer (layer 3), forwarding packets based on logical addressing and routing tables. Switches primarily operate at layer 2.",
    lens: "Map the device to its highest layer of decision-making: hub layer 1, switch layer 2, router layer 3, application proxy layer 7.",
    why: { 0: "Layer 2 forwards frames using MAC addresses.", 2: "Layer 4 handles end-to-end transport and ports.", 3: "Layer 5 manages sessions." }
  },
  {
    id: "d4q2", d: 4, topic: "PDUs", diff: 1,
    stem: "A network engineer is analysing a capture and needs the unit that carries TCP port numbers, sequence numbers, and acknowledgements. What is the protocol data unit at the transport layer?",
    options: ["Bit", "Frame", "Packet", "Segment"],
    answer: 3,
    whyText: "The transport layer PDU is a segment (TCP) or datagram (UDP). Network layer uses packets, data link uses frames, physical uses bits.",
    lens: "Remember the stack: bits, frames, packets, segments, data.",
    why: { 0: "A bit is the physical-layer unit.", 1: "A frame is the data-link-layer unit.", 2: "A packet is the network-layer unit." }
  },
  {
    id: "d4q3", d: 4, topic: "TCP and UDP", diff: 1,
    stem: "A monitoring system sends short, periodic status queries where occasional loss is acceptable and low overhead matters. Which transport protocol is the better fit?",
    options: ["TCP, because it guarantees delivery", "UDP, because it is connectionless and has lower overhead", "SCTP, because it provides message boundaries and multihoming", "TCP with a small window, because it avoids congestion"],
    answer: 1,
    whyText: "UDP is connectionless and does not guarantee delivery or ordering, which suits short queries where retransmission overhead is unnecessary. TCP is better when reliability and ordering matter.",
    lens: "Choose transport by the application's tolerance for loss versus its need for reliability. Not every application needs TCP.",
    why: { 0: "Reliability is unnecessary here and adds overhead.", 2: "SCTP is reliable and connection-oriented; it adds overhead the scenario does not need.", 3: "TCP still guarantees delivery and adds handshake overhead." }
  },
  {
    id: "d4q4", d: 4, topic: "IPsec", diff: 2,
    stem: "A site-to-site VPN must protect both the confidentiality and integrity of traffic between two offices. Which IPsec component should be used?",
    options: ["Authentication Header (AH)", "Encapsulating Security Payload (ESP)", "Internet Key Exchange (IKE) without IPsec", "Generic Routing Encapsulation (GRE) alone"],
    answer: 1,
    whyText: "ESP provides confidentiality through encryption and also integrity and authentication. AH provides integrity and authentication but does not encrypt the payload.",
    lens: "Confidentiality requirement → ESP. Integrity only → AH. GRE alone provides tunnelling without encryption.",
    why: { 0: "AH does not provide confidentiality.", 2: "IKE negotiates keys and security associations; it does not itself protect the data plane.", 3: "GRE is a tunnelling protocol and not a security protocol." }
  },
  {
    id: "d4q5", d: 4, topic: "IPsec modes", diff: 2,
    stem: "Two branch offices connect through an untrusted network using IPsec. The entire original IP packet must be protected between the gateways. Which mode is required?",
    options: ["Transport mode", "Tunnel mode", "Transport mode with ESP", "Tunnel mode with GRE"],
    answer: 1,
    whyText: "Tunnel mode encapsulates the entire original IP packet inside a new IP packet, protecting the internal addressing as well. Transport mode protects the payload but leaves the original IP header visible.",
    lens: "Host-to-host payload protection = transport mode. Gateway-to-gateway or full packet protection = tunnel mode.",
    why: { 0: "Transport mode does not protect the original IP header.", 2: "Transport mode protects the payload, not the entire original IP packet.", 3: "GRE is a tunneling protocol, not an IPsec mode." }
  },
  {
    id: "d4q6", d: 4, topic: "TLS and HTTPS", diff: 2,
    stem: "A user connects to a banking website over HTTPS. What does the TLS handshake primarily establish before application data is sent?",
    options: ["A shared symmetric session key and server authentication", "A shared symmetric key and client authentication", "A digital certificate for the user and a session key", "A one-time password and a compressed session"],
    answer: 0,
    whyText: "TLS authenticates the server via its certificate, negotiates algorithms, and establishes shared symmetric keys for the session. The certificate does not prove the application is free of flaws.",
    lens: "TLS solves channel security and server identity. It does not solve application authorization or vulnerability.",
    why: { 1: "TLS authenticates the server by default; client authentication is optional.", 2: "The handshake authenticates the server, not necessarily the user.", 3: "A one-time password is an application authentication method, not the TLS handshake’s primary output." }
  },
  {
    id: "d4q7", d: 4, topic: "DNSSEC", diff: 2,
    stem: "An attacker poisons a DNS resolver's cache so users are redirected to a fraudulent site. Which control lets the resolver verify that the DNS records it receives are authentic and unmodified?",
    options: ["DNS over HTTPS with certificate pinning", "Integrity and authenticity of DNS responses through digital signatures", "DNS response rate limiting and cache locking", "Split-horizon DNS with internal zones"],
    answer: 1,
    whyText: "DNSSEC signs DNS records so resolvers can verify that the data is authentic and unmodified. It does not encrypt queries or hide the client's identity.",
    lens: "DNSSEC = integrity and authenticity, not confidentiality. DoH/DoT provide query confidentiality.",
    why: { 0: "DoH encrypts the query path but does not validate the origin of the records.", 2: "Rate limiting and cache locking reduce some poisoning attempts but do not prove authenticity.", 3: "Split-horizon DNS separates views; it does not sign or validate records." }
  },
  {
    id: "d4q8", d: 4, topic: "Email authentication", diff: 2,
    stem: "An organisation wants receiving mail servers to verify that messages claiming to come from its domain were authorised by it, and to act on failures. Which combination is designed for this?",
    options: ["SPF, DKIM, and DMARC", "SPF and DKIM without DMARC", "DMARC and ARC without SPF", "MTA-STS and TLS-RPT"],
    answer: 0,
    whyText: "SPF authorises sending hosts, DKIM signs messages, and DMARC ties the results to a published policy for handling failures.",
    lens: "SPF checks the envelope sender, DKIM signs the message, DMARC tells the receiver what to do when either fails.",
    why: { 1: "SPF and DKIM authenticate parts of the message, but without DMARC the domain owner has no policy for failures.", 2: "DMARC depends on SPF or DKIM alignment; ARC helps forwarding but is not a complete policy.", 3: "MTA-STS and TLS-RPT protect transport and report failures; they do not authorize sending domains." }
  },
  {
    id: "d4q9", d: 4, topic: "Wireless authentication", diff: 2,
    stem: "An enterprise wants each employee to authenticate to Wi-Fi with individual credentials and receive role-based network access. Which architecture is most appropriate?",
    options: ["WPA2-Personal with a shared passphrase", "WPA2-Enterprise with 802.1X and RADIUS", "WPA3-Personal with SAE and a shared passphrase", "WPA2-Enterprise with a pre-shared key and MAC filtering"],
    answer: 1,
    whyText: "WPA2-Enterprise uses 802.1X to authenticate individual users or devices against a RADIUS server, enabling per-user credentials and policy. WPA2-Personal uses one shared key.",
    lens: "Personal = shared PSK. Enterprise = 802.1X + authentication server. Individual accountability requires Enterprise.",
    why: { 0: "A shared passphrase cannot identify individual users.", 2: "WPA3-Personal improves the handshake but still uses a shared passphrase, not individual credentials.", 3: "A pre-shared key does not provide individual authentication; MAC filtering is easily spoofed." }
  },
  {
    id: "d4q10", d: 4, topic: "Wireless key management", diff: 2,
    stem: "A small office uses WPA2-Personal. An employee who knows the Wi-Fi passphrase leaves the company. What is the primary security concern?",
    options: ["The former employee can still connect until the shared key is changed for everyone", "The former employee can decrypt other users' HTTPS sessions", "The former employee can join only if the SSID is hidden", "The former employee's device is automatically blocked by 802.1X"],
    answer: 0,
    whyText: "WPA2-Personal uses a pre-shared key shared by all users. Without per-user credentials, the key must be changed and redistributed when someone leaves, disrupting everyone.",
    lens: "Shared secrets destroy individual revocation. Enterprise authentication exists to solve exactly this.",
    why: { 1: "HTTPS sessions are protected by TLS, not by the Wi-Fi key alone.", 2: "Hiding the SSID is not an access control.", 3: "WPA2-Personal does not use 802.1X or per-user certificates." }
  },
  {
    id: "d4q11", d: 4, topic: "Rogue access points", diff: 1,
    stem: "An attacker sets up a wireless access point with the same SSID as a legitimate café network to capture user traffic. What is this attack called?",
    options: ["Evil twin", "Bluejacking", "Wardriving", "A deauthentication attack"],
    answer: 0,
    whyText: "An evil twin impersonates a legitimate access point to lure users into connecting, enabling traffic interception or credential capture.",
    lens: "Evil twin = rogue AP impersonating a trusted SSID. Defence includes certificate validation, WIPS, and avoiding untrusted networks.",
    why: { 1: "Bluejacking sends unsolicited Bluetooth messages.", 2: "Wardriving is the practice of discovering wireless networks.", 3: "Deauthentication disrupts existing connections; it does not impersonate the network." }
  },
  {
    id: "d4q12", d: 4, topic: "ARP attacks", diff: 2,
    stem: "An attacker on the same local network sends forged ARP replies so that traffic destined for the gateway flows through the attacker's host. Which attack is this?",
    options: ["DNS poisoning", "ARP poisoning leading to man-in-the-middle", "VLAN hopping", "SYN flood"],
    answer: 1,
    whyText: "ARP poisoning corrupts the victim's ARP cache, associating the gateway's IP address with the attacker's MAC address. This positions the attacker for man-in-the-middle interception.",
    lens: "ARP has no authentication. Dynamic ARP inspection, static mappings, and segmentation reduce the exposure.",
    why: { 0: "DNS poisoning targets name resolution, not local MAC-to-IP mappings.", 2: "VLAN hopping crosses layer-2 segmentation.", 3: "A SYN flood exhausts connection state." }
  },
  {
    id: "d4q13", d: 4, topic: "DDoS", diff: 2,
    stem: "A public web service is overwhelmed by a volumetric DDoS attack that saturates its internet link. Which control is most effective at the network edge?",
    options: ["Enable SYN cookies on the web servers", "Use upstream scrubbing and rate limiting", "Add a web application firewall in blocking mode", "Increase the server's TCP backlog"],
    answer: 1,
    whyText: "Volumetric attacks consume bandwidth before reaching the application. Upstream scrubbing centres and rate limiting absorb or filter the traffic before it saturates the link.",
    lens: "Match the DDoS type to the defence: volumetric needs upstream capacity and scrubbing; application-layer needs caching, rate limits, and WAF rules.",
    why: { 0: "SYN cookies help with SYN floods, not a volumetric link saturation.", 2: "A WAF filters application attacks, not a link-saturating flood.", 3: "A larger backlog does not increase link capacity." }
  },
  {
    id: "d4q14", d: 4, topic: "Firewalls", diff: 2,
    stem: "A firewall allows an internal client to initiate an outbound connection and automatically permits the return traffic for that session. Which capability is being used?",
    options: ["Stateless packet filtering", "Stateful inspection", "Application proxying", "Network address translation"],
    answer: 1,
    whyText: "A stateful firewall tracks connection state and permits return traffic that belongs to an established session. A stateless filter would require an explicit rule for the return direction.",
    lens: "Stateful remembers the conversation; stateless evaluates each packet in isolation.",
    why: { 0: "Stateless filtering does not track sessions.", 2: "A proxy terminates and re-originates connections; the scenario describes state tracking.", 3: "NAT translates addresses and does not by itself permit return traffic." }
  },
  {
    id: "d4q15", d: 4, topic: "IDS and IPS", diff: 1,
    stem: "A security team needs to block malicious traffic inline before it reaches a protected server. Which control best meets this requirement?",
    options: ["Network-based IDS in promiscuous mode", "Network-based IPS in inline mode", "A syslog server", "A honeypot"],
    answer: 1,
    whyText: "An IPS is deployed inline and can drop malicious traffic. An IDS detects and alerts but does not block by itself.",
    lens: "IDS = detect and alert. IPS = detect and block. The question's verb tells you which.",
    why: { 0: "An IDS in promiscuous mode observes a copy of traffic and cannot block.", 2: "A syslog server collects logs and does not inspect traffic inline.", 3: "A honeypot is a decoy, not a production blocking control." }
  },
  {
    id: "d4q16", d: 4, topic: "WAF", diff: 1,
    stem: "Which control is specifically designed to inspect HTTP requests and block application-layer attacks such as SQL injection and cross-site scripting?",
    options: ["A web application firewall", "A stateful packet filter", "A VPN concentrator", "A load balancer"],
    answer: 0,
    whyText: "A WAF understands HTTP and can apply rules or models to block application-layer attacks. A network firewall mainly enforces address and port policy.",
    lens: "Layer 7 attacks need layer 7 inspection. A WAF is not a substitute for secure code, but it is the network control aimed at these flaws.",
    why: { 1: "A packet filter does not understand HTTP semantics.", 2: "A VPN concentrator terminates encrypted tunnels.", 3: "A load balancer distributes traffic and may offer limited inspection, but is not the primary control." }
  },
  {
    id: "d4q17", d: 4, topic: "NAC", diff: 2,
    stem: "An organisation wants to check whether a device has current antivirus and patches before allowing it onto the corporate network. Which control should it deploy?",
    options: ["Network access control", "A web application firewall", "A reverse proxy", "DNS security extensions"],
    answer: 0,
    whyText: "NAC evaluates endpoint posture and identity before admission, and can quarantine non-compliant devices or restrict them to a remediation network.",
    lens: "NAC is about admission decisions: who and what may join the network, and under what conditions.",
    why: { 1: "A WAF protects web applications.", 2: "A reverse proxy fronts web servers.", 3: "DNSSEC protects DNS integrity." }
  },
  {
    id: "d4q18", d: 4, topic: "VLAN security", diff: 2,
    stem: "Which practice most directly reduces the risk of VLAN hopping on a switch?",
    options: ["Disable unused ports and avoid automatic trunk negotiation on access ports", "Enable dynamic trunking on access ports", "Use the default VLAN for management traffic", "Allow native VLAN tagging on all access ports"],
    answer: 0,
    whyText: "VLAN hopping often abuses trunk negotiation or double-tagged frames. Disabling unused ports, hard-setting access ports, and restricting trunk negotiation reduce the attack surface.",
    lens: "A VLAN is a segmentation convenience, not a hard security boundary. Configure ports explicitly and limit trunk reach.",
    why: { 1: "Dynamic trunking on access ports can be negotiated by an attacker.", 2: "Management traffic on the default VLAN increases exposure.", 3: "Native VLAN tagging is a common hopping vector." }
  },
  {
    id: "d4q19", d: 4, topic: "NAT", diff: 1,
    stem: "Which statement about network address translation (NAT) is correct?",
    options: ["NAT provides stateful inspection of application traffic", "NAT conserves public addresses and obscures internal addressing, but does not enforce security policy", "NAT hides internal addresses but preserves end-to-end integrity", "NAT is a routing technique that also authenticates clients"],
    answer: 1,
    whyText: "NAT maps private addresses to public addresses and hides internal structure, but it does not inspect or enforce policy. It is not a substitute for a firewall.",
    lens: "Obscurity is not control. NAT may complicate an attacker's view, but it does not decide what traffic is allowed.",
    why: { 0: "NAT translates addresses; it does not inspect application payloads.", 2: "NAT modifies addresses and does not provide integrity protection.", 3: "NAT does not authenticate clients." }
  },
  {
    id: "d4q20", d: 4, topic: "Zero trust", diff: 2,
    stem: "Which principle best describes a zero-trust network architecture?",
    options: ["Trust internal traffic but verify external traffic", "Verify identity and context for every request, regardless of network location", "Segment the network into VLANs and trust each segment", "Apply least privilege only to remote workers"],
    answer: 1,
    whyText: "Zero trust removes implicit trust based on network location. Every request is authenticated and authorized using identity, device posture, and context.",
    lens: "The perimeter is no longer the trust boundary. Identity and policy follow the request.",
    why: { 0: "Zero trust does not grant implicit trust based on network location.", 2: "Segmentation is useful but does not replace per-request verification.", 3: "Least privilege applies to all users and workloads, not just remote workers." }
  }
]);
