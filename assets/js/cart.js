/**
 * Shopping Cart Functionality
 */
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('teBoCart')) || [];
        this.cartIcons = document.querySelectorAll('.cart-icon');
        this.cartModal = document.querySelector('.cart-modal');
        this.cartOverlay = document.querySelector('.cart-overlay');
        this.cartItemsContainer = document.querySelector('.cart-items');
        this.cartEmptyMessage = document.querySelector('.cart-empty');
        this.totalAmountElement = document.querySelector('.total-amount');
        this.closeCartBtn = document.querySelector('.close-cart');
        this.clearCartBtn = document.querySelector('.clear-cart');
        this.checkoutBtn = document.querySelector('.checkout-btn');
        
        this.initCartIndicators();
        this.initCartModal();
    }

    // Initialize cart indicators based on current cart state
    initCartIndicators() {
        const hasItems = this.items.length > 0;
        this.updateCartIndicator(hasItems);
    }

    // Initialize cart modal event listeners
    initCartModal() {
        // Open cart modal when cart icon is clicked
        this.cartIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                this.openCart();
            });
        });

        // Close cart when close button is clicked
        if (this.closeCartBtn) {
            this.closeCartBtn.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Close cart when overlay is clicked
        if (this.cartOverlay) {
            this.cartOverlay.addEventListener('click', () => {
                this.closeCart();
            });
        }

        // Clear cart when clear button is clicked
        if (this.clearCartBtn) {
            this.clearCartBtn.addEventListener('click', () => {
                this.clearCart();
                this.renderCartItems();
            });
        }

        // Handle checkout button
        if (this.checkoutBtn) {
            this.checkoutBtn.addEventListener('click', () => {
                // Placeholder for checkout functionality
                alert('Proceeding to checkout...');
                // Here you could redirect to a checkout page
                // window.location.href = '/checkout.html';
            });
        }

        // Close modal with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.cartModal.classList.contains('show')) {
                this.closeCart();
            }
        });
    }

    // Open cart modal
    openCart() {
        this.renderCartItems();
        this.cartModal.classList.add('show');
        this.cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Close cart modal
    closeCart() {
        this.cartModal.classList.remove('show');
        this.cartOverlay.classList.remove('show');
        document.body.style.overflow = ''; // Enable scrolling
    }

    // Render cart items in modal
    renderCartItems() {
        if (!this.cartItemsContainer) return;

        // Clear current content
        this.cartItemsContainer.innerHTML = '';

        if (this.items.length === 0) {
            // Show empty cart message
            this.cartEmptyMessage.classList.add('show');
            this.cartItemsContainer.style.display = 'none';
        } else {
            // Hide empty cart message, show items
            this.cartEmptyMessage.classList.remove('show');
            this.cartItemsContainer.style.display = 'block';

            // Create HTML for each item
            this.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.dataset.id = item.id;

                // Image placeholder or actual image if available
                let imgSrc = '/assets/img/product-placeholder.png'; // Default placeholder
                
                // Try to find actual product image based on product ID
                // This is a simple approach - in a real site you'd have a more robust solution
                const productId = item.id.split('-')[0].toLowerCase();
                if (productId === 'vintage' || productId === 'chair') {
                    imgSrc = '/assets/img/vintagechair.png';
                } else if (productId === 'closetto') {
                    imgSrc = '/assets/img/closetto.png';
                } else if (productId === 'dresser') {
                    imgSrc = '/assets/img/dresser.png';
                } else if (productId === 'georgian' || productId === 'rug') {
                    imgSrc = '/assets/img/carpetgeorgian.png';
                } else if (productId === 'symphonic' || productId === 'curtain') {
                    imgSrc = '/assets/img/symphonic.png';
                } else if (productId === 'luxury' || productId === 'sofa') {
                    imgSrc = '/assets/img/luxurysofa.png';
                }

                itemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${imgSrc}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">€${parseFloat(item.price).toFixed(2)}</div>
                        <div class="cart-item-controls">
                            <div class="quantity-control">
                                <button class="quantity-btn decrease">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn increase">+</button>
                            </div>
                        </div>
                    </div>
                    <button class="remove-item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;

                // Add event listeners
                const decreaseBtn = itemElement.querySelector('.decrease');
                const increaseBtn = itemElement.querySelector('.increase');
                const removeBtn = itemElement.querySelector('.remove-item');
                
                decreaseBtn.addEventListener('click', () => {
                    this.decreaseQuantity(item.id);
                });
                
                increaseBtn.addEventListener('click', () => {
                    this.increaseQuantity(item.id);
                });
                
                removeBtn.addEventListener('click', () => {
                    this.removeItem(item.id);
                    this.renderCartItems();
                });

                this.cartItemsContainer.appendChild(itemElement);
            });
        }

        // Update total amount
        this.updateTotalAmount();
    }

    // Update all cart icons to show/hide indicators
    updateCartIndicator(hasItems) {
        this.cartIcons.forEach(icon => {
            if (hasItems) {
                // For multiple items, use count badge and remove the dot indicator
                if (this.items.length > 1) {
                    icon.classList.remove('has-items'); // Remove dot indicator
                    let countBadge = icon.querySelector('.cart-count');
                    if (!countBadge) {
                        countBadge = document.createElement('span');
                        countBadge.className = 'cart-count';
                        icon.appendChild(countBadge);
                    }
                    countBadge.textContent = this.items.length;
                } else {
                    // For a single item, use the dot indicator
                    icon.classList.add('has-items');
                    const countBadge = icon.querySelector('.cart-count');
                    if (countBadge) {
                        countBadge.remove();
                    }
                }
            } else {
                // No items, remove all indicators
                icon.classList.remove('has-items');
                const countBadge = icon.querySelector('.cart-count');
                if (countBadge) {
                    countBadge.remove();
                }
            }
        });
    }

    // Add item to cart
    addItem(product) {
        // Check if product already in cart
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        // Save to localStorage
        this.saveCart();
        
        // Update indicators
        this.updateCartIndicator(true);
        
        // Show notification
        this.showNotification(`${product.name} added to cart!`);
        
        return this.items;
    }

    // Increase item quantity
    increaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            this.saveCart();
            this.renderCartItems();
        }
    }

    // Decrease item quantity
    decreaseQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            this.saveCart();
            this.renderCartItems();
        } else if (item && item.quantity === 1) {
            // If quantity would become 0, remove the item
            this.removeItem(productId);
            this.renderCartItems();
        }
    }

    // Remove item from cart
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartIndicator(this.items.length > 0);
        return this.items;
    }

    // Clear entire cart
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartIndicator(false);
    }

    // Get cart contents
    getCart() {
        return this.items;
    }

    // Calculate cart total
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0).toFixed(2);
    }

    // Update the displayed total amount
    updateTotalAmount() {
        if (this.totalAmountElement) {
            this.totalAmountElement.textContent = `€${this.getTotal()}`;
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('teBoCart', JSON.stringify(this.items));
    }

    // Show notification when product is added
    showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.cart-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'cart-notification';
            document.body.appendChild(notification);
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize cart when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Create global cart instance
    window.teBoCart = new ShoppingCart();
    
    // Add click handlers to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn, .overlay-btn').forEach(button => {
        button.addEventListener('click', function(event) {
            // Prevent default action if it's a link
            if (this.tagName.toLowerCase() === 'a') {
                event.preventDefault();
            }
            
            // Skip if this is not a cart button (e.g., it's the view or heart icon)
            if (this.classList.contains('overlay-btn') && !this.querySelector('.fa-shopping-cart')) {
                return;
            }
            
            // Get product info from the closest product card
            const productCard = this.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('.product-title').innerText;
                const productPrice = productCard.querySelector('.current-price').innerText.replace('€', '');
                const productId = productCard.dataset.productId || Math.random().toString(36).substr(2, 9);
                
                // Add to cart
                window.teBoCart.addItem({
                    id: productId,
                    name: productName,
                    price: productPrice,
                });
            }
        });
    });
});
