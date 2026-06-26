const bannerImages = document.querySelector('.upper-main-body-banner-images');
const images = document.querySelectorAll('.upper-main-body-banner-images img');

let currentIndex = 0;

const scrollBanner = () => {
    currentIndex++;
    if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    bannerImages.style.transform = `translateX(${-100 * currentIndex}%)`;
};

setInterval(scrollBanner, 5000);
