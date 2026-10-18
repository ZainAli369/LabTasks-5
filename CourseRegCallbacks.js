// Task 6 - 
const students = {
  101: { id: 101, completed: ['CS301'], registered: [] },
  102: { id: 102, completed: [], registered: [] },
};
const courses = {
  CS401: { code: 'CS401', prereq: 'CS301', seats: 2 },
  CS402: { code: 'CS402', prereq: null, seats: 0 },
};

function loadStudent(id, callback) {
  setTimeout(() => {
    const student = students[id];
    if (!student) return callback(new Error(`Student ${id} does not exist`));
    callback(null, student);
  }, 100);
}

function checkPrerequisites(student, courseCode, callback) {
  setTimeout(() => {
    const course = courses[courseCode];
    if (!course) return callback(new Error(`Course ${courseCode} does not exist`));
    if (course.prereq && !student.completed.includes(course.prereq)) {
      return callback(new Error(`Prerequisite ${course.prereq} not completed`));
    }
    callback(null, course);
  }, 100);
}

function checkSeats(course, callback) {
  setTimeout(() => {
    if (course.seats <= 0) return callback(new Error(`Course ${course.code} is full`));
    callback(null, course);
  }, 100);
}

function registerCourse(student, course, callback) {
  setTimeout(() => {
    if (student.registered.includes(course.code)) {
      return callback(new Error(`Student ${student.id} already registered in ${course.code}`));
    }
    student.registered.push(course.code);
    course.seats -= 1;
    callback(null, { studentId: student.id, course: course.code, status: 'REGISTERED' });
  }, 100);
}

//async
function registerForCourse(studentId, courseCode, done) {
  loadStudent(studentId, (err, student) => {
    if (err) return done(err);
    checkPrerequisites(student, courseCode, (err, course) => {
      if (err) return done(err);
      checkSeats(course, (err) => {
        if (err) return done(err);
        registerCourse(student, course, done);
      });
    });
  });
}

const show = label => (err, result) => console.log(label, err ? `ERROR: ${err.message}` : result);

registerForCourse(101, 'CS401', (err, result) => {
  show('success      :')(err, result);
  registerForCourse(101, 'CS401', show('duplicate    :')); // run after the first finished
});
registerForCourse(999, 'CS401', show('no student   :'));
registerForCourse(102, 'CS401', show('no prereq    :'));
registerForCourse(101, 'CS402', show('course full  :'));


