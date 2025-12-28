const bar = document.getElementById('bar');
const navbar = document.getElementById('navbar');
const closeBtn = document.querySelector('#navbar .close-btn');

if (bar && navbar) {
  bar.onclick = () => {
    navbar.classList.toggle('active');
  };
}

if (closeBtn && navbar) {
  closeBtn.onclick = () => {
    navbar.classList.remove('active');
  };
}