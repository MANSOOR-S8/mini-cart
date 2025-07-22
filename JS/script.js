
//nav bar js 

const navEl = document.querySelector('.nav');
const hamburgerEl = document.querySelector('.hamburger');
const navItemEls = document.querySelectorAll('.nav__item');

hamburgerEl.addEventListener('click', () => {
  navEl.classList.toggle('nav--open');
  hamburgerEl.classList.toggle('hamburger--open');
});

navItemEls.forEach(navItemEl => {
  navItemEl.addEventListener('click', () => {
    navEl.classList.remove('nav--open');
    hamburgerEl.classList.remove('hamburger--open');
  });
});

// counting

 function getCartCount() {
      return parseInt(localStorage.getItem('cartCount')) || 0;
    }

    function setCartCount(count) {
      localStorage.setItem('cartCount', count);
      document.getElementById('cart-count').textContent = count;
    }

    function addToCart() {
      let count = getCartCount();
      count++;
      setCartCount(count);
    }

    // Set cart count on page load
    // window.onload = () => {
    //   setCartCount(getCartCount(0));
    // };


