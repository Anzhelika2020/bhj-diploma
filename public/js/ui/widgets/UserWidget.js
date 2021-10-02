"use strict";

//Класс UserWidget отвечает за отображение информации об имени пользователя после авторизации или его выхода из системы

class UserWidget {
/*
Устанавливает полученный элемент в свойство element.
Если переданный элемент не существует, необходимо выкинуть ошибку.
*/
  constructor(element) {
    if (element) {
      this.element = element;

    } else {
      throw new Error ("ошибка в UserWidget, element не существует");
    };
  };

/*
Получает информацию о текущем пользователе с помощью User.current(). 
 Если пользователь авторизован, в элемент .user-name устанавливает имя авторизованного пользователя
*/
  update() {
    if (User.current()) {
      document.querySelector(".user-panel").querySelector(".user-name").textContent =  User.current().name;

      /*
      App.widgets.user.element.querySelector(".user-name").textContent =  User.current().name;

      App.widgets.user.element - это - document.querySelector(".user-panel") - задано при создании виджета панели юзера
      */
    };
  };
};
