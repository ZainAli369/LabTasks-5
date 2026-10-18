import Student from './Student.js';
import { calculateAverage as average, calculateGPA } from './gradeUtils.js'; // aliased import

const round = n => Number(n.toFixed(2));

export function parseTranscripts(json) {
  let data;
  try {
    data = JSON.parse(json);
  } catch (err) {
    throw new SyntaxError(`Malformed JSON: ${err.message}`);
  }
  if (!Array.isArray(data)) throw new TypeError('Transcript data must be an array');

  const seen = new Set();
  return data.map(record => {
    const id = record?.id;
    if (id === undefined || id === null || id === '') throw new TypeError('Missing student ID');
    if (seen.has(id)) throw new Error(`Duplicate student ID: ${id}`);
    seen.add(id);
    if (!Array.isArray(record.courses)) throw new TypeError(`Student ${id}: courses must be an array`);

    record.courses.forEach(c => {
      if (!c?.code) throw new TypeError(`Student ${id}: missing course code`);
      if (typeof c.marks !== 'number') throw new TypeError(`Student ${id}: marks for ${c.code} must be a number`);
      if (c.marks < 0 || c.marks > 100) throw new RangeError(`Student ${id}: marks for ${c.code} must be 0-100`);
    });
    return new Student(id, record.name, record.courses);
  });
}

export function buildReport(students) {
  return {
    totalStudents: students.length,
    students: students.map(s => ({
      id: s.id,
      name: s.name,
      average: round(average(s.marks)),
      gpa: round(calculateGPA(s.marks)),
    })),
  };
}

export const reportToJSON = report => JSON.stringify(report, null, 2);

export function processTranscripts(rawJson) {
  return reportToJSON(buildReport(parseTranscripts(rawJson)));
}
