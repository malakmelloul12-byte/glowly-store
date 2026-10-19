/* ==========================================================================
   Glowly Beauty & More - JavaScript Store Application
   ========================================================================== */

// 1. WhatsApp Phone Number Configuration (Morocco: 212 + number without leading 0)
const WHATSAPP_NUMBER = "212600000000"; // قومي بتغيير هذا الرقم لرقمك الخاص

// 2. Product Catalog Data
const products = [
    {
        id: 1,
        name: "طقم فرشي المكياج الاحترافي (12 قطعة)",
        category: "tools",
        price: 199,
        oldPrice: 249,
        rating: 5,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80",
        discount: "-20%"
    },
    {
        id: 2,
        name: "مجموعة العناية والنضارة الفائقة (4 قطع)",
        category: "skincare",
        price: 285,
        oldPrice: 335,
        rating: 5,
        reviews: 98,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
        discount: "-15%"
    },
    {
        id: 3,
        name: "مجموعة ملمع الشفاه المات (6 ألوان)",
        category: "makeup",
        price: 149,
        oldPrice: 199,
        rating: 4.8,
        reviews: 76,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80",
        discount: "-25%"
    },
    {
        id: 4,
        name: "أظافر اصطناعية فاخرة Press-On (24 قطعة)",
        category: "nails",
        price: 125,
        oldPrice: 153,
        rating: 4.9,
        reviews: 112,
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=500&q=80",
        discount: "-18%"
    },
    {
        id: 5,
        name: "عطر الجمال الرومانسي Floral Glow 100ml",
        category: "fragrance",
        price: 320,
        oldPrice: 390,
        rating: 5,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80",
        discount: "-18%"
    },
    {
        id: 6,
        name: "ربطات وإكسسوارات شعر حريرية (3 قطع)",
        category: "hair",
        price: 89,
        oldPrice: 110,
        rating: 4.7,
        reviews: 54,
        image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=500&q=80",
        discount: "-19%"
    },
    {
        id: 7,
        name: "أسفنجات المكياج الاحترافية (4 قطع)",
        category: "tools",
        price: 79,
        oldPrice: 99,
        rating: 4.9,
        reviews: 142,
        image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=500&q=80",
        discount: "-20%"
    },
    {
        id: 8,
        name: "سيروم الهيالورونيك لنضارة البشرة 50ml",
        category: "skincare",
        price: 210,
        oldPrice: 260,
        rating: 4.8,
        reviews: 67,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",
        discount: "-19%"
    }
];

// 3. Application State Management
let cart = JSON.parse(localStorage.getItem('glowly_cart')) || [];
const SHIPPING_FEE = 35; // Standard shipping fee in MAD

// 4. DOM Element References
const productsGrid = document.getElementById('productsGrid');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartToggleBtn = document.getElementById('cartToggleBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartBadge = document.getElementById('cartBadge');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartTotal = document.getElementById('cartTotal');
const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const searchInput = document.getElementById('searchInput');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const accountBtn = document.getElementById('accountBtn');
const accountModal = document.getElementById('accountModal');
const checkoutModal = document.getElementById('checkoutModal');
const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');
const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
const checkoutForm = document.getElementById('checkoutForm');

// 5. Initialize Store
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartUI();
    setupEventListeners();
});

