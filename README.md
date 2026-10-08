# XSS Virtual Lab - Educational Cybersecurity Laboratory

Professional, isolated, and functional XSS (Cross-Site Scripting) educational laboratory built with Electron, React, TypeScript, Docker, and Node.js.

## Overview

This application provides a complete, hands-on learning experience for cybersecurity students to understand, observe, and mitigate Cross-Site Scripting (XSS) vulnerabilities in a **completely isolated, local environment**.

**Key Features:**
- ✅ Fully functional Electron desktop application
- ✅ Interactive XSS demonstration with safe payloads
- ✅ Vulnerable AND secure implementations side-by-side
- ✅ Isolated Docker container (no external network access)
- ✅ Comprehensive theory and assessment
- ✅ Real-time activity logging
- ✅ Professional cybersecurity dashboard UI

## Learning Objectives

Upon completing this lab, students will:
- Understand XSS fundamentals and vulnerability types
- Identify root causes of XSS in web applications
- Perform safe, controlled XSS demonstrations
- Observe and explain browser-side impacts
- Understand and apply output encoding/sanitization
- Compare vulnerable vs. secure implementations
- Score 70%+ on comprehensive assessment quiz

## Architecture

```
XSS Virtual Lab
├── Electron Desktop App (Main Controller)
│   ├── React UI (Tab Navigation)
│   ├── Zustand State Management
│   └── IPC Bridge to Lab Controller
│
├── Lab Controller (Node.js)
│   ├── Docker Compose Orchestration
│   └── Health Checks & Lifecycle
│
└── Target Container (Isolated)
    ├── Express.js API Server
    ├── Vulnerable endpoint (no encoding)
    ├── Secure endpoint (output encoded)
    └── Activity Logger
```

## Technology Stack

**Frontend:**
- Electron 27
- React 18
- TypeScript 5
- Tailwind CSS 3
- Lucide React Icons
- Zustand (State Management)
- Axios (HTTP Client)
- Vite (Build Tool)

**Backend:**
- Node.js 20 (Alpine)
- Express.js 4
- CORS & Body Parser middleware

**Infrastructure:**
- Docker & Docker Compose
- Isolated network (172.24.0.0/16)
- Resource limits: 512MB RAM, 1 CPU

**Development:**
- Vitest (Testing)
- Concurrently (Dev workflow)
- Wait-on (Port polling)

## Prerequisites

- **Docker Desktop** (installed and running)
- **Node.js 18+** with npm
- **Git** (for cloning)
- **4GB RAM** minimum
- **Port 3000** available (for target application)
- **Windows 10/11, macOS, or Linux**

### Verify Prerequisites

```bash
docker --version          # Should be Docker 20.10+
docker-compose --version  # Should be Docker Compose 1.29+
node --version            # Should be v18 or higher
npm --version             # Should be 8 or higher
```

## Installation

### 1. Clone or Extract Project

