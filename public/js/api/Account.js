"use strict";

/*
let callback = (err, response) => {
  if (err) {
    console.log(err);
    console.error(err);
    alert("Ошибка при получении ответа с сервера");
    throw new Error("Ошибка при получении ответа с сервера");

  } else {
    console.log(response);
  };
};
*/

/*
let data = [
  {name: 'Банк', user_id: '1', id: '1', sum: -6800},
  {name: 'Магазин', user_id: '1', id: '2', sum: -3750},
  {name: 'Новый', user_id: '1', id: 'lw0z94ooktx7bhp9', sum: 0},
  {name: 'еее', user_id: '1', id: 'lw0z95qgktx7dduh', sum: 0}
]*/

/*
let data = {
  email: "demo@demo",
  password: "demo",
  name: "demo",
  id: "1",
  account_id: "1",
  sum: 5000,
  type: "expense",
  user_id: "1"
};

let user = {
  email: "demo@demo",
  password: "demo",
  name: "demo",
  id: "1",
  account_id: "1"
};


/*
Класс Account наследуется от Entity. Управляет счетами пользователя. 
Имеет свойство URL со значением '/account'
*/
class Account extends Entity {
  static URL = "/account";

// Получает информацию о счёте
  static get(id = '', callback) {
    let options = {
      url: `${this.URL}/${id}`,
      method: 'GET',
      callback: callback
    };

    //options.url = `${this.URL}/${id}`;

    //options.method = 'GET';

    //options.data = {};

    //options.callback = callback;
    
    createRequest(options);
  };

};

