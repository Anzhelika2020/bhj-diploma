"use strict";

//Класс RegisterForm управляет формой регистрации

class RegisterForm extends AsyncForm {
  /*
  Производит регистрацию с помощью User.register
  После успешной регистрации устанавливает состояние App.setState('user-logged') и закрывает окно, в котором находится форма,
  также сбрасывает форму в AsyncForm.registerEvents()
  */
  onSubmit(data) {
    User.register(data, (err, response) => {
      if (err) {
        console.error(err);
    
      } else if (response.success) {
        App.setState('user-logged');

        App.modals.register.onClose();

        //очищается окно у нас при отправке submit в методе AsyncForm  .registerEvents()
        
      } else if (!response.success) {
        console.error(response);
        
        alert(`${response.error}`);
      };
    });
  };
};