// Types
export type LessonType = "text" | "video" | "link" | "quiz";

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
  replies?: Comment[];
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  completed: boolean;
  duration?: string;
  content?: string;
  videoUrl?: string;
  linkUrl?: string;
  comments?: Comment[];
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  instructorAvatar: string;
  sections: Section[];
}

// Helper
function lessonId(courseIdx: number, sIdx: number, lIdx: number) {
  return `c${courseIdx}-s${sIdx}-l${lIdx}`;
}

// Mock data
export const courses: Course[] = [
  {
    id: "course-1",
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive bootcamp.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=340&fit=crop",
    instructor: "Sarah Chen",
    instructorAvatar: "SC",
    sections: [
      {
        id: "c1-s1",
        title: "Getting Started",
        lessons: [
          {
            id: lessonId(1, 1, 1),
            title: "Welcome to the Course",
            type: "video",
            completed: true,
            duration: "5 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "<p>Welcome to the Complete Web Development Bootcamp! In this course, you'll learn everything you need to become a full-stack web developer.</p><p>We'll start with the fundamentals and work our way up to building complete applications.</p>",
            comments: [
              {
                id: "cm1",
                author: "Alex Rivera",
                avatar: "AR",
                text: "Great introduction! Really excited to start this course.",
                date: "2 days ago",
                replies: [
                  { id: "cm1r1", author: "Sarah Chen", avatar: "SC", text: "Thanks Alex! Let me know if you have any questions.", date: "1 day ago" },
                ],
              },
              { id: "cm2", author: "Jamie Lee", avatar: "JL", text: "The production quality is amazing. Looking forward to the rest!", date: "1 day ago" },
            ],
          },
          {
            id: lessonId(1, 1, 2),
            title: "Setting Up Your Development Environment",
            type: "text",
            completed: true,
            duration: "10 min",
            content: "<h2>Development Environment Setup</h2><p>Before we begin coding, let's set up our development environment. You'll need the following tools:</p><ul><li><strong>Visual Studio Code</strong> — A powerful, free code editor</li><li><strong>Node.js</strong> — JavaScript runtime for running code outside the browser</li><li><strong>Git</strong> — Version control system</li></ul><p>Follow the instructions below to install each tool on your operating system.</p><h3>Installing VS Code</h3><p>Download VS Code from <em>code.visualstudio.com</em> and follow the installer. Once installed, we recommend adding these extensions:</p><ul><li>Prettier — Code formatter</li><li>ESLint — JavaScript linter</li><li>Live Server — Local development server</li></ul>",
          },
          {
            id: lessonId(1, 1, 3),
            title: "How the Internet Works",
            type: "text",
            completed: true,
            duration: "8 min",
            content: "<h2>How the Internet Works</h2><p>Understanding how the internet works is fundamental to web development. Let's break it down.</p><p>When you type a URL into your browser, a series of steps happen:</p><ol><li>Your browser sends a <strong>DNS request</strong> to find the server's IP address</li><li>A <strong>TCP connection</strong> is established with the server</li><li>Your browser sends an <strong>HTTP request</strong></li><li>The server processes the request and sends back a <strong>response</strong></li><li>Your browser renders the HTML, CSS, and JavaScript</li></ol><p>This entire process happens in milliseconds!</p>",
          },
        ],
      },
      {
        id: "c1-s2",
        title: "HTML Fundamentals",
        lessons: [
          {
            id: lessonId(1, 2, 1),
            title: "Introduction to HTML",
            type: "video",
            completed: false,
            duration: "12 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "<p>HTML (HyperText Markup Language) is the backbone of every web page. In this lesson, we'll cover the basics of HTML structure and syntax.</p>",
          },
          {
            id: lessonId(1, 2, 2),
            title: "HTML Elements & Tags",
            type: "text",
            completed: false,
            duration: "15 min",
            content: "<h2>HTML Elements & Tags</h2><p>HTML uses a system of <strong>tags</strong> to define elements on a page. Tags usually come in pairs — an opening tag and a closing tag.</p><pre><code>&lt;p&gt;This is a paragraph.&lt;/p&gt;</code></pre><p>Some tags are self-closing, meaning they don't need a closing tag:</p><pre><code>&lt;img src=\"image.jpg\" alt=\"An image\" /&gt;\n&lt;br /&gt;\n&lt;hr /&gt;</code></pre><h3>Common HTML Elements</h3><ul><li><code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> — Headings</li><li><code>&lt;p&gt;</code> — Paragraphs</li><li><code>&lt;a&gt;</code> — Links</li><li><code>&lt;img&gt;</code> — Images</li><li><code>&lt;div&gt;</code> — Generic container</li></ul>",
          },
          {
            id: lessonId(1, 2, 3),
            title: "Forms & Input Elements",
            type: "text",
            completed: false,
            duration: "18 min",
            content: "<h2>Forms & Input Elements</h2><p>Forms are essential for collecting user input. Let's learn how to build them.</p>",
          },
          {
            id: lessonId(1, 2, 4),
            title: "HTML Best Practices",
            type: "link",
            completed: false,
            duration: "5 min",
            linkUrl: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
            content: "<p>Review these best practices for writing clean, semantic HTML. Click the link below to access the MDN Web Docs guide.</p>",
          },
        ],
      },
      {
        id: "c1-s3",
        title: "CSS Styling",
        lessons: [
          {
            id: lessonId(1, 3, 1),
            title: "CSS Basics",
            type: "video",
            completed: false,
            duration: "14 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "<p>CSS (Cascading Style Sheets) controls the visual presentation of your web pages. Let's start with the fundamentals.</p>",
          },
          {
            id: lessonId(1, 3, 2),
            title: "Selectors & Properties",
            type: "text",
            completed: false,
            duration: "20 min",
            content: "<h2>CSS Selectors & Properties</h2><p>Selectors let you target specific HTML elements to style. Properties define what styles to apply.</p>",
          },
          {
            id: lessonId(1, 3, 3),
            title: "Flexbox Layout",
            type: "video",
            completed: false,
            duration: "22 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "<p>Flexbox is a powerful layout model that makes it easy to design flexible and responsive layouts.</p>",
          },
          {
            id: lessonId(1, 3, 4),
            title: "CSS Grid",
            type: "text",
            completed: false,
            duration: "25 min",
            content: "<h2>CSS Grid</h2><p>CSS Grid is a two-dimensional layout system that gives you complete control over rows and columns.</p>",
          },
          {
            id: lessonId(1, 3, 5),
            title: "Responsive Design Quiz",
            type: "quiz",
            completed: false,
            duration: "10 min",
            content: "<h2>Responsive Design Quiz</h2><p>Test your knowledge of responsive design principles. This quiz covers media queries, fluid layouts, and mobile-first design.</p><p><em>Quiz functionality coming soon!</em></p>",
          },
        ],
      },
      {
        id: "c1-s4",
        title: "JavaScript Essentials",
        lessons: [
          {
            id: lessonId(1, 4, 1),
            title: "Variables & Data Types",
            type: "video",
            completed: false,
            duration: "16 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "<p>JavaScript is the programming language of the web. Let's start by learning about variables and data types.</p>",
          },
          {
            id: lessonId(1, 4, 2),
            title: "Functions & Scope",
            type: "text",
            completed: false,
            duration: "20 min",
            content: "<h2>Functions & Scope</h2><p>Functions are reusable blocks of code. Understanding scope is crucial for writing bug-free JavaScript.</p>",
          },
          {
            id: lessonId(1, 4, 3),
            title: "DOM Manipulation",
            type: "video",
            completed: false,
            duration: "18 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "<p>The Document Object Model (DOM) allows JavaScript to interact with and modify HTML elements on the page.</p>",
          },
          {
            id: lessonId(1, 4, 4),
            title: "JavaScript Resources",
            type: "link",
            completed: false,
            duration: "5 min",
            linkUrl: "https://javascript.info",
            content: "<p>Explore these curated JavaScript resources for deeper learning.</p>",
          },
          {
            id: lessonId(1, 4, 5),
            title: "JavaScript Fundamentals Quiz",
            type: "quiz",
            completed: false,
            duration: "15 min",
            content: "<h2>JavaScript Fundamentals Quiz</h2><p>Test everything you've learned about JavaScript basics.</p><p><em>Quiz functionality coming soon!</em></p>",
          },
        ],
      },
    ],
  },
  {
    id: "course-2",
    title: "UI/UX Design Masterclass",
    description: "Master the principles of user interface and user experience design from scratch.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=340&fit=crop",
    instructor: "Marcus Johnson",
    instructorAvatar: "MJ",
    sections: [
      {
        id: "c2-s1",
        title: "Design Foundations",
        lessons: [
          {
            id: "c2-s1-l1",
            title: "What is UX Design?",
            type: "video",
            completed: true,
            duration: "10 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "<p>User Experience Design is about creating products that provide meaningful and relevant experiences to users.</p>",
          },
          {
            id: "c2-s1-l2",
            title: "Design Thinking Process",
            type: "text",
            completed: true,
            duration: "15 min",
            content: "<h2>Design Thinking</h2><p>Design thinking is a human-centered approach to innovation. It consists of five phases: Empathize, Define, Ideate, Prototype, and Test.</p>",
          },
          {
            id: "c2-s1-l3",
            title: "Color Theory",
            type: "text",
            completed: false,
            duration: "12 min",
            content: "<h2>Color Theory for Designers</h2><p>Understanding color is essential for creating visually appealing designs.</p>",
          },
        ],
      },
      {
        id: "c2-s2",
        title: "UI Components",
        lessons: [
          {
            id: "c2-s2-l1",
            title: "Buttons & Forms",
            type: "video",
            completed: false,
            duration: "18 min",
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            content: "<p>Learn how to design effective buttons and form elements that users love.</p>",
          },
          {
            id: "c2-s2-l2",
            title: "Navigation Patterns",
            type: "text",
            completed: false,
            duration: "14 min",
            content: "<h2>Navigation Patterns</h2><p>Good navigation is the backbone of any application. Let's explore common patterns.</p>",
          },
          {
            id: "c2-s2-l3",
            title: "Design Resources",
            type: "link",
            completed: false,
            duration: "5 min",
            linkUrl: "https://www.figma.com",
            content: "<p>Explore Figma and other design tools to bring your designs to life.</p>",
          },
        ],
      },
    ],
  },
];

// Helpers
export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getLesson(courseId: string, lessonId: string): { course: Course; section: Section; lesson: Lesson } | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  for (const section of course.sections) {
    const lesson = section.lessons.find((l) => l.id === lessonId);
    if (lesson) return { course, section, lesson };
  }
  return undefined;
}

export function getAllLessons(course: Course): Lesson[] {
  return course.sections.flatMap((s) => s.lessons);
}

export function getCompletedCount(course: Course): number {
  return getAllLessons(course).filter((l) => l.completed).length;
}

export function getTotalCount(course: Course): number {
  return getAllLessons(course).length;
}

export function getFirstIncompleteLesson(course: Course): Lesson | undefined {
  return getAllLessons(course).find((l) => !l.completed) || getAllLessons(course)[0];
}

export function getAdjacentLessons(course: Course, lessonId: string): { prev?: Lesson; next?: Lesson } {
  const all = getAllLessons(course);
  const idx = all.findIndex((l) => l.id === lessonId);
  return {
    prev: idx > 0 ? all[idx - 1] : undefined,
    next: idx < all.length - 1 ? all[idx + 1] : undefined,
  };
}
