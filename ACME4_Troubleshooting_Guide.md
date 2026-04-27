# ACME4 Troubleshooting Guide — IT Support Team

**Version:** 1.0 | **Date:** 2026-04-08 | **Author:** mnharidz (SIN18)
**Based on:** 478 tickets analyzed (Mar 24 – Apr 7, 2026) | **Resolution rate:** 91.8%

---

## Quick Diagnosis

| Symptom | Go To |
|---------|-------|
| "ACME service is not running on this device" | [Scenario A](#scenario-a-acme-not-running) |
| "Sync issue between AEA and ACME" | [Scenario B](#scenario-b-aea-acme-sync-failure) |
| ACME3 and ACME4 both installed | [Scenario C](#scenario-c-v3v4-dual-install-conflict) |
| `quarantine` commands "not recognized" | [Scenario D](#scenario-d-quarantine-commands-not-recognized) |
| ACME non-compliant / device isolated | [Scenario E](#scenario-e-non-compliant--isolated) |
| ACME4 won't install / can't start service | [Scenario F](#scenario-f-acme4-wont-install--service-wont-start) |
| Mobile cart / long-dormant laptop | [Scenario G](#scenario-g-mobile-cart--dormant-laptop) |

---

## Scenario A: ACME Not Running

**Tickets:** V2159342171, V2166935471, V2152578671

### Step 1 — Restart
Restart the laptop. Check if ACME loads after reboot.

### Step 2 — Check quarantine version
Open elevated CMD:
```cmd
quarantine /version
```
- If it returns a version → go to Step 3
- If `ERROR: Failed to load Version of Quarantine Daemon` → go to Step 4

### Step 3 — Run quarantine commands
```cmd
quarantine /ra
quarantine /rm
quarantine /synccompliance
gpupdate /force
```
Restart → verify ACME is running.

### Step 4 — Registry delete + reinstall
This is the most common fix (40% of all resolved tickets).

1. Find the ACME4 registry key:
```cmd
reg query "HKLM\SOFTWARE\Classes\Installer\Products" /s /f "Amazon Client Management Engine v4"
```

2. Note the key path (e.g. `HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Installer\Products\CC32700FD53E77F4A8522EC38647AD41`)

3. Delete it:
```cmd
REG DELETE "HKEY_LOCAL_MACHINE\SOFTWARE\Classes\Installer\Products\<KEY>" /f
```

4. Uninstall ACME4 from **Add or Remove Programs** (if listed)

5. Reinstall from cached installer:
```
C:\ProgramData\Amazon\Guardian\State\CachedInstaller\
```
If not found there, use:
- ACME Daemon: https://tiny.amazon.com/17y0k7u5j
- ACME UI: https://tiny.amazon.com/5qmwocf3

6. Restart laptop → verify ACME is running

### Step 5 — Run ACME4 Diagnostic tool
Download from: https://tiny.amazon.com/50dgmboi
- Option 1: Diagnose Only
- Option 2: Diagnose and Auto-Remediate (recommended)

The tool checks 11 items: stack detection, service state, version, KARLQueue, compliance, AEA sync, registry, logs, activation, isolation, AEA smoke test.

---

## Scenario B: AEA-ACME Sync Failure

**Tickets:** V2167693486, V2167741088 | **⚠️ Hardest to resolve — 34% still open**

### Step 1 — Check posture validation
Open browser → navigate to:
```
https://midway-auth.amazon.com/api/posture-validation
```
- If `Request Forbidden. AEA verification failed: prev_cert_expired_stale_jwt` → go to Step 2
- If `You did not present a posture cookie` → go to Step 3

### Step 2 — Alternate VPN + force register
1. Connect to alternate postureless VPN headend:
   - `dub-ap-orca.amazon.com` (or see https://kb.it.a2z.com/articles/supported-services/vpn/connect-to-alternate-vpn-head-ends)
2. Run in elevated CMD:
```cmd
quarantine /register /force
quarantine /synccompliance
```
3. Restart → verify AEA sync

### Step 3 — Kill AEA + restart ACME service
```cmd
taskkill /f /im EnterpriseAccess*
net stop acme
net start acme
```
Wait 30 seconds → check if AEA sync resolves.

### Step 4 — Check for missing aeaclaimsubmit.json
If ACME logs show `FileNotFoundException: aeaclaimsubmit.json.tmp`:
- This is a legacy data sync issue between ACME3→4
- Run the ACME4 Diagnostic tool with auto-remediate (Option 2)
- If persists → escalate to **ITS-COS**

### Escalation
If standard steps fail → **ITS-COS**
KB: https://my.it.a2z.com/articles/software/aea/sync-issues-aea-acme

---

## Scenario C: v3/v4 Dual Install Conflict

**Tickets:** V2164024284, V2166935471 | **15% of all ACME4 tickets**

### Steps (from actual ITSE Notes — V2164024284):
1. Check ACME for M365 registration status
2. Check **Access Work or School** account — user may not be connected
3. Open **Add or Remove Programs** → look for both ACME 3 and ACME 4
4. **Uninstall ACME 3**
5. Reboot
6. Open ACME → check M365 registration
7. If M365 not registered → register M365 in ACME
8. Launch Outlook → verify login successful

### If Outlook shows Error 53003 after fix:
This is a separate device compliance issue. Check ACME compliance modules and re-evaluate.

---

## Scenario D: Quarantine Commands Not Recognized

**Tickets:** V2167693486

### Diagnosis
`quarantine` not recognized in CMD means the quarantine service path is not in system PATH or the service is disabled.

### Steps:
1. Open **Services.msc** → find **Quarantine** service
2. If **Disabled** → set to **Automatic** → Start the service
3. If service won't start → check if ACME4 service (acme) is also disabled
4. Set ACME4 service to **Automatic** → Start
5. Retry quarantine commands
6. If still not recognized → go to [Scenario A Step 4](#step-4--registry-delete--reinstall) (registry delete + reinstall)

---

## Scenario E: Non-Compliant / Isolated

**Tickets:** V2166558967, V2166829499

### Quick fix — Reset isolation
```cmd
quarantine /resetisolation
quarantine /resetfirewall
```
This temporarily restores network access.

### Fix compliance modules
1. Open ACME → identify non-compliant module(s)
2. Click **Evaluate** → **Fix this now** on each module
3. For specific modules:

| Module | Fix |
|--------|-----|
| Third-party updates | End app in Task Manager → ACME fix → update app manually |
| Windows Update | `quarantine /rem:windowsupdate` → install updates → restart |
| Qualys | ACME → Attempt Remediation → if fails, follow KB |
| Antivirus | Software Center → repair antivirus |
| AEC | Software Center → ACME Compliance Fix |

4. After fixing: `quarantine /synccompliance` → restart → verify

### KB articles:
- https://it.amazon.com/en/help/articles/getting-your-computer-out-of-isolation
- https://it.amazon.com/en/help/articles/resolve-quarantine-issues-using-software-center
- https://kb.it.a2z.com/articles/client-devices/windows/qualys-agent-troubleshooting-for-windows

---

## Scenario F: ACME4 Won't Install / Service Won't Start

**Tickets:** V2167604095, V2152578671

### Steps:
1. Try [Scenario A Step 4](#step-4--registry-delete--reinstall) first (registry delete + reinstall)
2. If ACME4 still won't start after reinstall:
   - Check **Services.msc** → ACME service → set to **Automatic**
   - Check if cached installer exists: `C:\ProgramData\Amazon\Guardian\State\CachedInstaller\`
   - If not → manually download from https://tiny.amazon.com/17y0k7u5j
3. If ACME4 absolutely won't start:
   - **Fallback:** Install ACME3 and repair components (V2167604095 — SHA11)
   - ACME3 will work as interim solution
4. If nothing works → **reimage the device** (backup data with Persist first)

### Escalation
ACME4 install failures → **Client-Eng-ACCA**
Reference: ACME-10263 (known ongoing issue)

---

## Scenario G: Mobile Cart / Dormant Laptop

**Tickets:** V2164307633

### Full reset procedure (from worklog):
1. Reset firewall: `quarantine /resetfirewall`
2. Update Windows to 25H2: Settings → Windows Update → install all
3. Re-evaluate ACME: `quarantine /synccompliance`
4. Install StaleProfile (if applicable)
5. Update Java
6. Run HPIA for driver/BIOS updates
7. Restart → verify internet connectivity and ACME compliance

---

## Escalation Paths

| Scenario | Escalate To | Reference |
|----------|------------|-----------|
| ACME4 install failures, v3/v4 conflicts | **Client-Eng-ACCA** | ACME-10263 |
| AEA sync persistent failure | **ITS-COS** | — |
| Adobe patch version mismatch | **Client-Eng-Win** | D423839465 |
| Device needs reimage (OTS) | **OTS-Support** via ServiceNow | — |

---

## Diagnostic Tool Reference

**ACME4 Diagnostic & Remediation Tool** — download from https://tiny.amazon.com/50dgmboi

Checks performed (11 total):
1. Stack Detection (PROD/GAMMA)
2. Service State Validation (ACME4, ACME3, Guardian)
3. ACME4 Version Check
4. KARLQueue Bloat Detection (threshold: 1000 files)
5. Compliance Module Check
6. AEA-ACME Sync Check
7. Registry Key Validation
8. Log Availability Check
9. Activation Status Check
10. Isolation Status Check
11. AEA Smoke Check

---

## Key Intel

- **ACME team is updating Software Center** with latest ACME4 installer — current drive.corp links are temporary (P403721951)
- **Adobe patch mismatch** (D423839465) affects 270+ contacts — watch for this pattern
- **Sev-2 CCM alarm** (P408592569) is active — ClientCredentialManager Windows module issue
- `quarantine /version` returning ERROR = corrupted install → go straight to registry delete + reinstall
- ACME4 Diagnostic tool auto-remediate mode can fix AEA sync issues automatically

---

*Generated from 478 SIM-T tickets (Mar 24 – Apr 7, 2026). For corrections or additions, contact mnharidz@.*
