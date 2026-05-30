const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const prisma = new PrismaClient();
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

const collectionByType = {
  OPERATIONAL_PROCEDURE: 'industrial_knowledge',
  FACTORY_OPERATION: 'operational_troubleshooting',
  STANDARD_CLAUSE: 'standards_knowledge',
  AUDIT_CHECKLIST: 'audit_knowledge',
  INTERVIEW_QA: 'interview_knowledge',
  DEFECT_SCENARIO: 'operational_troubleshooting',
  CAPA_TEMPLATE: 'document_templates',
  NCR_TEMPLATE: 'document_templates',
  RCA_METHODOLOGY: 'document_templates',
  RISK_ASSESSMENT: 'document_templates',
  INSPECTION_PROCEDURE: 'industrial_knowledge',
  WORK_INSTRUCTION: 'industrial_knowledge',
};

const seedKnowledge = [
  {
    objectId: 'STD-ISO9001-851',
    title: 'ISO 9001 Clause 8.5.1 - Production and Service Provision',
    industry: 'STEEL_ROLLING',
    process: 'quality_management_system',
    standard: 'ISO 9001',
    knowledgeType: 'STANDARD_CLAUSE',
    authorityLevel: 'EXPERT',
    retrievalTags: ['ISO 9001', '8.5.1', 'production control', 'process control', 'QMS'],
    language: 'ar',
    content: `ISO 9001 Clause 8.5.1 focuses on controlled conditions for production and service provision. In a steel rolling mill this means documented work instructions, defined process parameters, competent operators, calibrated monitoring equipment, clear acceptance criteria, and records that prove the process ran under control.

Arabic guidance: عند تدقيق بند 8.5.1 اسأل عن تعليمات التشغيل، حدود درجات الحرارة، سرعة الدرفلة، إعدادات stand، خطة الفحص، سجلات المعايرة، وسجلات التفتيش. الدليل الجيد يربط بين الخطة والإنتاج الفعلي والنتيجة النهائية.`,
  },
  {
    objectId: 'RCA-5WHY-FISHBONE-001',
    title: 'RCA Methodology - 5 Why and Fishbone',
    industry: 'STEEL_ROLLING',
    process: 'root_cause_analysis',
    knowledgeType: 'RCA_METHODOLOGY',
    authorityLevel: 'EXPERT',
    retrievalTags: ['RCA', '5 Why', 'Fishbone', 'root cause', 'problem solving'],
    language: 'ar',
    content: `A strong RCA starts with a precise problem statement: what happened, where, when, how much, and what requirement was missed. Use containment first, then collect evidence before deciding root cause. 5 Why works for linear causes; Fishbone helps organize people, machine, method, material, measurement, and environment causes.

Arabic guidance: لا تقف عند سبب عام مثل "خطأ مشغل". اربط السبب الجذري بدليل قابل للتحقق، مثل غياب معيار ضبط، أداة قياس غير معايرة، billet temperature خارج الحدود، أو work instruction غير كاف. يجب أن ينتج عن RCA سبب يمكن إزالته بإجراء تصحيحي واضح.`,
  },
  {
    objectId: 'CAPA-EFFECTIVENESS-001',
    title: 'CAPA Template and Effectiveness Check',
    industry: 'STEEL_ROLLING',
    process: 'capa_management',
    knowledgeType: 'CAPA_TEMPLATE',
    authorityLevel: 'STANDARD',
    retrievalTags: ['CAPA', 'corrective action', 'preventive action', 'effectiveness'],
    language: 'ar',
    content: `CAPA should include containment, root cause, corrective action, preventive action, responsible person, due date, verification method, and effectiveness criteria. The action is not complete until evidence shows the nonconformity did not recur under comparable operating conditions.

Arabic guidance: معيار الفاعلية يجب أن يكون قابل للقياس، مثل انخفاض تكرار العيب خلال ثلاث ورديات إنتاج، أو نجاح audit follow-up، أو تحقيق FPY target بعد تعديل الإجراء. تجنب إغلاق CAPA بمجرد تنفيذ التدريب فقط بدون دليل فاعلية.`,
  },
  {
    objectId: 'AUD-ISO9001-INTERNAL-001',
    title: 'Internal Audit Checklist - ISO 9001 for Rolling Mill',
    industry: 'STEEL_ROLLING',
    process: 'internal_audit',
    standard: 'ISO 9001',
    knowledgeType: 'AUDIT_CHECKLIST',
    authorityLevel: 'STANDARD',
    retrievalTags: ['Audit', 'ISO 9001', 'checklist', 'rolling mill'],
    language: 'ar',
    content: `Internal audit questions for a rolling mill should verify process controls, competence, documented information, traceability, nonconformity control, inspection records, and improvement actions. Good evidence includes heat records, rolling parameters, inspection reports, NCRs, CAPA records, calibration certificates, and operator qualification records.

Arabic checklist: هل توجد خطة فحص معتمدة؟ هل حدود العملية معروفة ومراقبة؟ هل يتم عزل المنتج غير المطابق؟ هل سجلات NCR و CAPA مغلقة بفاعلية؟ هل توجد مطابقة بين متطلبات العميل وسجلات الإنتاج والفحص؟`,
  },
  {
    objectId: 'DEF-STEEL-SURFACE-001',
    title: 'Steel Rolling Surface Defects - Causes and Checks',
    industry: 'STEEL_ROLLING',
    process: 'rolling_operations',
    knowledgeType: 'DEFECT_SCENARIO',
    authorityLevel: 'EXPERT',
    retrievalTags: ['Steel Rolling', 'surface defects', 'scale', 'cracks', 'rolling defects'],
    language: 'ar',
    content: `Common surface defects in steel rolling include cracks, laps, seams, scale marks, scratches, and rolled-in foreign material. Likely causes include billet surface defects, reheating issues, incorrect descaling, roll damage, guide misalignment, excessive reduction, or poor handling after rolling.

Arabic troubleshooting: ابدأ بتحديد شكل العيب واتجاهه ومكانه على المنتج. إذا كان العيب طولي ومتكرر راجع billet surface والـ guides والـ rolls. إذا كان مرتبطا بالحرارة راجع reheating furnace وdescaling. اربط العيب بالوردية، رقم heat، stand، وسجلات الفحص لتحديد السبب الأكثر احتمالا.`,
  },
];

