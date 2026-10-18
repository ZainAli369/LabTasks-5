
const student = {
    id: 101,
    name: "Ali",
    marks: 0,
    address: { city: "Islamabad", sector: "F-10" }
};

const update = {
    name: "Ali Khan",
    address: { city: "Rawalpindi" }
};


function updateStudent(student, update) {
    return {
        ...student,
        ...update,
        address: { ...student.address, ...update.address }
    };
}

const updated = updateStudent(student, update);
console.log(updated);


const {
    name: fullName,
    marks = 100,
    address: { city, sector }
} = updated;

console.log(fullName, marks, city, sector);

// Rest parameters
const sum = (...nums) => nums.reduce((a, b) => a + b, 0);
console.log(sum(1, 2, 3));


// Reference comparison
console.log(student === updated); 
