"use strict";

/*
Класс User управляет авторизацией, выходом и регистрацией пользователя из приложения
Имеет свойство URL, равное '/user'.
*/

class User {
  static URL = "/user";

  //Устанавливает текущего пользователя в локальном хранилище.
  static setCurrent(user) {
    localStorage.user = JSON.stringify(user);
  };

  //Удаляет информацию об авторизованном пользователе из локального хранилища.
  static unsetCurrent() {
    delete localStorage.user;
  }

  //Возвращает текущего авторизованного пользователя из локального хранилища
  static current() {
    return JSON.parse(localStorage.getItem('user'));

    /* неудачный и длинный способ:
    if(localStorage.user) {
      return JSON.parse(localStorage.user);

    } else {
      return undefined;
    };
    В User.current не используйте undefined в явном виде (вообще никогда). 
    Да и работу с локальным хранилищем лучше поправить на использование метода getItem. 
    Так и условную конструкцию получится убрать. 
    Получится, метод будет реализован в одну строку: return JSON.parse(localStorage.getItem('user'));

    localStorage.getItem('user') - возвращает null если нет авторизованного
    localStorage.user - возвращает undefined если нет авторизованного и при попытке распарсить эти данные из JON выходит ошибка:
    VM112:1 Uncaught SyntaxError: Unexpected token u in JSON at position 0
    */
  };

  //Получает информацию о текущем авторизованном пользователе.
  static fetch(callback) {  //при вызове этого метода:
    //вызываем ф-ию - делаем запрос на сервер с заданными параметрами:
    createRequest({// в функцию передаем объект (условно options), тут же его создаем и задаем ему свойства (в виде литерала):
      url: `${this.URL}/current`,  //задаем URL будущего запроса
      method: 'GET',  // задаем метод будущего запроса
      callback: (err, response) => { // задаем колбек который выполнится сразу после запроса в ф-ии createRequest
        if (response.success && response.user !== undefined) { //если успешный запрос и есть авторизованный на сервере
          User.setCurrent(response.user);  // то установить его текщим в localStorage
        } else {  // в других случаях:
          User.unsetCurrent();  // удалить текущего пользователя из localStorage
        };
  
        callback(err, response);  // вызвать переданный при вызове метода  fetch() коллбек 
      } // нет (;) так как перечисление свойств идет, можно и просто (,) сделать
    });
  };

  /*
  Производит попытку авторизации. После успешной авторизации необходимо
  сохранить пользователя через метод User.setCurrent.
  */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => { 
        if (response && response.user) {//если такой пользователь есть, 
          User.setCurrent(response.user);//то устанавливаем текущего пользователя в localStorage
          //App.setState('user-logged'); // можно и так сделать, тут задать, а не при нажатии на кнопку отправки формы фхода в LoginForm
        };
        callback(err, response);// и дальше вызываем колбек заданный при вызове, делаем дальше с данными что нам нужно
      }// не нужно знака
    });
  };

  /*
  Производит попытку регистрации пользователя. После успешной авторизации необходимо
  сохранить пользователя через метод User.setCurrent.
  */
  static register(data, callback) {
    //также как и выше создаем options, задаем ему свойства-значения и передаем его в вызываемую ф-ию createRequest()
    createRequest({
      url: `${this.URL}/register`,
      method: 'POST',
      data: data,
      callback: (err, response) => {
        if (response.success) {
          console.log(response.user);
          User.setCurrent(response.user);
          //App.setState('user-logged');// можно и так сделать, тут задать, а не при нажатии на кнопку отправки формы регистрации в RegisterForm
        };
  
        callback(err, response);//вызываем колбек заданный при вызове
      }
    });
  };

  /*
  Производит выход из приложения. 
  После успешного выхода необходимо вызвать метод User.unsetCurrent
  */
  static logout(callback) {
    createRequest({
      url: `${this.URL}/logout`,
      method: 'POST',
      callback: (err, response) => {
        if (response.success) {
          User.unsetCurrent();
          //App.setState('init');
        };
  
        callback(err, response);
      }
    }); 
  };
};
