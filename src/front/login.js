document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const formTitle = document.getElementById('form-title');
    const toggleLink = document.getElementById('toggle-link');

    toggleLink.addEventListener('click', () => {
        if (loginForm.style.display === 'none') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            formTitle.textContent = 'Login';
            toggleLink.textContent = "Sign up";
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            formTitle.textContent = 'Sign Up';
            toggleLink.textContent = 'Login';
        }
    });

    const isValidInput = (value) => {
        const regex = /^[a-zA-Z0-9!@#?$%^&*~]{6,16}$/;
        return regex.test(value);
    };

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('login-username').value;
        const pw = document.getElementById('login-password').value;
    
        if (!isValidInput(id) || !isValidInput(pw)) {
            alert('아이디와 비밀번호는 6~16자 사이여야 하며, 알파벳, 숫자, 일부 특수기호만 사용할 수 있습니다.');
            return;
        }
    
        const loginData = { username: id, password: pw };
    
        try {
            const response = await fetch('http://localhost:8000/api/v1/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
    
            if (response.ok) {
                // 로그인 성공 시 암호화된 ID를 쿠키에 저장
                const encryptedId = CryptoJS.AES.encrypt(id, 'fdkWMbnd@kw!MsXCFOdjwjrjdn@!!ndnzPDnensditnWECMlslx!!!!!!snUIbsnIANdNNJUWkqmsnskwq').toString();
                document.cookie = `encryptedId=${encryptedId}; path=/;`;
    
                // Calendar.html로 리디렉션
                window.location.href = 'calendar.html';
            } else {
                alert('로그인 실패');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 요청 중 오류가 발생했습니다.');
        }
    });

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = document.getElementById('signup-username').value;
        const pw = document.getElementById('signup-password').value;
        const confirmpw = document.getElementById('signup-confirm-password').value;

        if (!isValidInput(id) || !isValidInput(pw) || !isValidInput(confirmpw)) {
            alert('아이디와 비밀번호는 6~16자 사이여야 하며, 알파벳, 숫자, 일부 특수기호만 사용할 수 있습니다.');
            return;
        }

        if (pw !== confirmpw) {
            alert("Passwords do not match!");
            return;
        }

        const createDate = new Date().toISOString();
        const signupData = { user_id: id, user_password: pw, create_date: createDate };

        try {
            const response = await fetch('http://localhost:8000/api/v1/login/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupData)
            });

            if (response.ok) {
                alert('회원가입 성공');
                // 회원가입 성공 후 로그인 화면으로 리디렉션
                window.location.href = 'login.html';
            } else {
                alert('회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입 요청 중 오류가 발생했습니다.');
        }
    });
});
