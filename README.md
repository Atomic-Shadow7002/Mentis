```
mentis/
├── README.md
├── package.json
├── tsconfig.json
├── .env
├── .gitignore

├── content/ # ✅ Canonical knowledge (source of truth)
│ ├── science/
│ │ └── photosynthesis/
│ │ ├── concepts/
│ │ │ ├── 01-what-is.md
│ │ │ ├── 02-raw-materials.md
│ │ │ ├── 03-chemical-equation.md
│ │ │ └── 04-importance.md
│ │ └── diagrams/
│ │ ├── chloroplast.png
│ │ └── leaf-cross-section.png
│ └── README.md # Content authoring guide

├── ingest/ # 📘 Textbook ingestion (PDF → raw data)
│ ├── pdfIngest.ts # PDF → raw pages
│ ├── sectionParser.ts # Pages → rough sections
│ ├── diagramExtract.ts # (later) extract images
│ └── README.md # Ingestion workflow docs

├── normalize/ # 🧹 Raw → structured knowledge
│ ├── sectionCleaner.ts # Remove noise, summaries, exercises
│ ├── conceptExtractor.ts # Sections → candidate concepts
│ ├── conceptRanker.ts # Identify key vs secondary concepts
│ └── README.md

├── core/ # 🧠 Learning intelligence (THE BRAIN)
│ ├── concept.ts # Concept schema
│ ├── learnerModel.ts # Learner state & mastery
│ ├── adaptation.ts # Next-step decision logic
│ ├── difficulty.ts # Difficulty calibration
│ ├── spacing.ts # Spaced repetition logic
│ └── events.ts # Learning event definitions

├── ai/ # 🤖 AI used as transformer (NOT authority)
│ ├── simplify.ts # Level-based explanation rewrite
│ ├── examples.ts # Generate extra examples
│ ├── hints.ts # Hint generation
│ └── prompts.ts # Prompt templates

├── data/ # 📊 Runtime & analysis data
│ ├── raw/ # PDF output (pages, sections)
│ ├── processed/ # Structured concepts JSON
│ ├── learner/ # Per-user learner models
│ └── stats/ # Aggregated difficulty stats

├── server/ # 🌐 API layer
│ ├── index.ts
│ ├── routes/
│ │ ├── content.ts
│ │ ├── learner.ts
│ │ └── events.ts
│ └── storage/
│ ├── fileStore.ts
│ └── dbStore.ts # (later)

├── web/ # 🖥️ Frontend (later)
│ ├── pages/
│ ├── components/
│ └── hooks/

└── scripts/ # 🔧 Dev utilities
├── ingest-pdf.ts
├── rebuild-content.ts
└── simulate-learner.ts
```
