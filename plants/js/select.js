import Listeners from "./listeners.js";

const SELECTORS = {
  SELECT: "[data-select]",
  BUTTON: "[data-select-button]",
  CONTENT: "[data-select-content]",
  SECTION: "[data-select-section]",
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
    this.content.classList.remove("select-active");
  }

  opened() {
    this.state = STATES_SECTION.ANIMATED;
    this._animateContent(true, STATES_SECTION.OPENED);
    this.button.setAttribute("aria-expanded", true);
    this.content.classList.add("select-active");
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
    });
  }

  destroy() {
    this._listeners.removeAll();
  }
}

const select = document.querySelector(SELECTORS.SELECT);

new Collapse(select, SELECT_CONFIG);
