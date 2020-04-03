/* xhr.open(method, URL, async, user, password)
Этот метод – как правило, вызывается первым после создания объекта XMLHttpRequest.
Задаёт основные параметры запроса:
method – HTTP-метод. Как правило, используется GET либо POST, хотя доступны и более экзотические, вроде TRACE/DELETE/PUT и т.п.
URL – адрес запроса. Можно использовать не только http/https, но и другие протоколы, например ftp:// и file://.
При этом есть ограничения безопасности, называемые «Same Origin Policy»: запрос со страницы можно отправлять только на тот же протокол://домен:порт, с которого она пришла. В следующих главах мы рассмотрим, как их можно обойти.
async – если установлено в false, то запрос производится синхронно, если true – асинхронно. */
/* xhr.send([body])
Именно этод метод открывает соединение и отправляет запрос на сервер.
В body находится тело запроса. Не у всякого запроса есть тело, например у GET-запросов тела нет, а у POST – основные данные как раз передаются через body. */
// Вызов xhr.abort() прерывает выполнение запроса.
/* Основные свойства, содержащие ответ сервера:
status
HTTP-код ответа: 200, 404, 403 и так далее. Может быть также равен 0, если сервер не ответил или при запросе на другой домен.
statusText
Текстовое описание статуса от сервера: OK, Not Found, Forbidden и так далее.
responseText
Текст ответа сервера.
Есть и ещё одно свойство, которое используется гораздо реже:
responseXML
Если сервер вернул XML, снабдив его правильным заголовком Content-type: text/xml, то браузер создаст из него XML-документ. По нему можно будет делать запросы xhr.responseXml.querySelector("...") и другие.
Оно используется редко, так как обычно используют не XML, а JSON. То есть, сервер возвращает JSON в виде текста, который браузер превращает в объект вызовом JSON.parse(xhr.responseText). */
/* Для работы с HTTP-заголовками есть 3 метода:
setRequestHeader(name, value)
Устанавливает заголовок name запроса со значением value.
Например:
xhr.setRequestHeader('Content-Type', 'application/json');
Особенностью XMLHttpRequest является то, что отменить setRequestHeader невозможно.
Повторные вызовы лишь добавляют информацию к заголовку, например:
xhr.setRequestHeader('X-Auth', '123');
xhr.setRequestHeader('X-Auth', '456');
// в результате будет заголовок:
// X-Auth: 123, 456
getResponseHeader(name)
Возвращает значение заголовка ответа name, кроме Set-Cookie и Set-Cookie2.
Например:
xhr.getResponseHeader('Content-Type')
getAllResponseHeaders()
Возвращает все заголовки ответа, кроме Set-Cookie и Set-Cookie2.
Заголовки возвращаются в виде единой строки, например:
Cache-Control: max-age=31536000
Content-Length: 4260
Content-Type: image/png
Date: Sat, 08 Sep 2012 16:53:16 GMT
Между заголовками стоит перевод строки в два символа "\r\n" (не зависит от ОС), значение заголовка отделено двоеточием с пробелом ": ". Этот формат задан стандартом.
Таким образом, если хочется получить объект с парами заголовок-значение, то эту строку необходимо разбить и обработать. */
/* Максимальную продолжительность асинхронного запроса можно задать свойством timeout:
xhr.timeout = 30000; // 30 секунд (в миллисекундах)
При превышении этого времени запрос будет оборван и сгенерировано событие ontimeout:
xhr.ontimeout = function() {
  alert( 'Извините, запрос превысил максимальное время' );
}
Список событий:
loadstart – запрос начат.
progress – браузер получил очередной пакет данных, можно прочитать текущие полученные данные в responseText.
abort – запрос был отменён вызовом xhr.abort().
error – произошла ошибка.
load – запрос был успешно (без ошибок) завершён.
timeout – запрос был прекращён по таймауту.
loadend – запрос был завершён (успешно или неуспешно)
Используя эти события можно более удобно отслеживать загрузку (onload) и ошибку (onerror), а также количество загруженных данных (onprogress). */
/* var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
var xhr = new XHR(); //кросс-браузерный сопособ (XDomainRequest для IE8,9)

// 1. Создаём новый объект XMLHttpRequest
var xhr = new XMLHttpRequest();
// 2. Конфигурируем его: GET-запрос на URL 'phones.json'
xhr.open('GET', 'phones.json', false);
// 3. Отсылаем запрос
xhr.send();
// 4. Если код ответа сервера не 200, то это ошибка
xhr.onreadystatechange = function() {
  if (this.readyState != 4) return;
  // по окончании запроса доступны:
  // status, statusText
  // responseText, responseXML (при content-type: text/xml)
  if (this.status != 200) {
    // обработать ошибку
    alert( 'ошибка: ' + (this.status ? this.statusText : 'запрос не удался') );
    return;
  }
  // получить результат из this.responseText или this.responseXML
} */

