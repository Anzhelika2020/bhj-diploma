"use strict";

//Класс TransactionsWidget отвечает за открытие всплывающих окон для создания нового дохода или расхода

class TransactionsWidget {
  /*
  Устанавливает полученный элемент в свойство element.
  Если переданный элемент не существует, необходимо выкинуть ошибку.
  */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();

    } else {
      throw new Error ("ошибка в TransactionsWidget, element не существует");
    };

  }
  /*
  Регистрирует обработчики нажатия на кнопки «Новый доход» и «Новый расход».
  При нажатии вызывает Modal.open() для экземпляра окна
  */

/* или так:
  registerEvents() {
    document.querySelector(".create-income-button").addEventListener("click", () => App.getModal("newIncome").open());

    document.querySelector(".create-expense-button").addEventListener("click", () => App.getModal("newExpense").open());
  };
*/

  //или так:
  registerEvents() {
    document.querySelector(".create-income-button").onclick  = () => App.getModal("newIncome").open();

    document.querySelector(".create-expense-button").onclick  = () => App.getModal("newExpense").open();
  };
};
