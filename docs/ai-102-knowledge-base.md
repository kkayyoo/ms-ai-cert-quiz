# AI-102 Azure AI Engineer Certification - Knowledge Base

## Exam Overview
- **Exam**: AI-102: Designing and Implementing a Microsoft Azure AI Solution
- **Passing Score**: 700/1000
- **Duration**: 120 minutes
- **Total Questions**: ~60

## Exam Domains

| Domain | Weight |
|--------|--------|
| Plan and manage an Azure AI solution | 15-20% |
| Implement decision support solutions | 10-15% |
| Implement computer vision solutions | 15-20% |
| Implement natural language processing solutions | 30-35% |
| Implement knowledge mining and document intelligence solutions | 10-15% |
| Implement generative AI solutions | 10-15% |

---

## Domain 1: Plan and Manage an Azure AI Solution (15-20%)

### Key Services
- **Azure AI Services multi-service resource** - Single endpoint/key for multiple AI capabilities
- **Azure Key Vault** - Store and manage keys, secrets, certificates (CMK support)
- **Azure Monitor** - Metrics, logs, alerts for AI resources
- **Managed Identity** - Secure authentication without credentials in code

### Key Concepts
- **Network Security**: VNet service endpoints, private endpoints, firewall rules
- **Authentication**: Subscription keys, Entra ID (AAD), Managed Identity
- **Pricing Tiers**: Free (F0) = limited calls; Standard (S0) = pay-per-use with SLA
- **Containers**: Run AI services on-premises or in disconnected environments
- **CMK (Customer-Managed Keys)**: Stored in Azure Key Vault for compliance
- **Responsible AI**: Fairness, Reliability, Privacy, Inclusiveness, Transparency, Accountability
- **Data Residency**: Use regional endpoints; avoid global endpoints for compliance

### Important Notes
- Monitor with Azure Monitor (not Azure Advisor)
- For disconnected/edge deployment → use AI Services containers
- For credential-free auth in production → Managed Identity + Key Vault

---

## Domain 2: Implement Decision Support Solutions (10-15%)

### Key Services

#### Azure AI Anomaly Detector
- Detects anomalies in time-series data without labeled training data
- **Univariate**: Single time series
- **Multivariate (MVAD)**: Multiple correlated time series simultaneously
- Configure granularity/period for seasonal data
- Use cases: IoT monitoring, predictive maintenance

#### Azure AI Personalizer
- Reinforcement learning for personalized recommendations
- **Decision Loop**: Rank API → Show content → Reward API
- **Exploration rate (epsilon)**: % of requests that try random actions to explore
- **Offline Evaluation**: Counterfactual analysis of historical data
- Use cases: Product recommendations, news feed personalization

#### Azure AI Metrics Advisor
- Monitor business KPIs across multiple metrics
- Automatic anomaly detection + root cause analysis
- Customizable dashboards
- Use cases: Business performance monitoring

#### Azure AI Content Safety
- Moderate text and images for harmful content
- Categories: Hate, Violence, Sexual, Self-harm
- Provides severity scores (0-6)
- Custom blocklists supported

---

## Domain 3: Implement Computer Vision Solutions (15-20%)

### Key Services

#### Azure AI Vision - Image Analysis
- **Tags**: Apply content labels to images
- **Objects**: Detect objects with bounding boxes
- **Captions / Dense Captions**: Human-readable descriptions (for accessibility)
- **OCR (Read API)**: Extract printed and handwritten text (asynchronous preferred for large images)
- **Spatial Analysis**: Count people, zone entry/exit, crowd density from live video

#### Azure AI Face
- **Detect**: Find faces and attributes
- **Verify**: Determine if two faces belong to same person
- **Identify**: Match detected face to a Person Group
- **Find Similar**: Find similar faces in a list

#### Azure AI Custom Vision
- Train custom image classification and object detection models
- Min 15 images per tag recommended for object detection
- **Export models**: Docker (IoT Edge), CoreML (iOS), TensorFlow (Android)
- **Evaluation**: Precision and Recall are key metrics

#### Azure AI Video Indexer
- Extract insights from video: objects, faces, speech, topics
- Best for batch video analysis and content discovery

#### Azure AI Vision 4.0 Custom Models
- Train custom models within Image Analysis 4.0 (Florence foundation model)
- No separate Custom Vision resource needed

---

## Domain 4: Implement NLP Solutions (30-35%)

### Key Services

