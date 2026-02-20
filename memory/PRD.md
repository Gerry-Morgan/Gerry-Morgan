# E-Valu-iT Product Requirements Document

## Original Problem Statement
Build LPAI (Learning Progress AI), a comprehensive educational performance evaluation system with:
- Friendly AI assistant named Laya
- School setup and configuration
- Classroom mode for daily operations
- Reporting and analytics
- Data security with blockchain-protected database

## Product Rename
**Renamed from**: LPAI / Learning Progress AI
**Renamed to**: E-Valu-iT
**Copyright**: © Gerry Morgan, Developed with Emergent

---

## Core Requirements

### Part 1: System Setup & Configuration
- [x] User role identification (Principal, Teacher, etc.)
- [x] School information collection (District, Name, Address, etc.)
- [x] Staff setup with secure access
- [x] Grade and subject configuration
- [x] Inference-based assessment with three-tier qualifiers (D/M/I)
- [ ] Report style configuration
- [ ] School calendar and timetables
- [ ] AI recommendation scope settings

### Part 2: Classroom Mode - Daily Operations
- [x] Teacher interface with student roster
- [x] Inference sets and quick actions
- [x] Recording observations with qualifiers
- [x] Custom inference creation
- [x] Attendance recording
- [x] Assessment marks entry
- [ ] Deductions and behavioral notes

### Part 3: Reporting & Analytics
- [x] Individual student reports
- [x] Batch report generation (PDF/HTML)
- [x] Qualifier distribution
- [ ] AI-driven recommendations (partial)
- [ ] Affirmations and certificates
- [ ] IEP support enhancements

### Part 4: Data Security
- [x] Audit trail (blockchain-inspired)
- [x] Secure authentication (Google OAuth)
- [x] Role-based access
- [ ] Year-end process and archiving

---

## What's Implemented

### Core Features
1. **Authentication**: Emergent Google Social Login
2. **AI Assistant (Laya)**: Claude Sonnet 4, voice-enabled, global access
3. **School Setup Wizard**: Guided configuration for principals
4. **Dashboard**: Stats, navigation, quick actions
5. **Student Management**: Single add, bulk import (CSV/Excel)
6. **Curriculum Management**: AI-powered document processing
7. **Classroom Mode**: Observations, attendance, assessments
8. **Staff Management**: Principal-managed staff roles
9. **Report Generation**: Individual and batch (PDF/HTML)
10. **Interactive Demo**: Guided tour with Laya

### Technical Stack
- **Frontend**: React, TailwindCSS, Shadcn/UI
- **Backend**: FastAPI, Python
- **Database**: MongoDB
- **AI**: Claude Sonnet 4 (Emergent LLM Key)
- **Auth**: Emergent Google OAuth

---

## Backlog / Pending Features

### P1 (High Priority)
- [ ] Deductions & Notes feature
- [ ] IEP Support enhancements
- [ ] Full staff management UI

### P2 (Medium Priority)
- [ ] Parent-requested interim reports
- [ ] AI affirmations & certificates
- [ ] Year-end process workflow
- [ ] Email notifications

### P3 (Lower Priority)
- [ ] Parent/Student Portal
- [ ] Blockchain full implementation
- [ ] Mobile apps
- [ ] Multi-language support

---

## Known Issues

### Recurring
- `/app/frontend/src/pages/Students.js` - Complex file prone to JSX errors; needs refactoring

---

## Last Updated
- **Date**: February 2025
- **Action**: Complete product rename from LPAI to E-Valu-iT
- **Copyright added**: © Gerry Morgan, Developed with Emergent
