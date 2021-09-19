/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */


const data = {
  email: 'demo@demo',
  password: 'demo'
};

callback = (err, response) => {
  if (err) {
    console.log(err);
  } else {
    console.log(response);
    console.log("успех");
  };
}


class Entity {
  static URL = "";

  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  
  static list(data, callback) {

    options.url = this.URL;

    options.data.email = data.email;

    options.data.password = data.password;

    options.method = 'GET';
    
    createRequest(options);

  };
  

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {

  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback ) {

  }
}
