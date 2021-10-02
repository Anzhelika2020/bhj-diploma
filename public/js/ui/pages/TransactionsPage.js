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
      this.registerEvents();

    } else {
      throw new Error ("Ошибка, страница транзакций content-wrapper не существует");
    };
  };


  //Вызывает метод render для отрисовки страницы
  update(options) {
/*
    //если в панели счетов нет какого-то активного счета, то
    if (document.querySelector("ul.accounts-panel li.active")) {
      App.pages.transactions.clear(); // очищаем страницу со списком транзакций
    };
*/
    if(options) {
      this.render(options);
    } else {
      this.render(this.lastOptions);
    }
  

  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    let removeAccountBtn = this.element.querySelector(".remove-account");

    removeAccountBtn.onclick = () => this.removeAccount();

    let id;

    this.element.querySelector(".content").onclick = (event) => {
      if (event.target.closest(".transaction__remove")) {
        id = event.target.closest(".transaction__remove").dataset.id;

      } else if (event.target.className.includes("transaction__remove")) {
        id = event.target.dataset.id;

      } else {
        id = null
      };

      console.log("нажали на удаление транзакции:");
      console.log(event.target);

      this.removeTransaction(id);


    }

  }

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
        //!!!!ПРОВЕРИТЬ
        {id}, //первый аргумент, создаем обьект с данными и сразу записываем туда данные id переданные при вызове метода удаления

        (err, response) => {//второй аргумент - колбек, задаю его:
          if(err) {
            console.log(err);// если ошибка при запросе
  
          } else if (response.success) {// если запрос успешный
            console.log("успешный запрос удаления транзакции, ответ:");
            console.log(response);

            //this.lastOptions.account_id = 

            //this.render(this.lastOptions);//сначала отрисовываю список транзакций, потом уже обновляю страницу и удаляю id актуального счета в this.lastOptions (оно у меня в clear() очищается)

            App.update(); // обновляем приложение (либо обновляем текущую страницу (метод update) и виджет со счетами)


          } else if (!response.success) {
            console.error(response);
            
            alert(`${response.error}`);
          };
        });
    };

  }

  /*
  С помощью Account.get() получает название счёта и отображает его через TransactionsPage.renderTitle.
  Получает список Transaction.list и полученные данные передаёт в TransactionsPage.renderTransactions()
  */
  render(options) {
    //если options есть, если есть хоть какой-то выбранный счет по которому нужно отобразить информацию о транзакциях (если на него нажали и его id записалось в свойство this.lastOptions (это делается в AccountsWidget.js примерно в строке 100 )), то:
    if (options) {
      //this.clear();// очищаем страницу со списком транзакций

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

            // так как при добавлении/удалении транзакций все обновляется и список счетов с итоговыми суммами перерисовывается (а у них у всех изначально активным никто вы установлен и поэтому список транзакций не отрисовывается), то мы находим все счета, ищем у кого dataset.id совпадает с нужным нам номером счета (сейчас это последний выбранный - он передается в .lastOptions) и возвращаем ему класс .active, чтобы отражался список транзакций нужного нам активного счета:

            let accounts = Array.from(document.querySelectorAll("ul.accounts-panel li.account"));

            accounts.find((elm) => elm.dataset.id === this.lastOptions.account_id).classList.add("active");
  
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
    

  } 

  /*
  Очищает страницу. Вызывает TransactionsPage.renderTransactions() с пустым массивом.
  Устанавливает заголовок: «Название счёта»
  */
  clear() {
    this.renderTransactions([]);//перерисовываем страницу транзакций из данных пустого массива

    this.renderTitle("Название счёта");//Задаём первоначальный заголовок счёта

    this.lastOptions = null;//Удаляем содержимое из lastOptions

  };

  /**
   * Устанавливает нужный заголовок в элемент .content-title
   * */
  renderTitle(name){
    console.log("запустили метод renderTitle()");

    console.log(this.element.querySelector(".content-title").textContent)

    this.element.querySelector(".content-title").textContent = name;

    console.log(this.element.querySelector(".content-title").textContent)

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
  }''

  
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