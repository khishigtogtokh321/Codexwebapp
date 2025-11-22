# AGENT: Ashidsoft WebApp Frontend Assistant

You are an engineering assistant for the **Ashidsoft webapp** project.  
Your main үүрэг: **Vue.js + TailwindCSS ашигласан frontend кодыг зохион байгуулалттай, UI/UX өндөр түвшинд хөгжүүлэх, рефактор хийх, баримтжуулах.**

---

## 1. Project Overview

- **Project name:** Ashidsoft webapp  
- **Root directory (WSL):** `/mnt/d/Project/ashidwebapp`
- **Goal:**  
  - AshidSoft шүдний эмнэлгийн програмыг webapp хэлбэрээр эмч нарт зориулж хэрэгжүүлэх.  
  - Эмч дараах функцийг web-ээр гүйцэтгэнэ:
    - Өвчтөн сонгох / жагсаалт харах  
    - Эмчилгээ хийх, эмчилгээний дэлгэрэнгүй харах  
    - Цаг товлох / цагийн хуваарь харах  
    - Эмчийн мэдээлэл, өвчтөний мэдээлэл харах  
- **Scope of this repo:**  
  - **Зөвхөн frontend** (Vue.js SPA).  
  - Backend / database энэ repo-д байхгүй. API байгаа бол гадна талын сервер.

---

## 2. Tech Stack & Global Rules

- **Frontend framework:** Vue.js (SPA)
- **Styling:**  
  - Tailwind CSS (primary)  
  - Custom CSS where necessary (`resources/css` дотор)
- **No database code** in this repo.  
- **Language:** Code comments ба файл нэрийг **English**, UI текстийг **Mongolian** (UTF-8) хэрэглэнэ.

---

## 3. Directory Structure (current + recommended)

### Existing important folders

- `resources/js/app.js` – Vue entry point
- `resources/js/App.vue` – root component
- `resources/js/router/index.js` – Vue Router configuration
- `resources/js/layouts/`  
  - `AppLayout.vue` – main app layout (эмчийн dashboard гэх мэт)  
  - `AuthLayout.vue` – authentication layout (login/register)
- `resources/js/views/app/`  
  - `AppointmentForm.vue`  
  - `ApptVueCal.vue`  
  - `Emch.vue`  
  - `EmchilgeePage.vue`  
  - `PatientPage.vue`  
  - `SettingsPage.vue`
- `resources/js/views/auth/`  
  - `LoginPage.vue`  
  - `RegisterPage.vue`
- `resources/js/components/`  
  - `emchilgee/` – эмчилгээтэй холбоотой жижиг компонентууд  
  - `layout/` – layout-related reusable components  
- `resources/js/assets/` – images, icons, etc.
- `resources/css/` – Tailwind болон custom CSS

### New / recommended folders (AGENT may create)

- `resources/js/services/`  
  - API ба business logic-ийг тусад нь байрлуулах layer  
- `resources/js/store/`  
  - Хэрэв шаардлагатай бол Pinia эсвэл simple global store (агуулга: user, auth, settings гэх мэт)
- `resources/js/utils/`  
  - Helper functions (date format, validation, etc.)

**Rule:**  
- Шинэ файл / folder үүсгэхдээ дээрх structure-т нийцүүл.  
- Хуучин файлын байрлалыг шалтгаангүйгээр өөрчлөхгүй.

---

## 4. Coding Style & Conventions

### 4.1 Vue Components

- **Naming**
  - Component files: `PascalCase.vue` (e.g. `PatientCard.vue`, `EmchilgeeList.vue`)
  - Props, variables: `camelCase`
  - Emits / events: `camelCase` (`update:modelValue`, `submitForm`, гэх мэт)

- **API style**
  - **Composition API + `<script setup>`** ашиглахыг анхдагч болго.
  - Хуучин Options API байвал эвдэлгүй ажиллана; шинэ component бичихдээ Composition API хэрэглэ.

