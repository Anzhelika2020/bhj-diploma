"use strict";

//Класс Modal отвечает за управление всплывающими окнами. В первую очередь это открытие или закрытие имеющихся окон

class Modal {
  /*
  Устанавливает текущий элемент в свойство element
  Регистрирует обработчики событий с помощью Modal.registerEvents()
  Если переданный элемент не существует, необходимо выкинуть ошибку.
  */
  constructor(element){
    if (element) {
      this.element = element;
      this.registerEvents();

    } else {
      throw new Error ("ошибка в Modal, element не существует");
    };
  };

//При нажатии на элемент с data-dismiss="modal" должен закрыть текущее окно (с помощью метода Modal.onClose)
  registerEvents() {
    const closeModalBtns = this.element.querySelectorAll("[data-dismiss]");

    closeModalBtns.forEach((elm) => elm.onclick = () => this.onClose());
  };


//Срабатывает после нажатия на элементы, закрывающие окно. Закрывает текущее окно (Modal.close())
//при нажатии на кнопку закрытия: 
  onClose() {
    this.close();
    this.element.querySelector(".form").reset();
  };

//Открывает окно: устанавливает CSS-свойство display со значением «block»
  open() {
   this.element.style.display = "block";
  };

//Закрывает окно: удаляет CSS-свойство display
  close() {
    this.element.style.display = "none";
  };
};


