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
