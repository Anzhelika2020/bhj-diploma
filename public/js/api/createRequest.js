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

const createRequest = (options) => {
  const xhr = new XMLHttpRequest();

  xhr.responseType = 'json';

  if (options.method === 'GET') {
    options.url = `${options.url}${getUrlRqstGET(options.data)}`;
  };

  const formData = new FormData;

  for(let key in options.data) {
    formData.append(`${key}`, `${options.data[key]}`);
  };

  xhr.open(options.method, options.url);

  options.method === 'GET' ? xhr.send() : xhr.send(formData);

  xhr.onload = () => options.callback(null, xhr.response);

  xhr.onerror = () => options.callback(xhr.response.error);
};