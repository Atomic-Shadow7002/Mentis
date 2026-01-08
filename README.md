# Mentis

### Curriculum-Aware Smart Adaptive Learning Engine

Mentis is a **curriculum-first adaptive learning system** that transforms static textbooks into structured, personalized learning experiences while maintaining pedagogical rigor, deterministic behavior, and full testability.

This repository contains the **core intelligence layer** of Mentis—the foundation that powers curriculum-grounded adaptive learning.

---

## 🎯 Why Mentis Exists

Most "AI learning platforms" fail on fundamentals:

- **Generate content without curriculum grounding** → No learning authority
- **Treat learning as a chat session** → No pedagogical structure
- **Lack verifiable structure** → Untestable black boxes
- **Cannot explain decisions** → Zero accountability

### Mentis takes a different approach:

> **Curriculum is the authority. AI is a bounded assistant. Learners are stateful systems.**

We believe adaptive learning requires **explicit models**, not just generative outputs.

---

## 🧠 Core Principles

| Principle                   | What It Means                                               |
| --------------------------- | ----------------------------------------------------------- |
| **Curriculum-first**        | Knowledge structure precedes all content generation         |
| **Deterministic logic**     | Every decision is traceable; no black-box reasoning         |
| **Pedagogical constraints** | Learning science principles are enforced in code            |
| **Layered architecture**    | Each subsystem is independently testable and composable     |
| **Production discipline**   | Validation contracts, immutability, and fail-fast semantics |

---

## 🏗️ System Architecture

```
Textbook (PDF)
      ↓
Ingestion & Extraction
      ↓
Curriculum Alignment ✅ DONE
      ↓
Learner Model ⏳ NEXT
      ↓
Adaptation Engine
      ↓
Personalized Learning Flow
```

**This repository focuses on the foundation layers**, not UI or delivery systems.

---

## 📚 Curriculum System (Completed)

Mentis defines an **authoritative curriculum graph** that serves as the single source of truth for all learning content and progression logic.

### Features

- **Strongly typed concept definitions** with explicit contracts
- **Learning outcomes** tied to measurable competencies
- **Difficulty levels** (1–5 scale) per concept
- **Knowledge types**: conceptual, procedural, dispositional, factual
- **Reinforcement strategies** for each concept
- **Completion semantics** with clear success criteria
- **Explicit prerequisites** forming a directed acyclic graph
- **DAG validation** with automatic cycle detection
- **Runtime immutability** preventing accidental mutation

### File Structure

```
mentis/
├─ assets/
│  └─ textbooks/
│
├─ data/
│  ├─ raw/                 # PDF → pages
│  ├─ intermediate/        # sections, concepts (optional)
│  ├─ final/               # chapter.json, curriculum.json
│  └─ learner/             # learner profiles (later)
│
├─ ingest/                 # Phase 1–3 (DONE)
│  ├─ pdfIngest.ts
│  ├─ sectionParser.ts
│  ├─ classifyBlock.ts
│  ├─ fastClassifier.ts
│  ├─ llamaClassifier.ts
│  ├─ classifierCache.ts
│  ├─ conceptExtractor.ts
│  ├─ learningUnitGenerator.ts
│  ├─ learningUnitRefiner.ts
│  └─ types.ts
│
├─ curriculum/             # Phase 6 (NEW)
│  ├─ curriculumGraph.ts   # data models
│  ├─ buildGraph.ts        # manual / semi-auto graph creation
│  └─ validateGraph.ts     # DAG + integrity checks
│
├─ learner/                # Phase 7 (NEW)
│  ├─ learnerModel.ts      # LearnerProfile, LearnerConceptState
│  ├─ masteryUpdater.ts   # rules to update mastery
│  └─ decayModel.ts        # forgetting logic
│
├─ adapt/                  # Phase 8 (NEW)
│  ├─ adaptationEngine.ts  # decision rules (core brain)
│  ├─ decisionTypes.ts     # LearningAction types
│  └─ explainDecision.ts   # human-readable explanations
│
├─ scripts/
│  ├─ ingestChapter.ts
│  ├─ buildCurriculum.ts
│  └─ simulateLearner.ts   # test adaptation logic
│
├─ README.md
├─ tsconfig.json
├─ package.json
└─ eslint.config.js

```

### Guarantees

✓ Invalid curricula fail at startup  
✓ Pedagogical rules are enforced in types  
✓ Runtime mutation is impossible  
✓ Curriculum is the single source of truth

---

## 🔗 Alignment Engine (Completed)

