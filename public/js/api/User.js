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
    /*
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
      } // нет (;) так как перечисление свойств идет
    });
    /*
    options.url = `${this.URL}/current`;

    options.method = 'GET';

    options.callback = (err, response) => {
      if (response.success && response.user !== undefined) {
        User.setCurrent(response.user);
      } else {
        User.unsetCurrent()
      };

      callback(err, response);
    };*/

    //createRequest(options); // вызываем ф-ию - делаем запрос на сервер с заданными параметрами
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
        if (response && response.user) {
          User.setCurrent(response.user);
          //App.setState('user-logged');
        }
        callback(err, response);
      }
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
          //App.setState('user-logged');
        };
  
        callback(err, response);
      } //! =//=
    });
  
    /*
    options.url = `${this.URL}/register`;

    options.method = 'POST';

    options.data = data;

    options.callback = (err, response) => {
      if (response.success) {
        console.log(response.user);
        User.setCurrent(response.user);
        //App.setState('user-logged');
      };

      callback(err, response);
    };

    createRequest(options);*/
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
  /*
    options.url = `${this.URL}/logout`;

    options.method = 'POST';

    options.callback = (err, response) => {
      if (response.success) {
        User.unsetCurrent();
        //App.setState('init'); //почему здеь его не установить?, а в Sidevar.js в initAuthLinks() прописывать?
      };

      callback(err, response);
    };

    createRequest(options);
  };*/
};
