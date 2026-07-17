<?php
session_start();
include("config.php");

$emailError = $passwordError = "";
$email = $password = "";
$loginError = "";

if (isset($_POST['submit'])) {
    if (empty($_POST['email'])) {
        $emailError = "Email is required";
    } else {
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $emailError = "Invalid email format";
        }
    }

    if (empty($_POST['password'])) {
        $passwordError = "Password is required";
    } else {
        $password = mysqli_real_escape_string($conn, $_POST['password']);
    }

    if (empty($emailError) && empty($passwordError)) {
        $query = "SELECT * FROM users WHERE email=? AND password=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $email, $password);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($row) {
            $_SESSION['valid'] = $row['email'];
            $_SESSION['username'] = $row['username'];
            $_SESSION['fullname'] = $row['fullname'];
            $_SESSION['age'] = $row['age'];
            $_SESSION['phonenumber'] = $row['phonenumber'];

            header("Location: index.html");
            exit();
        } else {
            $loginError = "Wrong Email or Password";
        }
        $stmt->close();
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="login.css">
    <style>
        body {
            background-size: cover;
            background-position: center;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }

        .registration-form-container {
            background-color: #2873a585;
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            max-width: 410px;
            width: 100%;
            z-index: 10;
            position: relative;
        }

        .box { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; }
        .btn { width: 100%; padding: 8px; font-size: 14px; background-color: rgb(245, 76, 110); color: white; border: none; border-radius: 4px; cursor: pointer; }
        .btn:hover { background-color: rgb(192, 39, 75); }
        h3, span { color: #05374d; }
        h3 { font-size: 30px; }
        p { color: #ffffff; }
        a { color: white; }
        .message { color: red; font-weight: bold; }
        canvas { position: fixed; top:0; left:0; z-index:1; }
        .button-particle {
            position: absolute;
            pointer-events: none;
            animation: burst 0.8s ease-out forwards;
        }
        @keyframes burst {
            to { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
    </style>
</head>
<body>
    <canvas id="particleCanvas"></canvas>
    <div class="registration-form-container">
        <?php if (!empty($loginError)) echo "<div class='message'>$loginError</div>"; ?>
        <form action="" method="post" name="login_form">
            <h3>Sign In</h3>
            <span>Email</span>
            <input type="text" name="email" id="email" class="box" placeholder="Enter your email" value="<?php echo htmlspecialchars($email); ?>" required>
            <div class="message"><?php echo $emailError; ?></div>

            <span>Password</span>
            <input type="password" name="password" id="password" class="box" placeholder="Enter your password" required>
            <div class="message"><?php echo $passwordError; ?></div>

            <input type="submit" id="loginBtn" value="Sign In" name="submit" class="btn">
            <p>Don't have an account? <a href="signup.php">Register here</a></p>
        </form>
    </div>

<script>
let mouse = { x: null, y: null };
window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });

const images = ["main-home-single-img-01-800x341.jpg", "su.jpg", "w1.jpg"];
let currentIndex = 0;
function changeBackgroundImage() {
    document.body.style.backgroundImage = `url(${images[currentIndex]})`;
    currentIndex = (currentIndex + 1) % images.length;
}
setInterval(changeBackgroundImage, 2000);
changeBackgroundImage();

// Particle canvas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particlesArray;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*canvas.height;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random()-0.5;
        this.speedY = Math.random()-0.5;
        this.color = `rgba(255,255,255,${Math.random()})`;
        this.followMouse = Math.random()<0.2;
    }
    update() {
        if(this.followMouse && mouse.x && mouse.y){
            let dx = mouse.x-this.x;
            let dy = mouse.y-this.y;
            let force = 0.01;
            this.x += this.speedX + dx*force;
            this.y += this.speedY + dy*force;
        } else { this.x += this.speedX; this.y += this.speedY; }

        if(this.x<0) this.x=canvas.width;
        if(this.x>canvas.width) this.x=0;
        if(this.y<0) this.y=canvas.height;
        if(this.y>canvas.height) this.y=0;
    }
    draw() { ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2); ctx.fillStyle=this.color; ctx.fill(); }
}

function initParticles(){ particlesArray=[]; for(let i=0;i<100;i++){ particlesArray.push(new Particle()); } }
initParticles();
function animateParticles(){ ctx.clearRect(0,0,canvas.width,canvas.height); particlesArray.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(animateParticles);}
animateParticles();
window.addEventListener('resize', ()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; initParticles(); });

// Button stars effect
function createButtonStars(button){
    const rect = button.getBoundingClientRect();
    for(let i=0;i<35;i++){
        const star=document.createElement('div');
        star.classList.add('button-particle');
        const dx=(Math.random()-0.5)*200+'px';
        const dy=(Math.random()-0.5)*200+'px';
        star.style.setProperty('--dx',dx);
        star.style.setProperty('--dy',dy);
        star.style.left=(rect.left+rect.width/2-5)+'px';
        star.style.top=(rect.top+rect.height/2-5)+'px';
        star.innerHTML=`<svg width="20" height="20" viewBox="0 0 24 24" fill="yellow" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14.09 8.26H20.82L15.36 12.14L17.45 18.4L12 14.52L6.55 18.4L8.64 12.14L3.18 8.26H9.91L12 2Z"/></svg>`;
        document.body.appendChild(star);
        star.addEventListener('animationend', ()=>star.remove());
    }
}

const loginForm = document.querySelector('form[name="login_form"]');
loginForm.addEventListener('submit', e=>{
    const loginBtn = document.getElementById('loginBtn');
    createButtonStars(loginBtn);
});
</script>
</body>
</html>