- **Template rules**
  - Tailwind классыг давхардсан, логикгүй байдлаар овоолохгүй; давтагдсан хэсгийг component болго.  
  - Text content → i18n сан ашиглахгүй бол одоогоор шууд Mongolian string.

- **Reactivity**
  - `ref` ба `reactive` logical name-тай байх.  
  - Complex state → `store/` дотор.

### 4.2 Styling

- **Tailwind first**:  
  - Эхлээд Tailwind utility-гаараа шийд; давтагдсан pattern үүсвэл `@apply` ашигласан CSS component class үүсгэ.
- **Color & theme**
  - Эмнэлгийн өнгө: цэнхэр + цагаан төв, minimal clean UI.  
  - Товч, link, highlight-д **primary blue**; danger actions-д **red**; success-д **green**.
- **Spacing**
  - Layout-ууд дээр consistent `p-4`, `p-6`, `gap-4` гэх мэт spacing scale хэрэглэнэ.
- **Responsive**
  - Mobile-first class (`w-full`, `flex-col`) → need үед `md:`, `lg:` breakpoint нэм.

---

## 5. Frontend Architecture

### 5.1 Views vs Components vs Layouts

- **Layouts (`layouts/`)**
  - `AppLayout.vue`:  
    - Top bar, sidebar, main content slot.  
    - Dashboard, patient, emchilgee, settings зэрэг ажиллаж буй үед ашиглана.
  - `AuthLayout.vue`:  
    - Login / Register UI layout.  
    - Logo, center card, background gradient.

- **Views (`views/app/`, `views/auth/`)**
  - **Өргөн хүрээний page-level компонент**.  
  - Router-оор шууд холбогдоно.  
  - Only high-level orchestration + composition:
    - Data fetch call → service layer
    - Local state for page
    - Uses many child components

- **Components (`components/`)**
  - Дахин ашиглагдах UI хэсгүүд:
    - Cards, tables, forms, modals, input fields, etc.
  - Хүчин чадлын хувьд single responsibility:
    - Жагсаалт → List component  
    - Жагсаалтын мөр → Row / Item component  

### 5.2 Service Layer (`services/`)

- **Purpose:** UI component-уудаас API 호출, бизнес логикыг салгах.
- Example files:
  - `services/authService.js`
  - `services/patientService.js`
  - `services/appointmentService.js`

- **Service function signature**
  - Always return `Promise`  
  - Standard response object:

    ```js
    // success
    { success: true, data, message?: string }

    // error
    { success: false, error, message?: string }
    ```

- **Axios configuration**  
  - Base URL, interceptors зэргийг нэг файлд төвлөрүүлэх (`services/httpClient.js` гэх мэт).
  - **Important:** API URL-уудын base path, endpoint нэрийг дураараа солихгүй. Одоогийн backend contract-г баримтал.

### 5.3 State Management (`store/`)

- Хэрэв Pinia ашиглавал:
  - Store файлуудыг `useXxxStore` нэртэй define (`useAuthStore`, `usePatientStore`).  
  - Global state: `currentUser`, `token`, `selectedPatient`, etc.
- Page-specific simple state → тухайн view дотор хадгалж болно.

---

## 6. API Usage (frontend-only contract)

- Энэ repo **database болон backend код агуулахгүй**.  
- Хэрэв API-д холбогдох бол:
  - API endpoint-ууд `services/` layer-аар дамжина.
  - Backend contract-г өөрчлөхгүй.
  - New endpoint нэмж ашиглах шаардлагатай бол:
    - Комментод **TODO: backend endpoint required** гэж тодорхой тэмдэглэ.
- Error handling:
  - Network / server алдаа → UI дээр toast / alert, error message үзүүлэх.
  - Form validation алдаа → field-level error messages.

---

## 7. Restrictions (Маш чухал)

AGENT дараах зүйлийг **ХИЙХ ЁСГҮЙ**:

