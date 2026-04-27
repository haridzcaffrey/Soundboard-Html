# SIN18 Laptop RAM Upgrade — Self-Service Booking System Proposal

**Author:** mnharidz | **Date:** 2026-04-08 | **Location:** SIN18 Singapore
**Status:** Draft — Pending Approval

---

## 1. Executive Summary

Upgrade 632 laptops from 16GB to 32GB RAM at SIN18. This proposal covers a **self-service booking system** that automates scheduling, ticket creation, calendar invites, and progress tracking — eliminating manual coordination for 632 users across an estimated 8-week rollout.

## 2. Project Scope

| Item | Detail |
|---|---|
| Total laptops | 632 |
| Config A: Single 16GB (1 slot) | Add 1x 16GB SODIMM (~10 min) |
| Config B: Dual 8GB (2 slots) | Replace 2x 8GB with 2x 16GB SODIMM (~15 min) |
| Engineers | 5 (mnharidz, pabdsofy, samsudm, mohajaiu, dinolee) |
| Estimated duration | 8 weeks (accounting for reschedules and no-shows) |

## 3. Problem Statement

- 632 users need to be individually scheduled for a 15–30 min hardware upgrade
- Engineers have existing in-person support commitments (Mon–Fri, varying hours)
- Manual scheduling (email, Quip sign-ups) does not scale and creates coordination overhead
- No native booking tool available (Microsoft Bookings disabled)

## 4. Proposed Solution: Serverless Booking System

### 4.1 Architecture

```
User Email → Booking Web Page (S3) → API Gateway → Lambda → DynamoDB
                                                      ↓
                                              SIM-T Ticket Created
                                              Calendar Invite Sent
                                              Dashboard Updated
```

### 4.2 User Flow

1. User receives wave email with booking link (internal URL)
2. User opens booking page — sees available dates and 30-min time slots
3. User selects slot, enters alias and laptop model, submits
4. System automatically:
   - Reserves the slot (prevents double-booking)
   - Creates a SIM-T ticket assigned to the next engineer (round-robin)
   - Sends Outlook calendar invite to user and assigned engineer
   - Updates the live dashboard
5. User can reschedule or cancel via link in confirmation email

### 4.3 Engineer Dashboard

A simple internal web page showing:
- All bookings by date, time, engineer
- Status: Scheduled / Completed / Rescheduled / No-show
- Completion progress (X/632)
- Engineer workload distribution
- Filter by date, engineer, status, config type

### 4.4 Scheduling Constraints (Built-In)

| Day | Available Upgrade Slots |
|---|---|
| Monday–Tuesday | 9:00 AM – 1:00 PM, 2:00 – 4:00 PM |
| Wednesday–Friday | 9:00 AM – 12:00 PM, 2:00 – 4:00 PM |

- 2 engineers on upgrades (Mon–Tue), 3 engineers on upgrades (Wed–Fri)
- Remaining engineers cover in-person support
- Rotation weekly for fairness

## 5. Technical Architecture

### 5.1 AWS Services

| Service | Purpose | Config |
|---|---|---|
| S3 | Host static booking page + dashboard HTML | Single bucket, static website hosting |
| API Gateway | REST API for booking/cancel/dashboard endpoints | 4 routes |
| Lambda | Business logic (book slot, cancel, list slots, dashboard data) | Node.js/Python, 128MB, <1s |
| DynamoDB | Store slots, bookings, engineer rotation state | On-demand, single table |

### 5.2 API Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | /slots?date=YYYY-MM-DD | List available slots for a date |
| POST | /book | Book a slot (creates ticket + invite) |
| POST | /cancel | Cancel/reschedule a booking |
| GET | /dashboard | Dashboard data (all bookings + stats) |

### 5.3 Integrations

| System | Integration Method | Purpose |
|---|---|---|
| SIM-T | HTTP API (internal) | Auto-create upgrade ticket on booking |
| Outlook/Exchange | EWS or Graph API | Send calendar invite to user + engineer |
| Email | SES or internal SMTP | Confirmation + reschedule link |

### 5.4 Data Model (DynamoDB — Single Table)

**Slots Table:**
- PK: `DATE#2026-04-13` SK: `SLOT#0900`
- Attributes: engineerAlias, userAlias, laptopModel, configType, status, ticketId, createdAt

## 6. Cost Estimate

| Service | Monthly Cost | Project Total (8 weeks) |
|---|---|---|
| Lambda | $0.00 (free tier: 1M req/mo) | $0.00 |
| API Gateway | $0.00 (free tier: 1M calls/mo) | $0.00 |
| DynamoDB | $0.00 (free tier: 25GB + 25 RCU/WCU) | $0.00 |
| S3 | $0.00 (free tier: 5GB + 20K GET) | $0.00 |
| **Total** | **$0.00** | **< $2.00 if past free tier** |

## 7. Rollout Plan

| Phase | Week | Activity |
|---|---|---|
| Build | Week 0 | Deploy booking system to mnharidz_aws (985539796771) |
| Test | Week 0 | Team tests with 5 dummy bookings |
| Wave 1 | Weeks 1–3 | Email sent to ~200 users (Floor 1 / Dept A) |
| Wave 2 | Weeks 3–5 | Email sent to ~200 users (Floor 2 / Dept B) |
| Wave 3 | Weeks 5–7 | Email sent to ~232 users (remaining) |
| Mop-up | Week 8 | Chase no-shows, manager escalation for stragglers |

## 8. Completion Estimates

| Scenario | Users | Timeline |
|---|---|---|
| Book & show first attempt (60%) | 379 | Weeks 1–3 |
| Reschedule once (25%) | 158 | Weeks 4–5 |
| Reschedule 2+ times (10%) | 63 | Weeks 6–7 |
| No-shows requiring escalation (5%) | 32 | Week 8 |

## 9. Risk & Mitigation

| Risk | Mitigation |
|---|---|
| Low user adoption of booking page | Clear email instructions + manager endorsement |
| Double-booking | DynamoDB conditional writes (atomic slot reservation) |
| SIM-T API access issues | Fallback: email-triggered AutoRule for ticket creation |
| Calendar invite delivery | Fallback: manual invite from engineer if EWS fails |
| Engineer absence | Rotation auto-adjusts; remaining engineers absorb slots |

## 10. Requirements for Approval

- [ ] AWS account access confirmed (mnharidz_aws — 985539796771)
- [ ] SIM-T API access for Lambda (or AutoRule fallback approved)
- [ ] Manager approval for 2-3 day build time
- [ ] RAM procurement confirmed (632x 16GB SODIMMs + spares)
- [ ] Wave email distribution lists identified

## 11. Post-Project Cleanup

- Delete all AWS resources (Lambda, API GW, DynamoDB, S3)
- Archive final dashboard data to Quip for records
- Close parent SIM ticket with completion stats

---

**Next Steps:** Approve proposal → Build system (2-3 days) → Test → Launch Wave 1
