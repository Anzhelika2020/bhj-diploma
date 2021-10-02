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
    //задаем обработчик на всю панель счетов, так как счетов изначально нет в HTML, а при их добавлении переписывается HTML и снимаются обработчики
    this.element.onclick = (event) => {
      if (event.target.closest(".create-account")) {//при нажатии на кнопку создать счет - открываем окно создания счета
        App.modals.createAccount.open();

      } else if (event.target.closest(".account")) {//Если нажали на элемент, ближайший родитель которого имеет класс .account, то это счет, значит:
        //let account = event.target.closest(".account"); //находим элемент инициатор события (на который нажал пользователь) и получаем его родителя (нужный нам счет)

        this.onSelectAccount(event.target.closest(".account")); //вызываем метод меняющий класс выбранному счету и вызывающий страницу с транзакциями

        //return false;//при нажатии на ссылки (а) и так ссылка никуда не перебрасывает
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
    if (User.current()) { // если авторизованный юзер есть:
      Account.list( //вызываю список его счетов с нужными аргументами:
        User.current(), //первый аргумент - data - данные активного юзера

        (err, response) => { //второй аргумент - колбек, задаю его:
          if(err) {
            console.error(err); // если ошибка при запросе

          } else if (response.success) {//если пришел пустой массив, то тоже выполняю действие (перерисовываю список счетов), а то вдруг другой пользователь зашел и у него нет счетов - при входе надо перерисовать страницу на пустой список счетов.
            console.log("успешный запрос списка счетов, ответ:");
            console.log(response);

            this.clear(); //очищаю список ранее отображённых счетов

            this.renderItem(response.data); //запускаю метод renderItem() для отрисовки счетов из полученных данных
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

    console.log("выбрали счет")
    console.log(element)

    if(element.className.includes("active")) {
      console.log("нажали на и так активный класс, поэтому его удалим");

      element.classList.remove("active");

      App.pages.transactions.clear();

      return;

    } else if (element.closest(".accounts-panel").querySelector(".active")) {
      element.closest(".accounts-panel").querySelector(".active").classList.remove("active");
    };

    console.log("убрали активный класс прежнему элементу");

    element.classList.add("active");//переданному элементу устанавливаем класс .active

    console.log("поменяли активный класс у счета");
    console.log(element);
    console.log({account_id: `${element.dataset.id}`});

    App.pages.transactions.lastOptions = {account_id: `${element.dataset.id}`};// записали номер счета в свойство lastOptions у страницы отображения транзакций по этому счету

    App.showPage('transactions', App.pages.transactions.lastOptions); //вызывает страницу с транзакциями по этому счету
    
    console.log("сработало после вызова страницы транзакций по этому счету");
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
    data.forEach((elm) => {//для каждого элемента массива(счета) 
      //нахожу панель для отображения существующих счетов и добавляю пустой элемент в разметку к уже существующей
      document.querySelector(".accounts-panel").innerHTML += this.getAccountHTML(elm);

      /* 
      длинный путь через создание нового элемента, его вставки в панель счетов и установления ему нового значения (замены его содержимого включая замену его самого):

      let htmlAccountItem = this.getAccountHTML(elm);//получаю созданную HTML разметку (строку) через метод .getAccountHTML
      
      let elmAccountItem = document.createElement("li"); //создаю пустой элемент списка счетов

      document.querySelector(".accounts-panel").appendChild(elmAccountItem);//нахожу панель для отображения существующих счетов и добавляю пустой элемент в разметку

      elmAccountItem.outerHTML = htmlAccountItem; // устанавливаю HTML разметку этому элементу (изменяя его самого включительно)
      */
    });
  };
};
