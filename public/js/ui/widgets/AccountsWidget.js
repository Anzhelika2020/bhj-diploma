"use strict";

//Класс AccountsWidget управляет блоком отображения счетов в боковой колонке

class AccountsWidget {
  /*
  Устанавливает текущий элемент в свойство element
  Регистрирует обработчики событий с помощью AccountsWidget.registerEvents()
  Вызывает AccountsWidget.update() для получения списка счетов и последующего отображения
  Если переданный элемент не существует, необходимо выкинуть ошибку.
  */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
      this.update();

    } else {
      throw new Error ("ошибка в AccountsWidget, element не существует");
    };
  };

  /*
  При нажатии на .create-account открывает окно #modal-new-account для создания нового счёта
  При нажатии на один из существующих счетов (которые отображены в боковой колонке),
  вызывает AccountsWidget.onSelectAccount()
  */
  registerEvents() {
    this.element.onclick = (event) => {
      if (event.target.closest(".create-account")) {
        App.modals.createAccount.open();

      } else if (event.target.closest(".account")) {
        this.onSelectAccount(event.target.closest(".account"));
      };
    };
  };

  /*
  Метод доступен только авторизованным пользователям (User.current()).
  Если пользователь авторизован, необходимо получить список счетов через Account.list(). 
  При успешном ответе необходимо очистить список ранее отображённых счетов через AccountsWidget.clear().
  Отображает список полученных счетов с помощью метода renderItem()
  */
  update() {
    if (User.current()) {
      Account.list(
        User.current(),

        (err, response) => {
          if(err) {
            console.error(err);

          } else if (response.success) {
            this.clear();

            this.renderItem(response.data);
          };
      });
    };
  };


  //Очищает список ранее отображённых счетов. Для этого необходимо удалять все элементы .account в боковой колонке
  clear() {
    const accounts = document.querySelectorAll("ul.accounts-panel li.account");

    accounts.forEach((account) => {
      account.remove();
    });
  };

  /*
  Срабатывает в момент выбора счёта
  Устанавливает текущему выбранному элементу счёта класс .active. 
  Удаляет ранее выбранному элементу счёту класс .active.
  Вызывает App.showPage( 'transactions', { account_id: id_счёта });
  */
  onSelectAccount(element) {
    if(element.className.includes("active")) {//если нажали на счет у которого и так класс active - то закрываем его
      element.classList.remove("active");

      App.pages.transactions.clear();

      return;

    } else if (element.closest(".accounts-panel").querySelector(".active")) {
      element.closest(".accounts-panel").querySelector(".active").classList.remove("active");
    };

    element.classList.add("active");

    App.pages.transactions.lastOptions = {account_id: `${element.dataset.id}`};// записали номер счета в свойство lastOptions у страницы отображения транзакций по этому счету (чтобы запомнить номер последнего выбранного счета)

    App.showPage('transactions', App.pages.transactions.lastOptions); //вызывает страницу с транзакциями по этому счету
  };

  
  //Возвращает созданный HTML-код счёта (в виде строки) для последующей вставки и отображения в боковой колонке. (item - объект с данными о счёте)
  getAccountHTML(item) {
    return `
    <li class="account" data-id=\"${item.id}\">
      <a href=\"#\">
          <span>${item.name}</span> /
          <span>${item.sum}</span>
      </a>
    </li>
    `;
  };

  /*
  Получает массив с информацией о счетах.
  Отображает полученный с помощью метода AccountsWidget.getAccountHTML HTML-код элемента и добавляет его внутрь элемента виджета
  */
  renderItem(data){
    data.forEach((elm) => {
      document.querySelector(".accounts-panel").innerHTML += this.getAccountHTML(elm);
    });
  };
};
