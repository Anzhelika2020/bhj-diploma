"use strict";

const options = {
  url: "/user/login", 
  data: {
    email: "demo@demo",
    password: "demo",
    name: "demo",
    id: "1",
    account_id: "1"
  }, 
  method: 'POST',
  callback: (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
    };
  }
};

function getUrlRqstGET(data) {
  let url = "";
  for(let key in data) {
    let value = `${key}=${data[key]}`;
    url = `${url}&${value}`; 
  }
  url = Array.from(url);
  url[0] = "?"; 
  return url.join("");
}


//Основная функция для совершения запросов на сервер.
const createRequest = options => {
  const xhr = new XMLHttpRequest();

  xhr.responseType = 'json';

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
  
      xhr.open(options.method, options.url);
      xhr.send(formData);
    }

    xhr.onload = () => options.callback(null, xhr.response);

  } catch (e) {
    // перехват сетевой ошибки
    xhr.onerror = () => options.callback(e);
  }
};