function chunkText(text, maxWords = 130, overlapWords = 25) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return [text];

  const chunks = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + maxWords, words.length);
    chunks.push(words.slice(start, end).join(' '));
    if (end === words.length) break;
    start = Math.max(end - overlapWords, start + 1);
  }
  return chunks;
}

function fakeEmbedding(text) {
  const dimension = 1536;
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(index);
    hash &= hash;
  }

  const seed = Math.abs(hash);
  const vector = Array.from({ length: dimension }, (_, index) => {
    const random = Math.sin(seed + index) * 10000;
    return (random - Math.floor(random)) * 2 - 1;
  });
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return vector.map((value) => value / norm);
}

async function generateEmbeddings(chunks) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key_here') {
    return chunks.map(fakeEmbedding);
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: chunks,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI embeddings failed: ${response.status} ${details}`);
  }

  const data = await response.json();
  return data.data.map((item) => item.embedding);
}

async function ensureCollection(name) {
  try {
    const exists = await fetch(`${QDRANT_URL}/collections/${name}`);
    if (exists.ok) return true;

    const created = await fetch(`${QDRANT_URL}/collections/${name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vectors: {
          size: 1536,
          distance: 'Cosine',
        },
      }),
    });
    return created.ok;
  } catch {
    return false;
  }
}

async function upsertQdrant(collection, points) {
  if (!(await ensureCollection(collection))) {
    console.warn(`Qdrant unavailable; skipped indexing collection ${collection}`);
    return false;
  }

  const response = await fetch(`${QDRANT_URL}/collections/${collection}/points`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ points }),
  });

  if (!response.ok) {
    console.warn(`Qdrant upsert failed for ${collection}: ${response.status}`);
    return false;
  }

  return true;
}

async function seedOne(item) {
  const knowledgeObject = await prisma.knowledgeObject.upsert({
    where: { objectId: item.objectId },
    update: {
      title: item.title,
      industry: item.industry,
      process: item.process,
      standard: item.standard || null,
      knowledgeType: item.knowledgeType,
      authorityLevel: item.authorityLevel,
      retrievalTags: item.retrievalTags,
      language: item.language,
      content: item.content,
    },
    create: {
      objectId: item.objectId,
      title: item.title,
      version: '1.0',
      industry: item.industry,
      process: item.process,
      standard: item.standard || null,
      knowledgeType: item.knowledgeType,
      authorityLevel: item.authorityLevel,
      retrievalTags: item.retrievalTags,
      language: item.language,
      content: item.content,
      chunkCount: 0,
    },
  });

  await prisma.knowledgeChunk.deleteMany({
    where: { knowledgeObjectId: knowledgeObject.id },
  });

  const chunks = chunkText(item.content);
  const embeddings = await generateEmbeddings(chunks);
  const createdChunks = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = await prisma.knowledgeChunk.create({
      data: {
        knowledgeObjectId: knowledgeObject.id,
        chunkIndex: index,
        content: chunks[index],
        metadata: {
          objectId: item.objectId,
          title: item.title,
          industry: item.industry,
          knowledgeType: item.knowledgeType,
          process: item.process,
          standard: item.standard || null,
        },
      },
    });
    createdChunks.push(chunk);
  }

  const collection = collectionByType[item.knowledgeType] || 'industrial_knowledge';
  const indexed = await upsertQdrant(collection, createdChunks.map((chunk, index) => ({
    id: chunk.id,
    vector: embeddings[index],
    payload: {
      content: chunk.content,
      knowledgeObjectId: knowledgeObject.id,
      chunkId: chunk.id,
      objectId: item.objectId,
      title: item.title,
      industry: item.industry,
      knowledgeType: item.knowledgeType,
      process: item.process,
      standard: item.standard || null,
      chunkIndex: chunk.chunkIndex,
    },
  })));

  if (indexed) {
    await Promise.all(createdChunks.map((chunk) =>
      prisma.knowledgeChunk.update({
        where: { id: chunk.id },
        data: { vectorId: chunk.id },
      }),
    ));
  }

  await prisma.knowledgeObject.update({
    where: { id: knowledgeObject.id },
    data: { chunkCount: chunks.length },
  });

  console.log(`Seeded ${item.objectId} (${chunks.length} chunks)`);
}

async function main() {
  for (const item of seedKnowledge) {
    await seedOne(item);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