/* <button onclick="loadPhones()" id="button">Загрузить phones.json!</button> */
/* function loadPhones() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'server/phones.json', true); //открываем запрос GET, асинхронный
  xhr.onreadystatechange = function() { //событие при ответе сервера
    if (xhr.readyState != 4) return;
    button.innerHTML = 'Готово!';
    if (xhr.status != 200) {
      // обработать ошибку
      alert(xhr.status + ': ' + xhr.statusText);
    } else {
      // вывести результат
      try {
        var phoneModels = JSON.parse(xhr.responseText); //формируем объект из json-строки ответа
      } catch(e) {
        console.log('Incorrect response' + e.message);
      }
      showPhones(phoneModels); //выводим список названий телефонов
    }
  }
    xhr.send();
    button.innerHTML = 'Загружаю...';
    button.disabled = true;
  }
  function showPhones(phones) {
    let ul = document.createElement('ul');
    let str = ``;
    for (const phone in phones) {
      str += `<li>${phones[phone].name}</li>`;
    }
    ul.innerHTML = str;
    document.body.appendChild(ul);
  } */
  /* Все современные браузеры умеют делать кросс-доменные XMLHttpRequest.
В IE8,9 для этого используется объект XDomainRequest, ограниченный по возможностям.
Кросс-доменный запрос всегда содержит заголовок Origin с доменом запроса.
Порядок выполнения:
Для запросов с «непростым» методом или особыми заголовками браузер делает предзапрос OPTIONS, указывая их в Access-Control-Request-Method и Access-Control-Request-Headers.
Браузер ожидает ответ со статусом 200, без тела, со списком разрешённых методов и заголовков в Access-Control-Allow-Method и Access-Control-Allow-Headers. Дополнительно можно указать Access-Control-Max-Age для кеширования предзапроса.
Браузер делает запрос и проверяет, есть ли в ответе Access-Control-Allow-Origin, равный * или Origin.
Для запросов с withCredentials может быть только Origin и дополнительно Access-Control-Allow-Credentials: true.
Если проверки пройдены, то вызывается xhr.onload, иначе xhr.onerror, без деталей ответа.
Дополнительно: названия нестандартных заголовков ответа сервер должен указать в Access-Control-Expose-Headers, если хочет, чтобы клиент мог их прочитать. */

