// Function to validate email using regex 
function isEmail(value){
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(value);
}

// Function to validate empty values
function isEmpty(value){
    return value === "";
}

// Function to validate valid date format
function isValidDate(value){
    const dateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return dateRegex.test(value);
}

// Function to validate password (min 8 chars, at least 1 letter and 1 number)
function isValidPassword(value){
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(value);
}
