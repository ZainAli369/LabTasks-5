
const results = [
  { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
  { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
  { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 },
];

// Grading
const GRADES = [
  { min: 85, grade: 'A', points: 4.0 },
  { min: 80, grade: 'A-', points: 3.67 },
  { min: 75, grade: 'B+', points: 3.33 },
  { min: 70, grade: 'B', points: 3.0 },
  { min: 65, grade: 'B-', points: 2.67 },
  { min: 60, grade: 'C+', points: 2.33 },
  { min: 50, grade: 'C', points: 2.0 },
  { min: 0, grade: 'F', points: 0 },
];

const processed = results.map(s => {
  const g = GRADES.find(x => s.marks >= x.min);
  return { ...s, grade: g.grade, gradePoints: g.points, status: g.grade === 'F' ? 'FAIL' : 'PASS' };
});
console.log('A. Processed:'); console.table(processed);

// Ranking
const ranked = [...processed].sort((a, b) => b.marks - a.marks || a.name.localeCompare(b.name));
console.log('B. Ranked:', ranked.map(s => `${s.name}(${s.marks})`).join(', '));
console.log('Original untouched:', results[0].name === 'Ali');


function departmentStats(list) {
  const acc = list.reduce((a, s) => {
    const d = a[s.department] ?? { students: 0, total: 0, highest: 0, passed: 0 };
    return {
      ...a,
      [s.department]: {
        students: d.students + 1,
        total: d.total + s.marks,
        highest: Math.max(d.highest, s.marks),
        passed: d.passed + (s.status === 'PASS' ? 1 : 0),
      },
    };
  }, {});
  return Object.fromEntries(
    Object.entries(acc).map(([dept, { total, ...rest }]) => [dept, { ...rest, average: Number((total / rest.students).toFixed(2)) }])
  );
}
console.log('C. Department stats:', departmentStats(processed));
console.log('C. New dept "DS":', departmentStats([...processed, { name: 'New', department: 'DS', marks: 70, status: 'PASS' }]).DS);

//Analysis
const average = processed.reduce((s, r) => s + r.marks, 0) / processed.length;
console.log('D. First > 85:', processed.find(s => s.marks > 85).name);
console.log('   Index of first failed:', processed.findIndex(s => s.status === 'FAIL'));
console.log('   Anyone failed:', processed.some(s => s.status === 'FAIL'));
console.log('   All marks valid:', processed.every(s => s.marks >= 0 && s.marks <= 100));
console.log(`   Above average (${average.toFixed(2)}):`, processed.filter(s => s.marks > average).map(s => s.name));
console.log('   Top three:', ranked.slice(0, 3).map(s => s.name));
