"use strict";

//Класс Entity - базовый для взаимодействия с сервером. Имеет свойство URL, равно пустой строке.
class Entity {
  static URL = "";

/*
Запрашивает с сервера список данных. Это могут быть счета или доходы/расходы 
(в зависимости от того, что наследуется от Entity)
*/
  static list(data, callback) {
    options.url = this.URL;

    options.data = data;

    options.method = 'GET';

    options.callback = callback;
    
    createRequest(options);
  };
  

  /*
  Создаёт счёт или доход/расход с помощью запроса на сервер. 
  (в зависимости от того, что наследуется от Entity)
  */
  static create(data, callback) {
    options.url = this.URL;

    options.data = data;
    //console.log(options.data.sum);
    //console.log(typeof options.data.sum);
    //console.log(options.data);

    options.method = 'PUT';

    options.callback = callback;
    
    createRequest(options);
  };

  /*
  Удаляет информацию о счёте или доходе/расходе 
  в зависимости от того, что наследуется от Entity)
  */
  static remove(data, callback ) {
    options.url = this.URL;

    options.data = data;

    options.method = 'DELETE';

    options.callback = callback;
    
    createRequest(options);
  };
};