#### Azure AI Language
- **Sentiment Analysis + Opinion Mining**: Positive/negative/neutral/mixed, aspect-level opinions
- **Named Entity Recognition (NER)**: Extract Person, Organization, Location, DateTime, etc.
- **Key Phrase Extraction**: Important terms from text
- **PII Detection**: Identify and redact personal data
- **Language Detection**: Identify the language of text
- **Custom Text Classification**: Train custom categories (e.g., support ticket routing)
- **Custom Question Answering**: Build QA knowledge base from documents/FAQs
- **CLU (Conversational Language Understanding)**: Successor to LUIS; intent + entity recognition
- **Orchestration Workflow**: Route between CLU and QnA from single endpoint
- **Text Analytics for Health**: Extract medical entities (diagnoses, medications, symptoms)
- **Document Summarization**: Extractive (select sentences) or abstractive (generate new text)

#### Azure AI Speech
- **Speech-to-Text**: Transcribe spoken audio to text
- **Custom Speech**: Domain-adapted models for specialized vocabulary
- **Speaker Diarization**: Identify who is speaking in multi-speaker audio
- **Text-to-Speech**: Convert text to synthesized speech
- **Custom Neural Voice (CNV)**: Create brand-specific synthetic voice (requires talent consent)
- **Speech Translation**: Real-time speech translation
- **Pronunciation Assessment**: Evaluate pronunciation quality

#### Azure AI Translator
- Text translation across 100+ languages
- **Custom Translator**: Domain-specific translation models
- Detect language automatically

#### Azure Bot Service
- Build multi-turn conversational bots
- Integrates with CLU for intent recognition and Custom QnA for FAQ
- Manages conversation state and dialog flows

### CLU Evaluation Metrics
- **Intent-level**: Precision, Recall, F1
- **Entity-level**: Precision, Recall, F1

---

## Domain 5: Knowledge Mining & Document Intelligence (10-15%)

### Key Services

#### Azure AI Search (formerly Cognitive Search)
- Enterprise search over heterogeneous content
- **Skillsets**: AI enrichment pipeline (OCR, entity extraction, sentiment, etc.)
- **OCR Skill**: Extract text from images in documents
- **Knowledge Store**: Persist enriched data to Azure Storage for reuse
- **Custom Skills**: Azure Functions that extend the enrichment pipeline
- **Semantic Ranker**: L2 re-ranking using deep learning (improves relevance)
- **Vector Search**: Semantic similarity using embeddings; requires vector fields in index

#### Azure AI Document Intelligence (formerly Form Recognizer)
- **Prebuilt Models**: Invoice, Receipt, Business Card, ID Document, W-2, etc.
- **General Document Model**: Extract text, tables, key-value pairs from any document
- **Custom Template Model**: Fixed-layout forms with consistent structure
- **Custom Neural Model**: Variable-layout documents; more flexible
- Use asynchronous API for batch processing large volumes

### Important Concepts
- **Vector Search Setup**: Generate embeddings (e.g., text-embedding-ada-002) → store in vector fields → query with vector
- **Semantic Ranker**: Requires Standard S1 tier or above

---

## Domain 6: Implement Generative AI Solutions (10-15%)

### Key Services

#### Azure OpenAI Service
- GPT-4, GPT-3.5-Turbo for chat/completions
- DALL-E for image generation (Images API)
- text-embedding-ada-002, text-embedding-3-large for embeddings
- **Fine-tuning**: Available for GPT-3.5-Turbo; requires JSONL training data
- **Content Filtering**: Built-in filters for hate, sexual, violence, self-harm (enabled by default)
- **Function Calling (Tools)**: Model identifies when to call external APIs; returns structured JSON
- **JSON Mode**: Force valid JSON output (response_format: json_object)

### Key Concepts

#### RAG (Retrieval-Augmented Generation)
- Retrieval → Fetch relevant docs from Azure AI Search
- Augmentation → Include retrieved docs in prompt as context
- Generation → LLM generates grounded answer from context
- Best approach for grounding LLM to company-specific data

#### Prompt Engineering
- **System Message**: Define model behavior, style, persona
- **Few-shot prompting**: Provide examples to guide output format
- **Chain-of-thought**: Ask model to reason step-by-step
- **JSON Mode**: Combined with few-shot for structured output
- Temperature = 0 for deterministic output; higher = more creative

#### Azure OpenAI Studio
- **Chat Playground**: Interactive testing of GPT models
- **DALL-E Playground**: Image generation testing
- **Deployments**: Create model deployments with quota and settings

---

## Study Resources
- [AI-102 Certification Page](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/)
- [AI-102 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-102)
- [Azure AI Services Documentation](https://learn.microsoft.com/en-us/azure/ai-services/)
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/)

---

*Last Updated: 2026-06-10 | Questions: 70 | Status: Complete*
