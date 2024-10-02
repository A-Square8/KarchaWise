import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAQf57UvhDQAkE-p4KBNoQJEqHpHFAl4lk",
    authDomain: "kharchawise-613ae.firebaseapp.com",
    projectId: "kharchawise-613ae",
    storageBucket: "kharchawise-613ae.appspot.com",
    messagingSenderId: "832176684846",
    appId: "1:832176684846:web:6dd62b4076caa190b7c4bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('error-message');
    const registerErrorMessage = document.getElementById('register-error-message');
    const mainContent = document.getElementById('mainContent');
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');

    // Show/Hide registration and login forms
    document.getElementById('showRegisterForm').addEventListener('click', function (e) {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });

    document.getElementById('showLoginForm').addEventListener('click', function (e) {
        e.preventDefault();
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    // Handle Login
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('username').value + '@abc.com';
        const password = document.getElementById('password').value;
        const errormsg = document.getElementById('errormessage');

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                mainContent.style.display = "block"; 
                loginContainer.style.display = "none";
                MainContent(auth.currentUser);
            })
            .catch(() => {
                errormsg.textContent = 'Invalid username/password';
            });
    });

    // Handle Registration 
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('newUsername').value + '@abc.com';
        const password = document.getElementById('newPassword').value; 
        const errormsg = document.getElementById('registererrormessage');

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                mainContent.style.display = "block"; 
                loginContainer.style.display = "none";
                MainContent(auth.currentUser);
            })
            .catch((error) => {
                errormsg.textContent = `Error: ${error.message}`;
            });
    });
});

// Main content function
function MainContent(profile) {
    const sections = document.querySelectorAll('section');
    const buttons = document.querySelectorAll('.mobile-nav button');

    // Set active section and hide others
    function setActive(sectionId) {
        sections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.add('active');
                section.style.display = 'block';
            } else {
                section.classList.remove('active');
                section.style.display = 'none';
            }
        });

        buttons.forEach(button => {
            if (button.getAttribute('data-target') === sectionId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // Initial setup
    if (window.innerWidth <= 768) {
        setActive('section1');
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-target');
            setActive(target);
        });
    });

    if (window.innerWidth > 768) {
        const middleSection = document.getElementById('section2');
        middleSection.querySelector('.content').style.overflowY = 'auto';
        setActive('section1');
    }

    // Calculator logic
    const numberInput = document.getElementById('numberInput');
    const calcButtons = document.querySelectorAll('.calc-btn');
    let firstValue = '';
    let operator = '';

    calcButtons.forEach(button => {
        button.addEventListener('click', function () {
            const value = this.getAttribute('data-value');
            const operation = this.getAttribute('data-operation');

            if (value) {
                numberInput.value += value;
            } else if (operation) {
                if (numberInput.value !== '') {
                    if (firstValue === '') {
                        firstValue = numberInput.value;
                    } else if (operator) {
                        firstValue = operate(firstValue, numberInput.value, operator);
                    }
                    operator = operation;
                    numberInput.value = '';
                }
            } else if (this.id === 'equals') {
                if (firstValue !== '' && numberInput.value !== '' && operator) {
                    numberInput.value = operate(firstValue, numberInput.value, operator);
                    firstValue = '';
                    operator = '';
                }
            } else if (this.id === 'clear') {
                numberInput.value = '';
                firstValue = '';
                operator = '';
            }
        });
    });

    function operate(a, b, operator) {
        a = parseFloat(a);
        b = parseFloat(b);
        switch (operator) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b !== 0 ? a / b : 'Error';
            default: return b;
        }
    }

    // Handle submission
    document.getElementById('submitBtn').addEventListener('click', () => {
        const transactionType = document.getElementById('transactionType').value;
        const amount = numberInput.value;
        const account = document.getElementById('account').value;

        if (amount === '') {
            alert('Please enter an amount.');
            return;
        }

        console.log({
            transactionType,
            amount,
            account
        });

        alert('Transaction Submitted!');
    });

    // Date field setup
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateField').value = today;

    // Transaction type logic
    let selectedOption = 'Expense';
    document.getElementById('expenseBtn').classList.add('active');

    // Define the selectOption function in the MainContent scope
    function selectOption(option) {
        selectedOption = option;

        document.getElementById('expenseBtn').classList.remove('active');
        document.getElementById('incomeBtn').classList.remove('active');
        document.getElementById('transferBtn').classList.remove('active');

        if (option === 'Expense') {
            document.getElementById('expenseBtn').classList.add('active');
            document.getElementById('expenseCategoryGroup').style.display = 'flex';
            document.querySelector('#toAccountGroup').style.display = 'none';
        } else if (option === 'Income') {
            document.getElementById('incomeBtn').classList.add('active');
            document.getElementById('expenseCategoryGroup').style.display = 'none';
            document.querySelector('#toAccountGroup').style.display = 'none';
        } else if (option === 'Transfer') {
            document.getElementById('transferBtn').classList.add('active');
            document.getElementById('expenseCategoryGroup').style.display = 'none';
            document.querySelector('#toAccountGroup').style.display = 'flex';
        }
    }

    // Add click listeners to the transaction buttons
    document.getElementById('expenseBtn').onclick = () => selectOption('Expense');
    document.getElementById('incomeBtn').onclick = () => selectOption('Income');
    document.getElementById('transferBtn').onclick = () => selectOption('Transfer');

    // Default view on load
    selectOption('Expense'); // Set default as Expense
}