```bash
cd xss-virtual-lab
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Electron & dev tools
- React & frontend dependencies
- Vite build tool
- TypeScript

### 3. Build Docker Image

```bash
npm run docker:build
```

This creates the Docker image for the intentionally vulnerable target application.

## Running the Application

### Development Mode (with Hot Reload)

```bash
npm run electron-dev
```

This:
1. Starts Vite dev server on http://localhost:5173
2. Launches Electron app with DevTools open
3. Auto-reloads on code changes

### Production Build

```bash
npm run build
```

Creates optimized Electron app in `dist/`.

### Start the Lab

1. Open the application
2. Go to **Lab Setup** tab
3. Click **Check Environment** to verify Docker/Node
4. Click **Start Lab**
5. Wait for health checks (10-15 seconds)
6. Status changes to "Running"

### Stop/Reset the Lab

```bash
npm run docker:down    # Stop containers
npm run docker:down -v # Remove volumes and reset
```

Or use the UI buttons in Lab Setup tab.

## Lab Workflow

### Expected Student Journey:

1. **Overview** — Understand the experiment scope
2. **Theory** — Learn XSS fundamentals
3. **Lab Setup** — Start isolated Docker environment
4. **XSS Simulation** — Run interactive demonstrations
   - Normal input (baseline)
   - XSS payload (safe alert)
   - Compare vulnerable vs. secure modes
5. **Comparison** — View side-by-side code
6. **Activity Log** — Review all actions
7. **Assessment** — Complete 12-question quiz (70% pass)
8. **References** — Access authoritative resources
9. **Feedback** — Provide improvement suggestions

## Using the XSS Simulation

### Vulnerable Mode

1. Select **Vulnerable** mode
2. Keep username as "Student" or change it
3. Select input type:
   - **Normal Input**: Baseline test
   - **XSS Demonstration**: Safe alert payload
4. Click **Run Demonstration**
5. Comments section shows rendered output
6. **In vulnerable mode**: JavaScript `alert()` executes (demonstrates XSS)
7. Check Activity Log for event details

### Secure Mode

1. Select **Secure** mode
2. Use same settings as above
3. Click **Run Demonstration**
4. **In secure mode**: Payload rendered as plain text
5. Script does NOT execute (demonstrates mitigation)
6. Compare the difference

### Safe Payload Used

```
<script>alert('XSS Demonstration')</script>
```

This is intentionally safe for an educational lab. It proves execution without causing harm.

## Testing

### Run Tests

```bash
npm test
```

Tests verify:
- Lab startup/shutdown
- Docker health checks
- Vulnerable/secure endpoints
- Input handling
- API responses
- UI rendering

### Manual Testing Checklist

- [ ] Docker starts without errors
- [ ] Health check passes within 15s
- [ ] Vulnerable endpoint accepts XSS payload
- [ ] Secure endpoint escapes HTML entities
- [ ] Activity log records all events
- [ ] Quiz calculates score correctly
- [ ] UI renders all tabs without errors
- [ ] Stop/Reset work correctly
- [ ] No external network calls made

## Project Structure

```
xss-virtual-lab/
├── README.md                    # This file
├── package.json                 # Node dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js           # Tailwind CSS
├── postcss.config.js            # PostCSS
├── tsconfig.json                # TypeScript
├── index.html                   # React entry point
├── lab.yaml                     # Lab manifest
├── docker-compose.yml           # Docker orchestration
│
├── electron/
│   ├── main.ts                  # Electron main process
│   ├── preload.ts               # IPC preload script
│   └── ipc/
│       └── labController.js     # Lab lifecycle management
│
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Main app component
│   ├── index.css                # Global styles
│   │
│   ├── components/
│   │   ├── Navigation.tsx        # Tab navigation
│   │   └── TopBar.tsx            # Status bar
│   │
│   ├── pages/
│   │   ├── Overview.tsx          # Intro & quick start
│   │   ├── Theory.tsx            # XSS education
│   │   ├── LabSetup.tsx          # Environment setup
│   │   ├── XSSSimulation.tsx      # Main demonstration
│   │   ├── Comparison.tsx        # Vulnerable vs Secure
│   │   ├── ActivityLog.tsx       # Event history
│   │   ├── Assessment.tsx        # 12-question quiz
│   │   ├── References.tsx        # External resources
│   │   └── Feedback.tsx          # User feedback form
│   │
│   └── store/
│       └── labStore.ts          # Zustand state management
│
├── target/
│   ├── Dockerfile               # Container definition
│   ├── package.json             # Node dependencies
│   └── src/
│       ├── server.js            # Express app
│       ├── vulnerable.js        # Unsafe handler
│       ├── secure.js            # Safe handler
│       └── logger.js            # Activity logger
│
├── docs/
│   ├── theory.md                # Detailed XSS theory
│   ├── procedure.md             # Step-by-step experiment
│   ├── viva.md                  # 15 Viva questions
│   ├── references.md            # Curated resources
│   └── screenshots.md           # UI screenshots
│
├── tests/
│   ├── vulnerable.test.js       # Vulnerability tests
│   ├── secure.test.js           # Mitigation tests
│   └── integration.test.js      # End-to-end
│
└── scripts/
    ├── start-lab                # Start container
    ├── stop-lab                 # Stop container
    ├── reset-lab                # Reset to clean state
    └── health-check             # Verify lab health
```

## Safety & Isolation Model

### Network Isolation
- ✅ Containers run on isolated Docker network `xss-lab-network`
- ✅ Only localhost:3000 exposed
- ✅ No external network access
- ✅ No LAN scanning or remote connections

### Resource Limits
- ✅ CPU: 1 core max
- ✅ Memory: 512MB limit / 256MB reservation
- ✅ No disk I/O attacks possible

### Safe Demonstration
- ✅ Only harmless `alert()` payload used
- ✅ No credential theft, cookie theft, or session hijacking
- ✅ No keylogging or phishing attempts
- ✅ No malware or persistence
- ✅ No data exfiltration

### Restrictions Enforced
```yaml
No:
  - External HTTP/HTTPS requests
  - LAN device discovery
  - Privilege escalation
  - Container escape attempts
  - Malicious persistence
```

## API Endpoints (Local Only)

All endpoints accessible at `http://localhost:3000`:

