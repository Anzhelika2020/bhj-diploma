"use strict";
/*
функция для формировани URL для GET запроса через XMLHttpRequest(). 
Получает данные из объекта с элементами в виде ключ: значение
*/
function getUrlRqstGET(data) {
  let url = "";
  for(let key in data) {
    let value = `${key}=${data[key]}`;
    url = `${url}&${value}`; 
  }
  url = Array.from(url);
  url[0] = "?"; 
  return url.join("");
};

/*
Основная функция коорую будем использовать для совершения запросов на сервер.
options будет формироваться в зависимости от того что нужно запросить и передаваться при вызове функции.
options - это будет объект с данными в виде ключ: значение. 
Что-то в ключе (напр. URL) будет именно простое значение, 
что-то объектом с ключем data(данные пользователя/счета/транзакции let data = {...}), 
что-то функцией с ключом callback.
Этот колбек будет вызываться внутри нашей функции createRequest после полученния ответа с сервера. 
Если успешный ответ, то делаем с этими данными то, что нам нужно и что прописано в колбеке, если нет - выводим ошибку. 
Эти действия прописываем в колбеке каждый раз как собираемся вызвать createRequest и добавляем этот колбек в формируемый options. соответстенно потом вызываем createRequest, передаем в него options
*/
const createRequest = (options) => {
  const xhr = new XMLHttpRequest(); //содаем объект запроса

  xhr.responseType = 'json'; // задаем тип ответа

  if (options.method === 'GET') { //если запрос GET - формируем URL запроса:
    options.url = `${options.url}${getUrlRqstGET(options.data)}`; // к URL добавляем данные с помощю ф-ии getUrlRqstGET()
  };

  const formData = new FormData; // если запрос не GET, то создаем объект формы

  for(let key in options.data) {// пробегаемся по всему объекту и добавляем данные в объект формы
    formData.append(`${key}`, `${options.data[key]}`);
  };

  xhr.open(options.method, options.url);//инициализация зароса 

  options.method === 'GET' ? xhr.send() : xhr.send(formData);// отправка запроса в зависимости от применяемого метода

  xhr.onload = () => options.callback(null, xhr.response);// при успешной загрузке ответа вызов колбека с ответом

  xhr.onerror = () => options.callback(xhr.response.error);// при ошибке запроса вызов колбека с ошибкой
};

/*

//либо так?

  try {
  xhr.open(options.method, options.url);

  options.method === 'GET' ? xhr.send() : xhr.send(formData);

  xhr.onload = () => options.callback(null, xhr.response);

  } catch(e) {
    options.callback(e); // перехват сетевой ошибки
  };

 В блоке try/catch должен быть только “опасный код”. 
 У вас это дейсвтия open и send. Следовательно их и нужно оборачивать в try/catch. 
 Формирование строки запроса или формы не должны приводить к ошибкам. 
 Следовательно их можно вынести из try/catch.

 В блоке catch у вас ошибка уже произошла, а вы только подписываетесь на событие завершения ошибки…Вы либо сразу колбек вызывайте, либо на onerror подписывайтесь до перехвата ошибки.

*/