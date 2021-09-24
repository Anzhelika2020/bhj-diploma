"use strict";


//Класс LoginForm управляет формой входа в портал

class LoginForm extends AsyncForm {
  /*
  Производит авторизацию с помощью User.login. 
  После успешной авторизации, сбрасывает форму, устанавливает состояние App.setState( 'user-logged' ) 
  и закрывает окно, в котором находится форма
  */
  onSubmit(data) {
    User.login(data, (err, response) => { //вызываю метод login и тут же задаю колбек который применится
      if (err) {
        console.error(err);

        alert("Ошибка при получении ответа с сервера при входе");

        throw new Error("Ошибка при получении ответа с сервера при входе");
    
      } else if (response.success) {
        console.log(response);
        
        App.setState('user-logged');

        App.modals.login.onClose();

      } else if (!response.success) {
        console.error(response);
        
        alert(`${response.error}`);
      };
      
      
    });
  };
};