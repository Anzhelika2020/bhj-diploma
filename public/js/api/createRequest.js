"use strict";
/*  
const options = {
  url: "/user/login", 
  data: {
    email: "demo@demo",
    password: "demo",
    name: "demo",
    id: "1",
    account_id: "1",
    sum: 5000,
    type: "expense",
    user_id: "1"
  }, 
  method: 'GET',
  callback: (err, response) => {
    if (err) {
    console.error(err);
    alert("Ошибка при получении ответа с сервера");
    throw new Error("Ошибка при получении ответа с сервера");

  } else {
    console.log(response);
  };
};
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
function callback (err, response) {
  if (err) {
    console.log(err);
    console.error(err);
    alert("Ошибка при получении ответа с сервера");
    throw new Error("Ошибка при получении ответа с сервера");

  } else {
    console.log(response);
  };
};

let options = {
  url: "", 
  data: {}, 
  method: "",
  callback: ""
};
*/
//Основная функция для совершения запросов на сервер.
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

 //первоначальный вариант:
  try {
    if (options.method === 'GET') {
      options.url = `${options.url}${getUrlRqstGET(options.data)}`;
      //console.log(options.url);

      //options.url = `${options.url}?email=${options.data.email}&password=${options.data.password}&account_id=${options.data.account_id}`;
  
      xhr.open(options.method, options.url);
      xhr.send();
  
    } else {
      const formData = new FormData;
      
      formData.append('email', options.data.email);
      formData.append('password', options.data.password);
      formData.append('name', options.data.name);
      formData.append('id', options.data.id);
      formData.append('account_id', options.data.account_id);
      formData.append('type', options.data. type);
      formData.append('sum', options.data.sum);
      formData.append('user_id', options.data.user_id);
  
      xhr.open(options.method, options.url);
      xhr.send(formData);
    }

    xhr.onload = () => options.callback(null, xhr.response);

  } catch (e) {
    // перехват сетевой ошибки
    xhr.onerror = () => options.callback(e);
  }

*/