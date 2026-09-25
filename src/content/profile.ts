/**
 * profile.ts — SINGLE SOURCE OF TRUTH for all personal data.
 *
 * HARD RULE: No fabrication. Verified data only.
 * Unknown values are `null` and rendered gracefully (hidden / labelled),
 * never invented. Fill the PLACEHOLDER fields when you have real values.
 */

export type Project = {
  id: string;
  name: string;
  tagline: string;
  year: string;
  domain: "AI" | "AI • Multimodal" | "Computer Vision";
  accent: "signal" | "ember";
  summary: string;
  /** The honest problem the project set out to solve. */
  problem: string;
  /** A real, specific engineering challenge from building it. */
  challenge: string;
  /** Honest current state — no invented metrics. */
  status: string;
  /** Verified technologies actually used. */
  stack: string[];
  /** High-level architecture stages used to drive the scroll visual. */
  pipeline: { key: string; label: string; detail: string }[];
  /** Real, verified links only. `null` hides the link. */
  repo: string | null;
  live: string | null;
};

export type Certification = {
  title: string;
  issuer: string;
  date: string;
};

export const profile = {
  name: "Raushan Kumar",
  initials: "RK",
  role: "B.Tech Computer Science",
  focus: "AI / ML",
  tagline: "Builder",
  location: "India",

  headline:
    "Building intelligent systems at the intersection of software and the physical world.",
  subheadline:
    "Computer Science student focused on AI/ML — retrieval systems, computer vision and NLP — with a builder's curiosity for electronics, robotics and mechanical systems.",

  // ---- Contact (verified only) --------------------------------------------
  email: "raushanverma1240@gmail.com",
  phone: "+91 76677 16307" as string | null,
  github: "anurohan",
  githubUrl: "https://github.com/anurohan",
  linkedin: "https://www.linkedin.com/in/raushan-kumar-verma" as string | null,
  linkedinHandle: "in/raushan-kumar-verma",
  resumePath: "/Raushan_Kumar_CV.pdf", // real PDF lives in /public

  // ---- Education (verified) -----------------------------------------------
  education: {
    school: "Lovely Professional University",
    degree: "B.Tech, Computer Science & Engineering",
    period: "2024 — 2028",
    cgpa: "7.0",
    location: "Punjab, India",
  },

  // ---- Honest achievements (verified) -------------------------------------
  achievements: [
    {
      title: "Rank 1 — IoT Project Competition",
      detail:
        "Placed first in a college IoT project competition — a hands-on exploration of sensors, embedded control and physical systems.",
    },
    {
      title: "Ranked — College Hackathon",
      detail:
        "Secured a rank in a college-level hackathon, building under time pressure with a team.",
    },
  ],

  // ---- Certifications (verified, from résumé) ------------------------------
  certifications: [
    {
      title: "Career Essentials in Generative AI",
      issuer: "Microsoft & LinkedIn",
      date: "Aug 2025",
    },
    {
      title: "Career Essentials in GitHub Professional Certificate",
      issuer: "GitHub",
      date: "Sep 2025",
    },
    {
      title: "Responsive Web Design",
      issuer: "freeCodeCamp",
      date: "Sep 2025",
    },
    {
      title: "Career Essentials in Business Analysis",
      issuer: "Microsoft & LinkedIn",
      date: "Feb 2026",
    },
  ] as Certification[],

  // ---- Interests (framed honestly as interests, NOT fake projects) --------
  coreInterests: [
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Vision",
    "NLP",
    "RAG & Semantic Search",
    "Full-Stack Engineering",
    "Backend Development",
  ],
  builderInterests: [
    "Robotics",
    "Electronics",
    "IoT & Sensors",
    "Motors & Actuators",
    "Embedded Systems",
    "Mechanical Systems",
  ],
} as const;

/**
 * skillGroups — the technical map.
 * Every entry is a technology genuinely used across the projects above
 * (WisdomLens / LifeLens AI / VisionDetect) or a core competency.
 * No fabricated proficiency scores or badges.
 */
export type SkillGroup = {
  key: string;
  title: string;
  accent: "signal" | "ember";
  blurb: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    key: "ai",
    title: "AI / ML",
    accent: "signal",
    blurb: "The core — turning data into understanding.",
    items: [
      "Retrieval-Augmented Generation",
      "Semantic Search",
      "Computer Vision (YOLO)",
      "NLP",
      "Deep Learning",
      "Embeddings",
      "TensorFlow",
      "Scikit-learn",
      "Sentence-Transformers",
    ],
  },
  {
    key: "backend",
    title: "Backend & Data",
    accent: "signal",
    blurb: "Serving models and moving data reliably.",
    items: [
      "Python",
      "FastAPI",
      "Flask",
      "PostgreSQL",
      "pgvector",
      "FAISS",
      "OpenCV",
      "NumPy",
      "Pandas",
      "Streamlit",
    ],
  },
  {
    key: "frontend",
    title: "Frontend",
    accent: "signal",
    blurb: "Interfaces that make the system usable.",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS"],
  },
  {
    key: "languages",
    title: "Languages & Core CS",
    accent: "signal",
    blurb: "The fundamentals under everything.",
    items: [
      "Python",
      "C++",
      "Java",
      "SQL",
      "Data Structures & Algorithms",
      "OOP",
      "DBMS",
      "REST APIs",
    ],
  },
  {
    key: "physical",
    title: "Physical Systems",
    accent: "ember",
    blurb: "Genuine interests — where code meets hardware.",
    items: [
      "IoT & Sensors",
      "Embedded Control",
      "Robotics",
      "Electronics",
      "Mechanical Systems",
    ],
  },
];

