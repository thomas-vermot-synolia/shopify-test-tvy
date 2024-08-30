class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = document.getElementById('cart-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);

    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
  }

  open() {
      console.log('!!!! catrNotif.OPEN', {});
      this.notification.classList.add('animate');
      this.notification.classList.add('active');

    this.notification.addEventListener(
      'transitionend',
      () => {
        this.notification.focus();
        trapFocus(this.notification);
      },
      { once: true }
    );

    document.body.addEventListener('click', this.onBodyClick);
  }

  close() {
      console.log('!!!! catrNotif.CLOSE', {});
    this.notification.classList.remove('active');
    document.body.removeEventListener('click', this.onBodyClick);

    removeTrapFocus(this.activeElement);
  }

  renderContents(parsedState) {
    this.cartItemKey = parsedState.key;
    console.log('!!!! catrNotif.renderContenst', { parsedState  });
    this.getSectionsToRender().forEach((section) => {
        console.log('!!!! catrNotif.renderContenst x', section.id === "cart-notification-product", { section, parsedState, htmlshouldbe: parsedState.sections[section.id], });
      document.getElementById(section.id).innerHTML = this.getSectionInnerHTML(
        parsedState.sections[section.id],
        section.selector, section.id
      );
    });

    if (this.header) this.header.reveal();
    this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: '[id="shopify-section-cart-notification-product"]', // `[id="cart-notification-product-${this.cartItemKey}"]`,
      },
      {
        id: 'cart-notification-button',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section', sectionIDTODELETE) {
      const a = new DOMParser().parseFromString(html, 'text/html')
      const b = a.querySelector(selector);
    const result = b.innerHTML;
      console.log('!!!!! catrNotif.getSectionInnerHTLM', sectionIDTODELETE, { html, selector, result, a, b });
    return result;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification')) {
      const disclosure = target.closest('details-disclosure, header-menu');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;

        console.log('!!!! catrNotif.handlebodyclik', {});
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-notification', CartNotification);
