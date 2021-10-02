"use strict";


//Класс RegisterForm управляет формой регистрации

class RegisterForm extends AsyncForm {
  /*
  Производит регистрацию с помощью User.register
  После успешной регистрации устанавливает состояние App.setState('user-logged') и закрывает окно, в котором находится форма,
  также сбрасывает форму в AsyncForm.registerEvents()
  */
  onSubmit(data) {//при отправке формы регистрации:
    User.register(data, (err, response) => { //вызываю метод регистрации и тут же задаю колбек который применится
      if (err) {// если ошибка при отправке запроса или получения ответа
        console.error(err);

        //throw new Error("Ошибка при получении ответа с сервера при регистрации");
    
      } else if (response.success) {// при успешном запросе и получении ответа:
        console.log(response);

        App.setState('user-logged');// отрисовываем страницу - вид страницы авторизованного пользователя

        App.modals.register.onClose();//закываем окно регистрации

        //очищается окно у нас при отправке submit в методе AsyncForm  .registerEvents()
        
      } else if (!response.success) {//если ответ успешно пришел, но он не дал нам желаемого результата - ошибка при запросе
        console.error(response);
        
        alert(`${response.error}`);// покажет какая ошибка
      };
    });
  };
};