# XSS Virtual Lab - Experiment Procedure

**Experiment:** Cross-Site Scripting (XSS) Demonstration  
**Code:** XSS-01  
**Duration:** 45 minutes  
**Level:** Intermediate  
**Environment:** Isolated Docker Container

---

## Aim

To demonstrate how Cross-Site Scripting vulnerabilities occur when untrusted user input is rendered by a web application without appropriate output encoding or sanitization, and to demonstrate effective mitigation strategies.

---

## Objectives

After completing this experiment, the student will be able to:

1. **Understand XSS Fundamentals**
   - Define XSS and its types (Reflected, Stored, DOM-based)
   - Explain why XSS vulnerabilities occur
   - Identify the role of the browser in XSS attacks

2. **Identify Unsafe Input Handling**
   - Recognize when user input is treated as code
   - Understand the consequences of missing output encoding
   - Trace the data flow from user input to browser rendering

3. **Perform Safe Demonstrations**
   - Execute controlled XSS proofs in an isolated environment
   - Use harmless educational payloads only
   - Observe browser-side behavior safely

4. **Compare Implementations**
   - Analyze vulnerable code patterns
   - Review secure code patterns
   - Understand output encoding techniques

5. **Apply Mitigation**
   - Implement output encoding strategies
   - Verify mitigation effectiveness
   - Understand defense-in-depth approaches

6. **Assess Understanding**
   - Complete comprehensive quiz
   - Explain root causes and solutions
   - Score 70%+ on assessment

---

## Theory

### What is Cross-Site Scripting (XSS)?

Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. When the browser renders the page, it interprets the injected code as legitimate JavaScript and executes it in the victim's security context.

### Why Does XSS Occur?

XSS vulnerabilities occur when:

1. **Untrusted Input** — User-supplied data (form input, URL parameters, cookies) is accepted without validation
2. **Unsafe Output** — The application renders user data directly into HTML without encoding
3. **Browser Interpretation** — The browser interprets HTML/JavaScript and executes scripts
4. **Missing Sanitization** — No removal or escaping of potentially dangerous content

### Types of XSS

| Type | Description | Example | Risk |
|------|-------------|---------|------|
| **Reflected XSS** | Malicious code is reflected in immediate response | URL: `?name=<script>alert(1)</script>` | Medium |
| **Stored XSS** | Malicious code stored in database, displayed to all users | Comment: `<img src=x onerror=alert(1)>` | High |
| **DOM-based XSS** | Unsafe JavaScript manipulation of DOM | `element.innerHTML = userInput` | High |

### Attack Flow

```
User Input → Server → No Encoding → HTML Response → Browser → Script Execution
```

### Prevention Techniques

| Technique | How It Works | Example |
|-----------|------------|---------|
| **Output Encoding** | Convert special chars to entities | `<` → `&lt;` |
| **Input Validation** | Whitelist acceptable input | Reject all HTML tags |
| **Content Security Policy** | HTTP header restricts script sources | `script-src 'self'` |
| **DOM Methods** | Use textContent instead of innerHTML | `element.textContent = data` |
| **Template Engines** | Auto-escape by default | React, Vue, Angular |

---

## Procedure

### Step 1: Environment Setup (5 minutes)

**Objective:** Verify all prerequisites and start the lab

**Instructions:**

1. Open the XSS Virtual Lab application
2. Navigate to the **Lab Setup** tab
3. Verify prerequisites:
   - Docker is installed and running
   - Node.js is available
   - Port 3000 is available
4. Click **Check Environment**
5. Wait for all checks to pass ✓

**Expected Output:**
```
✓ Docker available
✓ Node.js available
✓ Network configuration ready
✓ Port 3000 available
```

**Troubleshooting:**
- If Docker check fails → Start Docker Desktop
- If port check fails → Close applications using port 3000
- If checks timeout → Verify 4GB RAM available

---

### Step 2: Theory Review (5 minutes)

**Objective:** Understand XSS concepts before demonstration

**Instructions:**

1. Navigate to **Theory** tab
2. Read sections in order:
   - "What is Cross-Site Scripting?"
   - "Why Does XSS Occur?"
   - "Types of XSS"
   - "XSS Attack Flow"
3. Focus on:
   - How untrusted input flows through a web application
   - Why output encoding prevents XSS
   - The role of the browser

