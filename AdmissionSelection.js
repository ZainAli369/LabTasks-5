function programName(code) {
  switch (code) {
    case 'BSCS': return 'Computer Science';
    case 'BSSE': return 'Software Engineering';
    case 'BSAI': return 'Artificial Intelligence';
    default: return null; 
  }
}

//Nan is valid and is conv. to
function toNumber(value) {
  if (value === undefined || value === null || String(value).trim() === '') return NaN;
  return Number(value);
}

const inRange = (n, min, max) => !Number.isNaN(n) && n >= min && n <= max;

function processApplicant(a) {
  if (!a || typeof a !== 'object') return { id: null, status: 'INVALID DATA', errors: ['not an object'] };

  const age = toNumber(a.age);
  const matric = toNumber(a.matricMarks);
  const inter = toNumber(a.intermediateMarks);
  const test = toNumber(a.entryTest);

  const errors = [];
  if (!inRange(age, 17, 30)) errors.push('age must be a number between 17 and 30');
  if (!inRange(matric, 0, 100)) errors.push('matricMarks must be 0-100');
  if (!inRange(inter, 0, 100)) errors.push('intermediateMarks must be 0-100');
  if (!inRange(test, 0, 100)) errors.push('entryTest must be 0-100');
  if (programName(a.program) === null) errors.push('unsupported program');

  
  if (errors.length > 0) return { id: a.id, program: a.program, status: 'INVALID DATA', errors };

  const merit = Number((matric * 0.2 + inter * 0.3 + test * 0.5).toFixed(2));
  const eligible = merit >= 70 && test >= 60 && inter >= 60;
  const feePaid = a.feePaid === 'true' || a.feePaid === true;

  
  let status;
  if (!eligible) status = 'REJECTED';
  else status = merit >= 80 && feePaid ? 'SELECTED' : 'WAITING';

  return { id: a.id, name: a.name, program: a.program, merit, status };
}


//Summary
function summarize(results) {
  const valid = results.filter(r => r.status !== 'INVALID DATA');
  const programCounts = {};
  for (const r of results) {
    if (r.program) programCounts[r.program] = (programCounts[r.program] ?? 0) + 1;
  }
  const merits = valid.map(r => r.merit);
  return {
    validApplicants: valid.length,
    invalidApplicants: results.length - valid.length,
    highestMerit: valid.length ? valid.reduce((b, r) => (r.merit > b.merit ? r : b)) : null,
    lowestMerit: valid.length ? Math.min(...merits) : null,
    averageMerit: valid.length ? Number((merits.reduce((s, m) => s + m, 0) / valid.length).toFixed(2)) : null,
    programCounts,
  };
}



const applicants = [
  { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
  { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '45', entryTest: '72', program: 'BSSE', feePaid: 'false' },
  { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
  
  { id: 'A104', name: 'Ali', age: '17', matricMarks: '100', intermediateMarks: '60', entryTest: '64', program: 'BSCS', feePaid: 'false' },
 
  { id: 'A105', name: 'Ahsan (BM)', age: '20', matricMarks: '101', intermediateMarks: '80', entryTest: '2', program: 'BBA', feePaid: 'true' },

  { id: 'A106', name: 'akbar (LT)', age: '22', matricMarks: '95', intermediateMarks: '90', entryTest: '55', program: 'BSSE', feePaid: 'true' },
];

const results = applicants.map(processApplicant);
console.table(results.map(({ errors, ...r }) => r));
console.log(JSON.stringify(summarize(results), null, 2));
