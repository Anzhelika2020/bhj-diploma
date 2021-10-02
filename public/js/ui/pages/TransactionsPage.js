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
      this.lastOptions;//сюда записывать будем объект options {} с данными о номере счета account_id: 
      this.registerEvents();// вызываем метод

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
    // ищу кнопку удаления счета и задаю ей обработчик:
    this.element.querySelector(".remove-account").onclick = () => this.removeAccount();

    let id;//будем искать id транзакции для вызова метода удаления этой транзакции, создаем его

    //задаю обработчик на всю панель с транзакциями, так как ее содержимое все время перерисовывается и обработчики слетают
    this.element.querySelector(".content").onclick = (event) => {//при нажатии на страницу с транзакциями:

      console.log(event.target.closest(".transaction__remove"))
      console.log("нажали на удаление транзакции:");
      console.log(event.target);

      if (event.target.closest(".transaction__remove")) {// если ближайший родитель элемента на который нажали это кнопка удаления
        id = event.target.closest(".transaction__remove").dataset.id;// то id для этой транзакции равен dataset.id родителя этого элемента(dataset.id этой кнопки)

      } else if (event.target.className.includes("transaction__remove")) {// если этот элемент на который нажали и есть кнопка удаления
        id = event.target.dataset.id;// то id для этой транзакции равен dataset.id этой кнопки

      } else {//если в любые другие места нажали, то не нужно ничего удалять и id не будет нужен
        id = null
      };

      if (id !== null) {// если нажимали не на кнопку удаления и id поэтому равен null, то:
        this.removeTransaction(id);//удаляем ту транзакцию, на кнопку удаления которой нажали
      };
    };
  };

  /*
  Удаляет счёт. 
  Необходимо показать диаголовое окно (с помощью confirm()) для подтверждения удаления счета.
  Если пользователь согласен удалить счёт, вызовите Account.remove, а также TransactionsPage.clear с пустыми данными для того, чтобы очистить страницу.
  По успешному удалению необходимо вызвать метод App.updateWidgets(), либо обновляйте только виджет со счетами для обновления приложения
  */
  removeAccount() { // удаление счета
    //если есть какой-то выбранный счет (объект в lastOptions) и пользователь подтвердил отмену:
    if (this.lastOptions && confirm("Вы действительно хотите удалить счёт?")) {
      Account.remove(// запускаем метод удаления счета
        {id: this.lastOptions.account_id}, //первый аргумент, создаем обьект с данными и сразу записываем туда данные id хранящиеся в св-ве lastOptions

        (err, response) => {//второй аргумент - колбек, задаю его:
          if(err) {
            console.log(err);// если ошибка при запросе
  
          } else if (response.success) {// если запрос успешный
            console.log("успешный запрос удаления счета, ответ:");
            console.log(response);

            this.clear(); // очищаем страницу после успешного удаления

            App.getWidget("accounts").update();//обновляем виджет со счетами для обновления приложения
            //App.updateWidgets()//можно все виджеты обновить (и accounts и user)

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
      Transaction.remove(// запускаем метод удаления транзакции
        {id}, //первый аргумент, создаем обьект с данными и сразу записываем туда данные id переданные при вызове метода удаления

        (err, response) => {//второй аргумент - колбек, задаю его:
          if(err) {
            console.log(err);// если ошибка при запросе
  
          } else if (response.success) {// если запрос успешный
            console.log("успешный запрос удаления транзакции, ответ:");
            console.log(response);

            App.update(); // обновляем приложение (либо обновляем текущую страницу (метод update) и виджет со счетами)

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
    //если options есть, если есть хоть какой-то выбранный счет по которому нужно отобразить информацию о транзакциях (если на него нажали и его id записалось в свойство this.lastOptions (это делается в AccountsWidget.js примерно в строке 100 )), то:
    if (options) {
      Account.get( //получаем данные о выбранном счете и выполняем нужные действия:
        options.account_id, //первый аргумент данные id хранящиеся в св-ве lastOptions
        
        (err, response) => {//второй аргумент - колбек, задаю его:
          if(err) {
            console.log(err);// если ошибка при запросе
  
          } else if (response.success) {// если запрос успешный
            console.log("успешный запрос получения данных о счете, ответ:");
            console.log(response);
  
            console.log(this.lastOptions);
  
            this.renderTitle(response.data.name);//вызываем метод .renderTitle() для отображения имени счета в заголовке и передаем туда его имя

            /* 
            так как при добавлении/удалении транзакций все обновляется и список счетов с итоговыми суммами перерисовывается (а у них у всех изначально активным никто вы установлен и поэтому список транзакций не отрисовывается), 
            ТО МЫ НАХОДИМ все счета, ИЩЕМ у кого dataset.id совпадает номером счета над которым последние действия делались или он был выбран ранее (это номер счета, который был последним передан в свойство-объект .lastOptions) и ВОЗВРАЩАЕМ ему класс .active, чтобы отражался список транзакций нужного нам активного счета:
            */

            let accounts = Array.from(document.querySelectorAll("ul.accounts-panel li.account"));//ищем существующие счета этого пользователя и формируем из них массив

            accounts.find((elm) => elm.dataset.id === this.lastOptions.account_id).classList.add("active");//ищем у какого их них номер совпадает с последним номером счета в .lastOptions.account_id(над которыми действия делались или он был выбран ранее) и добавляем ему класс active, чтобы именно он и отрисовался на странице транзакций и светился выбранным.
  
          } else if (!response.success) {
            console.error(response);
            
            alert(`${response.error}`);
          };
        });

        Transaction.list(// получаем список транзакций по выбранному счету и выполняем нужные действия:
          {account_id: this.lastOptions.account_id}, //первый аргумент, создаем обьект с данными и сразу записываем туда данные id хранящиеся в св-ве lastOptions
        
          (err, response) => {//второй аргумент - колбек, задаю его:
            if(err) {
              console.log(err);// если ошибка при запросе
    
            } else if (response.success) {// если запрос успешный
              console.log("успешный запрос получения списка транзакций по выбранному счету, ответ:");
              console.log(response);
    
              this.renderTransactions(response.data); //вызываем метод .renderTransactions() для отрисовыки на странице всех транзакций по этому счету и передаем туда полученные данные 
              console.log(response.data);

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
    this.renderTransactions([]);//перерисовываем страницу транзакций из данных пустого массива

    this.renderTitle("Название счёта");//Задаём первоначальный заголовок счёта

    this.lastOptions = null;//Удаляем содержимое из lastOptions

  };

  
  //Устанавливает нужный заголовок в элемент .content-title (заголовок списка транзакций по конкретному счету - имя счета)
  renderTitle(name) {
    console.log("запустили метод renderTitle()");

    this.element.querySelector(".content-title").textContent = name;// ищем элемент заголовка и устанавливаем ему имя
  };

  /** !!!!! ПОЗЖЕ
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    console.log(date)
    
    return date;

  }

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
    console.log(data)

    console.log("запустили метод renderTransactions()");

    this.element.querySelector(".content").innerHTML = "";//сначала очищаем предыдущий список транзакций

    // для каждого элемента из массива полученных данных (транзакций по выбранному счету) выполняем действие: добавляем в список транзакций отображаемых на странице в HTML разметку каждый элемент (транзакцию), предварительно создав для нее HTML разметку используя метод .getTransactionHTML()
    data.forEach((elm) => {
      this.element.querySelector(".content").innerHTML += this.getTransactionHTML(elm);
    });
  };
};