**Key Concepts to Remember:**
- All user input is untrusted
- Output encoding converts dangerous characters to safe entities
- The browser interprets HTML/JavaScript - it doesn't know the source is malicious

---

### Step 3: Start Lab (3 minutes)

**Objective:** Initialize the Docker container with the vulnerable target

**Instructions:**

1. In **Lab Setup** tab, click **Start Lab**
2. Watch the status:
   - "Starting..." (10-15 seconds)
   - Health checks running
   - Target container initialization
3. Wait for status to change to **Running** ✓
4. Note the target URL: `http://localhost:3000`

**Expected Output:**
```
[10:20:04] Lab initialized
[10:20:10] Docker environment checked
[10:20:15] XSS target started
[10:20:20] Lab Running ✓
```

**If Lab Fails to Start:**
- Check Activity Log for error messages
- Verify Docker daemon is running
- Click Reset Lab, then try again

---

### Step 4: Observe Normal Behavior (5 minutes)

**Objective:** Establish baseline behavior with legitimate input

**Instructions:**

1. Navigate to **XSS Simulation** tab
2. Verify mode is set to **Vulnerable**
3. Keep username as "Student" (or enter your name)
4. Select **Normal Input** from dropdown
5. Click **Run Demonstration**

**Expected Output:**
```
Input:    "Hello, this is my first message!"
Response: 
{
  "mode": "vulnerable",
  "success": true,
  "message": "Comment submitted (VULNERABLE - no encoding)"
}
```

**What You'll See:**
- Comment appears in the Comments section
- Username and message render normally
- No script execution
- Normal HTML rendering confirmed

**Analysis:**
- This is the baseline - normal input works fine
- No security issue yet with normal data
- The system is vulnerable, but not triggered

---

### Step 5: Trigger Vulnerable XSS (5 minutes)

**Objective:** Demonstrate XSS execution in vulnerable mode

**Instructions:**

1. Still in **XSS Simulation** tab
2. Keep mode as **Vulnerable**
3. Username: "Student"
4. Select **XSS Demonstration** from dropdown
5. Click **Run Demonstration**

**Payload Being Submitted:**
```html
<script>alert('XSS Demonstration')</script>
```

**Expected Output:**
```
Input:    "<script>alert('XSS Demonstration')</script>"
Mode:     VULNERABLE
Status:   XSS Executed ✓
```

**What You'll See:**
- An `alert()` dialog box appears saying "XSS Demonstration"
- The script executed successfully
- This proves the vulnerability
- Click OK to close the alert

**Analysis:**
- The browser interpreted the injected `<script>` tag as legitimate code
- The `alert()` function executed in the browser's JavaScript context
- The application rendered user input as code, not as text
- This is the vulnerability in action

---

### Step 6: Review Vulnerable Code (3 minutes)

**Objective:** Understand why the vulnerability exists

**Instructions:**

1. Navigate to **Vulnerable vs Secure** tab
2. Review the **Vulnerable Code** section (left side)
3. Focus on:
   - Server-side: No output encoding applied
   - Client-side: Using `dangerouslySetInnerHTML`
4. Note the comment: "VULNERABLE: No output encoding"

**Key Code Patterns:**
```javascript
// VULNERABLE
const htmlContent = `<div><strong>${username}</strong>: ${comment}</div>`
// ❌ User input inserted directly - no encoding

// SECURE
const htmlContent = `<div><strong>${escapeHtml(username)}</strong>: ${escapeHtml(comment)}</div>`
// ✓ User input encoded - safe rendering
```

**Root Cause Identified:**
- Input is not HTML-encoded
- `<`, `>`, `&` characters retain their HTML meaning
- Browser interprets injected tags as code

---

### Step 7: Switch to Secure Mode (3 minutes)

**Objective:** Observe how mitigation prevents XSS

**Instructions:**

1. Still in **XSS Simulation** tab
2. Change mode to **Secure**
3. Username: "Student"
4. Select **XSS Demonstration** (same payload)
5. Click **Run Demonstration**

**Same Payload:**
```html
<script>alert('XSS Demonstration')</script>
```

**Expected Output:**
```
Input:    "<script>alert('XSS Demonstration')</script>"
Mode:     SECURE
Status:   Safe Rendering ✓
Result:   Payload displayed as text (not executed)
```

