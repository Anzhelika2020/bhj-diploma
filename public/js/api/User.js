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
    if(localStorage.user) {
      return JSON.parse(localStorage.user);

    } else {
      return undefined;
    };
  };

  //Получает информацию о текущем авторизованном пользователе.
  static fetch(callback) {
    options.url = `${this.URL}/current`;

    options.method = 'GET';

    options.callback = (err, response) => {
      if (response.success && response.user !== undefined) {
        User.setCurrent(response.user);
      } else {
        User.unsetCurrent()
      };

      callback(err, response);
    };

    createRequest(options);
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
          this.setCurrent(response.user);
          App.setState('user-logged');
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
    options.url = `${this.URL}/register`;

    options.method = 'POST';

    options.data = data;

    options.callback = (err, response) => {
      if (response.success) {
        console.log(response.user);
        User.setCurrent(response.user);
        App.setState('user-logged');
      };

      callback(err, response);
    };

    createRequest(options);
  };

  /*
  Производит выход из приложения. 
  После успешного выхода необходимо вызвать метод User.unsetCurrent
  */
  static logout(callback) {
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
  };
};
