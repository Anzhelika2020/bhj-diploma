/**
 * Класс Modal отвечает за
 * управление всплывающими окнами.
 * В первую очередь это открытие или
 * закрытие имеющихся окон
 * */

class Modal {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью Modal.registerEvents()
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    this.element = element;

  }

  

  /**
   * При нажатии на элемент с data-dismiss="modal"
   * должен закрыть текущее окно
   * (с помощью метода Modal.onClose)
   * */
  registerEvents() {

  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно (Modal.close())
   * */
  onClose(e) {

  }
  /**
   * Открывает окно: устанавливает CSS-свойство display
   * со значением «block»
   * */
  open() {

  }
  /**
   * Закрывает окно: удаляет CSS-свойство display
   * */
  close(){

  }
}

const registerModalBtn = document.querySelector(".menu-item_register");
const loginModalBtn = document.querySelector(".menu-item_login");
const createAccountBtn = document.querySelector(".create-account");
const createIncomeButton = document.querySelector(".create-income-button");
const createExpenseButton = document.querySelector(".create-expense-button");

registerModalBtn.onclick = function() {
  App.modals.register.element.style.display = "block";
};

loginModalBtn.onclick = function() {
  App.modals.login.element.style.display = "block";
};

createAccountBtn.onclick = function() {
  App.modals.createAccount.element.style.display = "block";
};

createIncomeButton.onclick = function() {
  App.modals.newIncome.element.style.display = "block";
};

createExpenseButton.onclick = function() {
  App.modals.newExpense.element.style.display = "block";
};