**What You'll See:**
- NO alert dialog appears
- The comment displays the literal text: `<script>alert('XSS Demonstration')</script>`
- The payload is visible but not executed
- This is the correct behavior

**Analysis:**
- Output encoding converted `<` to `&lt;` and `>` to `&gt;`
- Browser renders these as text, not as HTML tags
- No script execution - vulnerability prevented

---

### Step 8: Compare Side-by-Side (3 minutes)

**Objective:** Understand the difference between implementations

**Instructions:**

1. Navigate to **Vulnerable vs Secure** tab
2. Review the comparison table
3. Note differences:
   - **Output Encoding:** Vulnerable = None, Secure = HTML entities
   - **Script Execution:** Vulnerable = Allowed, Secure = Prevented
   - **OWASP Rating:** Vulnerable = Critical, Secure = Compliant

**Key Takeaway:**
```
Vulnerable:  Input → No Encoding → Browser → Script Executes ❌
Secure:      Input → HTML Encoding → Browser → Rendered as Text ✓
```

---

### Step 9: Review Activity Log (2 minutes)

**Objective:** Verify all actions were recorded

**Instructions:**

1. Navigate to **Activity Log** tab
2. Review recorded events:
   - Lab initialization
   - Normal input submission
   - Vulnerable demonstration (with XSS)
   - Secure demonstration (same input, safe)
3. Note timestamps and event levels

**Expected Entries:**
```
[10:20:15] Lab initialized
[10:20:30] Vulnerable submission: Student (Hello, this is...)
[10:20:31] Vulnerable rendering detected
[10:20:40] XSS Executed ✓
[10:20:45] Secure submission: Student (XSS payload)
[10:20:45] Safe Rendering ✓
```

**What This Confirms:**
- All actions are logged
- Timeline of experiment recorded
- Demonstrates reproducibility

---

### Step 10: Complete Assessment Quiz (8 minutes)

**Objective:** Test understanding and assess learning

**Instructions:**

1. Navigate to **Assessment** tab
2. Click **Start Quiz**
3. Answer all 12 questions:
   - Multiple choice format
   - Topics: XSS types, prevention, lab demonstrations
4. Review each answer before submitting
5. Click **Submit Quiz**

**Expected Score:** 70% or higher (9/12 correct)

**Quiz Topics Covered:**
- XSS definition and impact
- Types of XSS (Reflected, Stored, DOM-based)
- Root causes of vulnerabilities
- Output encoding techniques
- Content Security Policy
- Lab demonstrations
- Comparison of vulnerable vs. secure code

**After Submission:**
- Review detailed feedback for each question
- Note explanations for correct answers
- Understand why some choices were wrong
- If score < 70%, review theory and retry

---

### Step 11: Stop Lab (1 minute)

**Objective:** Clean shutdown and resource cleanup

**Instructions:**

1. Navigate to **Lab Setup** tab
2. Click **Stop Lab**
3. Wait for status to change to "Stopped"

**Expected Output:**
```
[10:30:00] Lab shutting down
[10:30:05] Docker containers stopped
[10:30:10] Lab Stopped ✓
```

**Cleanup:**
- Docker containers are stopped
- Network is cleaned up
- Resources are freed
- Local data is preserved (logs, feedback)

---

## Expected Outputs Summary

### Normal Input
```
Mode:     Vulnerable
Input:    "Hello, this is my first message!"
Result:   Comment renders normally
Impact:   No security issue with legitimate data
```

### XSS in Vulnerable Mode
```
Mode:     Vulnerable
Payload:  <script>alert('XSS Demonstration')</script>
Result:   JavaScript alert() executes
Impact:   Vulnerability demonstrated
Root Cause: No output encoding applied
```

### XSS in Secure Mode
```
Mode:     Secure
Payload:  <script>alert('XSS Demonstration')</script>
Result:   Payload rendered as literal text
Impact:   Vulnerability prevented
Mitigation: Output encoding applied
```

### Activity Log
```
All events timestamped and categorized:
- Lab lifecycle events
- Demonstration submissions
- Vulnerability triggers
- Mitigation confirmations
```

### Assessment Results
```
Total Questions: 12
Passing Score: 70% (9/12)
Expected Topics: XSS types, prevention, lab observations
Result: PASS ✓
```

---

## Observations & Analysis

### What Happened?