/* Запрос XMLHttpRequest состоит из двух фаз:
Стадия закачки (upload). На ней данные загружаются на сервер. Эта фаза может быть долгой для POST-запросов. Для отслеживания прогресса на стадии закачки существует объект типа XMLHttpRequestUpload, доступный как xhr.upload и события на нём.
Стадия скачивания (download). После того, как данные загружены, браузер скачивает ответ с сервера. Если он большой, то это может занять существенное время. На этой стадии используется обработчик xhr.onprogress.
Стадия закачки
На стадии закачки для получения информации используем объект xhr.upload. У этого объекта нет методов, он только генерирует события в процессе закачки. А они-то как раз и нужны.
Вот полный список событий:
loadstart
progress
abort
error
load
timeout
loadend
Пример установки обработчиков на стадию закачки:
xhr.upload.onprogress = function(event) {
  alert( 'Загружено на сервер ' + event.loaded + ' байт из ' + event.total );
}
xhr.upload.onload = function() {
  alert( 'Данные полностью загружены на сервер!' );
}
xhr.upload.onerror = function() {
  alert( 'Произошла ошибка при загрузке данных на сервер!' );
}
Стадия скачивания
После того, как загрузка завершена, и сервер соизволит ответить на запрос, XMLHttpRequest начнёт скачивание ответа сервера.
На этой фазе xhr.upload уже не нужен, а в дело вступают обработчики событий на самом объекте xhr. В частности, событие xhr.onprogress содержит информацию о количестве принятых байт ответа.
Пример обработчика:
xhr.onprogress = function(event) {
  alert( 'Получено с сервера ' + event.loaded + ' байт из ' + event.total );
}
Все события, возникающие в этих обработчиках, имеют тип ProgressEvent, то есть имеют свойства loaded – количество уже пересланных данных в байтах и total – общее количество данных. */

/* Современный XMLHttpRequest позволяет отправить на сервер всё, что угодно. Текст, файл, форму.
Мы, для примера, рассмотрим загрузку файла с индикацией прогресса. Это требует от браузера поддержки File API, то есть исключает IE9-.
File API позволяет получить доступ к содержимому файла, который перенесён в браузер при помощи Drag’n’Drop или выбран в поле формы, и отправить его при помощи XMLHttpRequest.
Форма для выбора файла с обработчиком submit: */
/* var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');
var file = new static.Server('.', {
  cache: 0
});
function accept(req, res) {
  if (req.url == '/upload') {
    var length = 0;
    req.on('data', function(chunk) {
      // ничего не делаем с приходящими данными, просто считываем
      length += chunk.length;
      if (length > 50 * 1024 * 1024) {
        res.statusCode = 413;
        res.end("File too big");
      }
    }).on('end', function() {
      res.end('ok');
    });
  } else {
    file.serve(req, res);
  }
}
// ------ запустить сервер -------
if (!module.parent) {
  http.createServer(accept).listen(8080);
} else {
  exports.accept = accept;
} */
{/* <form name="upload">
  <input type="file" name="myfile">
  <input type="submit" value="Загрузить">
</form>
<div id="log">Прогресс загрузки</div> */}
/* function log(html) {
      document.getElementById('log').innerHTML = html;
    }
    document.forms.upload.onsubmit = function() {
      var file = this.elements.myfile.files[0];
      if (file) {
        upload(file);
      }
      return false;
    }
    function upload(file) {
      var xhr = new XMLHttpRequest();
      // обработчики можно объединить в один,
      // если status == 200, то это успех, иначе ошибка
      xhr.onload = xhr.onerror = function() {
        if (this.status == 200) {
          log("success");
        } else {
          log("error " + this.status);
        }
      };
      // обработчик для закачки
      xhr.upload.onprogress = function(event) {
        log(event.loaded + ' / ' + event.total);
      }
      xhr.open("POST", "upload", true);
      xhr.send(file);
    } */
/* Мы получаем файл из формы через свойство files элемента <input> и передаём его в функцию upload:
Этот код отправит файл на сервер и будет сообщать о прогрессе при его закачке (xhr.upload.onprogress), а также об окончании запроса (xhr.onload, xhr.onerror). */

/* Выше мы использовали xhr.send(file) для передачи файла непосредственно в теле запроса.
При этом посылается только содержимое файла.
Если нужно дополнительно передать имя файла или что-то ещё – это можно удобно сделать через форму, при помощи объекта FormData:
Создадим форму formData и прибавим к ней поле с файлом file и именем "myfile": */
/* var formData = new FormData();
formData.append("myfile", file);
xhr.send(formData); */
/* Данные будут отправлены в кодировке multipart/form-data. Серверный фреймворк увидит это как обычную форму с файлом, практически все серверные технологии имеют их встроенную поддержку. Индикация прогресса реализуется точно так же. */

