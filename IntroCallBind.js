
class Person {
  constructor(name, email) { this.name = name; this.email = email; }
  introduce() { return `Hi, I am ${this.name} (${this.email})`; }
}

class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);          // const
    this.rollNo = rollNo; this.marks = marks;
  }
  introduce() { return `${super.introduce()}, student ${this.rollNo}`; } 
  getResult() { return this.marks >= 50 ? 'PASS' : 'FAIL'; }
}

class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId; this.department = department;
  }
  introduce() { return `${super.introduce()}, faculty ${this.employeeId} in ${this.department}`; }
}

const users = [
  new Student('Sara', 'sara@au.edu.pk', '231001', 88),
  new FacultyMember('Dr. Khan', 'khan@au.edu.pk', 'E-17', 'CS'),
  new Student('Usman', 'usman@au.edu.pk', '231002', 42),
  new Person('Visitor', 'visitor@example.com'),
];


users.forEach(user => console.log(user.introduce()));
console.log(users.map(u => `${u.name}: Student=${u instanceof Student}, Person=${u instanceof Person}`));
console.log('Result:', users[0].getResult(), users[2].getResult());

// call(): borrow Person.introduce with guest as `this`
const guest = { name: 'Dr. Ahmed', email: 'ahmed@example.com' };
console.log(Person.prototype.introduce.call(guest));

// Detached method: `this` is no longer the student
const student = users[0];
const fn = student.introduce;
try {
  fn();
} catch (error) {
  console.log(`fn() failed: ${error.constructor.name} - class code is strict, so this is undefined`);
}

// bind() is permanent
const safe = student.introduce.bind(student);
console.log(safe());
