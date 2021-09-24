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
      this.update();
      this.registerEvents();

    } else {
      console.error("ошибка в AccountsWidget");
      alert("ошибка в AccountsWidget");
      throw new Error ("ошибка в AccountsWidget");
    };
  };

  /*
  При нажатии на .create-account открывает окно #modal-new-account для создания нового счёта
  При нажатии на один из существующих счетов (которые отображены в боковой колонке),
  вызывает AccountsWidget.onSelectAccount()
  */
  registerEvents() {
    //при нажатии на кнопку создать счет - открываем окно создания счета
    document.querySelector(".create-account").onclick = () => App.modals.createAccount.open();

    //задаем обработчик на всю панель счетов, так как счетов изначально нет в HTML а задаем мы их сразу:
    this.element.onclick = function (event) {
      if (!event.target.closest(".header")) { //Если нажали не на заголовок к списку счетов, то срабатывает обработчик:
        let account = event.target.closest(".account"); //находим элемент инициатор события (на который нажал пользователь) и получаем его родителя (нужный нам счет)

        App.widgets.accounts.onSelectAccount(account); //вызываем метод меняющий класс выбранному счету и вызывающий страницу с транзакциями

        //return false;//при нажатии на ссылки (а) и так ссылка никуда не перебрасывает
      } ;
    };
  };

  /*
  Метод доступен только авторизованным пользователям (User.current()).
  Если пользователь авторизован, необходимо получить список счетов через Account.list(). 
  При успешном ответе необходимо очистить список ранее отображённых счетов через AccountsWidget.clear().
  Отображает список полученных счетов с помощью метода renderItem()
  */
  update() {
    if (User.current()) { // если авторизованный юзер есть:
      Account.list( //вызываю список его счетов с нужными аргументами:
        User.current(), //первый аргумент - data - данные активного юзера

        (err, response) => { //второй аргумент - колбек, задаю его:
          if(err) {
            console.log(err); // если ошибка при запросе

          } else if (response.success) { // если запрос успешный
            console.log("успешный запрос списка счетов, ответ:");
            console.log(response);

            this.clear(); //очищаю список ранее отображённых счетов

            this.renderItem(response.data); //запускаю метод renderItem() для отрисовки счетов из полученных данных

/* 
Хотела добавлять проверку не пустой ли пришел массив в ответе, например, если счетов вообще нет никаких, но при первом запросе сразу выдает ошибку: 
Uncaught TypeError: Cannot read properties of undefined (reading 'length'). 

При повторной отправке все хорошо работает. Почему??


            console.log(response.data.length)

            if (response.data.length !== 0) {//если полученный массив не пустой - есть счета и длина массива не 0:
              //console.log("есть счета");
              this.renderItem(response.data);//запускаю метод renderItem() для отрисовки счетов из полученных данных

            } else {
              //console.log("нет счетов");//если полученный массив пустой - счетов нет:
            };
*/
          };
      });
    };
  };


  //Очищает список ранее отображённых счетов. Для этого необходимо удалять все элементы .account в боковой колонке
  clear() {
    //находим все счета этого пользователя в разметке
    const accounts = document.querySelectorAll("ul.accounts-panel li.account");

    accounts.forEach((account) => { //для каждого счета
      account.remove(); //удаляем каждый счет
    });
  };

  /*
  Срабатывает в момент выбора счёта
  Устанавливает текущему выбранному элементу счёта класс .active. 
  Удаляет ранее выбранному элементу счёту класс .active.
  Вызывает App.showPage( 'transactions', { account_id: id_счёта });
  */
  onSelectAccount(element) { //получаем счет на который нажал пользователь
    //ищем через его родителя был ли ранее активным какой-либо счет и если да, то удаляем у него класс .active
    if (element.closest(".accounts-panel").querySelector(".active")) {
      element.closest(".accounts-panel").querySelector(".active").classList.remove("active");
    };

    element.classList.add("active");//переданному элементу устанавливаем класс .active

    console.log("поменяли активный класс у счета");
    console.log({account_id: `${element.dataset.dataId}`});

    App.showPage('transactions', {account_id: `${element.dataset.dataId}`}); //вызывает страницу с транзакциями по этому счету
    
    console.log("сработало после вызова страницы транзакций по этому счету");
  };

  
  //Возвращает HTML-код счёта для последующего отображения в боковой колонке. item - объект с данными о счёте
  getAccountHTML(item) {
    let accountItemElm = document.createElement("li"); //создаю пустой элемент списка счетов

    accountItemElm.className = "account"; //добавляю ему класс

    accountItemElm.dataset.dataId = `${item.id}`; //добавляю ему атрибут dataset
    //добавляю ему нужный контент:
    accountItemElm.innerHTML += `
      <a href=\"#\">
          <span>${item.name}</span> /
          <span>${item.sum}</span>
      </a>
    `;

    return accountItemElm; //метод возвращает HTML-код счёта
  };

  /*
  Получает массив с информацией о счетах.
  Отображает полученный с помощью метода AccountsWidget.getAccountHTML HTML-код элемента и добавляет его внутрь элемента виджета
  */
  renderItem(data){
    //console.log(data)

    data.forEach((elm) => {//для каждого элемента массива(счета) 
      let accountItemHtml = this.getAccountHTML(elm);//запускаю метод создания HTML разметки .getAccountHTML

      //console.log(accountItemHtml);//это созданная HTML разметка

      let accountsPanel = document.querySelector(".accounts-panel");//нахожу панель для отображения существующих счетов

      accountsPanel.appendChild(accountItemHtml);//добавляю существующие счета в разметку для отображения
    });
  };
};