// Алгоритм возобновляемой загрузки
/* var http = require('http');
var static = require('node-static');
var fileServer = new static.Server('.');
var path = require('path');
var fs = require('fs');
var uploads = {};
function onUpload(req, res) {
  var fileId = req.headers['x-file-id'];
  var startByte = req.headers['x-start-byte'];
  if (!fileId) {
    res.writeHead(400, "No file id");
    res.end();
  }
  // файлы будем записывать "в никуда"
  var filePath = '/dev/null';
  // можно положить файл и в реальное место
  // var filePath = path.join('/tmp', fileId);
  console.log("onUpload fileId: ", fileId);
  // инициализация новой загрузки
  if (!uploads[fileId]) uploads[fileId] = {};
  var upload = uploads[fileId];
  console.log("bytesReceived:" + upload.bytesReceived + " startByte:" + startByte)
  // если байт 0, то создать новый файл, иначе проверить размер и дописать
  if (startByte == 0) {
    upload.bytesReceived = 0;
    var fileStream = fs.createWriteStream(filePath, {
      flags: 'w'
    });
    console.log("New file created: " + filePath);
  } else {
    if (upload.bytesReceived != startByte) {
      res.writeHead(400, "Wrong start byte");
      res.end(upload.bytesReceived);
      return;
    }
    // добавляем в существующий файл
    fileStream = fs.createWriteStream(filePath, {
      flags: 'a'
    });
    console.log("File reopened: " + filePath);
  }
  req.on('data', function(data) {
    upload.bytesReceived += data.length;
  });
  // отправить тело запроса в файл
  req.pipe(fileStream);
  // в конце -- событие end
  fileStream.on('close', function() {
    if (upload.bytesReceived == req.headers['x-file-size']) {
      // полностью загрузили
      console.log("File finished");
      delete uploads[fileId];
      // при необходимости - обработать завершённую загрузку файла
      res.end("Success " + upload.bytesReceived);
    } else {
      // соединение оборвано, дескриптор закрылся но файл оставляем
      console.log("File unfinished, stopped at " + upload.bytesReceived);
      res.end();
    }
  });
  // при ошибках - завершение запроса
  fileStream.on('error', function(err) {
    console.log("fileStream error");
    res.writeHead(500, "File error");
    res.end();
  });
}
function onStatus(req, res) {
  var fileId = req.headers['x-file-id'];
  var upload = uploads[fileId];
  console.log("onStatus fileId:", fileId, " upload:", upload);
  if (!upload) {
    res.end("0")
  } else {
    res.end(String(upload.bytesReceived));
  }
}
function accept(req, res) {
  if (req.url == '/status') {
    onStatus(req, res);
  } else if (req.url == '/upload' && req.method == 'POST') {
    onUpload(req, res);
  } else {
    fileServer.serve(req, res);
  }
}
// -----------------------------------
if (!module.parent) {
  http.createServer(accept).listen(8080);
  console.log('Сервер запущен на порту 8080');
} else {
  exports.accept = accept;
} */
/* function Uploader(file, onSuccess, onFail, onProgress) {
  // fileId уникальным образом идентифицирует файл
  // можно добавить идентификатор сессии посетителя, но он и так будет в заголовках
  var fileId = file.name + '-' + file.size + '-' + +file.lastModifiedDate;
  // сделать из fileId число (хеш, алгоритм неважен), мы будем передавать его в заголовке,
  // в заголовках разрешены только ASCII-символы
  fileId = hashCode(fileId);
  var errorCount = 0;
  // если количество ошибок подряд превысит MAX_ERROR_COUNT, то стоп
  var MAX_ERROR_COUNT = 6;
  var startByte = 0;
  var xhrUpload;
  var xhrStatus;
  function upload() {
    console.log("upload: check status");
    xhrStatus = new XMLHttpRequest();
    xhrStatus.onload = xhrStatus.onerror = function() {
      if (this.status == 200) {
        startByte = +this.responseText || 0;
        console.log("upload: startByte=" + startByte);
        send();
        return;
      }
      // что-то не так
      if (errorCount++ < MAX_ERROR_COUNT) {
        setTimeout(upload, 1000 * errorCount); // через 1 сек пробуем ещё раз
      } else {
        onError(this.statusText);
      }
    };
    xhrStatus.open("GET", "status", true);
    xhrStatus.setRequestHeader('X-File-Id', fileId);
    xhrStatus.send();
  }
  function send() {
    xhrUpload = new XMLHttpRequest();
    xhrUpload.onload = xhrUpload.onerror = function() {
      console.log("upload end status:" + this.status + " text:" + this.statusText);
      if (this.status == 200) {
        // успешное завершение загрузки
        onSuccess();
        return;
      }
      // что-то не так
      if (errorCount++ < MAX_ERROR_COUNT) {
        setTimeout(resume, 1000 * errorCount); // через 1,2,4,8,16 сек пробуем ещё раз
      } else {
        onError(this.statusText);
      }
    };
    xhrUpload.open("POST", "upload", true);
    // какой файл догружаем /загружаем
    xhrUpload.setRequestHeader('X-File-Id', fileId);
    xhrUpload.upload.onprogress = function(e) {
      errorCount = 0;
      onProgress(startByte + e.loaded, startByte + e.total);
    }
    // отослать, начиная с байта startByte
    xhrUpload.send(file.slice(startByte));
  }
  function pause() {
    xhrStatus && xhrStatus.abort();
    xhrUpload && xhrUpload.abort();
  }
  this.upload = upload;
  this.pause = pause;
}
// вспомогательная функция: получение 32-битного числа из строки
function hashCode(str) {
  if (str.length == 0) return 0;
  var hash = 0,
    i, chr, len;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}; */
{/* <form name="upload" method="POST" enctype="multipart/form-data" action="/upload">
  <input type="file" name="myfile">
  <input type="submit" name="submit" value="Загрузить">
</form>
<button onclick="uploader.pause()">Пауза</button>
<div id="log">Индикация прогресса</div> */}
/* function log(html) {
  document.getElementById('log').innerHTML = html;
  //console.log(html);
}
function onSuccess() {
  log('success');
}
function onError() {
  log('error');
}
function onProgress(loaded, total) {
  log("progress " + loaded + ' / ' + total);
}
var uploader;
document.forms.upload.onsubmit = function() {
  var file = this.elements.myfile.files[0];
  if (!file) return false;
  uploader = new Uploader(file, onSuccess, onError, onProgress);
  uploader.upload();
  return false;
} */

