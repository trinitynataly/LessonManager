/*
Version: 1.0
Last edited by: Natalia Pakhomova
Last edit date: 30/09/2023
Command to create a super admin user.
*/

// Import the path module
const path = require('path');
// Import the yargs module
const yargs = require('yargs');

// Load environment variables from the .env file
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Import the connectDB and disconnectDB functions
const { connectDB, disconnectDB } = require('../db/connect');
// Import the User and Company models
const { User, Company } = require('../models');
// Import the generatePassswordHash function
const { generatePassswordHash } = require('../helpers/auth');

// Define the createUserAndCompany function to create a super admin user
const createUserAndCompany = async (first_name, last_name, email, password, companyName) => {
    try {
        // Connect to the database
        await connectDB();
        // Check if the company already exists
        let company = await Company.findOne({ companyName: new RegExp(`^${companyName}$`, 'i') });
        if (!company) { // If the company does not exist
            // Create a new company
            company = new Company({ companyName: companyName });
            // Save the new company
            await company.save();
        }
        // Check if the user already exists
        const existingUser = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (existingUser) { // If the user already exists
            // Log an error
            console.log('User already exists');
        } else { // If the user does not exist
            // Generate a password hash
            const hashedPassword = await generatePassswordHash(password);
            // Create a new user
            const user = new User({ email, first_name, last_name, password: hashedPassword, company: company._id, level: 2, status: 1 });
            // Save the new user
            await user.save();
            // Log a success message
            console.log('Super user created successfully');
        }
        // Disconnect from the database
        await disconnectDB();
        return;       
    } catch (error) { // If an error occurred
        console.error(error); // Log the error
        process.exit(1); // Exit the process
    }
}

// Define the yargs command to create a super admin user
yargs.command({
    command: 'createSuperUser', // Set the yargs command name
    describe: 'Create a super admin user', // Set the yargs command description
    builder: { // Set the yargs command options
        email: { // Set the email option
            describe: 'Email of the super user', // Set the option description
            demandOption: true, // Set the option as required
            type: 'string' // Set the option data type
        },
        first_name: { // Set the first_name option
            describe: 'Fist Name of the super user', // Set the option description
            demandOption: true, // Set the option as required
            type: 'string' // Set the option data type
        },
        last_name: { // Set the last_name option
            describe: 'Last Name of the super user', // Set the option description
            demandOption: true, // Set the option as required
            type: 'string' // Set the option data type
        },
        password: { // Set the password option
            describe: 'Password for the super user', // Set the option description
            demandOption: true, // Set the option as required
            type: 'string' // Set the option data type
        },
        company: { // Set the company option
            describe: 'Company name', // Set the option description
            demandOption: true, // Set the option as required
            type: 'string' // Set the option data type
        }
    },
    handler(argv) { // Set the yargs command handler
        // Call the createUserAndCompany function
        createUserAndCompany(argv.first_name, argv.last_name, argv.email, argv.password, argv.company);
    }
});

// Parse the yargs arguments
yargs.parse();
