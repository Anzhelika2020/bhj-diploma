"use strict";


//Класс CreateAccountForm управляет формой создания нового счёта

class CreateAccountForm extends AsyncForm {
//Создаёт счёт с помощью Account.create, закрывает окно в случае успеха, а также вызывает App.update() и сбрасывает форму в AsyncForm.registerEvents()
  onSubmit(data) {
    Account.create(
      data,

      (err, response) => {
        if(err) {
          console.log(err);

        } else if (response.success) {
          App.update();

          App.modals.createAccount.onClose();

        } else if (!response.success) {
          console.error(response);
          
          alert(`${response.error}`);
        };
      });
  };
};