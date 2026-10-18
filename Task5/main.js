import Student from './Student.js';                        // default import
import { calculateGrade as gradeOf } from './gradeUtils.js'; // named import with alias
import { processTranscripts } from './transcriptService.js';

const good = `[{"id":101,"name":"Ali","courses":[{"code":"CS301","marks":81},{"code":"CS302","marks":74}]}]`;

const cases = {
  'valid': good,
  'malformed JSON': '[{"id": 101,',
  'missing ID': '[{"name":"Ali","courses":[]}]',
  'duplicate ID': `[{"id":1,"name":"A","courses":[]},{"id":1,"name":"B","courses":[]}]`,
  'marks out of range': '[{"id":1,"name":"A","courses":[{"code":"CS1","marks":120}]}]',
  'missing course code': '[{"id":1,"name":"A","courses":[{"marks":50}]}]',
};

for (const [label, raw] of Object.entries(cases)) {
  try {
    console.log(`[${label}] OK:`, processTranscripts(raw));
  } catch (err) {
    console.log(`[${label}] ${err.name}: ${err.message}`);
  } finally {
    console.log('  -> finished processing this input');
  }
}

console.log(gradeOf(81), new Student(1, 'X', []) instanceof Student);
