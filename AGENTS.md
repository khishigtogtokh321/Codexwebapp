# AGENT: Ashidsoft WebApp — Frontend Engineering Assistant

## 1. Project Overview
- Name: Ashidsoft WebApp
- Root: /mnt/d/ashidwebapp
- Scope: Frontend only (Vue.js SPA)
- Target: Tablet (doctor workflow)
- Features: patient list, treatment workflow, appointment schedule, patient detail, doctor profile.

## 2. Tech Stack & Rules
- Vue.js (SPA)
- TailwindCSS
- Code → English, UI → Mongolian
- No backend/DB code
- Never rename components
- Never modify API contract
- Theme = medical blue + white

## 3. Directory Structure
```
resources/js/
  app.js
  App.vue
  router/
  layouts/
  views/
  components/
  services/
  store/
  utils/
resources/assets/
resources/css/
```
- layouts/: AppLayout.vue, AuthLayout.vue
- views/app/: page components
- components/: reusable UI
- components/emchilgee/: treatment UI blocks

## 4. Coding Conventions
- Component file: PascalCase.vue
- Props/vars: camelCase
- Use <script setup> (Composition API)
- Avoid repeated Tailwind classes
- Break long UI into small components
- Text = Mongolian (UTF-8)

### Reactivity
- Use ref, reactive
- Complex page state → store

## 5. Architecture
### Layouts
- AppLayout.vue: sidebar + header + slot
- AuthLayout.vue: centered login/register layout
### Views
- Page-level logic only
- Data fetch → service layer
- Compose UI from child components
### Components
- Reusable single-responsibility units

## 6. Service Layer (services/)
Purpose: API and business logic separated from UI.
Example:
```
services/httpClient.js
services/authService.js
services/patientService.js
services/appointmentService.js
```
Standard return:
```js
{ success: true, data, message?: string }
{ success: false, error, message?: string }
```
Rules:
- All API calls through services
- Do not rename endpoints
- Missing backend method → // TODO: backend endpoint required

## 7. Store (Pinia)
```
useAuthStore()
usePatientStore()
useTreatmentStore()
```
- Store = global shared state
- Page-specific small state → inside view

## 8. API Usage Rules
- No backend code
- No API mutation
- Error handling:
  - Network error → toast/alert
  - Field error → text-red-500 text-sm under input

## 9. Restrictions (Critical)
❌ Rename components  
❌ Change API endpoints  
❌ Add backend/DB files  
❌ Refactor unrelated modules  
❌ Change global theme  
✔ Minor UI fixes OK  
✔ Comments OK  
✔ ≤20-line local refactor OK  

## 10. Approval Rules
Requires approval:
- New view file
- Router change
- Layout major change
- Tailwind config/global CSS change

Auto-approved:
- Spacing adjustments
- Small UI fixes
- Comments/cleanup
- Minor component refactor

## 11. UI/UX Guidelines
- Doctors need fast, clean, simple UI
- 1–2 click main workflow rule
- Critical actions: red + confirmation
- Forms: label + input aligned, error shown under field
- Minimal icons

## 12. Task Execution (Codex)
One command = one feature.

Good:
- “Implement patient list using patientService.getPatients()”
- “Integrate ApptVueCal into AppointmentForm”
- “Refactor LoginPage.vue with Composition API”

Bad:
- “Improve everything”
- “Rewrite router”
- “Make UI nicer”

## 13. Example Workflows
### Patient Detail Page
- Create views/app/PatientDetailPage.vue
- Add route
- Use AppLayout
- Fetch via patientService.getPatientById(id)
- UI: basic info + treatment history

### Login Page Upgrade
- Move logic → authService
- Add loading + error display

### Appointment Calendar
- Use ApptVueCal.vue
- Load schedule from appointmentService
- Tooltip → patient name + time
