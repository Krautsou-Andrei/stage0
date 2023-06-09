import Listeners from "./listeners.js";
import dataSity from "./data-sity.js";

const SELECTORS = {
  SELECT: "[data-select]",
  BUTTON: "[data-select-button]",
  CONTENT: "[data-select-content]",
  SECTION: "[data-select-section]",
  VIEW_TEXT: "[data-select-view-text]",
  LINK_TEXT: "[data-select-link]",
  ADDRESS: "[data-select-address]",
  ADDRESS_CITY: "[data-address-city]",
  ADDRESS_PHONE: "[data-address-phone]",
  ADRESS_STREET: "[data-address-street]",
  IMAGE: "[data-select-image]",
  ADDRESS_BUTTON: "[data-address-button]",
  CALL_US: "[data-select-call]",
};

const STATES_SECTION = {
  ANIMATED: "animated",
  CLOSED: "closed",
  OPENED: "opened",
};

const SELECT_CONFIG = {
  alwaysOpenOne: true,
  openSection: [0],
};

const ANIMATION_CONFIG = {
  duration: 750,
  easing: "ease-in-out",
  fill: "forwards",
};

class Collapse {
  constructor(node) {
    this.element = node;
    this.button = this.element.querySelector(SELECTORS.BUTTON);
    this.content = this.element.querySelector(SELECTORS.CONTENT);
    this.viewText = this.element.querySelector(SELECTORS.VIEW_TEXT);
    this.linkTexts = this.element.querySelectorAll(SELECTORS.LINK_TEXT);
    this.address = this.element.querySelector(SELECTORS.ADDRESS);
    this.addressCity = this.element.querySelector(SELECTORS.ADDRESS_CITY);
    this.addressPhone = this.element.querySelector(SELECTORS.ADDRESS_PHONE);
    this.addressStreet = this.element.querySelector(SELECTORS.ADRESS_STREET);
    this.section = this.element.querySelector(SELECTORS.SECTION);
    this.image = this.element.querySelector(SELECTORS.IMAGE);
    this.addressButton = this.element.querySelector(SELECTORS.ADDRESS_BUTTON);

    this.state = STATES_SECTION.OPENED;

    this.animation = null;
    this.toggle();

    this._listeners = new Listeners();
    this._listeners.add(this.button, "click", this.toggle.bind(this));
    this.linkTexts.forEach((link) => {
      this.listenersLinks(link);
    });
  }

  toggle() {
    switch (this.state) {
      case STATES_SECTION.CLOSED:
        this.opened();
        break;
      case STATES_SECTION.OPENED:
        this.closed();
        break;
      default:
    }
  }

  selectAddress(event) {
    dataSity.forEach((element) => {
      if (element.sity == event.target.innerText) {
        console.log("return", element);
        this.addressCity.innerText = element.sity;
        this.addressPhone.innerText = element.phone;
        this.addressStreet.innerText = element.address;
        this.addressButton.setAttribute("href", `tel:${element.phone.replace(/\s/g, "")}`);
      }
    });
  }

  setShowText(event) {
    this.viewText.innerText = event.target.innerText;
    // this.addressCity.innerText = event.target.innerText;
    this.closed();

    const address = this.selectAddress(event);

    setTimeout(() => this.showAddress(), 500);
  }

  showAddress() {
    this.address.classList.add("active");
    this.viewText.classList.add("active");
    this.button.classList.add("active");
    this.section.classList.add("active");
    this.image.classList.add("active");
  }

  hiddenAdress() {
    this.address.classList.remove("active");
  }

  listenersLinks(link) {
    this._listeners.add(link, "click", this.setShowText.bind(this));
  }

  closed() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(false, STATES_SECTION.CLOSED);
    this.button.setAttribute("aria-expanded", false);
    this.content.classList.remove("select-active");
  }

  opened() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(true, STATES_SECTION.OPENED);
    this.button.setAttribute("aria-expanded", true);
    this.content.classList.add("select-active");
    this.hiddenAdress();
  }

  _animateContent(reverse, endState) {
    const config = ANIMATION_CONFIG;
    config.direction = reverse ? "reverse" : "normal";

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.content.animate(
      {
        minHeight: [`${this.content.scrollHeight}px`, "0px"],
        height: ["auto", "0px"],
        overflow: ["visible", "hidden"],
      },
      config
    );
    this.animation.addEventListener("finish", () => {
      this.animation = null;
      this.state = endState;
      this.address.classList.toggle("visible-address");
    });
  }

  destroy() {
    this._listeners.removeAll();
  }
}

const select = document.querySelector(SELECTORS.SELECT);

new Collapse(select, SELECT_CONFIG);
