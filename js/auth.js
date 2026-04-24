// Function to Sign Up
// async function signup(formData = {}) {
//     if (Object.entries(formData).length === 0)
//         return false;

//     try {
//         const response = await fetch(_ENDPOINT_SIGNUP, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(formData)
//         });

//         if (response.ok) {
//             return true;  // return success
//         } else {
//             const errorData = await response.json();
//             console.log("Signup failed:", errorData);
//             return false;
//         }

//     } catch (error) {
//         console.log("Exception error:", error.message);
//         return false;
//     }
// }

async function signup(formData = {}) {
    console.log("Mock signup called with:", formData);

    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate success
            resolve({
                success: true,
                message: "Mock signup successful"
            });
        }, 1000); // simulate network delay
    });
}
