import Listeners from "./listeners.js";

const SELECTORS = {
  ACCORDION: "[data-accordion]",
  BUTTON: "[data-accordion-button]",
  CONTENT: "[data-accordion-content]",
  SECTION: "[data-accordion-section]",
  ORDER_BUTTON: "[data-order-button]",
};

const STATES_SECTION = {
  ANIMATED: "animated",
  CLOSED: "closed",
  OPENED: "opened",
};

const ACCORDION_CONFIG = {
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
    this.orderButtons = this.element.querySelectorAll(SELECTORS.ORDER_BUTTON);

    this.state = STATES_SECTION.OPENED;

    this.animation = null;
    this.toggle();

    this._listeners = new Listeners();
    this._listeners.add(this.button, "click", this.toggle.bind(this));
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

  getListeners() {
    return (this.listenrs = this._listeners);
  }

  closed() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(false, STATES_SECTION.CLOSED);
    this.button.setAttribute("aria-expanded", false);
    this.content.classList.remove("accordion-active");
    this.orderButtons.forEach((button) => {
      button.tabIndex = -1;
    });
  }

  opened() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(true, STATES_SECTION.OPENED);
    this.button.setAttribute("aria-expanded", true);
    this.content.classList.add("accordion-active");
    this.orderButtons.forEach((button) => {
      button.tabIndex = 0;
    });
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
        height: [`${this.content.scrollHeight}px`, "0px"],
        overflow: ["visible", "hidden"],
      },
      config
    );
    this.animation.addEventListener("finish", () => {
      this.animation = null;
      this.state = endState;
    });
  }

  destroy() {
    this._listeners.removeAll();
  }
}

class Accordion {
  constructor(node, config) {
    this.config = config || ACCORDION_CONFIG;
    this.sections = node.querySelectorAll(SELECTORS.SECTION);
    this.sectionsInit = [];
    this._listeners = new Listeners();
    this.alwaysOpenOne = this.config.alwaysOpenOne;
    this.openSection = this.config.openSection;
    this.init();
  }

  init() {
    this.sections.forEach((element) => {
      const section = new Collapse(element);
      this.sectionsInit.push(section);

      if (this.alwaysOpenOne) {
        this._listeners.add(section.button, "click", this.closedSections.bind(this));
      }
    });

    this.startOpenSection();
  }

  startOpenSection() {
    this.openSection = this.openSection.splice(0, this.sectionsInit.length);
    if (!this.alwaysOpenOne) {
      this.openSection.forEach((index) => {
        if (index > 0 && index <= this.sectionsInit.length) {
          this.sectionsInit[index - 1].opened();
        }
      });
    } else if (this.openSection[0] > 0 && this.openSection[0] <= this.sectionsInit.length) {
      this.sectionsInit[this.openSection[0] - 1].opened();
    }
  }

  closedSections(event) {
    const id = event.target.id;
    this.sectionsInit.forEach((section) => {
      if (section.button.id !== id && section.state === STATES_SECTION.OPENED) {
        section.toggle();
      }
    });
  }

  destroy() {
    this._listeners.removeAll();
    this.sectionsInit.forEach((element) => {
      element.getListeners().removeAll();
    });
  }
}

const accordion = document.querySelector(SELECTORS.ACCORDION);

new Accordion(accordion, ACCORDION_CONFIG);
