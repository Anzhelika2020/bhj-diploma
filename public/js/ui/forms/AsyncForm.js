"use strict";

/*
Класс AsyncForm управляет всеми формами приложения, которые не должны быть отправлены с перезагрузкой страницы. 
Вместо этого данные с таких форм собираются и передаются в метод onSubmit для последующей обработки
*/
class AsyncForm {
  /*
  Если переданный элемент не существует, необходимо выкинуть ошибку.
  Сохраняет переданный элемент и регистрирует события через registerEvents()
  */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();

    } else {
      throw new Error ("Ошибка, форма не существует");
    };
  };

//Необходимо запретить отправку формы и в момент отправки вызывает метод submit()
  registerEvents() {
    this.element.onsubmit = e => {
      e.preventDefault();
      this.submit();
      this.element.reset();// сразу сбрасывает (очищает) форму !!! Это если нам нужно чтобы все формы сразу очищались после отправки данных, иначе - каждой форме отдельно в методе onSubmit(options) задавать или не задавать очистку формы.
    };
  };

  /**
   * Преобразует данные формы в объект вида
   * {
   *  'название поля формы 1': 'значение поля формы 1',
   *  'название поля формы 2': 'значение поля формы 2'
   * }
   * */
  getData() {
    const data = {};
    const formData = new FormData(this.element);

    const entries = formData.entries();

    for (let item of entries) {
      let key = item[0];
      let value = item[1];
      data[key] = `${value}`;
    };
    return data;
  };

//Пустой метод. Пригодится для дальнейших форм, что будут унаследованы от AsyncForm. 
  onSubmit(options) {
    //console.log(options);
  };


//Вызывает метод onSubmit и передаёт туда данные, полученные из метода getData()
  submit() {
    this.onSubmit(this.getData());
  };
};