// 6. Render Product Cards
function renderProducts(items) {
    if (!productsGrid) return;

    if (items.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p class="text-muted">لم يتم العثور على أي منتجات مطابقة.</p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = items.map(product => `
        <div class="product-card">
            ${product.discount ? `<span class="badge-discount">${product.discount}</span>` : ''}
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80'">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="rating">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="price-box">
                    <span class="current-price">${product.price} DH</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} DH</span>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn-cart" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-bag-shopping"></i> أضيفي للسلة
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// 7. Cart Operations
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    openCart();
    showToast("تمت إضافة المنتج إلى السلة ♡");
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
    showToast("تم إزالة المنتج من السلة");
}

function saveCart() {
    localStorage.setItem('glowly_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Update Badges
    if (cartBadge) cartBadge.textContent = totalItems;
    if (cartCount) cartCount.textContent = totalItems;

    // Render Cart Items
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px 0; color: var(--text-muted);">
                    <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; margin-bottom: 10px; opacity: 0.3;"></i>
                    <p>سلة التسوق فارغة حالياً</p>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} DH</div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">إزالة</button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Update Prices
    if (cartSubtotal) cartSubtotal.textContent = `${subtotal.toFixed(2)} DH`;
    if (cartTotal) cartTotal.textContent = `${subtotal.toFixed(2)} DH`;
}

// 8. Filter & Sort Handling
function filterAndSortProducts() {
    let result = [...products];
    const cat = categoryFilter ? categoryFilter.value : 'all';
    const sort = sortBy ? sortBy.value : 'default';
    const search = searchInput ? searchInput.value.trim().toLowerCase() : '';

    // Category Filter
    if (cat !== 'all') {
        result = result.filter(p => p.category === cat);
    }

    // Search Filter
    if (search !== '') {
        result = result.filter(p => p.name.toLowerCase().includes(search));
    }

    // Sort
    if (sort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
    }

    renderProducts(result);
}

// 9. Modals & Drawer Toggles
function openCart() {
    if (cartDrawer) cartDrawer.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
}

function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
}

function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('active');
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('active');
}

// 10. Checkout & WhatsApp Submission
function openCheckout() {
    if (cart.length === 0) {
        showToast("السلة فارغة! أضيفي منتجات أولاً.");
        return;
    }
    closeCart();
    renderCheckoutSummary();
    openModal('checkoutModal');
}

function renderCheckoutSummary() {
    const summaryContainer = document.getElementById('checkoutSummaryItems');
    const summarySubtotal = document.getElementById('summarySubtotal');
    const summaryShipping = document.getElementById('summaryShipping');
    const summaryTotal = document.getElementById('summaryTotal');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subtotal + SHIPPING_FEE;

    if (summaryContainer) {
        summaryContainer.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span>${item.name} (${item.quantity}x)</span>
                <strong>${(item.price * item.quantity).toFixed(2)} DH</strong>
            </div>
        `).join('');
    }

    if (summarySubtotal) summarySubtotal.textContent = `${subtotal.toFixed(2)} DH`;
    if (summaryShipping) summaryShipping.textContent = `${SHIPPING_FEE.toFixed(2)} DH`;
    if (summaryTotal) summaryTotal.textContent = `${finalTotal.toFixed(2)} DH`;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const city = document.getElementById('custCity').value.trim();
    const address = document.getElementById('custAddress').value.trim();

    // Validate Moroccan Phone Number Format
    const phoneRegex = /^(0|\+212|212)?[5-7]\d{8}$/;
    if (!phoneRegex.test(phone)) {
        showToast("يرجى إدخال رقم هاتف مغربي صحيح (06, 07, 05)");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_FEE;

    // Construct WhatsApp Message Text
    let message = `🛍️ *طلب جديد من متجر Glowly Beauty* 🛍️\n\n`;
    message += `👤 *معلومات الزبونة:*\n`;
    message += `• الاسم: ${name}\n`;
    message += `• الهاتف: ${phone}\n`;
    message += `• المدينة: ${city}\n`;
    message += `• العنوان: ${address}\n\n`;

    message += `🛒 *الطلبيات:*\n`;
    cart.forEach(item => {
        message += `• ${item.name} (الكمية: ${item.quantity}) - ${item.price * item.quantity} DH\n`;
    });

    message += `\n💵 *المجموع الفرعي:* ${subtotal.toFixed(2)} DH\n`;
    message += `🚚 *مصاريف الشحن:* ${SHIPPING_FEE.toFixed(2)} DH\n`;
    message += `✨ *الإجمالي النهائي:* ${total.toFixed(2)} DH\n\n`;
    message += `💳 *طريقة الدفع:* الدفع عند الاستلام (COD)`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    // Reset Cart & Close Modal
    cart = [];
    saveCart();
    updateCartUI();
    closeModal('checkoutModal');
    showToast("تم تحويل طلبك لـ WhatsApp بنجاح ♡");
}

// 11. Toast Notifications Helper
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// 12. Event Listeners Initialization
function setupEventListeners() {
    if (cartToggleBtn) cartToggleBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    if (proceedCheckoutBtn) proceedCheckoutBtn.addEventListener('click', openCheckout);
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => closeModal('checkoutModal'));

    if (accountBtn) accountBtn.addEventListener('click', () => openModal('accountModal'));

    if (categoryFilter) categoryFilter.addEventListener('change', filterAndSortProducts);
    if (sortBy) sortBy.addEventListener('change', filterAndSortProducts);
    if (searchInput) searchInput.addEventListener('input', filterAndSortProducts);

    // Mobile Menu Toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Category Cards Clicks
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.category;
            if (categoryFilter) categoryFilter.value = cat;
            filterAndSortProducts();
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Promo Banners Clicks
    document.querySelectorAll('.filter-btn-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.cat;
            if (categoryFilter) categoryFilter.value = cat;
            filterAndSortProducts();
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Close Modals on background click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Form Submissions
    if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckoutSubmit);

    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("شكراً لاشتراككِ في نشرتنا البريدية ♡");
            newsletterForm.reset();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("تم إرسال رسالتكِ بنجاح! سنتواصل معكِ قريباً.");
            contactForm.reset();
        });
    }
}
