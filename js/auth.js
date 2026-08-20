/**
 * Stackly Car Service Booking Platform
 * Authentication Logic (Login & Registration)
 */

document.addEventListener("DOMContentLoaded", function () {
    
    // --- REGISTRATION LOGIC ---
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Clear previous errors
            clearErrors();

            const name = document.getElementById("name").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPass = document.getElementById("confirmPassword").value;
            
            // Get selected role
            const selectedRoleInput = document.querySelector('input[name="role"]:checked');
            const role = selectedRoleInput ? selectedRoleInput.value : 'Customer';

            let hasError = false;

            // Basic Validation
            if (password.length < 6) {
                showError("password", "Password must be at least 6 characters.");
                hasError = true;
            }
            if (password !== confirmPass) {
                showError("confirmPassword", "Passwords do not match.");
                hasError = true;
            }

            if (hasError) return;

            // Store in localStorage (Simulation of Backend)
            const userData = {
                name: name,
                phone: phone,
                email: email,
                role: role,
                password: password, // In a real app, never store plain text passwords!
                createdAt: new Date().toISOString()
            };

            localStorage.setItem("stackly_user_" + email, JSON.stringify(userData));
            
            // Success Feedback
            const btn = signupForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Creating Account...';
            
            setTimeout(() => {
                alert("Account created successfully as " + role + "!");
                window.location.href = "login.html";
            }, 1000);
        });
    }


    // --- LOGIN LOGIC ---
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            clearErrors();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;
            
            // Get selected role
            const selectedRoleInput = document.querySelector('input[name="role"]:checked');
            const role = selectedRoleInput ? selectedRoleInput.value : 'Customer';

            // Retrieve user from DB (localStorage)
            const storedUser = localStorage.getItem("stackly_user_" + email);
            
            // Demo Login Fallback (If user doesn't exist, we just simulate login anyway for presentation)
            let userObj = storedUser ? JSON.parse(storedUser) : {
                name: email.split("@")[0],
                email: email,
                role: role
            };

            // If user exists, check role and password
            if (storedUser) {
                if (userObj.password !== password) {
                    showError("loginPassword", "Invalid password.");
                    return;
                }
                if (userObj.role !== role) {
                    showError("loginEmail", "No " + role + " account found with this email. Did you select the wrong role?");
                    return;
                }
            }

            // Set active session
            localStorage.setItem("stackly_active_session", JSON.stringify(userObj));

            // UI Feedback
            const btn = loginForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Authenticating...';

            // Route to unified dynamic dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);
        });
    }

    // --- HELPER FUNCTIONS ---
    function showError(fieldId, msg) {
        const input = document.getElementById(fieldId);
        if (!input) return;
        
        // Find the input-glass wrapper to add red border
        const wrapper = input.closest('.input-glass');
        if (wrapper) wrapper.style.borderColor = 'red';
        
        let fb = input.parentElement.nextElementSibling;
        if (!fb || !fb.classList.contains("invalid-feedback")) {
            fb = document.createElement("div");
            fb.className = "invalid-feedback d-block text-danger small mt-1 px-2";
            input.parentElement.insertAdjacentElement("afterend", fb);
        }
        fb.textContent = msg;
        
        input.addEventListener("input", function clearInputError() {
            if (wrapper) wrapper.style.borderColor = '';
            if (fb) fb.remove();
            input.removeEventListener("input", clearInputError);
        });
    }

    function clearErrors() {
        document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
        document.querySelectorAll('.input-glass').forEach(el => el.style.borderColor = '');
    }

        // --- PASSWORD STRENGTH LOGIC ---
    function setupPasswordStrength(inputId, barId, textId) {
        const passInput = document.getElementById(inputId);
        const strengthBar = document.getElementById(barId);
        const strengthText = document.getElementById(textId);

        if (!passInput || !strengthBar || !strengthText) return;

        passInput.addEventListener('input', function() {
            const val = passInput.value;
            let score = 0;
            
            if (val.length > 0) score += 1;
            if (val.length >= 6) score += 1;
            if (val.length >= 8) score += 1;
            if (/[A-Z]/.test(val)) score += 1;
            if (/[0-9]/.test(val)) score += 1;
            if (/[^A-Za-z0-9]/.test(val)) score += 1;

            let width = '0%';
            let colorClass = 'bg-danger';
            let text = 'Too short';

            if (val.length === 0) {
                width = '0%';
                text = 'Enter password';
            } else if (score <= 2) {
                width = '25%';
                colorClass = 'bg-danger';
                text = 'Weak';
            } else if (score <= 4) {
                width = '50%';
                colorClass = 'bg-warning';
                text = 'Fair';
            } else if (score === 5) {
                width = '75%';
                colorClass = 'bg-info';
                text = 'Good';
            } else {
                width = '100%';
                colorClass = 'bg-success';
                text = 'Strong';
            }

            strengthBar.style.width = width;
            strengthBar.className = 'progress-bar ' + colorClass;
            strengthText.textContent = text;
        });
    }

    // Initialize strength bars
    setupPasswordStrength('password', 'strengthBar', 'strengthText');
    setupPasswordStrength('loginPassword', 'loginStrengthBar', 'loginStrengthText');

    // --- PASSWORD VISIBILITY TOGGLE ---
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            }
        });
    });
});


