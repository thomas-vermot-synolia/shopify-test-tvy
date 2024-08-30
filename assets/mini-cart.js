console.log('!!!!! minicart file', document.querySelector('minicart'))
class MiniCart extends HTMLElement {
    constructor() {
        super();
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        console.log('!!!! Minicart construct', { cart: this.cart })

        this.addEventListener('click', this.open.bind(this));
    }

    open() {
        console.log('!!!! Minicart OPEN', { cart: this.cart, that: this, open: this.cart.open })

        setTimeout(() => {
            this.cart.open()
        });
    }
}

customElements.define('mini-cart', MiniCart);
