import Listeners from "./listeners.js";

const SELECTORS = {
  SERVICE: "[data-service]",
  BUTTONS: "[data-service-button]",
  CARDS: "[data-service-card]",
};

class ButtonService {
  constructor(node, array) {
    this.button = node;
    this.cards = array;
    this.isActive = false;
    this.isCheck = false;
    this.button.setAttribute("checked", false);

    this._listeners = new Listeners();
  }

  check() {
    this.isCheck = !this.isCheck;
    this.button.setAttribute("checked", this.isCheck);
  }

  activate() {
    this.cards.forEach((card) => {
      card.classList.toggle("active");
    });

    this.isActive = !this.isActive;
  }
}

class Service {
  constructor(node) {
    this.service = node;
    this.buttons = this.service.querySelectorAll(SELECTORS.BUTTONS);
    this.buttonsInit = [];
    this.cards = this.service.querySelectorAll(SELECTORS.CARDS);

    this._listeners = new Listeners();
    this.init();
  }

  init() {
    this.buttons.forEach((button) => {
      let array = [];

      this.cards.forEach((card) => {
        if (button.id == card.dataset.card) {
          array.push(card);
        }
      });

      const buttonService = new ButtonService(button, array);

      this.buttonsInit.push(buttonService);

      this._listeners.add(button, "click", this.toggle.bind(this));
    });
  }

  toggle(event) {
    const id = event.currentTarget.id;

    let counter = 0;

    this.buttonsInit.forEach((button) => {
      if (button.isCheck == false) {
        counter++;
      }
    });

    if (counter == 3) {
      this.pressOne(id);
    }
    if (counter == 2) {
      this.pressTwo(id);
    }
    if (counter == 1) {
      this.pressTgree(id);
    }
  }

  pressOne(id) {
    this.buttonsInit.forEach((button) => {
      if (button.button.id == id) {
        button.check();
      } else {
        button.activate();
      }
    });
  }

  pressTwo(id) {
    this.buttonsInit.forEach((button) => {
      if (button.button.id == id && button.isCheck) {
        this.pressOne(id);
      }

      if (button.button.id == id && !button.isCheck && button.isActive) {
        button.check();
        button.activate();
      }
    });
  }
  pressTgree(id) {
    this.buttonsInit.forEach((button) => {
      if (button.button.id == id && button.isCheck && !button.isActive) {
        button.activate();
        button.check();

        return;
      }
      if (button.button.id == id && !button.isCheck && button.isActive) {
        this.pressOne(id);
        this.checkAll(id);
        button.activate();
      }
    });
  }

  checkAll(id) {
    this.buttonsInit.forEach((button) => {
      if (button.button.id != id) {
        button.check();
      }
    });
  }
}

const service = document.querySelector(SELECTORS.SERVICE);
new Service(service);