// COMET, непрерывное получение данных с сервера
// Демо-чат
// Посылка запросов -- обычными XHR POST
/* function PublishForm(form, url) {
  function sendMessage(message) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    // просто отсылаю сообщение "как есть" без кодировки
    // если бы было много данных, то нужно было бы отослать JSON из объекта с ними
    // или закодировать их как-то иначе
    xhr.send(message);
  }
  form.onsubmit = function() {
    var message = form.message.value;
    if (message) {
      form.message.value = '';
      sendMessage(message);
    }
    return false;
  };
}
// Получение сообщений, COMET
function SubscribePane(elem, url) {
  function showMessage(message) {
    var messageElem = document.createElement('div');
    messageElem.appendChild(document.createTextNode(message));
    elem.appendChild(messageElem);
  }
  function subscribe() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;
      if (this.status == 200) {
        if (this.responseText) {
          // сервер может закрыть соединение без ответа при перезагрузке
          showMessage(this.responseText);
        }
        subscribe();
        return;
      }
      if (this.status != 502) {
        // 502 - прокси ждал слишком долго, надо пересоединиться, это не ошибка
        showMessage(this.statusText); // показать ошибку
      }
      setTimeout(subscribe, 1000); // попробовать ещё раз через 1 сек
    }
    xhr.open("GET", url, true);
    xhr.send();
  }
  subscribe();
} */
/* var http = require('http');
var url = require('url');
var querystring = require('querystring');
var static = require('node-static');
var fileServer = new static.Server('.');
var subscribers = {};
function onSubscribe(req, res) {
  var id = Math.random();
  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  subscribers[id] = res;
  //console.log("новый клиент " + id + ", клиентов:" + Object.keys(subscribers).length);
  req.on('close', function() {
    delete subscribers[id];
    //console.log("клиент "+id+" отсоединился, клиентов:" + Object.keys(subscribers).length);
  });
}
function publish(message) {
  //console.log("есть сообщение, клиентов:" + Object.keys(subscribers).length);
  for (var id in subscribers) {
    //console.log("отсылаю сообщение " + id);
    var res = subscribers[id];
    res.end(message);
  }
  subscribers = {};
}
function accept(req, res) {
  var urlParsed = url.parse(req.url, true);
  // новый клиент хочет получать сообщения
  if (urlParsed.pathname == '/subscribe') {
    onSubscribe(req, res); // собственно, подписка
    return;
  }
  // отправка сообщения
  if (urlParsed.pathname == '/publish' && req.method == 'POST') {
    // принять POST-запрос
    req.setEncoding('utf8');
    var message = '';
    req.on('data', function(chunk) {
      message += chunk;
    }).on('end', function() {
      publish(message); // собственно, отправка
      res.end("ok");
    });
    return;
  }
  // всё остальное -- статика
  fileServer.serve(req, res);
}
// -----------------------------------
if (!module.parent) {
  http.createServer(accept).listen(8080);
  console.log('Сервер запущен на порту 8080');
} else {
  exports.accept = accept;
  process.on('SIGINT', function() {
    for (var id in subscribers) {
      var res = subscribers[id];
      res.end();
    }
  });
} */
{/* <form name="publish">
  <input type="text" name="message" />
  <input type="submit" value="Отправить" />
</form>

<div id="subscribe">
</div> */}
/* new PublishForm(document.forms.publish, 'publish');
  // random url to fix https://code.google.com/p/chromium/issues/detail?id=46104
  new SubscribePane(document.getElementById('subscribe'), 'subscribe?random=' + Math.random()); */

