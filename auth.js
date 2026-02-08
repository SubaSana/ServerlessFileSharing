
const COGNITO_USER_POOL_ID = 'ap-south-1_ZqivbyEiF';  
const COGNITO_CLIENT_ID = '5evrum0em7dblhgv8rikmvvedc';
const COGNITO_REGION = 'ap-south-1';

const poolData = {
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_CLIENT_ID
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
function showMessage(message, isError = false) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = isError ? 'message error' : 'message success';
    messageDiv.style.display = 'block';
}

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('signup') === 'true') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'block';
        document.getElementById('auth-title').textContent = 'Sign Up';
    }
});

document.getElementById('show-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('auth-title').textContent = 'Sign Up';
});

document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('auth-title').textContent = 'Login';
});
let currentEmail = '';
document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    currentEmail = email;
    
    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email }),
        new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'name', Value: name })
    ];
    
    userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
            showMessage(err.message || JSON.stringify(err), true);
            return;
        }
        showMessage('Signup successful! Please check your email for verification code.');
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('verify-form').style.display = 'block';
    });
});
document.getElementById('verify-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const code = document.getElementById('verify-code').value;
    
    const userData = {
        Username: currentEmail,
        Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
            showMessage(err.message || JSON.stringify(err), true);
            return;
        }
        showMessage('Email verified! You can now login.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
});
document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const authenticationData = {
        Username: email,
        Password: password
    };
    
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    const userData = {
        Username: email,
        Pool: userPool
    };
    
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            const idToken = result.getIdToken().getJwtToken();
            localStorage.setItem('idToken', idToken);
            localStorage.setItem('userEmail', email);
            showMessage('Login successful! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        },
        onFailure: (err) => {
            showMessage(err.message || JSON.stringify(err), true);
        }
    });
});