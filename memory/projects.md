# Active Projects

## Omnia Queue Management Workflow
- Status: Active, in production use
- Approach: 5-source parallel research (IT KB, Wiki, my.it, Slack, SIM-T) using direct tool calls when rate-limited
- Output: Single response with Sev alert, pattern match, ITSE Notes resolution, links, customer talking points
- Learned patterns: 340+ tickets analyzed, 44+ persistent lessons saved
- Key learning: User corrections on actual KB steps are critical. When corrected, fetch actual ticket worklogs to learn exact steps.

## ACME4 Troubleshooting Guide
- Status: Completed (2026-04-08), awaiting export to Quip/Slack
- File: /Users/mnharidz/.meshclaw/workspace/ACME4_Troubleshooting_Guide.md (269 lines)
- Next: Export to Quip or share via Slack

## AutoSIM Rule: HDRT Loaner Auto-Assignment
- Status: Testing 3-day lead time validation (2026-04-24)
- Files: autosim-hdrt-loaner.js (production), autosim-hdrt-debug.js (debug), autosim-hdrt-loaner-test.js (test)
- Location: /Users/mnharidz/.meshclaw/workspace/
- Condition: title contains HDRT + building=SIN18 + status=Assigned
- Action: Parse need-by date → if <3 days auto-resolve with rejection, else hash-assign to 5 engineers + post loaner confirmation + set WIP
- WIP method: issue.edit({path: '/next_step', editAction: 'PUT', data: {owner: 'role:resolver', action: 'Implementation', exceptions: []}})
- Test result: P420538720 fired successfully (comment + assignment) but old version deployed, WIP + date validation not executed yet
- Next: Deploy updated version with 3-day validation and retest

## SIN18 RAM Upgrade Project (632 Laptops)
- Status: Deployed to pipeline 9462726 (2026-04-24), email integration postponed
- Cloud Desktop: dev-dsk-mnharidz-2a-68801092.us-west-2.amazon.com
- Workspace: ~/Ramupgrademnharidzburner
- Pipeline: 9462726
- CloudFront URL: https://dyuajye5sry90.cloudfront.net/dashboard.html
- Latest features: Engineer round-robin, site-scoped dashboards, 3-digit site codes, bulk booking management, site-isolated roster, today schedule with completed indicator
- Tests: 78/78 passed
- Security: 0 SAS risks, 0 Shepherd risks, no formal review needed for 30-day burner
- Next: Email notification integration with SES + team DL sender (postponed)

## NetworkUATScript
- Status: Production ready (2026-04-21T10:29)
- Repo: https://code.amazon.com/packages/NetworkUATScript/trees/mainline
- CR: CR-268892148 (merged via Override & merge)
- Next: Deploy to production use for corp office network UAT

## FinanceFlow Personal Finance Dashboard
- Status: v2.0 active development (2026-04-09), running at http://127.0.0.1:5001
- Location: /Users/mnharidz/Library/CloudStorage/WorkDocsDrive-Documents/Desktop/finance-dashboard/
- Tech: Flask + SQLite + Chart.js, 723+ lines across 3 files
- Next: Load realistic 6-month data, comprehensive testing

## XAUUSD Paper Trading Simulator
- Status: Active development (2026-04-14), encountered ACP process error
- Location: /Users/mnharidz/Library/CloudStorage/WorkDocsDrive-Documents/Desktop/xauusd-trader/paper_trader.py
- Next: Debug ACP process issue, complete Yahoo Finance integration

## Tokyo Summit Travel (May 2026)
- Status: Flight comparison complete, awaiting booking decision
- Event: Tokyo Summit, 11-13 May 2026
- Recommended: Option 1 (JL 37, 14 May 11:40 return, SGD 1,322.90)
- Next: Confirm with manager, book selected option

## Morning Briefing Automation
- Status: Active, cron job running (9a6d85ad)
- Schedule: Weekdays 8:30 AM SGT
- Content: mnharidz's tickets only (SIN18/SIN100), site-wide trending issues, calendar, MCM activity, daily checklist
- Delivery: Slack DM / MeshClaw dashboard
- Limitation: Only fires when kiro-cli running, no catch-up for missed times
- Next: Restart kiro-cli to load m365-mcp tools for email/SharePoint section
