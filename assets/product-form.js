if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.variantIdInput.disabled = false;

        // Listen to submit (add to cart)
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));

        // Get addToCart confirmation component
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');

        // Get submit button
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton.querySelector('span');

        // If addToCart confirmation is a drawer, premare submit button
        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        // Depend on data-hide-errors attribute
        this.hideErrors = this.dataset.hideErrors === 'true';
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        // If button is disabled, do nothing
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        // Show errors if necessary
        this.handleErrorMessage();

        // Disable submit button + set loading state
        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        // Prepare query
        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];
        const formData = new FormData(this.form);

        // Prepare addToCart confirmation component
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        console.log('!!!!! productFrom.onSubmitHandlre A', {url: routes.cart_add_url, config });

        // Launch addToCart query
        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
              console.log('!!!!! productFrom.onSubmitHandlre B', {response });

            // If there is an error
            if (response.status) {
              // Transmit error to everyone (for recipient-form, giftCard form)
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              // Show error
              this.handleErrorMessage(response.description);

              // Write "Sold out" in addToCart button if possible
              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButtonText.classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;

              // The end. Go to finally()
              return;
            } else if (!this.cart) {
              // If there is no AddToCart confirmation component, redirect to cart page
              window.location = window.routes.cart_url;
                // The end. Go to finally()
              return;
            }

              /**
               * If there are no error, Transmit event to everyone:
               * * cart.js
               * * price-pre-item.js
               * * product-info.js
               * * quick-add-bulk.js
               * * quick-order-list.js
               * * recipient-form.js
               */
            if (!this.error) {
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              });
            }
            this.error = false;


            // show addToCart confirmation (after closing modal if we are in a <quick-add-modal>)
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    this.cart.renderContents(response);
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              this.cart.renderContents(response);
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            // Stop addToCart loading state
            this.submitButton.classList.remove('loading');

            // Say cart is no more empty
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');

            // Enable addToCart if there are no error
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');

            // Remove loading state
            this.querySelector('.loading__spinner').classList.add('hidden');
          });
      }

      /**
       * Show/hide error message
       * Stops if
       * * errors are ignored,
       * * there is not DOM element to receive it
       * * errorMessage is false
       **/
      handleErrorMessage(errorMessage = false) {
        // If errors are ignored, do nothing
        if (this.hideErrors) return;

        // get wrapper and stop if there is not
        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;

        // get errorMessage element and toggle it
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');
        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        // Add error text
        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

        /**
         * Enable/disable addToCart button (+ change text if you want)
         * Used in product-info.js
         */
      toggleSubmitButton(disable = true, text) {
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      /**
       * get variant id input
       * Used in product-info.js
       */
      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }
    }
  );
}