```
POST   /api/vulnerable/submit     # Submit to vulnerable handler
POST   /api/secure/submit          # Submit to secure handler
GET    /api/comments/vulnerable    # Fetch vulnerable comments
GET    /api/comments/secure        # Fetch secure comments
POST   /api/comments/clear         # Clear all comments
GET    /api/health                 # Health check
GET    /api/logs                   # Fetch server logs
```

## Common Issues & Troubleshooting

### Docker Not Running
```
Error: Docker daemon is not running
Solution: Start Docker Desktop
```

### Port 3000 Already In Use
```
Error: Port 3000 is already allocated
Solution: 
  1. Stop other services using port 3000
  2. Or modify docker-compose.yml port mapping
```

### Containers Won't Start
```
Error: Cannot connect to Docker daemon
Solution: Restart Docker and check resources
```

### Lab Health Check Fails
```
Error: Health check timeout
Solution: 
  1. Check: docker-compose logs
  2. Verify: 4GB RAM available
  3. Retry: Click "Start Lab" again
```

### Electron App Won't Launch
```
Error: Failed to create window
Solution:
  1. npm install
  2. npm run build
  3. npm run electron
```

## Documentation

See `docs/` directory for:
- **theory.md** — Comprehensive XSS theory (college-level)
- **procedure.md** — Step-by-step lab procedure with expected outputs
- **viva.md** — 15 viva questions with answers
- **references.md** — Authoritative external resources

## Viva Questions (Sample)

1. Define XSS and explain its impact
2. What are the three main types of XSS?
3. Explain the difference between reflected and stored XSS
4. Why does output encoding prevent XSS?
5. What is the role of the browser in XSS attacks?
6. How does Content Security Policy help mitigate XSS?
7. Why should user input always be considered untrusted?
8. Explain the vulnerable implementation used in this lab
9. How does the secure implementation prevent XSS?
10. What are the limitations of input validation alone?
11. How would you test for XSS vulnerabilities?
12. Explain defense-in-depth for XSS prevention
13. What is the OWASP ranking of XSS?
14. How can developers detect XSS in code review?
15. Why is this lab isolated and not connected to the internet?

(See `docs/viva.md` for complete answers)

## Assessment Quiz

**12 comprehensive questions** covering:
- XSS definition and types
- Root causes
- Prevention techniques
- Output encoding
- Content Security Policy
- Lab demonstrations
- Secure vs vulnerable code

**Passing Score:** 70% (9/12 correct)

Results include:
- Final score
- Correct/incorrect count
- Detailed explanations for each answer
- Pass/fail status

## Activity Logging

All lab actions are logged:
- Lab startup/shutdown
- Health checks
- Demonstrations run
- Normal vs XSS inputs
- Vulnerable vs Secure modes
- System errors
- User submissions

Logs can be:
- Viewed in Activity Log tab
- Filtered by level (Info, Success, Warning, Error)
- Exported as CSV
- Cleared for fresh start

## Running Tests

```bash
# Run all tests
npm test

# Run specific test
npm test vulnerable.test.js

# Watch mode
npm test -- --watch
```

Test categories:
- ✅ Unit tests (isolated functions)
- ✅ Integration tests (endpoints)
- ✅ E2E tests (full workflow)

## Building for Production

```bash
# Build React app
npm run build

# Build Electron app
npm run electron

# Create distributable
# (Platform-specific: .exe on Windows, .dmg on Mac, etc.)
```

## Contributing & Development

### Development Workflow

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run electron-dev

# In another terminal, check Docker logs
npm run docker:logs

# Edit React components in src/pages/ and src/components/
# Changes hot-reload automatically
```

### Code Style
- TypeScript strict mode
- ESLint for code quality
- Tailwind CSS for styling
- Component-driven architecture

## License

Educational use - XSS Virtual Lab
Created for teaching cybersecurity concepts in isolated environments.

## Credits

Built with:
- Electron (desktop framework)
- React (UI library)
- Express.js (backend)
- Docker (containerization)
- OWASP (security guidance)

## Disclaimer

⚠️ **EDUCATIONAL PURPOSE ONLY**

This lab intentionally contains vulnerabilities to demonstrate XSS attacks.

**It is designed ONLY for:**
- Educational institutions
- Student learning
- Security awareness training
- Local, isolated environments

**DO NOT:**
- Deploy to production
- Expose to the internet
- Use for real attacks
- Modify for malicious purposes

All lab activities remain **completely local**. No data leaves your machine.

---

**Ready to learn?** Start with the **Overview** tab, then **Lab Setup** to begin!
