"use strict";

/*
Класс Sidebar отвечает за работу боковой колонки:
кнопки скрытия/показа колонки в мобильной версии сайта и за кнопки меню
*/
class Sidebar {
  
  //Запускает initAuthLinks и initToggleButton
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /*
  Отвечает за скрытие/показа боковой колонки:
  переключает два класса для body: sidebar-open и sidebar-collapse при нажатии на кнопку .sidebar-toggle
  */
  static initToggleButton() {
    const sidebarMini = document.querySelector(".sidebar-mini");

    const sidebarToggle = sidebarMini.querySelector(".sidebar-toggle");

    sidebarToggle.onclick = function() {
      sidebarMini.classList.toggle("sidebar-open");
      sidebarMini.classList.toggle("sidebar-collapse");
    };
  };

  /*
  При нажатии на кнопку входа, показывает окно входа (через найденное в App.getModal)
  При нажатии на кнопку регистрации показывает окно регистрации
  При нажатии на кнопку выхода вызывает User.logout и по успешному выходу устанавливает App.setState( 'init' )
  */
  static initAuthLinks() {
    document.querySelector(".menu-item_login").onclick = () => App.getModal("login").open();

    document.querySelector(".menu-item_register").onclick = () => App.getModal("register").open();

  /*
  Я ДУМАЛА ИЗНАЧАЛЬНО ЧТО они по принципу их id в dataset задавались.

    let modalLoginName = document.getElementById("modal-login").dataset.modalId;
    document.querySelector(".menu-item_login").onclick = () => App.getModal(modalLoginName).open();

  Если нет связи, то зачем вызывать через метод  App.getModal? можно же проще сразу по имени св-ва:

    document.querySelector(".menu-item_register").onclick = () => App.modals.register.open();
  */
    document.querySelector(".menu-item_logout").onclick = () => { //при нажатии на кнопку выхода:
      User.logout((err, response) => { //вызываю метод User.logout(callback), колбек задаю здесь же:
        if(err) {
          console.log(err); // если ошибка при запросе

        } else if (response.success) { // если запрос успешный
          console.log("выход успешно произведен");

          App.setState('init');
        };
      });
    //App.setState('init') не проще было сразу в User.js в User.logout() установить?
    };
  };
};