document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('captcha');
    var ctx = canvas.getContext('2d');
    var captchaText = generateCaptchaText(6);
    const captchaStatus = document.getElementById('captcha-status');
    const progressBar = document.getElementById('progress');
    drawCaptcha(captchaText);

    // Function to handle CAPTCHA verification
    function verifyCaptcha() {
        var inputText = document.getElementById('captcha-input').value.toLowerCase();

        if (inputText === captchaText.toLowerCase()) {
            captchaStatus.textContent = 'Captcha Correct!';
            captchaStatus.style.color = 'green';
        } else if (inputText.length < 6) {
            captchaStatus.textContent = 'Enter all characters!';
            captchaStatus.style.color = 'red';
        } else {
            captchaStatus.textContent = 'Captcha incorrect. Please try again!';
            captchaStatus.style.color = 'red';
        }
        setTimeout(() => {
            captchaStatus.textContent = 'Status : IDLE';
            captchaStatus.style.color = 'black';
        }, 3000);
        document.getElementById('captcha-input').value = '';
        updateProgress(0);
        captchaText = generateCaptchaText(6);
        drawCaptcha(captchaText);
    }

    // Add event listener for check button
    document.getElementById('check-captcha').addEventListener('click', verifyCaptcha);

    // Add event listener for reload button
    document.getElementById('reload-captcha').addEventListener('click', function () {
        captchaText = generateCaptchaText(6);
        drawCaptcha(captchaText);
        document.getElementById('captcha-input').value = '';
        captchaStatus.textContent = 'Status : IDLE';
        updateProgress(0);
    });

    // Add event listener for copy button
    document.getElementById('copy-captcha').addEventListener('click', function () {
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = captchaText;
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        captchaStatus.textContent = 'Captcha copied to clipboard!';
        captchaStatus.style.color = 'blue';
        setTimeout(() => {
            captchaStatus.textContent = 'Status : IDLE';
            captchaStatus.style.color = 'black';
        }, 3000);
    });

    // Add event listener for audio CAPTCHA
    document.getElementById('audio-captcha').addEventListener('click', function () {
        const msg = new SpeechSynthesisUtterance(captchaText);
        window.speechSynthesis.speak(msg);
    });

    // Add event listener for dark mode toggle
    document.getElementById('toggle-dark-mode').addEventListener('click', function () {
        if (document.body.hasAttribute('data-theme')) {
            document.body.removeAttribute('data-theme');
            this.textContent = "🌙 Dark Mode";
        } else {
            document.body.setAttribute('data-theme', 'dark');
            this.textContent = "☀️ Light Mode";
        }
    });

    // Add event listener for progress bar update
    document.getElementById('captcha-input').addEventListener('input', function (e) {
        const inputLength = e.target.value.length;
        const progress = (inputLength / 6) * 100;
        updateProgress(progress);
    });

    function generateCaptchaText(length) {
        let result = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const cahrsLength = chars.length;
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * cahrsLength));
        }
        return result;
    }

    function drawCaptcha(text) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f3f3f3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        addNoise(ctx);
        ctx.fillStyle = '#F0F8FF';
        ctx.font = '22px Arial';

        const textWidth = ctx.measureText(text).width;
        const startX = (canvas.width - textWidth) / 3;

        for (let i = 0; i < text.length; i++) {
            ctx.save();
            ctx.translate(startX + i * 20, 30);
            ctx.rotate((Math.random() - 0.5) * 0.4);
            ctx.fillText(text[i], 0, 0);
            ctx.restore();
        }
    }

    function addNoise(ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4) {
            const random = Math.random() * 255;
            pixels[i] = random;        // Red
            pixels[i + 1] = random;    // Green
            pixels[i + 2] = random;    // Blue
        }
        ctx.putImageData(imageData, 0, 0);
    }

    function updateProgress(progress) {
        progressBar.style.width = progress + '%';
    }
});