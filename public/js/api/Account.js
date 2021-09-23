"use strict";

let callback = (err, response) => {
  if (err) {
    console.log(err);
  } else {
    console.log(response);
  };
}
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

let data3 = {
  email: "demodemo.ru",
  id: "lw0z95nkktsobpvh",
  name: "demo"
}
*/



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
