

# Podia-Style Online Course Platform — Phase 1

## Overview
Build the student-facing UI for an online course platform using mock data. Clean, minimal design with a light theme, subtle borders, and full responsiveness.

---

## 1. Student Dashboard — "My Courses"
- Grid layout showing enrolled course cards
- Each card: thumbnail, course title, instructor name, progress bar (e.g., "3/80 lessons"), and a "Resume" button
- Empty state for when no courses are enrolled
- Top navigation bar with logo, "My Courses" link, and user avatar/menu

## 2. Course Viewer Layout
- **Left Sidebar**: Collapsible course outline organized by sections
  - Each section is an expandable accordion with lesson titles
  - Icons per lesson type: 📄 text, 🎬 video, 🔗 link, ❓ quiz
  - Checkmark icons for completed lessons
  - Progress indicator at the top (e.g., "3/80 completed" with a mini progress bar)
  - Collapsible on mobile (slide-out drawer)
- **Main Content Area**: Takes remaining width, scrollable

## 3. Lesson Viewer
- **Breadcrumb navigation**: Course > Section > Lesson
- **Lesson content area**: Renders rich text, images, and embedded video (YouTube/Vimeo iframe)
- **"Complete & Continue" button**: Marks lesson done and advances to next lesson
- **Previous / Next lesson navigation** at the bottom
- **Comments section**: Simple threaded comment UI with mock comments (read-only for now)

## 4. Mock Data
- 1-2 sample courses with multiple sections (4-5 sections, 5-10 lessons each)
- Mix of lesson types (text lessons with paragraphs, video lessons with embedded players, link lessons, quiz placeholders)
- Some lessons pre-marked as completed to demonstrate progress tracking

## 5. Routing
- `/` — Student dashboard (My Courses)
- `/course/:courseId` — Redirects to first incomplete lesson
- `/course/:courseId/lesson/:lessonId` — Lesson viewer with sidebar

## 6. Design Details
- Light theme, white backgrounds, subtle gray borders
- Clean typography with good hierarchy
- Smooth transitions for sidebar collapse/expand and accordion toggles
- Mobile-responsive: sidebar becomes a drawer, content stacks vertically

