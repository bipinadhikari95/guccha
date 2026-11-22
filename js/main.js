/* ===================================================
   GUCHHA FLOWERS — Handcrafted Crochet Bouquets
   Interactive Stem-by-Stem Custom Bouquet Builder
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==================== STATE ====================
    const state = {
        items: {}, // { id: { name, price, qty, emoji, category } }
        wrapping: { name: 'Classic Kraft', price: 0 },
        addons: {}, // { name: price }
        cardMessage: ''
    };

    // ==================== DOM REFS ====================
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const themeToggle = document.getElementById('themeToggle');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    // Builder elements
    const flowerCards = document.querySelectorAll('.flower-card');
    const totalStemsCount = document.getElementById('totalStemsCount');
    const pillStemCount = document.getElementById('pillStemCount');
    const pillTotalAmount = document.getElementById('pillTotalAmount');
    const basketVisualTray = document.getElementById('basketVisualTray');
    const basketItemsList = document.getElementById('basketItemsList');
    const stemsBreakdownCount = document.getElementById('stemsBreakdownCount');
    const stemsSubtotal = document.getElementById('stemsSubtotal');
    const wrappingSubtotal = document.getElementById('wrappingSubtotal');
    const extrasSubtotal = document.getElementById('extrasSubtotal');
    const grandTotalPrice = document.getElementById('grandTotalPrice');
    const clearBasketBtn = document.getElementById('clearBasketBtn');
    const formStemsSummary = document.getElementById('formStemsSummary');
    const formPriceSummary = document.getElementById('formPriceSummary');

    // Addons & Wrapping
    const wrapPills = document.querySelectorAll('.wrap-pill');
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox-card');
    const cardAddonToggle = document.getElementById('cardAddonToggle');
    const cardMessageBox = document.getElementById('cardMessageBox');
    const cardMessageInput = document.getElementById('cardMessageInput');
    const charCount = document.getElementById('charCount');

    // Order form & WhatsApp
    const bouquetOrderForm = document.getElementById('bouquetOrderForm');
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
    const orderModal = document.getElementById('orderModal');
    const modalOrderSummary = document.getElementById('modalOrderSummary');
    const closeModal = document.getElementById('closeModal');

    // ==================== THEME / DARK MODE ====================
    const savedTheme = localStorage.getItem('guchha_theme') || 'light';
    applyTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        showToast(newTheme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
    });

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('guchha_theme', theme);
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    // ==================== NAVBAR ====================
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // ==================== PETAL PARTICLES ====================
    function createPetals() {
        const container = document.getElementById('heroParticles');
        if (!container) return;
        const colors = ['#f8bbd0', '#f48fb1', '#ffffff', '#ffd54f', '#e1bee7'];
        for (let i = 0; i < 20; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            petal.style.left = Math.random() * 100 + '%';
            petal.style.background = colors[Math.floor(Math.random() * colors.length)];
            const size = (8 + Math.random() * 12);
            petal.style.width = size + 'px';
            petal.style.height = size + 'px';
            petal.style.animationDuration = (7 + Math.random() * 9) + 's';
            petal.style.animationDelay = Math.random() * 10 + 's';
            container.appendChild(petal);
        }
    }
    createPetals();

    // ==================== CATEGORY TABS ====================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const catalogGroups = document.querySelectorAll('.catalog-group');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetTab = btn.dataset.tab;

            catalogGroups.forEach(group => {
                if (targetTab === 'all' || group.dataset.group === targetTab) {
                    group.classList.remove('hidden');
                } else {
                    group.classList.add('hidden');
                }
            });
        });
    });

    // ==================== FLOWER CARD STEPPERS ====================
    flowerCards.forEach(card => {
        const id = card.dataset.id;
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price);
        const category = card.dataset.category;
        const emoji = card.dataset.emoji || '🌸';

        const minusBtn = card.querySelector('.stepper-btn.minus');
        const plusBtn = card.querySelector('.stepper-btn.plus');
        const input = card.querySelector('.stepper-input');
        const subtotalEl = card.querySelector('.card-subtotal');

        plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let current = parseInt(input.value) || 0;
            current++;
            setItemQty(id, name, price, current, emoji, category, card, input, subtotalEl);
        });

        minusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            let current = parseInt(input.value) || 0;
            if (current > 0) {
                current--;
                setItemQty(id, name, price, current, emoji, category, card, input, subtotalEl);
            }
        });

        input.addEventListener('input', () => {
            let val = parseInt(input.value);
            if (isNaN(val) || val < 0) val = 0;
            if (val > 99) val = 99;
            setItemQty(id, name, price, val, emoji, category, card, input, subtotalEl);
        });
    });

    function setItemQty(id, name, price, qty, emoji, category, card, input, subtotalEl) {
        input.value = qty;

        if (qty > 0) {
            state.items[id] = { name, price, qty, emoji, category };
            card.classList.add('active');
            subtotalEl.style.display = 'block';
            subtotalEl.textContent = `Rs. ${price * qty} (${qty} stem${qty > 1 ? 's' : ''})`;
        } else {
            delete state.items[id];
            card.classList.remove('active');
            subtotalEl.style.display = 'none';
        }

        recalculateBouquet();
    }

    // ==================== WRAPPING RADIO BUTTONS ====================
    wrapPills.forEach(pill => {
        const radio = pill.querySelector('input[type="radio"]');
        pill.addEventListener('click', () => {
            wrapPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            radio.checked = true;

            state.wrapping = {
                name: radio.value,
                price: parseFloat(radio.dataset.price) || 0
            };
            recalculateBouquet();
        });
    });

    // ==================== ADD-ONS CHECKBOXES ====================
    addonCheckboxes.forEach(card => {
        const checkbox = card.querySelector('input[type="checkbox"]');
        const name = card.dataset.name;
        const price = parseFloat(card.dataset.price) || 0;

        card.addEventListener('click', (e) => {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }

            if (checkbox.checked) {
                card.classList.add('active');
                state.addons[name] = price;
            } else {
                card.classList.remove('active');
                delete state.addons[name];
            }

            // Toggle card message box
            if (card.id === 'cardAddonToggle') {
                cardMessageBox.style.display = checkbox.checked ? 'block' : 'none';
                if (!checkbox.checked) {
                    state.cardMessage = '';
                    if (cardMessageInput) cardMessageInput.value = '';
                }
            }

            recalculateBouquet();
        });
    });

    if (cardMessageInput) {
        cardMessageInput.addEventListener('input', () => {
            charCount.textContent = cardMessageInput.value.length;
            state.cardMessage = cardMessageInput.value;
        });
    }

    // ==================== CLEAR BASKET ====================
    clearBasketBtn.addEventListener('click', () => {
        state.items = {};
        flowerCards.forEach(card => {
            card.classList.remove('active');
            const input = card.querySelector('.stepper-input');
            const subtotalEl = card.querySelector('.card-subtotal');
            if (input) input.value = 0;
            if (subtotalEl) subtotalEl.style.display = 'none';
        });

        // Reset Addons
        state.addons = {};
        addonCheckboxes.forEach(c => {
            c.classList.remove('active');
            c.querySelector('input').checked = false;
        });
        if (cardMessageBox) cardMessageBox.style.display = 'none';
        if (cardMessageInput) cardMessageInput.value = '';

        // Reset wrapping to default
        state.wrapping = { name: 'Classic Kraft', price: 0 };
        wrapPills.forEach(p => p.classList.remove('active'));
        wrapPills[0].classList.add('active');
        wrapPills[0].querySelector('input').checked = true;

        showToast('🗑️ Bouquet cleared');
        recalculateBouquet();
    });

    // ==================== RE-CALCULATE TOTALS & RENDER BASKET ====================
    function recalculateBouquet() {
        const activeItems = Object.entries(state.items);

        let totalStems = 0;
        let stemsCost = 0;

        // Calculate stems & flower cost
        activeItems.forEach(([, item]) => {
            totalStems += item.qty;
            stemsCost += item.price * item.qty;
        });

        // Calculate extras
        let addonsCost = 0;
        Object.values(state.addons).forEach(price => {
            addonsCost += price;
        });

        const wrapCost = state.wrapping.price;
        const grandTotal = stemsCost + wrapCost + addonsCost;

        // Update counts & text
        totalStemsCount.textContent = totalStems;
        pillStemCount.textContent = totalStems;
        pillTotalAmount.textContent = `Rs. ${grandTotal}`;
        stemsBreakdownCount.textContent = totalStems;
        stemsSubtotal.textContent = `Rs. ${stemsCost}`;
        wrappingSubtotal.textContent = wrapCost > 0 ? `Rs. ${wrapCost} (${state.wrapping.name})` : `${state.wrapping.name} (Free)`;
        extrasSubtotal.textContent = `Rs. ${addonsCost}`;
        grandTotalPrice.textContent = `Rs. ${grandTotal}`;
        formStemsSummary.textContent = `${totalStems} stems selected`;
        formPriceSummary.textContent = `Rs. ${grandTotal}`;

        // Render Visual Tray
        if (activeItems.length === 0) {
            basketVisualTray.innerHTML = `
                <div class="basket-empty-state">
                    <i class="fas fa-seedling"></i>
                    <p>Click <strong>+</strong> on any flower to start assembling your custom bouquet!</p>
                </div>`;
        } else {
            basketVisualTray.innerHTML = activeItems.map(([, item]) => `
                <div class="basket-bubble">
                    <div class="bubble-circle">
                        <span>${item.emoji}</span>
                        ${item.qty > 1 ? `<span class="bubble-badge">${item.qty}</span>` : ''}
                    </div>
                    <span class="bubble-label">${item.name}</span>
                </div>
            `).join('');
        }

        // Render Itemized Scroll List
        let itemsHtml = '';
        activeItems.forEach(([id, item]) => {
            itemsHtml += `
                <div class="basket-row-item">
                    <div class="basket-item-info">
                        <span>${item.emoji}</span>
                        <span>${item.name}</span>
                    </div>
                    <div class="basket-item-controls">
                        <button class="basket-qty-btn mini-minus" data-id="${id}"><i class="fas fa-minus"></i></button>
                        <span><strong>${item.qty}</strong></span>
                        <button class="basket-qty-btn mini-plus" data-id="${id}"><i class="fas fa-plus"></i></button>
                        <span class="basket-row-price">Rs. ${item.price * item.qty}</span>
                    </div>
                </div>`;
        });

        Object.entries(state.addons).forEach(([name, price]) => {
            itemsHtml += `
                <div class="basket-row-item">
                    <div class="basket-item-info">
                        <span>✨</span>
                        <span>${name}</span>
                    </div>
                    <span class="basket-row-price">+Rs. ${price}</span>
                </div>`;
        });

        if (state.wrapping.price > 0) {
            itemsHtml += `
                <div class="basket-row-item">
                    <div class="basket-item-info">
                        <span>🎁</span>
                        <span>${state.wrapping.name}</span>
                    </div>
                    <span class="basket-row-price">+Rs. ${state.wrapping.price}</span>
                </div>`;
        }

        basketItemsList.innerHTML = itemsHtml;

        // Mini +/- button handlers in sidebar
        basketItemsList.querySelectorAll('.mini-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const card = document.querySelector(`.flower-card[data-id="${id}"]`);
                if (card) {
                    const plus = card.querySelector('.stepper-btn.plus');
                    if (plus) plus.click();
                }
            });
        });

        basketItemsList.querySelectorAll('.mini-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const card = document.querySelector(`.flower-card[data-id="${id}"]`);
                if (card) {
                    const minus = card.querySelector('.stepper-btn.minus');
                    if (minus) minus.click();
                }
            });
        });
    }

    // ==================== LOAD READY-MADE RECIPES INTO BUILDER ====================
    const presets = {
        'romantic-rose': { 'red-rose': 5, 'pink-rose': 2, 'babys-breath': 3, 'eucalyptus': 2 },
        'sunlit-cheer': { 'sunflower': 4, 'daisy': 4, 'fern-leaf': 2 },
        'pastel-peony': { 'peony': 3, 'tulip': 3, 'lavender': 2, 'eucalyptus': 2 },
        'peaceful-lily': { 'white-lily': 4, 'babys-breath': 3, 'fern-leaf': 2 }
    };

    document.querySelectorAll('.btn-load-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            const presetKey = btn.dataset.preset;
            const recipe = presets[presetKey];
            if (!recipe) return;

            // Clear current items first
            state.items = {};
            flowerCards.forEach(card => {
                const id = card.dataset.id;
                const input = card.querySelector('.stepper-input');
                const subtotalEl = card.querySelector('.card-subtotal');
                const targetQty = recipe[id] || 0;

                input.value = targetQty;
                if (targetQty > 0) {
                    const name = card.dataset.name;
                    const price = parseFloat(card.dataset.price);
                    const emoji = card.dataset.emoji || '🌸';
                    const category = card.dataset.category;
                    state.items[id] = { name, price, qty: targetQty, emoji, category };
                    card.classList.add('active');
                    subtotalEl.style.display = 'block';
                    subtotalEl.textContent = `Rs. ${price * targetQty} (${targetQty} stems)`;
                } else {
                    card.classList.remove('active');
                    subtotalEl.style.display = 'none';
                }
            });

            recalculateBouquet();
            showToast('💐 Loaded recipe in Custom Builder!');
            document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==================== BOUQUET ORDER FORM SUBMISSION ====================
    bouquetOrderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const activeItems = Object.entries(state.items);
        if (activeItems.length === 0) {
            showToast('⚠️ Please choose at least 1 flower stem first!');
            document.getElementById('builder').scrollIntoView({ behavior: 'smooth' });
            return;
        }

        const name = document.getElementById('orderName').value.trim();
        const phone = document.getElementById('orderPhone').value.trim();
        const email = document.getElementById('orderEmail').value.trim();
        const city = document.getElementById('orderCity').value.trim();
        const address = document.getElementById('orderAddress').value.trim();
        const date = document.getElementById('orderDate').value;
        const payment = document.getElementById('orderPayment').value;
        const notes = document.getElementById('orderNotes').value.trim();

        // Calculate Totals & Breakdown
        let totalStems = 0;
        let stemsCost = 0;
        const stemBreakdown = activeItems.map(([, item]) => {
            totalStems += item.qty;
            const itemTotal = item.price * item.qty;
            stemsCost += itemTotal;
            return `${item.name} × ${item.qty} (Rs. ${itemTotal})`;
        }).join(', ');

        let addonsCost = 0;
        const addonsList = Object.entries(state.addons).map(([aName, aPrice]) => {
            addonsCost += aPrice;
            return `${aName} (Rs. ${aPrice})`;
        }).join(', ') || 'None';

        const grandTotal = stemsCost + state.wrapping.price + addonsCost;

        // Prepare FormSubmit payload
        const payload = {
            _subject: `New Custom Crochet Bouquet Order from ${name} (Rs. ${grandTotal})`,
            _template: 'table',
            "Customer Name": name,
            "Phone Number": phone,
            "Email Address": email || 'Not provided',
            "City": city,
            "Delivery Address": address,
            "Preferred Delivery Date": date || 'As soon as possible',
            "Payment Method": payment,
            "Total Stems Selected": `${totalStems} stems`,
            "Crochet Flowers Breakdown": stemBreakdown,
            "Wrapping Style": `${state.wrapping.name} (Rs. ${state.wrapping.price})`,
            "Add-ons & Extras": addonsList,
            "Card Message": state.cardMessage || 'None',
            "Special Instructions": notes || 'None',
            "Total Payable Price": `Rs. ${grandTotal}`
        };

        submitOrderBtn.disabled = true;
        submitOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting to bipinadhikari95@gmail.com...';

        try {
            const res = await fetch('https://formsubmit.co/ajax/bipinadhikari95@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                showSuccessModal(name, phone, totalStems, grandTotal, stemBreakdown);
                bouquetOrderForm.reset();
                clearBasketBtn.click();
            } else {
                throw new Error('Submission error');
            }
        } catch (err) {
            console.warn('FormSubmit network error, falling back to WhatsApp:', err);
            sendToWhatsApp(name, phone, city, address, totalStems, grandTotal, stemBreakdown, addonsList, notes);
            showSuccessModal(name, phone, totalStems, grandTotal, stemBreakdown);
            bouquetOrderForm.reset();
            clearBasketBtn.click();
        } finally {
            submitOrderBtn.disabled = false;
            submitOrderBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Place Custom Order (Send to Gmail)';
        }
    });

    // ==================== WHATSAPP DIRECT ORDER BUTTON ====================
    whatsappOrderBtn.addEventListener('click', () => {
        const activeItems = Object.entries(state.items);
        if (activeItems.length === 0) {
            showToast('⚠️ Please choose at least 1 flower stem first!');
            return;
        }

        const name = document.getElementById('orderName').value.trim() || 'Valued Customer';
        const phone = document.getElementById('orderPhone').value.trim() || 'N/A';
        const city = document.getElementById('orderCity').value.trim() || '';
        const address = document.getElementById('orderAddress').value.trim() || '';
        const notes = document.getElementById('orderNotes').value.trim() || '';

        let totalStems = 0;
        let stemsCost = 0;
        const stemBreakdown = activeItems.map(([, item]) => {
            totalStems += item.qty;
            stemsCost += item.price * item.qty;
            return `• ${item.name} × ${item.qty}`;
        }).join('\n');

        let addonsCost = 0;
        const addonsList = Object.entries(state.addons).map(([aName, aPrice]) => {
            addonsCost += aPrice;
            return `• ${aName}`;
        }).join('\n') || 'None';

        const grandTotal = stemsCost + state.wrapping.price + addonsCost;

        sendToWhatsApp(name, phone, city, address, totalStems, grandTotal, stemBreakdown, addonsList, notes);
    });

    function sendToWhatsApp(name, phone, city, address, totalStems, grandTotal, stemBreakdown, addonsList, notes) {
        const msg = encodeURIComponent(
            `🌸 *NEW CUSTOM BOUQUET ORDER — GUCHHA FLOWERS*\n\n` +
            `*Customer:* ${name}\n` +
            `*Phone:* ${phone}\n` +
            `*Location:* ${city}${address ? ', ' + address : ''}\n\n` +
            `💐 *Stems Selected (${totalStems} stems):*\n${stemBreakdown}\n\n` +
            `🎁 *Wrapping:* ${state.wrapping.name}\n` +
            `✨ *Extras:* ${addonsList}\n` +
            (state.cardMessage ? `💌 *Card Note:* "${state.cardMessage}"\n` : '') +
            (notes ? `📝 *Notes:* ${notes}\n` : '') +
            `\n💰 *Total Price: Rs. ${grandTotal}*`
        );
        window.open(`https://wa.me/9779761697040?text=${msg}`, '_blank');
    }

    function showSuccessModal(name, phone, stems, total, breakdown) {
        modalOrderSummary.innerHTML = `
            <div><strong>Customer:</strong> ${name} (${phone})</div>
            <div><strong>Bouquet:</strong> ${stems} handmade crochet stems</div>
            <div><strong>Total Amount:</strong> <span style="color:var(--clr-primary); font-weight:700;">Rs. ${total}</span></div>
            <div style="font-size:0.78rem; color:var(--clr-text-light); margin-top:4px;">${breakdown}</div>
        `;
        orderModal.classList.add('active');
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            orderModal.classList.remove('active');
        });
    }
    if (orderModal) {
        orderModal.addEventListener('click', (e) => {
            if (e.target === orderModal) {
                orderModal.classList.remove('active');
            }
        });
    }

    // ==================== QUICK CONTACT FORM ====================
    const quickContactForm = document.getElementById('quickContactForm');
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = quickContactForm.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending to Jeson...';

            const cName = document.getElementById('cName').value.trim();
            const cPhone = document.getElementById('cPhone').value.trim();
            const cMsg = document.getElementById('cMessage').value.trim();

            try {
                const res = await fetch('https://formsubmit.co/ajax/bipinadhikari95@gmail.com', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({
                        _subject: `New Inquiry from ${cName} — Guchha Flowers`,
                        Name: cName,
                        Phone: cPhone,
                        Message: cMsg
                    })
                });
                if (res.ok) {
                    showToast('📩 Message sent to Jeson! We will contact you.');
                    quickContactForm.reset();
                } else {
                    throw new Error();
                }
            } catch (err) {
                window.open(`https://wa.me/9779761697040?text=${encodeURIComponent(`Hi Jeson, I have an inquiry.\nName: ${cName}\nPhone: ${cPhone}\nMessage: ${cMsg}`)}`, '_blank');
                quickContactForm.reset();
            } finally {
                btn.disabled = false;
                btn.innerHTML = orig;
            }
        });
    }

    // ==================== TOAST ====================
    function showToast(msg) {
        toastMessage.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    // ==================== BOUQUET GALLERY FILTERS ====================
    const filterBtns = document.querySelectorAll('.bouquet-filters .filter-btn');
    const bouquetCards = document.querySelectorAll('.bouquet-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            bouquetCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Initial recalculation
    recalculateBouquet();

});