// *******************************************************************************************************
// WebSocket**********************************************************************************************
// Для открытия соединения достаточно создать объект WebSocket, указав в нём специальный протокол ws.:
// var socket = new WebSocket("ws://javascript.ru/ws");
// У объекта socket есть четыре коллбэка: один при получении данных и три – при изменениях в состоянии соединения:
/* socket.onopen = function() {
  alert("Соединение установлено.");
};
socket.onclose = function(event) {
  if (event.wasClean) {
    alert('Соединение закрыто чисто');
  } else {
    alert('Обрыв соединения'); // например, "убит" процесс сервера
  }
  alert('Код: ' + event.code + ' причина: ' + event.reason);
};
socket.onmessage = function(event) {
  alert("Получены данные " + event.data);
};
socket.onerror = function(error) {
  alert("Ошибка " + error.message);
}; */
/* Для посылки данных используется метод socket.send(data). Пересылать можно любые данные.
Например, строку: */
// socket.send("Привет");
// …Или файл, выбранный в форме:
// socket.send(form.elements[0].file);
/* Просто, не правда ли? Выбираем, что переслать, и socket.send().
Для того, чтобы коммуникация была успешной, сервер должен поддерживать протокол WebSocket. */

// Демо чата на веб-советах
/* <!-- форма для отправки сообщений -->
<form name="publish">
  <input type="text" name="message">
  <input type="submit" value="Отправить">
</form>
<!-- здесь будут появляться входящие сообщения -->
<div id="subscribe"></div> */
/* Код на клиенте:
// создать подключение
var socket = new WebSocket("ws://localhost:8081");
// отправить сообщение из формы publish
document.forms.publish.onsubmit = function() {
  var outgoingMessage = this.message.value;
  socket.send(outgoingMessage);
  return false;
};
// обработчик входящих сообщений
socket.onmessage = function(event) {
  var incomingMessage = event.data;
  showMessage(incomingMessage);
};
// показать сообщение в div#subscribe
function showMessage(message) {
  var messageElem = document.createElement('div');
  messageElem.appendChild(document.createTextNode(message));
  document.getElementById('subscribe').appendChild(messageElem);
} */
// Серверный код можно писать на любой платформе. В нашем случае это будет Node.JS, с использованием модуля ws:
/* var WebSocketServer = new require('ws');
// подключенные клиенты
var clients = {};
// WebSocket-сервер на порту 8081
var webSocketServer = new WebSocketServer.Server({
  port: 8081
});
webSocketServer.on('connection', function(ws) {
  var id = Math.random();
  clients[id] = ws;
  console.log("новое соединение " + id);
  ws.on('message', function(message) {
    console.log('получено сообщение ' + message);
    for (var key in clients) {
      clients[key].send(message);
    }
  });
  ws.on('close', function() {
    console.log('соединение закрыто ' + id);
    delete clients[id];
  });
}); */

