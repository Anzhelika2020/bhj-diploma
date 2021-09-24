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
      console.error("ошибка в UserWidget");
      alert("ошибка в UserWidget");
      throw new Error ("ошибка в UserWidget");
    };
  };

/*
Получает информацию о текущем пользователе с помощью User.current(). 
 Если пользователь авторизован, в элемент .user-name устанавливает имя авторизованного пользователя
*/
  update() {
    let userCurrent = User.current();
    if (userCurrent) {
      App.widgets.user.element.querySelector(".user-name").textContent =  User.current().name;
    };
  };
};
