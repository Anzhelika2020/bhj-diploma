"use strict";

/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /*
  Производит регистрацию с помощью User.register
  После успешной регистрации устанавливает состояние App.setState('user-logged') и закрывает окно, в котором находится форма
  */
  onSubmit(data) {
    User.register(data, (err, response) => { //вызываю метод регистрации и тут же задаю колбек который применится
      if (err) {
        console.error(err);

        alert("Ошибка при получении ответа с сервера при регистрации");

        throw new Error("Ошибка при получении ответа с сервера при регистрации");
    
      } else if (response.success) {
        console.log(response);

        App.setState('user-logged');

        App.modals.register.onClose();
        
      } else if (!response.success) {
        console.error(response);
        
        alert(`${response.error}`);
      };
    });
  };
};