// Протокол JSONP***************************************************************
/* Если создать тег <script src>, то при добавлении в документ запустится процесс загрузки src. В ответ сервер может прислать скрипт, содержащий нужные данные.
Таким образом можно запрашивать данные с любого сервера, в любом браузере, без каких-либо разрешений и дополнительных проверок.
Протокол JSONP – это «надстройка» над таким способом коммуникации. Здесь мы рассмотрим его использование в деталях. */
/* var CallbackRegistry = {}; // реестр
// при успехе вызовет onSuccess, при ошибке onError
function scriptRequest(url, onSuccess, onError) {
  var scriptOk = false; // флаг, что вызов прошел успешно
  // сгенерировать имя JSONP-функции для запроса
  var callbackName = 'cb' + String(Math.random()).slice(-6);
  // укажем это имя в URL запроса
  url += ~url.indexOf('?') ? '&' : '?';
  url += 'callback=CallbackRegistry.' + callbackName;
  // ..и создадим саму функцию в реестре
  CallbackRegistry[callbackName] = function(data) {
    scriptOk = true; // обработчик вызвался, указать что всё ок
    delete CallbackRegistry[callbackName]; // можно очистить реестр
    onSuccess(data); // и вызвать onSuccess
  };
  // эта функция сработает при любом результате запроса
  // важно: при успешном результате - всегда после JSONP-обработчика
  function checkCallback() {
    if (scriptOk) return; // сработал обработчик?
    delete CallbackRegistry[callbackName];
    onError(url); // нет - вызвать onError
  }
  var script = document.createElement('script');
  // в старых IE поддерживается только событие, а не onload/onerror
  // в теории 'readyState=loaded' означает "скрипт загрузился",
  // а 'readyState=complete' -- "скрипт выполнился", но иногда
  // почему-то случается только одно из них, поэтому проверяем оба
  script.onreadystatechange = function() {
    if (this.readyState == 'complete' || this.readyState == 'loaded') {
      this.onreadystatechange = null;
      setTimeout(checkCallback, 0); // Вызвать checkCallback - после скрипта
    }
  }
  // события script.onload/onerror срабатывают всегда после выполнения скрипта
  script.onload = script.onerror = checkCallback;
  script.src = url;
  document.body.appendChild(script);
} */
/* function ok(data) {
  alert( "Загружен пользователь " + data.name );
}

function fail(url) {
  alert( 'Ошибка при запросе ' + url );
}
// Внимание! Ответы могут приходить в любой последовательности!
scriptRequest("user?id=123", ok, fail); // Загружен
scriptRequest("/badurl.js", ok, fail); // fail, 404
scriptRequest("/", ok, fail); // fail, 200 но некорректный скрипт */

