"use strict";

/*
Класс Account наследуется от Entity. Управляет счетами пользователя. 
Имеет свойство URL со значением '/account'
*/
class Account extends Entity {
  static URL = "/account";

/*
Получает информацию о счёте
Содержит 1 статический метод: Метод посылает GET запрос на адрес, заданный URL. Метод запускает функцию createRequest.
*/
  static get(id = '', callback) {
    let options = {
      url: `${this.URL}/${id}`,
      method: 'GET',
      callback: callback
    };

    createRequest(options);
  };

};

/*
/account:

Метод PUT - name - вернет success = true

Метод DELETE - id - вернет success = true

Метод GET - вернет данные по всем счетам и success = true

Метод GET - id - вернет данные по конкретному счету
*/