export const projects: Project[] = [
  {
    id: "wisdomlens",
    name: "WisdomLens",
    tagline: "Retrieval-augmented answers grounded in a real knowledge base.",
    year: "2026",
    domain: "AI",
    accent: "signal",
    summary:
      "A chat-based knowledge assistant that answers questions from a stored text knowledge base. Semantic search over 800+ chunks with Sentence-Transformers + FAISS finds the most relevant passages, and a RAG pipeline feeds that context to a locally-run Llama 3.2 (via Ollama) for grounded, bilingual answers.",
    problem:
      "LLMs answer confidently even when they don't know — and can't cite where an answer came from. WisdomLens keeps answers tied to real source passages.",
    challenge:
      "Keeping retrieval, generation and the chat UI as independent parts behind a REST API, so each could evolve without breaking the others — and running the model locally through Ollama instead of a paid API.",
    status:
      "Working project. FastAPI backend + React frontend; retrieval over 800+ text chunks with bilingual responses.",
    stack: ["Python", "FastAPI", "React", "FAISS", "Sentence-Transformers", "Ollama", "Llama 3.2"],
    pipeline: [
      { key: "doc", label: "Knowledge base", detail: "Source text enters the system." },
      { key: "chunk", label: "Chunking", detail: "Split into 800+ semantic chunks." },
      { key: "embed", label: "Embeddings", detail: "Each chunk becomes a vector." },
      { key: "search", label: "Vector search", detail: "FAISS nearest neighbours to the query." },
      { key: "retrieve", label: "Retrieval", detail: "Top-k relevant context selected." },
      { key: "llm", label: "Llama 3.2", detail: "Answer generated, grounded in context." },
      { key: "answer", label: "Answer", detail: "Traceable, source-linked response." },
    ],
    repo: null,
    live: null,
  },
  {
    id: "lifelens",
    name: "LifeLens AI",
    tagline: "Multimodal knowledge — documents, images and notes, unified.",
    year: "2026",
    domain: "AI • Multimodal",
    accent: "signal",
    summary:
      "A multimodal personal knowledge system where documents, notes and images live and are searched in one place. Tesseract OCR, spaCy and Sentence-Transformers turn every uploaded file into searchable text; embeddings + metadata sit in PostgreSQL with pgvector so similarity search stays fast across file types, all behind a responsive Next.js frontend.",
    problem:
      "Useful information is scattered across PDFs, screenshots and notes in different formats — impossible to search as one corpus.",
    challenge:
      "Making mixed modalities searchable together: extracting clean text from images via OCR and unifying everything into a single pgvector index that stays fast as file types differ.",
    status:
      "Working project. Upload, search and view across modalities; FastAPI + PostgreSQL/pgvector backend with a Next.js UI.",
    stack: ["Python", "Next.js", "FastAPI", "PostgreSQL", "pgvector", "Tesseract", "spaCy", "Sentence-Transformers"],
    pipeline: [
      { key: "inputs", label: "Mixed inputs", detail: "Documents, images and notes." },
      { key: "ocr", label: "OCR / extract", detail: "Tesseract + spaCy pull text from every file." },
      { key: "embed", label: "Embeddings", detail: "Unified vector representation." },
      { key: "store", label: "pgvector", detail: "Stored in PostgreSQL with metadata." },
      { key: "search", label: "Semantic search", detail: "Retrieve across modalities." },
      { key: "recall", label: "Recall", detail: "Relevant knowledge surfaced." },
    ],
    repo: null,
    live: null,
  },
  {
    id: "visiondetect",
    name: "VisionDetect",
    tagline: "Real-time object detection from images, video and a live camera.",
    year: "2026",
    domain: "Computer Vision",
    accent: "ember",
    summary:
      "A computer-vision application that detects objects and people in uploaded images and videos, and in a live camera feed. YOLO + OpenCV identify categories like phones, bottles and people; video is processed frame by frame, each detection drawn with a bounding box and class label.",
    problem:
      "Turning a raw camera or video feed into structured, labelled scene understanding that a program can act on.",
    challenge:
      "Running detection frame-by-frame fast enough to feel real time, while keeping bounding boxes and labels stable across frames.",
    status:
      "Working project. Detects objects/people in images, video and live camera input with bounding boxes and class labels.",
    stack: ["Python", "YOLO", "OpenCV"],
    pipeline: [
      { key: "camera", label: "Camera / video", detail: "Live stream or uploaded footage in." },
      { key: "frames", label: "Frames", detail: "Decoded into individual frames." },
      { key: "yolo", label: "YOLO", detail: "Single-pass detection network." },
      { key: "boxes", label: "Bounding boxes", detail: "Objects localised per frame." },
      { key: "labels", label: "Labels", detail: "Classes attached to each box." },
    ],
    repo: null,
    live: null,
  },
];
