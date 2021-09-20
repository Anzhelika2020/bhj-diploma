"use strict";

/*
Класс Account наследуется от Entity. Управляет счетами пользователя. 
Имеет свойство URL со значением '/account'
*/
class Account extends Entity {
  static URL = "/account";

// Получает информацию о счёте
  static get(id = '', callback){
    options.url = `${this.URL}/${id}`;

    options.method = 'GET';

    options.callback = callback;
    
    createRequest(options);
  };

};