// Fetch, замена XMLHttpRequest***************************************************************
// Синтаксис метода fetch:
// let promise = fetch(url[, options]);
/* url – URL, на который сделать запрос,
options – необязательный объект с настройками запроса.
Свойства options:
method – метод запроса,
headers – заголовки запроса (объект),
body – тело запроса: FormData, Blob, строка и т.п.
mode – одно из: «same-origin», «no-cors», «cors», указывает, в каком режиме кросс-доменности предполагается делать запрос.
credentials – одно из: «omit», «same-origin», «include», указывает, пересылать ли куки и заголовки авторизации вместе с запросом.
cache – одно из «default», «no-store», «reload», «no-cache», «force-cache», «only-if-cached», указывает, как кешировать запрос.
redirect – можно поставить «follow» для обычного поведения при коде 30x (следовать редиректу) или «error» для интерпретации редиректа как ошибки. */
/* При вызове fetch возвращает промис, который, когда получен ответ, выполняет коллбэки с объектом Response или с ошибкой, если запрос не удался.
Пример использования: */
/* 'use strict';
fetch('/article/fetch/user.json')
  .then(function(response) {
    alert(response.headers.get('Content-Type')); // application/json; charset=utf-8
    alert(response.status); // 200

    return response.json();
   })
  .then(function(user) {
    alert(user.name); // iliakan
  })
  .catch( alert ); */
/* Объект response кроме доступа к заголовкам headers, статусу status и некоторым другим полям ответа, даёт возможность прочитать его тело, в желаемом формате.
Варианты описаны в спецификации Body, они включают в себя:
response.arrayBuffer()
response.blob()
response.formData()
response.json()
response.text()
Соответствующий вызов возвращает промис, который, когда ответ будет получен, вызовет коллбэк с результатом.
В примере выше мы можем в первом .then проанализировать ответ и, если он нас устроит – вернуть промис с нужным форматом. Следующий .then уже будет содержать полный ответ сервера. */

//Async/Await************************************************************************
// Последовательное посылание запросов: послать запрос http://localhost:8090/products,
// подождать три секунды, послать следующий запрос http://localhost:8090/products/1
// Это применяется, когда следующему запросу требуется результат предыдущего.
/* async function getProducts() {
  let responseProducts = await fetch('http://localhost:8090/products');
  let products = await responseProducts.json(); // will not work without "await" word
  await new Promise((resolve, reject) => setTimeout(resolve, 3000)); // this works like Sleep(3000) in threads
  console.log(JSON.stringify(products, '', ' '));
  let responseFirstProduct = await fetch('http://localhost:8090/products/1');
  let firstProduct = await responseFirstProduct.json();
  console.log(JSON.stringify(firstProduct, '', ' '));
  return products;
}
getProducts(); */
// Параллельное выполнение запросов: запросы http://localhost:8090/products и http://localhost:8090/products/1 будут посланы в
// сервер параллельно в момент вызова Promise.all. В .then этого Promise.all попадем (судя по всему) когда оба запроса отработают.
// Там почему-то сделано так, что они возвращают тоже промисы, и надо повторить извлечение информации из них с помощью
// let jrp = await rp.json() и let jrp1 = await rp1.json();
// Это применяется, когда запросы не зависят друг от друга, и можно послать их одновременно
// Третий вариант (самый красивый, потому что без вложенностей, код ровный):
/* async function getProductsParallel3() {
  let p = fetch('http://localhost:8090/products');
  let p1 = fetch('http://localhost:8090/products/1');
  let [rp, rp1] = await Promise.all([p, p1]); // запросы ушли одновременно
  let [products, product1] = await Promise.all([rp.json(), rp1.json()]);
  console.log(JSON.stringify(products, '', ' '));
  console.log(JSON.stringify(product1, '', ' '));
}
getProductsParallel3(); */
