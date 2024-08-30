const DetailsModal = customElements.get('details-modal');

console.log('!!!!! sizgid modal', { DetailsModal });
class SizeGuideModal extends HTMLElement {
    constructor() {
        super();

        this.opener = this.querySelector('opener');
        this.modal = this.querySelector('modal');

        console.log('!!!!! sizgid modal.constructor', { opener: this.opener, modal: this.modal });
        // if (this.querySelector('input[aria-invalid="true"]')) this.open({ target: this.querySelector('details') });
        this.opener.addEventListener('click', this.onClick.bind(this));
    }
    isOpen() {
        return this.modal.hasAttribute('open');
    }

    onClick() {
        console.log('!!!!! sizgid modal.onClick', { IS_OPEN: this.isOpen(), opener: this.opener, modal: this.modal });
        if (this.isOpen()) {
            this.modal.removeAttribute('open');
        } else {
            this.modal.setAttribute('open', true);
        }
    }
    open() {
        console.log('!!!!! sizgid modal.open', { IS_OPEN: this.isOpen(), opener: this.opener, modal: this.modal });
        if (!this.isOpen()) {
            this.modal.setAttribute('open', true);
            this.opener.removeEventListener('click', this.open);
            this.opener.addEventListener('click', this.close.bind(this));
        }
    }

    close() {
        console.log('!!!!! sizgid modal.close', { IS_OPEN: this.isOpen(), opener: this.opener, modal: this.modal });
        if (this.isOpen()) {
            this.modal.setAttribute('open', false);
            this.opener.removeEventListener('click', this.close);
            this.opener.addEventListener('click', this.open.bind(this));
        }
    }
}

customElements.define('size-guide-modal', SizeGuideModal);
