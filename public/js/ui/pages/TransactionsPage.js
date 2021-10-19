"use strict";


//Класс TransactionsPage управляет страницей отображения доходов и расходов конкретного счёта

class TransactionsPage {
  /*
  Если переданный элемент не существует, необходимо выкинуть ошибку.
  Сохраняет переданный элемент и регистрирует события через registerEvents()
  */
  constructor( element ) {
    if (element) {
      this.element = element;
      this.lastOptions;
      this.registerEvents();

    } else {
      throw new Error ("Ошибка, страница транзакций content-wrapper не существует");
    };
  };

  /*
  * Вызывает метод render()
  * В случае, если метод render() был ранее вызван с какими-то опциями, при вызове update() эти опции необходимо передать повторно
  */
  update(options) {

    if(options) {
      this.render(options);
    } else {
      this.render(this.lastOptions);
    };
  
  };

  /*
  Отслеживает нажатие на кнопку удаления транзакции и удаления самого счёта. 
  Внутри обработчика пользуйтесь методами TransactionsPage.removeTransaction и TransactionsPage.removeAccount соответственно
   */
  registerEvents() {
    this.element.querySelector(".remove-account").onclick = () => this.removeAccount();

    let id;
    this.element.querySelector(".content").onclick = (event) => {
      if (event.target.closest(".transaction__remove")) {
        id = event.target.closest(".transaction__remove").dataset.id;

      } else if (event.target.className.includes("transaction__remove")) {
        id = event.target.dataset.id;

      } else {
        id = null
      };

      if (id !== null) {
        this.removeTransaction(id);
      };
    };
  };

  /*
  Удаляет счёт. 
  Необходимо показать диаголовое окно (с помощью confirm()) для подтверждения удаления счета.
  Если пользователь согласен удалить счёт, вызовите Account.remove, а также TransactionsPage.clear с пустыми данными для того, чтобы очистить страницу.
  По успешному удалению необходимо вызвать метод App.updateWidgets(), либо обновляйте только виджет со счетами для обновления приложения
  */
  removeAccount() {
    if (this.lastOptions && confirm("Вы действительно хотите удалить счёт?")) {
      Account.remove(
        {id: this.lastOptions.account_id},

        (err, response) => {
          if(err) {
            console.log(err);
  
          } else if (response.success) {
            this.clear();

            App.getWidget("accounts").update();

          } else if (!response.success) {
            console.error(response);
            
            alert(`${response.error}`);
          };
        });
    };
  };

  /*
  Удаляет транзакцию (доход или расход). Требует подтверждеия действия (с помощью confirm()).
  По удалению транзакции вызовите метод App.update(), либо обновляйте текущую страницу (метод update) и виджет со счетами
 */
  removeTransaction(id) {
    if (this.lastOptions && confirm("Вы действительно хотите удалить эту транзакцию?")) {
      Transaction.remove(
        {id},

        (err, response) => {
          if(err) {
            console.log(err);
  
          } else if (response.success) {
            App.update();

          } else if (!response.success) {
            console.error(response);
            
            alert(`${response.error}`);
          };
        });
    };
  };

  /*
  С помощью Account.get() получает название счёта и отображает его через TransactionsPage.renderTitle.
  Получает список Transaction.list и полученные данные передаёт в TransactionsPage.renderTransactions()
  */
  render(options) {
    if (options) {
      Account.get(
        options.account_id,
        
        (err, response) => {
          if(err) {
            console.log(err);
  
          } else if (response.success) {
            this.renderTitle(response.data.name);

            let accounts = Array.from(document.querySelectorAll("ul.accounts-panel li.account"));

            accounts.find((elm) => elm.dataset.id === this.lastOptions.account_id).classList.add("active");
  
          } else if (!response.success) {
            console.error(response);
            
            alert(`${response.error}`);
          };
        });

        Transaction.list(
          {account_id: this.lastOptions.account_id},
        
          (err, response) => {
            if(err) {
              console.log(err);
    
            } else if (response.success) {
              this.renderTransactions(response.data);

            } else if (!response.success) {
              console.error(response);
              
              alert(`${response.error}`);
            };
          })
    };
  };

  /*
  Очищает страницу. Вызывает TransactionsPage.renderTransactions() с пустым массивом.
  Устанавливает заголовок: «Название счёта»
  */
  clear() {
    this.renderTransactions([]);

    this.renderTitle("Название счёта");

    this.lastOptions = null;
  };

  
  //Устанавливает нужный заголовок в элемент .content-title (заголовок списка транзакций по конкретному счету - имя счета)
  renderTitle(name) {
    this.element.querySelector(".content-title").textContent = name;
  };

  /* formatDate(date)
  Форматирует дату в формате 2019-03-10 03:20:41 (строка)
  в формат «10 марта 2019 г. в 03:20»
  
  По форматированию, могу посоветовать использовать методы toLocaleTimeString и toLacaleDateString:  
  */
  formatDate(date) {
    const dateObject = new Date(date);

    const time = dateObject.toLocaleTimeString("ru-Ru", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const day = dateObject.toLocaleDateString("ru-Ru", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return `${day} в ${time}`;
  };

  /*
  Формирует HTML-код транзакции (дохода или расхода).
  item - объект с информацией о транзакции
  */
  getTransactionHTML(item) {
    let type = item.type === "income" ? "transaction_income" : "transaction_expense";

    let date = this.formatDate(item.created_at);

    //!!!значек рубля не отражается у меня, нужен другой способ задать этот значок
    return `
    <div class=\"transaction ${type} row\">
      <div class=\"col-md-7 transaction__details\">
        <div class=\"transaction__icon\">
            <span class=\"fa fa-money fa-2x\"></span>
        </div>
        <div class=\"transaction__info\">
            <h4 class=\"transaction__title\">${item.name}</h4>
            <!-- дата -->
            <div class=\"transaction__date\">${date}</div>
        </div>
      </div>
      <div class=\"col-md-3\">
        <div class=\"transaction__summ\">
        ${item.sum} <span class=\"currency\">₽</span>
        </div>
      </div>
      <div class=\"col-md-2 transaction__controls\">
          <!-- в data-id нужно поместить id -->
          <button class=\"btn btn-danger transaction__remove\" data-id=\"${item.id}\">
              <i class=\"fa fa-trash\"></i>  
          </button>
      </div>
    </div>
    `;
  };

  
  //Отрисовывает список транзакций на странице спользуя getTransactionHTML
  renderTransactions(data) {
    this.element.querySelector(".content").innerHTML = "";

    data.forEach((elm) => {
      this.element.querySelector(".content").innerHTML += this.getTransactionHTML(elm);
    });
  };
};