const POINTS = { A: 4.0, 'A-': 3.67, 'B+': 3.33, B: 3.0, 'B-': 2.67, 'C+': 2.33, C: 2.0, F: 0 };

export function calculateGrade(marks) {
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}

export function calculateAverage(marks) {
  return marks.length === 0 ? 0 : marks.reduce((s, m) => s + m, 0) / marks.length;
}

export function calculateGPA(marks) {
  return calculateAverage(marks.map(m => POINTS[calculateGrade(m)]));
}
