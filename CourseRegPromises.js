
const students = { 101: { id: 101, completed: ['CS301'], registered: [] }, 102: { id: 102, completed: [], registered: [] } };
const courses = { CS401: { code: 'CS401', prereq: 'CS301', seats: 2 }, CS402: { code: 'CS402', prereq: null, seats: 0 } };

// Wraps a function in a Promise that settles after `ms`; a throw becomes a rejection
function delayed(work, ms = 50) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try { resolve(work()); } catch (err) { reject(err); }
    }, ms);
  });
}

const getStudent = id => delayed(() => {
  if (!students[id]) throw new Error(`Student ${id} does not exist`);
  return students[id];
});
const getCourse = code => delayed(() => {
  if (!courses[code]) throw new Error(`Course ${code} does not exist`);
  return courses[code];
});
const checkPrerequisites = (student, course) => delayed(() => {
  if (course.prereq && !student.completed.includes(course.prereq)) throw new Error(`Prerequisite ${course.prereq} not completed`);
});
const checkSeats = course => delayed(() => {
  if (course.seats <= 0) throw new Error(`Course ${course.code} is full`);
});
const registerStudent = (student, course) => delayed(() => {
  if (student.registered.includes(course.code)) throw new Error('Already registered');
  student.registered.push(course.code);
  course.seats -= 1;
  return { studentId: student.id, course: course.code, status: 'REGISTERED' };
});
const sendEmail = () => delayed(() => 'email sent');
const sendSMS = () => delayed(() => { throw new Error('SMS gateway down'); });
const writeAuditLog = () => delayed(() => 'logged');

// A. Data Flows
function register(studentId, courseCode) {
  return getStudent(studentId)
    .then(student => getCourse(courseCode).then(course => ({ student, course })))
    .then(ctx => checkPrerequisites(ctx.student, ctx.course).then(() => ctx))
    .then(ctx => checkSeats(ctx.course).then(() => ctx))
    .then(ctx => registerStudent(ctx.student, ctx.course));
}

//B wait for all three and learn each outcome even one fails
function postRegistration(confirmation) {
  const names = ['Email', 'SMS', 'Audit'];
  return Promise.allSettled([sendEmail(confirmation), sendSMS(confirmation), writeAuditLog(confirmation)])
    .then(outcomes => outcomes.map((o, i) => ({ service: names[i], status: o.status })));
}

function run(studentId, courseCode) {
  return register(studentId, courseCode)
    .then(confirmation => { console.log('Registered:', confirmation); return postRegistration(confirmation); })
    .then(report => console.log('Post-registration:', report))
    .catch(err => console.log(`Failed (${studentId}):`, err.message))
    .finally(() => console.log('--- finished request for', studentId));
}

// C  .any
const serverA = () => delayed(() => { throw new Error('Server A down'); }, 50);
const serverB = () => delayed(() => ({ code: 'CS401', title: 'Advanced Web Dev' }), 150);

function partC() {
  return Promise.race([serverA(), serverB()])
    .then(c => console.log('race:', c), err => console.log('race rejected (first settled was a failure):', err.message))
    .then(() => Promise.any([serverA(), serverB()]))
    .then(c => console.log('any :', c));
}

run(101, 'CS401')
  .then(() => run(999, 'CS401'))
  .then(() => run(102, 'CS401'))
  .then(partC);