1. **Normal Input:** Rendered without issues (baseline established)
2. **Vulnerable Mode + XSS:** Script executed - vulnerability confirmed
3. **Secure Mode + Same XSS:** Payload displayed as text - mitigation effective

### Root Cause Analysis

**Why did XSS execute in vulnerable mode?**
- User input was not HTML-encoded
- Special characters (<, >, &) retained their HTML meaning
- Browser interpreted `<script>` as a legitimate tag
- JavaScript code executed in the browser's security context

**Why was it prevented in secure mode?**
- Output encoding converted special characters to HTML entities
- `<` became `&lt;`, `>` became `&gt;`
- Browser rendered these as literal text, not as HTML tags
- No code interpretation by the browser

### Security Impact

**If This Was a Real Attack:**
- Attacker could steal session cookies
- User credentials could be harvested
- User's browser could be redirected
- Malware could be injected
- User's actions could be performed on their behalf

**How Output Encoding Prevents This:**
- Malicious scripts cannot be injected
- Browser treats user input as data, not code
- Attacker's intent is neutralized
- User is protected from the attack

---

## Key Learnings

1. **Trust Boundary:** User input crosses a trust boundary - it must be validated/encoded
2. **Output Context:** Encoding depends on output context (HTML, JavaScript, URL, CSS)
3. **Defense in Depth:** Multiple layers (encoding, CSP, input validation) are better
4. **Browser Role:** Browser interprets HTML/JS; it can't distinguish legitimate code from injected
5. **Importance of Encoding:** Output encoding is the primary XSS prevention technique
6. **Framework Defaults:** Modern frameworks (React, Vue) auto-escape by default - use this
7. **Never Trust Input:** Even from databases - if it came from user input originally, it's untrusted

---

## Mitigation Strategies (Applied in Lab)

| Strategy | Implementation | Effectiveness |
|----------|----------------|-----------------|
| Output Encoding | HTML entity encoding | ✓✓✓ Primary defense |
| Input Validation | Whitelist acceptable chars | ✓✓ Secondary layer |
| CSP Headers | Restrict script sources | ✓✓ Defense in depth |
| DOM Methods | Use textContent not innerHTML | ✓✓✓ Framework default |
| Sanitization | Remove dangerous HTML tags | ✓✓ For rich content |

---

## Troubleshooting During Procedure

| Issue | Cause | Solution |
|-------|-------|----------|
| Lab won't start | Docker not running | Start Docker Desktop |
| Alert doesn't appear | Port 3000 blocked | Check for port conflicts |
| Comments don't show | Network timeout | Verify internet; retry |
| Quiz won't submit | Browser cache | Clear cache; reload |
| Logs not appearing | Logger issue | Refresh Activity Log tab |

---

## Time Breakdown

- Step 1 (Setup): 5 min
- Step 2 (Theory): 5 min
- Step 3 (Start Lab): 3 min
- Step 4 (Normal Input): 5 min
- Step 5 (XSS Trigger): 5 min
- Step 6 (Code Review): 3 min
- Step 7 (Secure Mode): 3 min
- Step 8 (Compare): 3 min
- Step 9 (Logs): 2 min
- Step 10 (Quiz): 8 min
- Step 11 (Stop): 1 min

**Total: ~43 minutes** (allowing 2 min buffer)

---

## Assessment Criteria

### Knowledge
- Student understands XSS types and prevention
- Student can explain root causes
- Student scores 70%+ on quiz

### Skills
- Student can identify vulnerable code patterns
- Student can recognize output encoding
- Student can differentiate secure from vulnerable implementations

### Observation
- Student observes XSS execution in vulnerable mode
- Student observes XSS prevention in secure mode
- Student verifies difference through lab demonstration

### Analysis
- Student can explain why vulnerable mode failed
- Student can explain why secure mode succeeded
- Student understands the mitigation strategy

---

## Conclusion

This experiment successfully demonstrates:

✓ XSS vulnerability concepts in a controlled environment  
✓ Safe, isolated testing without internet exposure  
✓ Root causes of XSS vulnerabilities  
✓ Effectiveness of output encoding mitigation  
✓ Practical comparison of vulnerable vs. secure code  
✓ Assessment of student understanding through quiz  

Students complete the lab with practical knowledge of one of the OWASP Top 10 vulnerabilities and understanding of real-world prevention strategies.

---

**Experiment Complete** ✓
