// script.js

document.addEventListener('DOMContentLoaded', function() {
    const couponButtons = document.querySelectorAll('.show-coupon');
  
    couponButtons.forEach(button => {
      button.addEventListener('click', function() {
        alert('Coupon code: SAVE20');
      });
    });
  
    // Example: Add dynamic category switching
    const categoryButtons = document.querySelectorAll('.category-button');
    const offersSection = document.querySelector('.offers-section');
  
    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        loadOffers(category);
      });
    });
  
    function loadOffers(category) {
      // For simplicity, using static offers. Ideally, fetch from a server or database.
      const offers = {
        'Mobiles & Tablets': [
          { title: '60% Off on Electronics', store: 'Amazon' },
          { title: '40% Off on Mobile Accessories', store: 'Flipkart' }
        ],
        'Fashion': [
          { title: '75% Off on Fashion', store: 'Myntra' },
          { title: '50% Off on Shoes', store: 'AJIO' }
        ]
      };
  
      const selectedOffers = offers[category] || [];
      offersSection.innerHTML = '';
  
      selectedOffers.forEach(offer => {
        const offerCard = document.createElement('div');
        offerCard.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md');
        offerCard.innerHTML = `
          <h3 class="text-xl font-bold mb-2">${offer.title}</h3>
          <p class="text-gray-700 mb-4">${offer.store}</p>
          <button class="bg-red-500 text-white py-2 px-4 rounded show-coupon">Show Coupon</button>
        `;
        offersSection.appendChild(offerCard);
      });
    }
  });
  