1. **Компонентын нэрийг дураараа өөрчлөхгүй.**
   - `LoginPage.vue`, `RegisterPage.vue`, `AppointmentForm.vue` гэх мэт аль хэдийн байгаа файлын нэрийг rename хийхгүй.
2. **API URL / endpoint нэр солихгүй.**
   - `services/` дотор байгаа URL path-ууд backend contract-той холбоотой; зөвшөөрөлгүй өөрчлөхгүй.
3. **Database / backend файл үүсгэхгүй.**
   - Migration, model, controller зэрэг backend файл энэ repo-д үүсгэхгүй.
4. Хамааралгүй файлуудыг томоор рефактор хийж эвдэхгүй.  
   - Нэг feature дээр ажиллаж байхдаа зөвхөн түүнд хамаарах файлуудыг өөрчил.
5. UI design-ийг эрс өөр theme болгохгүй.  
   - Эмнэлгийн цэнхэр-цагаан, minimal theme-г баримтал.

---

## 8. Approval Rules

- **Always require review/approval when:**
  - New view (`views/app/` эсвэл `views/auth/`) үүсгэж байгаа.  
  - Router (`router/index.js`) дээр шинэ маршрут нэмсэн үед.  
  - Layout component-уудад томоохон өөрчлөлт хийсэн үед.  
  - Tailwind config эсвэл global CSS-г өөрчилсөн үед.

- **Auto-approve OK for:**
  - Жижиг UI fix (spacing, color tweak, typography)  
  - Comment нэмэх, code formatting сайжруулах  
  - Тухайн нэг component-ийн доторх бага хэмжээний refactor (10–20 мөр орчим)

---

## 9. Task Execution Guidelines

Codex-т даалгавар өгөхдөө **нэг команд = нэг тодорхой feature** байх ёстой.

Good examples:

- `Implement patient list table component and connect to patientService.getPatients()`
- `Create appointment calendar view using existing ApptVueCal component`
- `Refactor LoginPage.vue to use authService.login and display validation errors`
- `Add responsive layout for EmchilgeePage.vue using Tailwind`
- `Create patientService with mock API calls (no real backend yet)`

Bad examples (зааж өгч болохгүй):

- `Improve everything in project`
- `Change all styles to look nicer`
- `Rewrite router`

---

## 10. UI/UX Guidelines (Ashidsoft specific)

- Эмч webapp хэрэглэнэ → ** хурдан, ойлгомжтой, keyboard-friendly** байх шаардлагатай.
- Гол принцип:
  - Patient / Appointment related info → аль болох **1–2 click** дотор.
  - Critical actions (delete, cancel, finish treatment) →  
    - Red button  
    - Confirmation dialog заавал.
  - Forms:
    - Label + input цэгцтэй, `grid` эсвэл `flex` ашигласан  
    - Алдаа → доор нь `text-red-500 text-sm` хэлбэрээр.
- Icons:
  - Хэт олон icon бүү хэрэглэ; text + simple icon.

---

## 11. Example Workflows for AGENT

1. **New page for viewing patient details**
   - Create `resources/js/views/app/PatientDetailPage.vue`
   - Add route in `router/index.js`
   - Use `AppLayout.vue` as layout  
   - Fetch data via `patientService.getPatientById(id)`  
   - Display main info + treatment history list

2. **Login page refinement**
   - Refactor `LoginPage.vue` to use Composition API  
   - Move login API call into `authService.js`  
   - Add loading state + error message display  
   - Keep existing route names and component name unchanged

3. **Appointment calendar integration**
   - Use existing `ApptVueCal.vue` component inside `EmchilgeePage.vue` or `AppointmentForm.vue`  
   - Load mock data from `appointmentService`  
   - Show tooltip with patient name on hover

---

Энэ AGENTS.md-г төслийн root (`/mnt/d/Project/ashidwebapp/AGENTS.md`) дээр байрлуул.  
Codex `/init` хийсний дараа энэ файлыг уншиж, дээрх бүх дүрмийг баримтлан ажиллах ёстой.
