const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Employee = require("./lib/Employee")
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// User questions 

const userQuestions = [
    {
        type: "input", 
        name: "employeeId", 
        message: "What is your Employee ID :",
    },
    
    {
        type: "input", 
        name: "employeeName", 
        message: "What is your name : ",
    },
    
    {
        type: "input", 
        name: "email", 
        message: "What is your email :",
    },
    
    {
        type: "list", 
        name: "role", 
        message: "What is your role :", 
        choices: ["Manager", "Engineer", "Intern"]
    },
    
    {
        type: "input", 
        name: "officeNumber", 
        message: "What is your office number?", 
        when: function(answers){
            return answers.role === "Manager";
        },
    },
    
    {
        type: "input", 
        name: "school", 
        message: "Which school do you go to?",
        when: function (answers) {
            return answers.role === "Intern";
        },
    },

    {
        type: "input", 
        name: "github", 
        message: "What is your username for GitHub?",
        when: function(answers){
            return answers.role === "Engineer"; 
        },
    },
    {
        type: "confirm", 
        name: "enterAgain", 
        message: "Would you like to add another employee?",
        default: true,
    },
  ];

  // prompting user to add more eployees 

  async function createEmployees (employeeInput = []) {
    try {
        const { again, ...answers } = await inquirer.prompt(userQuestions);
        const newEmployee = [...employeeInput, answers];
        return again ? createEmployees(newEmployee) : newEmployee
      } catch (err) {
          throw err;
      }
  }

  async function init() {
    try {
        const employees = [];
        const employeeData = await createEmployees();

        employeeData.map((employee) => {
            const { name, id, role, officeNumber, school, github } = employee;

            if (role === "Manager") {
                const newManager = new Manager(name, id, email, officeNumber);
                employees.push(newManager);
            } else if (role === "Engineer") {
                const newEngineer = new Engineer(name, id, email, github);
                employees.push(newEngineer);

            } else {
                const newIntern = new Intern(name, id, email, school);
                employees.push(newIntern);
            }
        });

        const renderEmployee = render(employees);
        fs.writeFile(outputPath, renderEmployee, () => console.log("BAM! Successful!"));
    }   catch (err) {
        throw new Error(err);
    }
}

init();