The alignment engine connects **extracted textbook concepts** to the **official curriculum graph**, ensuring every piece of content is pedagogically grounded.

### Alignment Strategies (Priority Order)

1. **Exact ID match** → Direct curriculum reference
2. **Normalized title match** → Canonical name matching
3. **Explanation overlap** → Semantic similarity (guarded by concept kind)

### Alignment Outcomes

| Outcome    | Meaning                                      |
| ---------- | -------------------------------------------- |
| `aligned`  | Successfully mapped to a curriculum concept  |
| `rejected` | Explicitly excluded (never silently dropped) |

### Coverage Tracking

- **Covered curriculum concepts** → Concepts with aligned content
- **Missing curriculum concepts** → Gaps requiring content creation

### File Structure

```
curriculum/alignment/
├── aligner.ts         # Core alignment logic
├── rules.ts           # Strategy definitions & priority
└── types.ts           # Alignment contracts & result types
```

### Guarantees

✓ One decision per extracted concept  
✓ Deterministic behavior across runs  
✓ Full traceability of alignment decisions  
✓ Curriculum authority is always preserved

---

## 🧪 Testing Strategy

Mentis uses **logic-first testing**, not brittle snapshot tests.

### What We Test

- ✅ Curriculum validity (structure + semantics)
- ✅ Pedagogical constraints (prerequisites, difficulty)
- ✅ Immutability (top-level and deeply nested)
- ✅ Registry correctness (safe access patterns)
- ✅ Alignment correctness (all strategies)
- ✅ Rejection behavior (explicit non-alignment)
- ✅ Coverage reporting (gaps and completeness)

### Test Scripts

```
scripts/
├── testCurriculum.ts     # Curriculum validation suite
└── testAlignment.ts      # Alignment engine test suite
```

### Running Tests

```bash
npx ts-node scripts/testCurriculum.ts
npx ts-node scripts/testAlignment.ts
```

**All tests must pass before advancing to the next layer.**

---

## 📁 Repository Structure

```
.
├── curriculum/          # Authoritative curriculum system
│   ├── alignment/       # Textbook-to-curriculum alignment
│   ├── curriculum.ts    # Grade-level definitions
│   ├── types.ts         # Core data model
│   ├── validate.ts      # Validation logic
│   ├── registry.ts      # Safe access layer
│   └── freeze.ts        # Immutability utilities
├── ingest/              # Textbook ingestion & extraction
├── scripts/             # Test suites and pipelines
├── data/                # Generated artifacts (raw / final)
├── README.md            # This file
└── tsconfig.json        # TypeScript configuration
```

---

## 📊 Current Status

### ✅ Completed

- [x] Curriculum data model with strong typing
- [x] Curriculum validation & immutability enforcement
- [x] Curriculum registry with safe access patterns
- [x] Alignment contract definition
- [x] Alignment engine implementation
- [x] Comprehensive alignment test suite

### ⏳ Next Milestones

- [ ] Learner model (state tracking + mastery computation)
- [ ] Curriculum graph traversal algorithms
- [ ] Adaptation decision engine
- [ ] Personalized pacing & reinforcement logic

---

## 🚀 What Makes This Project Advanced

Mentis demonstrates production-grade design for intelligent learning systems:

| Capability                      | Implementation                                        |
| ------------------------------- | ----------------------------------------------------- |
| **Real system architecture**    | Layered, composable modules (not prototypes)          |
| **Curriculum-aware AI**         | All generation is grounded in pedagogical structure   |
| **Deterministic decisions**     | Traceable logic, not probabilistic black boxes        |
| **Pedagogical correctness**     | Learning science principles enforced in code          |
| **Production-grade validation** | Fail-fast semantics with comprehensive error handling |
| **Test-driven development**     | Logic-first tests for every subsystem                 |

### This project aligns with expectations for:

- EdTech R&D engineering
- Applied ML for education
- Intelligent tutoring systems (ITS)
- AI systems with real-world constraints

---

## ⚠️ Non-Negotiable Design Rules

1. **No AI output without curriculum grounding**  
   Every piece of content must map to the curriculum graph.

2. **No learner adaptation without mastery state**  
   Personalization requires explicit learner models.

3. **No silent failures**  
   Every error must be explicit and traceable.

4. **No mutable curriculum data**  
   The curriculum is frozen after validation.

5. **No shortcut logic**  
   Pedagogical correctness cannot be compromised for convenience.

---

## 🤝 Contributing

[Add contribution guidelines here]

---

**Mentis** — Where curriculum meets intelligence.
