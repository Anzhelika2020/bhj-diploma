"use strict";


//Класс CreateAccountForm управляет формой создания нового счёта

class CreateAccountForm extends AsyncForm {
//Создаёт счёт с помощью Account.create, закрывает окно в случае успеха, а также вызывает App.update() и сбрасывает форму в AsyncForm.registerEvents()
  onSubmit(data) {//сабмит с данными(вызванный в унаследованном AsyncForm) вызывает ф-ию создания счета(метод класса Account)
    Account.create(
      data, //первый аргумент - data - введенные в форму данные

      (err, response) => {//второй аргумент - колбек, задаю его:
        if(err) {
          console.log(err);// если ошибка при запросе

        } else if (response.success) {// если запрос успешный
          console.log("успешный запрос создания счета, ответ:");
          console.log(response);

          App.update();//обновляю панель счетов (Обновляет виджеты и содержимое страниц)

          App.modals.createAccount.onClose(); //закрываю и очищаю модальное окно

        } else if (!response.success) {
          console.error(response);
          
          alert(`${response.error}`);
        };
      });
  };
};