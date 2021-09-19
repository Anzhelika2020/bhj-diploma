/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

 
const options = {
  url: "/user/login", 
  data: {
    email: 'demo@demo',
    password: 'demo'
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

const createRequest = options => {
  const xhr = new XMLHttpRequest();

  xhr.responseType = 'json';

  try {
    if (options.method === 'GET') {
      options.url = `${options.url}?email=${options.data.email}&password=${options.data.password}`;
  
      xhr.open(options.method, options.url);
      xhr.send();
  
    } else {
      const formData = new FormData;
  
      formData.append('email', options.data.email);
      formData.append('password', options.data.password);
  
      xhr.open(options.method, options.url);
      xhr.send(formData);
    }

    xhr.onload = () => options.callback(null, xhr.response);

  } catch (e) {
    // перехват сетевой ошибки
    xhr.onerror = () => options.callback(e);
  }
};
