"use strict";


//Класс LoginForm управляет формой входа в портал

class LoginForm extends AsyncForm {
  /*
  Производит авторизацию с помощью User.login. 
  После успешной авторизации, сбрасывает форму в AsyncForm.registerEvents(), устанавливает состояние App.setState( 'user-logged' ) 
  и закрывает окно, в котором находится форма
  */
  onSubmit(data) {//при отправке формы входа:
    User.login(data, (err, response) => { //вызываю метод login и тут же задаю колбек который применится
      if (err) {// если ошибка при отправке запроса или получения ответа
        console.error(err);

        //throw new Error("Ошибка при получении ответа с сервера при входе");
    
      } else if (response.success) {// при успешном запросе и получении ответа:
        console.log(response);
        
        App.setState('user-logged');// отрисовываем страницу - вид страницы авторизованного пользователя

        App.modals.login.onClose();//закываем окно входа

        //очищается окно у нас при отправке submit в методе AsyncForm  .registerEvents()

      } else if (!response.success) {//если ответ успешно пришел, но он не дал нам желаемого результата - ошибка при запросе
        console.error(response);
        
        alert(`${response.error}`);// покажет какая ошибка
      };
    });
  };
};