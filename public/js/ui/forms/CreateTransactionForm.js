"use strict";

//Класс CreateTransactionForm управляет формой создания новой транзакции

class CreateTransactionForm extends AsyncForm {
  //Вызывает родительский конструктор и метод renderAccountsList
  constructor(element) {
    super(element)

    this.renderAccountsList();//вызывается дважды, так как у нас два окна создания транзакций: приход и расход
  };
  
  //Получает список счетов с помощью Account.list и Обновляет в форме всплывающего окна выпадающий список
  renderAccountsList() {
    Account.list(
      User.current(),

      (err, response) => {
        if(err) {
          console.log(err);

        } else if (response.success && response.data.length !== 0) {
          this.element.querySelector(".accounts-select").innerHTML = "";
          
          response.data.forEach((account) => {
            this.element.querySelector(".accounts-select").innerHTML += `
            <option value=\"${account.id}\">${account.name}</option>
            `;
          });
        };
      });
  };

  /*
  Создаёт новую транзакцию (доход или расход) с помощью Transaction.create. 
  По успешному результату вызывает App.update(), сбрасывает форму в AsyncForm.registerEvents() и закрывает окно, в котором находится форма
  */
  onSubmit(data) {
    console.log(data)

    Transaction.create(
      data,
      
      (err, response) => {
        if(err) {
          console.log(err);

        } else if (response.success) {
          App.pages.transactions.lastOptions.account_id = data.account_id;//перезаписываем в .lastOptions номер счета не тот, который был выбран (был класс .active) последним, а тот, для которого произвели последние действия, чтобы метод у страницы со списком транзакций .render() отрисовал страницу на которой мы действия произвели, так сказать перешел туда сразу.

          App.update();

          this.element.closest(".modal").style.display = "none";//закрываю и очищаю модальное окно 
          /* ! закрываю не через метод onClose() так как он есть только у объекта: App.modals.newIncome.onClose(), 
          а я нахожу не объект а элемент этого окна в DOM (как родительский у того элемента на котором действие) и меняю заданный style.display
          */

         //this.element.reset(); // форма и так очищается после закрытия в AsyncForm.registerEvents()
        };
      });
  };
};