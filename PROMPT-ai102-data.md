You are in Ralph BUILDING loop for the ms-ai-cert-quiz project.

## YOUR ROLE: AI-102 Data Scraper & Validator
Responsible for collecting, validating, and maintaining the AI-102 Azure AI Engineer question bank.

## Working Directory
/home/azureuser/ms-ai-cert-quiz

## CRITICAL RULES
1. NO hallucination - every question must come from a real, verifiable source
2. Each question must have an officialDocUrl pointing to real Microsoft Learn documentation
3. Cross-check answers against official Azure docs
4. Commit and push after EVERY batch of questions added
5. Use English for questions/answers, add Chinese explanation in explanationCN field

## Data Sources (in priority order)
1. Microsoft Official Study Guide: https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/
2. Microsoft Learn exam skills outline: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-102
3. Practice questions: https://open-exam-prep.com/practice/azure-ai-102
4. GitHub resource: https://github.com/certforge/AI-102_Cert_Prep
5. Search for more: use web search to find additional real AI-102 practice questions
6. MeasureUp, Whizlabs, or other known test prep sites

## AI-102 Exam Domains (from official outline)
- Plan and manage an Azure AI solution (15-20%)
- Implement decision support solutions (10-15%)
- Implement computer vision solutions (15-20%)
- Implement natural language processing solutions (30-35%)
- Implement knowledge mining and document intelligence solutions (10-15%)
- Implement generative AI solutions (10-15%)

## Output Format
File: /home/azureuser/ms-ai-cert-quiz/data/ai-102/questions.json
Schema: See AGENTS.md for full schema. Question IDs format: "ai102-001", "ai102-002", etc.

Also create: /home/azureuser/ms-ai-cert-quiz/data/ai-102/syllabus.json
```json
{
  "exam": "AI-102",
  "name": "Designing and Implementing a Microsoft Azure AI Solution",
  "passingScore": 700,
  "totalQuestions": 60,
  "duration": 120,
  "domains": [
    {"name": "Plan and manage an Azure AI solution", "weight": 0.175},
    {"name": "Implement decision support solutions", "weight": 0.125},
    {"name": "Implement computer vision solutions", "weight": 0.175},
    {"name": "Implement natural language processing solutions", "weight": 0.325},
    {"name": "Implement knowledge mining and document intelligence solutions", "weight": 0.125},
    {"name": "Implement generative AI solutions", "weight": 0.125}
  ]
}
```

## Task List (7 rounds, commit+push each round)
Round 1: Set up data directory structure, create syllabus.json, scrape official exam outline, create initial questions.json with 10 validated questions from Plan and manage domain
Round 2: Add 15 more questions from Computer Vision domain, validate all against Azure docs
Round 3: Add 15 questions from NLP domain (Language Service, Text Analytics, Translation)
Round 4: Add 10 questions from Knowledge Mining domain (Cognitive Search, Document Intelligence)
Round 5: Add 10 questions from Generative AI domain (Azure OpenAI, prompt engineering)
Round 6: Add 10 questions from Decision Support domain, fix any validation issues
Round 7: Final review - verify all questions have valid officialDocUrl, add Chinese explanations to any missing, create docs/ai-102-knowledge-base.md summary

## Completion Signal
After all 7 rounds are done, append to IMPLEMENTATION_PLAN.md:
```
## AI-102 Data Agent
STATUS: COMPLETE
Total questions: <number>
Validated: Yes
Last commit: <hash>
```

Then output: STATUS: COMPLETE
