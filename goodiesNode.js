// *************************************************************************************
// Модули, файловая система

// Некоторые базовые модули, такие как process и buffer, являются глобальными. Они доступны всегда и не требуют явного оператора require. 
// Это:
// buffer — используется для операций ввода-вывода (I/O) 
// (прежде всего, в файл и сеть) 
// stream — передача потоковых данных
// url — утилиты анализа URL
// Глобальные модули, которые надо подключать через require:
// assert — используется в проверочных целях для тестирования 
// child_process — функции для запуска внешних программ (Node и др.) 
// cluster — позволяет использовать несколько процессов для повышения производительности вашего приложения 
// crypto — встроенные криптографические библиотеки 
// dns — функции системы доменных имен (DNS) для преобразования сетевых имен 
// domain — позволяет группировать ввод-вывод и другие асинхронные операции для изоляции ошибок 
// events — утилиты для поддержки асинхронных событий 
// fs — операции файловой системы 
// http — сервер НТТР и связанные с ним утилиты 
// https — сервер НТТРS и связанные с ним утилиты 
// net — асинхронное сетевое API на базе сокетов 
// os — утилиты операционной системы 
// path — утилиты имен и путей файловой системы 
// querystring — утилиты для анализа и создания строк запросов URL 
// readline — интерактивные утилиты ввода-вывода; в первую очередь, для программ командной строки 
// smalloc — обеспечивает явное распределение памяти для буферов 
// string_decoder — преобразование буфера в строки 
// util — внутренние утилиты Node 
// zlib — утилита сжатия 

// работа с путями
const path = require('path');
console.log(path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb'));
console.log(path.resolve('/foo/bar', './baz'));
console.log(path.normalize('/foo/bar//baz/asdf/quux/..'));
console.log(path.normalize('C:\\temp\\\\foo\\bar\\..\\'));
console.log(path.parse('/home/user/dir/file.txt'));
console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..'));
console.log(path.sep); //если нужно вставить разделитель между путями
// работа с файлами
const fs = require('fs'); //модуль файловой системы
const path = require('path'); //модуль путей
/* удобный пакет для копирования, удаления, чтения и тп. - fs-extra */
const base = './test';
const readDir = (base, level) => {
  const files = fs.readdirSync(base); //читаем файлы и папки в директории 
  files.forEach((item) => {
    let localBase = path.join(base, item); //собирает несколько сегментов в один путь
    let state = fs.statSync(localBase); //возвращает статус файла (файл, папка)
    if (state.isDirectory()) { //если это папка
      console.log(' '.repeat(level) + 'DIR: ' + item); //выводим пробелы и имя папки (пробелы - уровни вложенности)
      readDir(localBase, level + 1); //читаем в ней файлы и увеличиваем уровень вложенности
    } else {
      console.log(' '.repeat(level) + 'File: ' + item);
    }
  })
}
readDir(base, 0);

fs.unlink('temp/test.txt', (err) => { //удаляем файл
  if (err) 
    console.log(err);
  fs.rmdir('temp', (err) => { //удаляем папку
    if (err) 
      console.log(err);
    console.log('Delete!');
  })
})

const fs = require('fs');
const path = require('path');
const file = 'test/test02.txt';
fs.readFile(file, (err, data) => {
  console.log(data.toString());
  if (!fs.existsSync('./temp')) { //если файл или папка не существует
    fs.mkdirSync('./temp') //то создаем 
  }
  fs.writeFile('temp/test.txt', data.toString() + ' ups', (err) => {
    console.log('Done!');
  })
})
// запаковка файла
const fs = require('fs');
const zlib = require('zlib');
const file = 'test.txt';
fs.readFile(file, (err, buffer) => {
  zlib.gzip(buffer, (err, buffer) => {
    fs.writeFile(file + '.gz', buffer, err => {
      console.log('Compressed!');
    })
  })
})
/* производит запаковку, только по частям */
const fs = require('fs');
const zlib = require('zlib');
const file = 'test.txt';
fs
  .createReadStream(file) //читает часть файла
  .pipe(zlib.createGzip()) //архивирует часть файла
  .on('end', () => {
    console.log('Read end');
  })
  .pipe(fs.createWriteStream(file + '.gz')) //пишет часть файла
  .on('close', () => {
    console.log('Closed');
	})
	
	process
  .stdin //процесс ввода в консоль
  .on('readable', () => { //событие считывания данных
    let chunk;
    while ((chunk = process.stdin.read()) !== null) {
      console.log(`Size: (${chunk.length}) - ${chunk.toString()}`);
    }
	})
	process
  .stdin
  .on('data', (chunk) => { //событие появления данных
    console.log(`Size: (${chunk.length}) - ${chunk.toString()}`);
	})
	
const stream = require('stream');
const Chance = require('chance'); //модуль для генерации lorem данных
const chance = new Chance();
class RandomStream extends stream.Readable {
  constructor(options) {
    super(options)
  }
  _read(size) {
    const chunk = chance.string();
    this.push(chunk, 'utf8');
    if (chance.bool({likelihood: 5})) {
      this.push(null)
    }
  }
}
const rs = new RandomStream();
rs.on('readable', () => {
  let chunk;
  while ((chunk = rs.read()) !== null) {
    console.log(`Size: (${chunk.length}) - ${chunk.toString()}`);
  }
})
// readStream
const stream = require('stream');
const fs = require('fs');
const path = require('path');
class ReadStream extends stream.Readable {
  constructor(file, options) {
    super(options);
    this.rr = fs.createReadStream(file); //создаем стрим
  }
  _read(size) {
    this
      .rr
      .on('data', (chunk) => { //событие на получение данных
        this.push(chunk.toString().toUpperCase()); //вставляем в стрим данные в верхнем регистре
      })
    this
      .rr
      .on('end', () => {
        this.push(null);
      })
  }
}
const rs = new ReadStream(path.join(__dirname, 'file.txt'));
rs.on('data', (chunk) => {
  console.log(`${chunk.toString()}`);
})
rs.on('end', (chunk) => {
  console.log(`----END----`);
})
// writeStream
const fs = require('fs');
const file = fs.createWriteStream('file-stream.txt');
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Последняя запись
        writer.write(data, encoding, callback);
      } else {
        // Здесь может быть DRAIN. (переполнение)
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Рано остановились, надо будет еще
      console.log('drain: ' + i);
      writer.once('drain', write);
    }
  }
}
writeOneMillionTimes(file, 'help', 'utf-8', () => {
  console.log('Done!');
})
const fs = require('fs');
const Chance = require('chance');
const chance = new Chance();
const file = fs.createWriteStream('file-stream.txt');
function generateCrazy() {
  while (chance.bool({likelihood: 95})) {
    const isOver = file.write(chance.string({
      length: 16 * 1024
    }));
    if (!isOver) {
      console.log('DRAIN!');
      return file.once('drain', generateCrazy);
    }
  }
  file.end(() => {
    console.log('End crazy text');
  })
}
generateCrazy()

const fs = require('fs');
const {Console} = require('console');
let output = fs.createWriteStream('./stdout.log');
let outerror = fs.createWriteStream('./stderr.log');
let console = new Console(output, outerror);
console.log('test message');
console.error('Error send');

const fromArray = require('from2-array');
const through = require('through2');
const fs = require('fs');
const path = require('path');

const _path = {
  src: './src/js',
  dist: './dist/js'
};

const files = ['first.js', 'second.js', 'third.js'].map(item => {
  return path.join(_path.src, item)
});
// соединяет файлы в один
function concatFiles(dest, files, callback) {
  const destStream = fs.createWriteStream(dest);
  fromArray
    .obj(files)
    .pipe(through.obj((file, enc, done) => {
      const src = fs.createReadStream(file);
      src.pipe(destStream, {end: false});
      src.on('error', err => {
        console.log(err.message);
        done();
      })
      src.on('end', done);
    }))
    .on('finish', () => {
      destStream.end();
      callback();
    })
}
concatFiles(path.join(_path.dist, 'main.js'), files, () => {
  console.log('Concat done!');
})

const fs = require('fs');
const split = require('split'); //разбивает текст на строки, каждая строка - отдельный кусок
const request = require('request');
const thP = require('through2-parallel');
const urlFile = process.argv[2] || 'urlList.txt'; //юрл адрес
fs
  .createReadStream(urlFile) //создаем стрим
  .pipe(split()) //разбиваем на строки
  .pipe(thP.obj({
    concurrency: 2
  }, function (url, enc, done) {
    if (!url) 
      return done();
    request(url, (err, response, body) => { //запрос на url
      this.push(`${url}  -  ${JSON.parse(body).special.course_alias} \n`); //пушим ответ в стрим
      done();
    })
  }))
  .pipe(fs.createWriteStream('result.txt')) //записываем результат в конечный файл
  .on('finish', () => {
    console.log('Done!');
  })
// копирует файлы в папке и ее подпапках в другую, разбивая по папкам по первоому символу в названии файла
const fs = require('fs'); //модуль файловой системы
const path = require('path'); //модуль путей
const mainDir = '../dz';
const dz2 = '../dz2';
const readDir = (base) => {
  const files = fs.readdirSync(base); //читаем файлы и папки в директории 
  makeDir(dz2);
  files.forEach((item) => {
    let localBase = path.join(base, item); //собирает несколько сегментов в один путь
    let state = fs.statSync(localBase); //возвращает статус файла (файл, папка)
    
    if (state.isDirectory()) { //если это папка
      let isEmpty = fs.readdirSync(localBase).length == 0;
      if(isEmpty) { //если есть пустые папки - удаляем
        deleteDir(localBase);
      }
      readDir(localBase); //читаем в ней файлы
    } else {
      makeDir(path.join(dz2, item[0].toLowerCase())); //создаем папку по первой букве файла
      const directories = fs.readdirSync(dz2);
      directories.forEach((directory) => {
        fs.readFile(localBase, (err, data) => {
          if(item[0].toLowerCase() == directory[0].toLowerCase()) {
            fs.writeFile(path.join(dz2, directory, item), data, (err) => {
              console.log('Done!');
              deleteFiles(localBase);

              let isEmpty = fs.readdirSync(path.join(localBase, '../')).length == 0;
              if(isEmpty) {
                deleteDir(path.join(localBase, '../'), mainDir);
              }
            });
          }
        });
      });
    }
  });
}
function makeDir(dir) {
  if (!fs.existsSync(dir)) { //если файл или папка не существует
    fs.mkdirSync(dir); //то создаем 
  }
}
function deleteFiles(file) {
  fs.unlinkSync(file, (err) => {
    if(err) {
      console.log(err);
    }
  });
}
function deleteDir(dir, mainDir) {
  let isEmpty;
  fs.rmdir(dir, (err) => { //удаляем папку
    if (err) console.log(err);
    
    if(fs.existsSync(mainDir)) 
      isEmpty = fs.readdirSync(mainDir).length == 0;
    if(isEmpty) {
      fs.rmdirSync(mainDir);
    }
  });
}
readDir(mainDir);
// // копирует файлы в папке и ее подпапках в другую, разбивая по папкам по первому символу в названии файла (с вотчером)
// watcher.js
class Watcher {
  constructor(onComplete) {
    this.onComplete = onComplete;
    this.process = [];
    this.allStarted = false;
  }
  startedAll() { //ставим флаг, что началось сканирование папок
    this.allStarted = true;
  }
  start(fileName) { //добавляем папку в  массив
    this
    .process
    .push(fileName);
    console.log(this.process);
  }
  end(fileName) { //удаляем папку из массива
    let index = this
    .process
    .findIndex(item => {
      return item === fileName;
    });
    this
    .process
    .splice(index, 1);
    this._checkForComplete();
  }
  _checkForComplete() { //проверка на вызов колбэка
    if (this.allStarted && this.process.length === 0) {
      this.onComplete();
    }
  }
}
module.exports = Watcher;
// index.js
const fs = require('fs');
const path = require('path');
const del = require('del');
const Watcher = require('./watcher');
// path
// если в консоль не введены названия папок и флаг на удаление изначальной папки, то берем по умолчанию
const inputDir = (process.argv[2]) ? (process.argv[2]) : path.join(__dirname, 'input'); 
const outputDir = (process.argv[3]) ? (process.argv[3]) : path.join(__dirname, 'output');
const isDelete = (process.argv[4]) ? (process.argv[4]) : false;
const watcher = new Watcher(() => { //передаем колбэк в вотчер
  if (isDelete) { //если тру, то удаляем изначальную папку
    del(inputDir).then(() => {
      console.log('Input folder delete');
    })
  }
});
function begin() {
  if (!fs.existsSync(outputDir)) {
    del(outputDir)
  }
}
function readFromDir(i) {
  watcher.start(i); //добавляем папку в массив
  fs.readdir(i, (err, files) => {
    if (err) throw Error(err);
    files.forEach((item)=> {
      const localPath = path.join(i, item);
      if (fs.statSync(localPath).isDirectory()) { //если папка - читаем дальше
        readFromDir(localPath)
      } else { //если файл - копируем
        copyFile(item, localPath)
      }
    })
  });
  watcher.end(i); //удаляем папку из массива и проверяем не пришло ли время вызвать колбэк
}
function copyFile(file, filePath) { //копируем файл
  const firtsLetter = file.charAt(0).toLowerCase();
  const dir = path.join(outputDir, firtsLetter);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir) //создаем папку по первой букве файла
  }
  fs.writeFileSync(path.join(dir, file), fs.readFileSync(filePath)); //пишем файл
}

if (!fs.existsSync(inputDir)) { //если нет папки input, то выводим ошибку
  console.log('Error! ', inputDir, ' is not a folder!');
} else {
  if (!fs.existsSync(outputDir)) { //если нет папки output, то создаем
    fs.mkdirSync(outputDir)
  }
  readFromDir(inputDir); //читаем папку input
  watcher.startedAll(); //включаем флаг у вотчера
}

// *************************************************************************************
// Асинхронность
// очередность выполнения кода
const fs = require('fs');
console.log('Начало работы'); //выполнится первым
setTimeout(() => { //выполнится шестым
  console.log('setTimeout happened');
}, 0);
fs.open(__filename, 'r', (err, fd) => { //выполнится последним
  console.log('file reading!');
});
setImmediate(() => { //выполнится седьмым, на следующем цикле события
  console.log('immediate happened');
});
new Promise(resolve => { //выполнится четвертым
  resolve('promise happened');
}).then(console.log);
Promise.resolve('resolved promise happened').then(console.log); //выполнится пятым
process.nextTick(() => { //выполнится третьим, раньше setImmediate, выполняется в конце текущего цикла события
  console.log('nextTick happened');
});
console.log('Конец файла'); //выполнится вторым
// eventEmitter - // example1.js
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
// once - выполнить событие 1 раз
myEmitter.once('newListener', (event, listener) => { //newListener - поставить обработчик на событие добавления обработчика, в итоге B будет выведено раньше A
  if (event === 'event') {
    // Insert a new listener in front
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => { //on - установка события
  console.log('A');
});
myEmitter.emit('event'); //вызов события // Prints:   B   A
// example2.js
const EventEmitter = require('events');
const fs = require('fs');
class MyEmitter extends EventEmitter {};
const me = new MyEmitter();
me.on('read', (err, data) => { //на событие чтения вешаем обработчик
  me.emit('write', data); //вызываем событие записи
})
me.on('write', (data) => { //на событие записи вешаем обработчик
  fs.writeFile('test.txt', data, (err) => { //пишем файл
    console.log('Write');
  })
})
fs.readFile('data.txt', 'utf-8', (err, data) => { //читаем файл
  me.emit('read', err, data); //вызываем событие чтения
})
// example3.js, myee.js
class MyEventEmitter {
  constructor() {
    this.events = {}
  }
  on(type, listener) {
    this.events[type] = this.events[type] || []; //если есть такое событие то просто переприсваиваем его, если нет то присваиваем пустой массив
    this
      .events[type]
      .push(listener);
  }
  emit(type) {
    if (this.events[type]) { //если есть обработчик с таким типом
      const arg = []
        .slice
        .call(arguments, 1); //собираем аргументы, помимо type, в массив
      this
        .events[type]
        .forEach(listener => {
          listener.apply(this, arg); //для каждого обработчика с таким типом вызываем функцию с переданным массивом аргументов
        });
    }
  }
}
module.exports = MyEventEmitter; //экспортируем 

const MyEmitter = require('./myee');
const fs = require('fs');
const me = new MyEmitter();
me.on('read', (err, data) => {
  me.emit('write', data);
})
me.on('write', (data) => {
  fs.writeFile('test.txt', data, (err) => {
    console.log('Write');
  })
})
fs.readFile('data.txt', 'utf-8', (err, data) => {
  me.emit('read', err, data);
})
// библиотека async
// parallel
const request = require('request');
const async = require('async');
const url = ['https://loftschool.com/api/v1/courses/streams/1', 'https://loftschool.com/api/v1/courses/streams/2', 'https://loftschool.com/api/v1/courses/streams/3']
async.parallel(url.map(item => { //параллельное выполнение, принимает массив функций
  return function (cb) {
    request(item, (err, response, body) => {
      cb(err, `${item}  -  ${JSON.parse(body).special.course_alias} \n`);
    })
  }
}), function (err, results) {
  console.log(results);
});
// waterfall
const fs = require('fs');
const async = require('async'); //библиотека из package.json
try {
  async
    .waterfall([ //типа промисов, выполнение идет асинхронно, друг за другом
      function (cb) {
        fs.readFile('data.json', 'utf8', (err, data) => { //читаем файл
          cb(err, data); //передаем в следующую функцию
        })
      },
      function (data, cb) {
        let result = JSON.parse(data); //парсим в объект
        result.test = result.test + 10; 
        cb(null, result) //передаем в следующую функцию
      },
      function (arg, cb) {
        fs.writeFile('data.json', JSON.stringify(arg), err => { //пишем в файл
          cb(err, 'done'); //передаем дальше строку 'done'
        })
      }
    ], function (err, result) { //выводим ошибку или done
      console.log(err);
      console.log('result: ' + result);
    });
} catch (err) {
  console.log(err);
}
// библиотека mz
const fs = require('mz/fs'); //модуль, создающий из обычных функций асинхронные (возвращают промис), мы берем только часть модуля - fs, есть и другие
fs
  .readFile('data.json', 'utf8')
  .then(data => {
    let result = JSON.parse(data);
    result.test = result.test + 10;
    return result;
  })
  .then(data => {
    return fs.writeFile('data.json', JSON.stringify(data))
  })
  .then(() => {
    console.log('Done');
  })
  .catch(err => {
    console.log(err);
	})
// promisify
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile); //промисифицируем функции, теперь они возвращают промис
const writeFile = util.promisify(fs.writeFile);
readFile('data.json', 'utf8').then(data => {
  let result = JSON.parse(data);
  result.test = result.test + 10;
  return result;
}).then(data => {
  return writeFile('data.json', JSON.stringify(data))
}).then(() => {
  console.log('Done');
}).catch(err => {
  console.log(err);
})
// promise.all
const util = require('util');
const _request = require('request');
const request = util.promisify(_request);
const url = ['https://loftschool.com/api/v1/courses/streams/1', 'https://loftschool.com/api/v1/courses/streams/3', 'https://loftschool.com/api/v1/courses/streams/21']
const p = url.map(link => { //получает массив промисов в стадии ожидания(pending)
  return request(link);
});
Promise
  .all(p) //возвращает промис, который выполнится тогда, когда выполнятся переданные промисы или отклонен любой из них
  .then((result) => { //сработает если все промисы загрузятся
    result.forEach((item, i) => {
      console.log(`${i} : ${JSON.parse(item.body).special.course_alias}`);
    })
  })
  .catch(console.log) //если при загрузке хотя бы одного произойдет ошибка
// promise race
const util = require('util');
const _request = require('request');
const request = util.promisify(_request);
const url = ['https://loftschool.com/api/v1/courses/streams/1', 'https://loftschool.com/api/v1/courses/streams/2', 'https://loftschool.com/api/v1/courses/streams/21']
const p = url.map(item => {
  return request(item);
});
Promise
  .race(p) //возвращает первый resolve или reject
  .then((result) => {
    console.log(`${JSON.parse(result.body).special.course_alias}`);
  })
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
// promise.all full
const util = require('util');
const _request = require('request');
const request = util.promisify(_request);
const url = Array.from({ //получается массив length = 25
  length: 25
}, (_, i) => 'https://loftschool.com/api/v1/courses/streams/' + i);
const p = url.map(item => {
  return request(item);
});
Promise
  .all(p.map(item => item.catch(err => err))) //на каждый промис вешаем обработку ошибок(ошибка уходит в пустоту), чтобы весь Promise.all не вывалился с ошибкой 
  .then((result) => {
    result.forEach((item, i) => {
      try {
        console.log(`${i} : ${JSON.parse(item.body).special.course_alias}`);
      } catch (e) {}
    })
  })
  .catch(console.log);
process.on('unhandledRejection', (reason, p) => { //если мы чтото не учли, то данное событие сообщит об этом
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
// generators
function * testGenerator() { //функция генератор
  yield 'Yura'; //означает, что планируется еще заход в данную функцию
  yield 'Egor';
  return 'Vova';
}
const myGenerator = testGenerator();
console.log(myGenerator.next());
console.log(myGenerator.next());
console.log(myGenerator.next()); //{Vova, done: true}
console.log(myGenerator.next()); //{undefined, done: true}

function * testGenerator(arr) {
  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
  }
}
const myGenerator = testGenerator(['Yura', 'Vova', 'Lexa']);
let item = myGenerator.next();
while (!item.done) {
  console.log(item.value);
  item = myGenerator.next();
}

function * testGenerator(i) {
  const test = yield 'Yura: ' + i; //в test возвращается 'Молодец'
  const test2 = yield 'Egor ' + test; //в test2 возвращается Тоже молодец
  return 'Vova ' + test2;
}
const myGenerator = testGenerator('Init');
console.log(myGenerator.next()); //Yura init
console.log(myGenerator.next('Молодец!')); //Egor молодец
console.log(myGenerator.next('Тоже молодец!')); //Vova Тоже молодец!
// асинхронные операции на генераторах
const fs = require('fs');
function asyncFlow(generatorFunc) {
  function cb(err) { //будет отрабатывать для readFile и writeFile
    if (err) {
      return generator.throw(err);
    }
    const results = []
      .slice
      .call(arguments, 1);
    let temp = generator.next(results.length > 1
      ? results
      : results[0]);
    console.log(temp);
  }
  const generator = generatorFunc(cb);
  let temp = generator.next();
  console.log(temp);
}
asyncFlow(function * (cb) {
  const filePath = './src/test.txt';
  const file = yield fs.readFile(filePath, 'utf8', cb); //колбэк выполняется с readFile
  yield fs.writeFile('dist/new.txt', file, cb); //и writeFile
})
// асинхронные операции на генераторах
const fs = require('fs');
function readFileThunk(filename, options) {
  return function (cb) {
    fs.readFile(filename, options, cb)
  }
}
function writeFileThunk(filename, buffer) {
  return function (cb) {
    fs.writeFile(filename, buffer, cb)
  }
}
function asyncFlow(generatorFunc) {
  function cb(err) {
    if (err) {
      return generator.throw(err);
    }
    const results = []
      .slice
      .call(arguments, 1);
    let thunk = generator
      .next(results.length > 1
      ? results
      : results[0])
      .value;
    thunk && thunk(cb); //если это функция, то вызываем ее с колбэком
  }
  const generator = generatorFunc(cb);
  let thunk = generator
    .next()
    .value; //функция, которая возвращается в readFileThunk или writeFileThunk
  // (typeof thunk === 'function') ? thunk(cb) : void 0;
  thunk && thunk(cb); //если это функция, то вызываем ее с колбэком
}
asyncFlow(function * (cb) {
  const filePath = './src/test.txt';
  const file = yield readFileThunk(filePath, 'utf8'); //подставится функция которая принимает колбэк
  yield writeFileThunk('dist/new.txt', file); //подставится функция которая принимает колбэк
})
// async/await
const request = require('request');
const url = ['https://loftschool.com/api/v1/courses/streams/1', 'https://loftschool.com/api/v1/courses/streams/2', 'https://loftschool.com/api/v1/courses/streams/3']
function getNameCourse(url) { //функция возвращает промис, async не работает с функциями, которые возвращают не промис!
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) 
        reject(err);
      resolve(JSON.parse(body).special.course_alias);
    })
  })
}
const main = async() => {
  for (let i = 0; i < url.length; i++) {
    try {
      let result = await getNameCourse(url[i]); //await - приостанавливает выполнение и ждет пока промис разрезолвится. в result будет resolve(JSON.parse(body).special.course_alias);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
}
main();
// await stream
const fs = require('fs');
const readStream = (stream) => {
  let resolve,
    	reject;
  stream.on('data', data => resolve(data));
  stream.on('error', err => reject(err));
  stream.on('end', () => resolve());
  return function () {
    return new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    })
  }
}
async function read() {
  let stream = fs.createReadStream('01-example.js', {
    highWaterMark: 80, //буфер 80 байт
    encoding: 'utf8'
  });
  let reader = readStream(stream);
  let data = await reader();
  while (data) {
    // await new Promise((resolve, reject) => setTimeout(resolve, 500)); //выведет только часть файла (80 байт), потому что стриму пофигу что мы ждем, он все данные прочитал
    console.log(data);
    data = await reader();
  }
}
read()
// обход ошибки из предыдущего примера
const fs = require('fs');
const readStream = (stream) => {
  return function () {
    return new Promise((resolve, reject) => {
      stream.on('data', ondata);
      stream.on('error', onerror);
      stream.on('end', onend);
      stream.resume();
      function ondata(chunk) { //ставим стрим на паузу, чистим обработчики
        stream.pause();
        clearListener();
        resolve(chunk); //отдаем данные в промис
      }
      function onerror(err) {
        clearListener();
        reject(err);
      }
      function onend() {
        clearListener()
        resolve();
      }
      function clearListener() {
        stream.removeListener('data', ondata);
        stream.removeListener('error', onerror);
        stream.removeListener('end', onend);
      }
    })
  }
}
async function read() {
  let stream = fs.createReadStream('01-example.js', {
    highWaterMark: 80,
    encoding: 'utf8'
  });
  let reader = readStream(stream);
  let data = await reader();
  while (data) {
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    console.log(data);
    data = await reader();
  }
}
read()

// *************************************************************************************
// Express.js
// Пути маршрутов
// Строки
app.get('/about', function (req, res) {
  res.send('about');
});
// Шаблоны строк
app.get('/ab?cd', function(req, res) {
  res.send('ab?cd');
});
// Регулярные выражения
app.get(/a/, function(req, res) {
  res.send('/a/');
});

// Методы ответа сервера
res.download()	//Приглашение загрузки файла.
res.end()	//Завершение процесса ответа.
res.json()	//Отправка ответа JSON.
res.jsonp()	//Отправка ответа JSON с поддержкой JSONP.
res.redirect()	//Перенаправление ответа.
res.render()	//Вывод шаблона представления.
res.send()	//Отправка ответа различных типов.
res.sendFile	//Отправка файла в виде потока октетов.
res.sendStatus()	//Установка кода состояния ответа и отправка представления в виде строки в качестве тела ответа.

// npm i -g nodemon - пакет который следит за окружением и если чтото меняется он перезагружает сервер (типа browserSync)
var express = require('express');
var app = express();
app.all('/', function (req, res, next) {
  console.log('Я выполнюсь для любого запроса и передам запрос дальше по очереди ...');
  next(); // передать следующему обработчику
});
app.get('/', function (req, res) {
  res.send('Отправил данные');
});
app.get('/:id', function (req, res) {
  let id = req.params.id;
  res.send('Отправил данные с параметра: ' + id);
});
app.post('/', function (req, res) {
  res.send('Получил POST запрос');
});
app.put('/', function (req, res) {
  res.send('Получил PUT запрос');
});
app.patch('/', function (req, res) {
  res.send('Получил PATCH запрос');
});
app.delete('/', function (req, res) {
  res.send('Получил DELETE запрос');
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// роуты
// app.js
const express = require('express');
const path = require('path');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views')); //путь до папки с шаблонами
app.set('view engine', 'pug'); //движок шаблонов
app.use(express.static(path.join(__dirname, 'public'))); //папка для статики (css, js)
app.use('/', require('./routes/index'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});
const server = app.listen(process.env.PORT || 3000, function() {
  console.log('Сервер запущен на порте: ' + server.address().port);
});
// routes/index.js
const express = require('express');
const router = express.Router();
//контроллеры
const ctrlHome = require('../controllers/index');
const ctrlAbout = require('../controllers/about');
const ctrlContact = require('../controllers/contact');
router.get('/', ctrlHome.getIndex);
router.post('/', ctrlHome.sendData);
router.get('/about', ctrlAbout.getAbout);
router.get('/contact', ctrlContact.getContact);
module.exports = router;
// controllers/index.js
module.exports.getIndex = function (req, res) {
  res.render('pages/index', { title: 'Main' }); //путь относительно папки с шаблонами (views)
}
module.exports.sendData = function (req, res) {
  res.json({ title: 'Main' });
}
// controllers/about.js
module.exports.getAbout = function (req, res) {
  res.render('pages/about', { title: 'About' }); //title: 'About' подставится в шаблон about.html
}
// controllers/contsct.js
module.exports.getContact = function (req, res) {
  res.render('pages/contact', { title: 'Contact' });
}
// upload
// app.js
const express = require('express');
const path = require('path');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
})
// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});
const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port ' + server.address().port);
});
// models/db.js
const nconf = require('nconf'); //простая json db
const path = require('path');
module.exports = function () {
  return nconf
    .argv()
    .env()
    .file({file: path.join(__dirname, 'my-db.json')}); //указываем в каком файле хранить бд
}
// routes/index.js
const express = require('express');
const router = express.Router();
const formidable = require('formidable'); //модуль для загрузки файлов
const fs = require('fs');
const path = require('path');
const db = require('../models/db')();
router.get('/', (req, res, next) => {
  // если есть msg, pic то выводим их в шаблоне pages/index
  res.render('pages/index', {title: 'My upload', msg: req.query.msg, pic: db.stores.file.store});
})
router.post('/', (req, res, next) => {
  let form = new formidable.IncomingForm();
  let upload = path.join('./public', 'upload');
  let fileName;
  if (!fs.existsSync(upload)) { //создаем папку public/upload, если ее нет
    fs.mkdirSync(upload);
  }
  form.uploadDir = path.join(process.cwd(), upload);
  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err);
    }
    // photo взялось из index.pug (input name="photo")
    if (files.photo.name === '' || files.photo.size === 0) {
      fs.unlink(files.photo.path);
      return res.redirect('/?msg=Не загружена картинка!');
    }
    if (!fields.name) {
      fs.unlink(files.photo.path);
      return res.redirect('/?msg=Не указано описание картинки!');
    }
    fileName = path.join(upload, files.photo.name);
    fs.rename(files.photo.path, fileName, function (err) { //переименовываем временный файл (все файлы изначально сохраняются во временную папку с временным именем)
      if (err) {
        console.error(err); //при ошибке удаляем файл и перезаписываем его
        fs.unlink(fileName);
        fs.rename(files.photo.path, fileName);
      }
      let dir = fileName.substr(fileName.indexOf('\\'));
      db.set(fields.name, dir);
      db.save(); //сохраняем в бд
      res.redirect('/?msg=Картинка успешно загружена');
    })
  })
});
module.exports = router;
// middleware
var app = require('express')();
app.use(function (req, res, next) {
  console.log('Я буду выполнятся всегда');
  next();
});
app.get('/a', function (req, res) {
  console.log('/a: Роут прерван');
  res.send('a'); //отправка ответа клиенту, соединение закрывается и дальнейшая отправка не идет
});
app.get('/a', function (req, res) {
  console.log('/a: Этот роут никогда не вызовется');
});
app.get('/b', function (req, res, next) {
  console.log('/b: Роут не был прерван');
  next();
});
app.use(function (req, res, next) {
  console.log('А я выполняюсь иногда, если сверху не прервут');
  next();
});
app.get('/b', function (req, res, next) {
  console.log('/b (part 2): Я вызвал ошибку!');
  throw new Error('Ошибка в роуте - b');
});
app.use('/b', function (err, req, res, next) {
  console.log('/b Ошибка обнаружена и передана дальше');
  next(err);
});
app.get('/c', function (err, req) {
  console.log('/c: Я вызвал ошибку');
  throw new Error('Ошибка в роуте - c');
});
app.use('/c', function (err, req, res, next) {
  console.log('/c: Ошибка обнаружена и НЕ передана дальше');
  next();
});
app.use(function (err, req, res, next) {
  console.log('Не обработанная ошибка обнаружена!: ' + err.message);
  res.send('500 - ошибка сервере');
});
app.use(function (req, res) {
  console.log('Роут не обработан');
  res.send('404 - страница не найдена');
});
app.listen(3000, function () {
  console.log('Сервер на порту: 3000');
});
// sendMail
// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/index'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});
const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port ' + server.address().port);
});
// routes/index.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const config = require('../config.json');
router.get('/', (req, res, next) => {
  res.render('pages/index', { title: 'My email' });
});
router.post('/', (req, res, next) => {
  //требуем наличия имени, обратной почты и текста
  if (!req.body.name || !req.body.email || !req.body.text) {
    //если что-либо не указано - сообщаем об этом
    return res.json({msg:'Все поля нужно заполнить!', status: 'Error'});
  }
  //инициализируем модуль для отправки писем и указываем данные из конфига
  const transporter = nodemailer.createTransport(config.mail.smtp);
  const mailOptions = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.text.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  };
  //отправляем почту
  transporter.sendMail(mailOptions, function(error, info) {
    //если есть ошибки при отправке - сообщаем об этом
    if (error) {
      return res.json({msg:`При отправке письма произошла ошибка!: ${error}`, status: 'Error'});
    }
    res.json({msg:'Письмо успешно отправлено!', status: 'Ok'});
  });
});
module.exports = router;
// session
// app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'loftschool',
  key: 'key',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  saveUninitialized: false,
  resave: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.all('/', function (req, res, next) {
  console.log(req.session.id);
  req.session.views = req.session.views === void 0
    ? 0
    : req.session.views;
  req.session.views++;
  next();
})
app.use('/', require('./routes/index'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});
const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port ' + server.address().port);
});
// routes/index.js
const express = require('express');
const router = express.Router();
const isAdmin = (req, res, next) => {
  // если в сессии текущего пользователя есть пометка о том, что он является
  // администратором
  if (req.session.isAdmin) {
    // то всё хорошо :)
    return next();
  }
  // если нет, то перебросить пользователя на главную страницу сайта
  res.redirect('/');
};
router.get('/', (req, res, next) => {
  res.render('pages/index', { title: 'My session', views: req.session.views});
});
router.post('/', (req, res, next) => {
  req.session.isAdmin = true;
  res.redirect('/secret');
});
router.get('/secret', isAdmin, (req, res, next) => {
  res.render('pages/secret');
});
module.exports = router;
// logs
// app.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan'); //модуль для логирования
const favicon = require('serve-favicon');
const app = express();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
const log = fs.createWriteStream('mylog.log', {flags: 'a'}); //записываем в файл инфу о винде и браузере...
app.use(morgan('combined', {stream: log})); // combined (production) short tiny dev
app.use('/', require('./routes/index'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});
const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Сервер запущен на порте: ' + server.address().port);
});
// routes/index.js
const express = require('express');
const router = express.Router();
const ctrlHome = require('../controllers/index');
const ctrlAbout = require('../controllers/about');
const ctrlContact = require('../controllers/contact');
router.get('/', ctrlHome.getIndex);
router.post('/', ctrlHome.sendData);
router.get('/about', ctrlAbout.getAbout);
router.get('/contact', ctrlContact.getContact);
module.exports = router;
// controllers/index.js
module.exports.getIndex = function (req, res) {
  res.render('pages/index', { title: 'Main' });
}
module.exports.sendData = function (req, res) {
  res.json({ title: 'Main' });
}
// controllers/about.js
module.exports.getAbout = function (req, res) {
  res.render('pages/about', { title: 'About' });
}
// controllers/contsct.js
module.exports.getContact = function (req, res) {
  res.render('pages/contact', { title: 'Contact' });
}

// *************************************************************************************
// REST API
// *************************************************************************************
// Когда использовать REST
// Когда есть ограничение пропускной способности соединения
// Если необходимо кэшировать запросы
// Если система предполагает значительное масштабирование
// В сервисах, использующих AJAX

// Критерии REST
// Клиент-сервер (Client-Server)
// Отсутствие состояний (Stateless)
// Кеширование ответа (Cacheable)
// Единый интерфейс (Uniform Interface)
// Многоуровневая система (Layered System)
// "Код по требованию" (Code on Demand - опционально)

// Формирование URI:
// Это не REST
// /api/users/do_some
// /api/users/13?action=delete
// /api/users/13?delete=1
// /api/users/13/remove
// /api/getUsers
// /api/v1/users.get

// Лучшие практики
// Использовать для описания базовых URL существительные во
// множественном числе
// Использование более конкретных, четких имен а не абстрактных ( /news, /
// videos , а не /items )
// Сложную логику описывать за счет дополнительных параметров, т.е.
// прятать за знаком «?»
// Пример пагинации ( /users?limit=25&offset=50 )
// Фильтрация ответа (/friends?fields=id,name,picture)
// Поддержка нескольких форматов (json, xml)

// Примеры URI ресурсов
// Добавление нового клиента в систему:
// POST http://www.example.com/customers
// Получить данные клиента с идентификатором клиента № 33245:
// GET http://www.example.com/customers/33245
// Тот же URI будет использоваться для PUT и DELETE для обновления и удаления соответственно.
// создание нового продукта:
// POST http://www.example.com/products
// для чтения, обновления, удаления продукта 66432, соответственно:
// GET | PUT | УДАЛИТЬ http://www.example.com/products/66432
// создания нового заказа для клиента:
// POST http://www.example.com/orders
// но это, возможно, вне контекста клиента
// POST http://www.example.com/customers/33245/orders
// для конкретного клиента
// список заказов, созданных или принадлежащих клиенту # 33245:
// GET http://www.example.com/customers/33245/orders
// усложним, добавить позицию для заказа № 8769 (которая для клиента № 33245):
// POST http://www.example.com/customers/33245/orders/8769/lineitems
// получение списка заказа по номеру без знания номера конкретного клиента.:
// GET http://www.example.com/orders/8769
// пройти один уровень глубже в иерархии, вернуть только первую позицию в том же порядке
// GET http://www.example.com/customers/33245/orders/8769/lineitems/1
// Ограничение с помощью заголовка диапазона:
// Когда выполняется запрос для целого ряда элементов с использованием HTTP-заголовка вместо параметров строки запроса
// Range: items=0-24
// Ограничение по параметрам Query-String:
// offset - это начальный номер позиции (соответствует первой цифре в строке элементов для заголовка Range), а limit - максимальное количество возвращаемых элементов
// GET http://api.example.com/resources?offset=0&limit=25
// При этом сервер должен отвечать заголовком Content-Range, чтобы указать, сколько элементов возвращается и и сколько еще не отображено
// Content-Range: items 0-24/66
// Ограничение с помощью заголовка диапазона:
// Когда выполняется запрос для следующего ряда элементов с использованием HTTP-заголовка вместо параметров строки запроса
// Range: items=15-27
// Передача параметров Query-String:
// offset - это начальный номер позиции (соответствует первой цифре в строке элементов для заголовка Range), а limit - максимальное количество возвращаемых элементов
// GET http://api.example.com/resources?offset=0&limit=25
// При этом сервер должен отвечать заголовком Content-Range, чтобы указать, сколько элементов возвращается и и сколько еще не отображено
// Content-Range: items 0-24/66 (*) если общее количество элементов на данный момент не известно
// фильтрация:
// GET http://www.example.com/users?filter="name::todd|city::denver|title::grand poobah”
// Разделитель двойной двоеточия («::») отделяет имя свойства от значения сравнения
// сортировка:
// GET http://www.example.com/users?sort=last_name|first_name|-hire_date
// Для каждого свойства - сортировка имени в порядке возрастания, и для каждого свойства, префиксного тире («-») сортировки в порядке убывания. Отделите каждого имени свойства
// вертикальной полосой («|»).
// Версионирование/отключение ресурса:
// Content-Type: application/json; version=1 (406 NOT ACCEPTABLE)
// Deprecated: true (200 OK)

// Обработка ошибок
// Не нужно помещать все ошибки логики/сервера в статус код HTTP
// Описание ошибки должно быть четким и лаконичным
// Отдавайте корректный HTTP статус код (RFC 2616)
// Всегда отдавайте ответ в запрошенном формате
// Если статус код позволяет отдавать тело сообщения — необходимо его
// расширить за счет краткого описания проблемы.

// base-api
// server.js
// local database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
// express
const express = require('express');
const app = express();
const router = express.Router();
// errors middleware
const HttpError = require('./error');
// paginator middleware
const Paginate = require('./middelware/paginate');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});
// get list of resourse and add single user
router.route('/users')
  .get((req, res) => {
    const users = db.get('users').value();
    const usersLength = users.length;
    // pagination
    if (req.query.offset) {
      const pageNum = parseInt(req.query.offset || 0, 10);
      const perPage = parseInt(req.query.limit || 1, 10);
      if (!usersLength) throw new HttpError('Cannot get data', 404);
      const page = Paginate(users, pageNum, perPage);
      if (page.nextPage) {
        res.set('Link', `http://localhost:3000/api/v1.0/users?offset=${page.nextPage}&limit=${perPage}`);
      }
      res.set('X-Total-Count', usersLength);
      if (page.pageData.length === 0) throw new HttpError('Empty data', 404);
      res.send(page.pageData);
    } else {
      res.send(
        db.get('users')
          .value()
      );
    }
  })
  .post((req, res) => {
    const {
      firstName,
      lastName = null,
      phone = null,
      email = null,
      memberSince} = req.body;
    if (!firstName) throw new HttpError('Missing required parameter - firstName', 400);
    db.get('users')
      .push({firstName, lastName, phone, email, memberSince})
      .write();
    const peopleLength = db.get('users').value().length;
    res.header('Location', `http://localhost:3000/api/v1.0/users/${peopleLength-1}`);
    res.status(201).send('User added');
  });
// work with the single user
router.route('/users/:user_id')
  .get((req, res) => {
    const userId = req.params.user_id;
    const singleUser = db.get(`users[${userId}]`).value();
    if (!singleUser) throw new HttpError('Not Found', 404);
    res.send(singleUser);
  })
  .delete((req, res) => {
    const userId = req.params.user_id;
    const singleUser = db.get(`users[${userId}]`).value();
    if (!singleUser) throw new HttpError('Not Found', 404);
    db.get('users')
      .remove({firstName: singleUser.firstName})
      .write();
    res.send(singleUser);
  });
// add base route
app.use('/api/v1.0', router);
// main route handler
app.use('*', (req, res) => {
  throw new HttpError('Not found. API is on http://localhost:3000/api/v1.0', 404);
});
// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({status: err.status, message: err.message, msg: 'yo'});
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));
// server2.js
// подключаем локальную базу данных
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
// подключаем express
const express = require('express');
const app = express();
const router = express.Router();
// для парсинга параметров переданных через POST запрос
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// описание корневого роута
router.get('/', (req, res) => {
  res.json({ message: 'hooray! welcome to our api!' });
});
// GET /users - получаем список всех пользователей
router.route('/users')
  .get((req, res) => {
    res.send(
      db.get('users')
        .value()
    );
  })
// POST /users - добавляем пользователя
  .post((req, res) => {
    const {
      firstName,
      lastName = null,
      phone = null,
      email = null,
      memberSince = null
    } = req.body;
    if (!firstName) res.status(400).send({error: 'Missing required parameter - firstName'});
    db.get('users')
      .push({firstName, lastName, phone, email, memberSince})
      .write();
    const peopleLength = db.get('users').value().length;
    res.header('Location', `http://localhost:3000/api/v1.0/users/${peopleLength}`);
    res.status(201).send('User added');
  });
// GET /users/:user_id - получаем данные о пользователе по его id
router.route('/users/:user_id')
  .get((req, res) => {
    const userId = req.params.user_id;
    const singleUser = db.get(`users[${userId}]`).value();
    if (!singleUser) res.status(404).send({ error: 'Not found' });
    res.send(singleUser);
  })
// DELETE /users/:user_id - удаляем пользователя по его id
  .delete((req, res) => {
    const userId = req.params.user_id;
    const singleUser = db.get(`users[${userId}]`).value();
    if (!singleUser) res.status(404).send({error: 'Not found'});
    db.get('users')
      .remove({firstName: singleUser.firstName})
      .write();
    res.send(singleUser);
  });
// Добавляем маршрут api
app.use('/api/v1.0', router);
app.use('*', (req, res) => {
  res.status(404).send({error: 'Not found. API is on http://localhost:3000/api/v1.0'});
});
// Обработчик ошибок
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({status: err.status, message: err.message});
});
// Запуск сервера
app.listen(3000, () => console.log('Example app listening on port 3000!'));
// error/index.js
// Error middleware
module.exports = function HttpError (message, httpStatus) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.status = httpStatus;
};
require('util').inherits(module.exports, Error);
// middleware/paginate.js
// paginator middleware
module.exports = function paginate (sourceList, page, perPage) {
  const totalCount = sourceList.length;
  const lastPage = Math.floor(totalCount / perPage);
  const sliceBegin = page * perPage;
  const sliceEnd = sliceBegin + perPage;
  const pageList = sourceList.slice(sliceBegin, sliceEnd);
  return {
    pageData: pageList,
    nextPage: page < lastPage ? page + 1 : null,
    totalCount: totalCount
  };
};
// adv-api
// server.js
// express
const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// add routes
require('./routes')(app);
// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({status: err.status, message: err.message});
});
app.listen(3000, () => console.log('Example app listening on port 3000!'));
// error/index.js
// Error middleware
module.exports = function HttpError (message, httpStatus) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.status = httpStatus;
};
require('util').inherits(module.exports, Error);
// middleware/paginate.js
// paginator middleware
module.exports = function paginate (sourceList, page, perPage) {
  const totalCount = sourceList.length;
  const lastPage = Math.floor(totalCount / perPage);
  const sliceBegin = page * perPage;
  const sliceEnd = sliceBegin + perPage;
  const pageList = sourceList.slice(sliceBegin, sliceEnd);
  return {
    pageData: pageList,
    nextPage: page < lastPage ? page + 1 : null,
    totalCount: totalCount
  };
};
// routes/index.js
const HttpError = require('../error');
module.exports = (app) => {
  app.use('/api', require('./api')); //подключаем модуль api/index.js
  app.get('/', (req, res) => {
    throw new HttpError('API is available on /api', 404);
  });
};
// routes/api/index.js
const express = require('express');
const app = module.exports = express();
const HttpError = require('../../error');
app.use('/v1.0', require('./v1.0')); //подключаем api/v1.0/index.js
app.get('/', (req, res) => {
  throw new HttpError('api ok, please choose version /v1.0', 400);
});
// routes/api/v1.0/index.js
const express = require('express');
const app = module.exports = express();
const HttpError = require('../../../error');
app.use('/users', require('./users')); //подключаем api/v1.0/users/index.js
app.get('/', (req, res) => {
  throw new HttpError('wrong query, choose v1.0/users', 400);
});
// routes/api/v1.0/users/index.js
// local database
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./db.json');
const db = low(adapter);
const express = require('express');
const app = module.exports = express();
const HttpError = require('../../../../error');
const Paginate = require('../../../../middelware/paginate');
// get list of resourse and add single user
app.get('/', (req, res) => {
  const users = db.get('users').value();
  const usersLength = users.length;
  // pagination
  if (req.query.offset) {
    const pageNum = parseInt(req.query.offset || 0, 10);
    const perPage = parseInt(req.query.limit || 1, 10);
    if (!usersLength) throw new HttpError('Cannot get data', 404);
    const page = Paginate(users, pageNum, perPage);
    if (page.nextPage) {
      res.set('Link', `http://localhost:3000/api/v1.0/users?offset=${page.nextPage}&limit=${perPage}`);
    }
    res.set('X-Total-Count', usersLength);
    if (page.pageData.length === 0) throw new HttpError('Empty data', 404);
    res.send(page.pageData);
  } else {
    res.send(
      db.get('users')
        .value()
    );
  }
});
app.post('/', (req, res) => {
  const {
    firstName,
    lastName = null,
    phone = null,
    email = null,
    memberSince} = req.body;
  if (!firstName) throw new HttpError('Missing required parameter - firstName', 400);
  db.get('users')
    .push({firstName, lastName, phone, email, memberSince})
    .write();
  const peopleLength = db.get('users').value().length;
  res.header('Location', `http://localhost:3000/api/v1.0/users/${peopleLength}`);
  res.status(201).send('User added');
});
// work with the single user
app.get('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const singleUser = db.get(`users[${userId}]`).value();
  if (!singleUser) throw new HttpError('Not Found', 404);
  res.send(singleUser);
});
app.delete('/:user_id', (req, res) => {
  const userId = req.params.user_id;
  const singleUser = db.get(`users[${userId}]`).value();
  if (!singleUser) throw new HttpError('Not Found', 404);
  db.get('users')
    .remove({firstName: singleUser.firstName})
    .write();
  res.send(singleUser);
});

// *************************************************************************************
// Koa.js
// *************************************************************************************
// Для того, чтобы вернуть какой-либо результат в ответе на запрос необходимо установить свойство body объекта ctx.
const users = ['Саша', 'Вика', 'Леша'];
router.get('/users',  async (ctx, next) => { ctx.body = users}); 
// Маршруты могут содержать параметры — именованные сегменты URL-адреса. Название параметра должно включать символы из диапазона [A-Za-z0-9_]. В определении маршрута параметры предваряются знаком двоеточия. Добавим еще один обработчик для следующего маршрута:
router.get("/users/:id", async (ctx, next) => {
  ctx.body = ctx.params.id;
});
// Можно использовать маршруты с несколькими не определенными составляющими.
router.get("/users/:admin/:id", async (ctx, next) => {
  ctx.body = ctx.params.admin + ctx.params.id;
});
// А так же имеется функционал для проверки параметров маршрута.
router.get("/users/:id([0-9]{9})", async (ctx, next) => {
  ctx.body = ctx.params.id;
});
// В данной ситуации будет обработан только тот запрос, у которого url будет соответствовать формату "users/любые девять цифр от 0 до 9", например, users/123456789. Для запроса на url users/abc123456 эта логика обработки применена не будет.

// Для обработки ошибок в Koa.js используется многими забытая, но от этого не переставшая быть эффективной конструкция try/catch. Использование данной конструкции, например, при описании логики обработки запроса, является простым и лаконичным средством.
const users = ['Саша', 'Вика', 'Леша'];
router.get("/users/:id", async (ctx, next) => {
try {
        users.find(user => user.id === ctx.params.id);
    } catch (err) {
        console.log(err);
        ctx.status = 400;
        ctx.body = err;
    }
});
// установка куки
ctx.cookies.set('access_token', '1111', { maxAge: 86400000 });
// Таким образом, на клиентской стороне будет установлен cookie с именем 'access_token', значением '1111', сроком "жизни" в 86400000 миллисекунд. 

// простой сайт
// app.js
const fs = require("fs");
const Koa = require('koa');
const app = new Koa();
const session = require("koa-session");
const static = require("koa-static");
const Pug = require('koa-pug');
const pug = new Pug({viewPath: './views', pretty: true, basedir: './views', noCache: true, app: app})
const config = require('./config');
const router = require('./routes');
// универсальный роут, чтобы отдавать всегда index.html, используется для vue
/* router.get('*', function(ctx) {
  ctx.body = fs.readFileSync(path.resolve(path.join('dist', 'index.html')), 'utf8');
}); */
app.use(static('./public')); //определяем папку со статическим контентом
if (!fs.existsSync('./public/upload')) {
  fs.mkdirSync('./public/upload')
}
app
  .use(session(config.session, app)) //подключаем сессии
  .use(router.routes()) //роуты
  .use(router.allowedMethods()); //разрешаем все методы
app.listen(3000, function () {
  console.log('Server start 3000');
});
// routes/index.js
const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body')
const controllers = require('../controllers/');
router.get('/', controllers.index); //при заходе на главную страницу
router.get('/work', controllers.myWorks) //при заходе на страницу мои работы
router.post('/work', koaBody({ //загружаем файл
  multipart: true,
  formidable: {
    uploadDir: process.cwd() + "/public/upload" //папка для хранения временных файлов
  }
}), controllers.uploadWork)
router.get('/contact-me', controllers.contactMe); //при заходе на страницу контактов
router.get('/login', controllers.login); //при заходе на страницу авторизации
router.post('/login', koaBody(), controllers.auth); //при отправке формы на странице авторизации
router.get('*', async(ctx, next) => { //при заходе на любую другую страницу
  ctx.render('error', {
    status: ctx.response.status,
    error: ctx.response.message
  });
})
module.exports = router;
// controllers/index.js
const fs = require('fs');
const _path = require('path');
const util = require('util');
const verifyForm = require('../libs/verify');
const psw = require('../libs/password')
const db = require('../models/db')
// из обычных функций делаем функции возвращающие промис
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);
module.exports.index = async(ctx, next) => { //при заходе на главную страницу
  ctx.render('pages/index');
}
module.exports.myWorks = async(ctx, next) => { //при заходе на страницу мои работы
  const works = db
    .getState()
    .works || []; //достаем работы из бд
  // console.log(db.getState().works);
  ctx.render('pages/my-work', { //передаем работы и флаг в шаблон
    items: works,
    authorised: ctx.session.isAuthorized
  });
}
module.exports.uploadWork = async(ctx, next) => { //при загрузке новой работы
  const {projectName, projectUrl, text} = ctx.request.body.fields; //поля из формы для загрузки файла
  const {name, size, path} = ctx.request.body.files.file; //параметры загружаемого файла
  let responseError = verifyForm(projectName, projectUrl, text);
  if (responseError) { //если ошибка в форме
    await unlink(path); //удаляем временный файл
    return ctx.body = responseError;
  }
  if (name === "" || size === 0) { //если у файла нет имени или размера
    await unlink(path);
    return (ctx.body = {
      mes: 'Не загружена картинка проекта',
      status: 'Error'
    });
  }
  let fileName = _path.join(process.cwd(), 'public/upload', name);
  const errUpload = await rename(path, fileName);
  if (errUpload) {
    return (ctx.body = {
      mes: "При загрузке проекта произошла ошибка rename file",
      status: "Error"
    });
  }
  db
    .get("works")
    .push({
      name: projectName,
      link: projectUrl,
      desc: text,
      picture: _path.join('upload', name)
    })
    .write();
  ctx.body = {
    mes: "Проект успешно загружен",
    status: "OK"
  };
}
module.exports.contactMe = async(ctx, next) => { //при заходе на страницу контактов
  ctx.render('pages/contact-me');
}
module.exports.login = async(ctx, next) => { //при заходе на страницу авторизации
  ctx.render('pages/login');
}
module.exports.auth = async(ctx, next) => { //при отправке формы на странице авторизации
  const {login, password} = ctx.request.body;
  const user = db
    .getState()
    .user;
  if (user.login === login && psw.validPassword(password)) {
    ctx.session.isAuthorized = true;
    ctx.body = {
      mes: "Aвторизация успешна!",
      status: "OK"
    };
  } else {
    ctx.body = {
      mes: "Логин и/или пароль введены неверно!",
      status: "Error"
    };
  }
}
// models/addUser.js
const readline = require('readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
const db = require('./db.js')
const psw = require('../libs/password');
//логин и пароль, изначально пустые
let login = '';
let hash = '';
let salt = '';
//спрашиваем логин
rl.question('Логин: ', answer => {
  //записываем введенный логин
  login = answer;
  //спрашиваем пароль
  rl.question('Пароль: ', answer => {
    //записываем введенный пароль
    const password = psw.setPassword(answer);
    // {hash, salt}
    hash = password.hash;
    salt = password.salt;
    //завершаем ввод
    rl.close();
  });
});
//когда ввод будет завершен
rl.on('close', () => {
  // Add a post
  db
    .set('user', {login, hash, salt}) //каждый раз будет перезаписывать юзера
    .write();
});
// models/db.js
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./models/db.json");
const db = low(adapter);
module.exports = db;
// libs/password.js
const crypto = require('crypto');
const db = require('../models/db');
module.exports.setPassword = function (password) {
  const salt = crypto
    .randomBytes(16)
    .toString('hex'); //получаем рандомную строку в 16 байт
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 512, 'sha512') //получаем ключ (1000 - итераций, 512 - длина ключа, sha512 - алгоритм шифрования)
    .toString('hex');
  return {salt, hash} //в базе будем хранить соль и хэш
};
module.exports.validPassword = function (password) {
  const user = db //вытаскиваем пользователя из бд
    .get('user')
    .value()
  const hash = crypto
    .pbkdf2Sync(password, user.salt, 1000, 512, 'sha512')
    .toString('hex');
  return user.hash === hash; //сравниваем хэш введенного пароля с хэшем пользователя
};
// libs/verify.js
module.exports = (projectName, projectUrl, text) => {
  let response;
  if (projectName === "") {
    response = {
      mes: "Не загружена название проекта",
      status: "Error"
    };
  }
  if (projectUrl === "") {
    response = {
      mes: "Не загружена url адрес проекта",
      status: "Error"
    };
  }
  if (text === "") {
    response = {
      mes: "Не загруженo описание проекта",
      status: "Error"
    };
  }
  return response;
};

// *************************************************************************************
// Работа с реляционными БД(PostgreSQL) (Sequelize)
// *************************************************************************************

// 01-connect.js
const {Client} = require('pg'); //модуль postgre
const db = new Client({user: 'postgres', host: 'localhost', database: 'test', password: '', port: 5432});
db.connect(); //подключаемся к бд
db.query('SELECT * FROM students', (err, data) => { //запрос к бд
  if (err) 
    throw new Error(err)
  console.log(data.rows);
  db.end();
});
// 02-async-connect
const {Client} = require('pg');
const db = new Client({user: 'postgres', host: 'localhost', database: 'test', password: '', port: 5432});
async function connect() {
  await db.connect();
  // добавляем студента
  await db.query('INSERT INTO students(s_id, name, start_year) VALUES ($1, $2, $3)', [1567, 'Рамиль', 2018]);
  await db.query('UPDATE students SET start_year = $1 WHERE s_id = 1567', [2015]); //обновляем ячейку у студента
  const data = await db.query('SELECT * FROM students');
  console.log(data.rows);
  db.end();
}
connect();
// create-group.js
const {Client} = require('pg');
const db = new Client({user: 'postgres', host: 'localhost', database: 'test', password: '', port: 5432})
async function connect() {
  await db.connect();
  await db.query('CREATE TABLE groups(g_no text PRIMARY KEY, headman integer NOT NULL REFERENCES s' +
      'tudents(s_id))'); //создаем таблицу groups(со старостой headman - число не пустое), связанную с таблицей students
  await db.query('ALTER TABLE students ADD g_no text REFERENCES groups(g_no)')
  await db.query('BEGIN')
  await db.query('INSERT INTO groups(g_no, headman) SELECT $1, s_id FROM students WHERE name = $2', ['Loft-05', 'Млада'])
  await db.query('UPDATE students SET g_no = $1', ['Loft-05'])
  await db.query('COMMIT')
  const students = await db.query('SELECT * FROM students')
  console.log(students.rows);
  const groups = await db.query('SELECT * FROM groups')
  console.log(groups.rows);
  db.end()
}
connect()
// 04-pool-connect
const {Pool} = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test',
  password: '',
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
})
async function connect() {
  const db = await pool.connect()
  const data = await db.query('SELECT * FROM students')
  console.log(data.rows);
  pool
    .end()
    .then(() => console.log('pool has ended'))
}
connect()
// 05-sequelize.js
const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'postgres', '', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
sequelize.sync(); //синхронизируемся с бд
sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение установлено');
  })
  .catch(err => {
    console.error('Ошибка соединения');
  })
  const modelNames = ['Teacher', 'Group', 'Student'];
for (const modelName of modelNames) {
  sequelize.import (`./models/${modelName}.js`); //импортируем модели
};
for (const modelName of Object.keys(sequelize.models)) {
  if ('associate' in sequelize.models[modelName]) { //если у модели есть метод associate
    sequelize
      .models[modelName]
      .associate(sequelize.models); //вызываем функцию associate и передаем туда модели
  };
};
// 06-sequelize-create.js
const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'postgres', '', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
sequelize.sync();
sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение установлено');
  })
  .catch(err => {
    console.error('Ошибка соединения');
  })
const modelNames = ['Teacher', 'Group', 'Student'];
for (const modelName of modelNames) {
  sequelize.import (`./models/${modelName}.js`);
};
for (const modelName of Object.keys(sequelize.models)) {
  if ('associate' in sequelize.models[modelName]) {
    sequelize
      .models[modelName]
      .associate(sequelize.models);
  };
};
async function createGroups() { //создаем группы
  for (let i = 0; i <= 3; i++) {
    let obj = {
      name: `Группа ${i}`
    }
    await sequelize
      .models
      .group
      .create(obj);
  }
}
createGroups()
// 07-sequelize-find.js
const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'postgres', '', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize.sync();
sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение установлено');
  })
  .catch(err => {
    console.error('Ошибка соединения');
  })
const modelNames = ['Teacher', 'Group', 'Student'];
for (const modelName of modelNames) {
  sequelize.import (`./models/${modelName}.js`);
};
for (const modelName of Object.keys(sequelize.models)) {
  if ('associate' in sequelize.models[modelName]) {
    sequelize
      .models[modelName]
      .associate(sequelize.models);
  };
};
async function updateGroup(id) {
  const data = await sequelize //ищем группу по id
    .models
    .group
    .find({
      where: {
        id: id
      }
    });
  // const data = await sequelize   .models   .group   .findAll();
  let params = {
    name: 'Группа закрыта'
  };
  await data.update(params) //обновляем поле name
  // await data.destroy()
  fs.writeFileSync('test.json', JSON.stringify(data)); //пишем в файл
};
updateGroup(2);
// 08-sequelize-teacher.js
const fs = require('fs');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'postgres', '', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
sequelize.sync();
sequelize
  .authenticate()
  .then(() => {
    console.log('Соединение установлено');
  })
  .catch(err => {
    console.error('Ошибка соединения');
  })
  const modelNames = ['Teacher', 'Group', 'Student'];
for (const modelName of modelNames) {
  sequelize.import (`./models/${modelName}.js`);
};
for (const modelName of Object.keys(sequelize.models)) {
  if ('associate' in sequelize.models[modelName]) {
    sequelize
      .models[modelName]
      .associate(sequelize.models);
  };
};
async function createTeacher() {
  try {
    const params = {
      name: 'Юрий Кучма',
      group: {
        name: 'Серверный JS - май 2018'
      },
      students: [
        {
          name: 'Млада'
        }, {
          name: 'Роман'
        }
      ]
    };
    const data = await sequelize
      .models
      .teacher
      .create(params, { //благодаря взимосвязям добавит данные в нужные таблицы
        include: [
          {
            all: true
          }
        ]
      });
    console.log(data)
  } catch (err) {
    console.log(err)
  }
};
createTeacher();
// models/Group.js
module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('group', { //определяет новую модель group, теперь будет находиться в sequelize.models
    name: {
      type: DataTypes.STRING
    },
    __id: {
      type: DataTypes.UUID,
      defautValue: DataTypes.UUIDV4
    }
  })
  return Group;
}
// models/Student.js
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('student', {
    name: {
      type: DataTypes.STRING
    },
    __id: {
      type: DataTypes.UUID,
      defautValue: DataTypes.UUIDV4
    }
  });
  Student.associate = function (models) {
    Student.belongsTo(models.teacher); //определяем взаимосвязь с моделью учителя
  }
  return Student;
}
// models/Teacher.js
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('teacher', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    position: {
      type: DataTypes.INTEGER
    },
    __id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }
  })
  Teacher.associate = function (models) {
    Teacher.belongsTo(models.group); //определяем взаимосвязь с моделью группы
    Teacher.hasMany(models.student); //определяем множественные взаимосвязи со студентами
  }
  return Teacher;
}

// Sequelize
// Модель пользователя (файл ./models/User.js)
module.exports = (sequelize, DataTypes) => {
  	  const User = sequelize.define("user", {
    	      name: {
	        type: DataTypes.STRING
	      }
	    });
	  return User ;
	};
// Остается только подключить модель к экземпляру соединения, и тогда можно будет воспользоваться встроенными методами модели. Существуют несколько подходов к подключению, одним из наиболее оптимальных считается этот (в основной файл необходимо подключить модули fs и path, так как они понадобятся для поиска моделей): 
fs.readdirSync('./models')
 .filter(function (file) {
   return (file.indexOf('.') !== 0) && (file !== 'index.js')
 })
 .forEach(function (file) {
   sequelize.import(path.join(__dirname, './models', file))
 })
Object.keys(sequelize.models).forEach(function (modelName) {
 if ('associate' in sequelize.models[modelName]) {
   sequelize.models[modelName].associate(sequelize)
 }
})
// В данном коде мы просматриваем директорию с моделями, и если они есть, то импортируем их в наш экземпляр соединения, затем просматриваем каждую модель в отдельности на предмет наличия у нее метода associate, который позволяет строить связи между моделями, и, в случае его наличия, вызываем его для создания связей между моделями. 
// Типы связей, поддерживаемых ORM Sequelize: 
// One-to-One (Один к одному) — это означает, что каждой записи в одной таблице соответствует не более одной записи в связанной таблице. Этот вид связи встречается довольно редко. В основном, в тех случаях, когда часть информации об объекте либо редко используется, либо является конфиденциальной (такая информация хранится в отдельной таблице, которая защищена от несанкционированного доступа). Например, анкетные данные студента (ФИО, факультет, курс, группа, дата рождения и т.п.) могут храниться в одной таблице БД, а сведения о родителях этого студента – в другой, т.к. эта информация используется достаточно редко и может быть отделена от основной. 
// One-to-Many (Один ко многим) — при таком типе связи каждой записи в одной таблице соответствует одна или более записей в связанной таблице. Для реализации такого отношения используются две таблицы. Одна из них представляет сторону «один», другая — сторону «много». Например, нужно иметь информацию о студентах и результатах сдачи ими экзаменов (дата сдачи, предмет, оценка и т.д.). Если все это хранить в одной таблице, то ее объем неоправданно возрастет, т.к. в ней для каждой записи об очередном экзамене должны повторяться все анкетные сведения о студенте. Поскольку Студент и Экзамены — это разные сущности, то и атрибуты их должны храниться в разных таблицах. Но эти сущности связаны между собой, т.к. экзамены сдает определенный студент. Причем один студент может сдавать несколько экзаменов, т.е. налицо тип отношения «один-ко-многим». 
// Belongs-to-Many (Относится ко многим) — При этом типе связи множеству записей в одной таблице соответствует множество записей в связанной таблице. 
// Давайте создадим новую модель, например, модель подписки на абстрактную рассылку. 
module.exports = (sequelize, DataTypes) => {
  const Subscription= sequelize.define("subscription", {
        name: {
      type: DataTypes.STRING
    }
  });
  return Subscription;
};
// Как видите, модели достаточно простые, но этого хватит, чтобы установить между ними связь. Для этого перед тем, как вернуть объект модели, нам необходимо расширить его методом associate для создания связи. 
// Представим, что пользователь может иметь только одну подписку, в таком случае модель пользователя будет выглядеть так: 
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
        name: {
      type: DataTypes.STRING
    }
  });
  User.associate = function (models) {
    User.belongsTo(models.subscription);
  };
  return User ;
};
// Для того, чтобы дать пользователю возможность иметь несколько подписок, нам достаточно заменить тип связи:
User.associate = function (models) {
  User.hasMany(models.subscription);
};
// Для того, чтобы взаимодействовать с данными, не обязательно писать 
// SQL-запросы (хотя такая возможность в ORM присутствует). Взаимодействие 
// с данными строится по CRUD(create, read, update, delete)-шаблону, и у каждой модели имеются соответствующие методы. 
// Например, вызов 
 User.findAll();
// Эквивалентен чтению, будут прочитаны и переданы все записи в базе данных, соответствующие модели пользователя (т.е. занесенные в таблицу пользователей, если абстрагироваться от использования ORM). 
// Точно так же можно взаимодействовать с базой данных в остальных случаях — при создании, обновлении и удалении. Под каждый случай имеется соответствующий метод, который принимает набор параметров (как правило, это отличительные признаки объекта (т.е. строки таблицы), по которым будет произведена выборка и дальнейшее действие. Вы можете редактировать или удалять как одну, так и несколько моделей сразу, главное - корректно переданные параметры для выборки.
// Параметры могут принимать любое свойство объекта. Лично я рекомендую как можно чаще использовать автоматически создаваемый __id, а не какие-либо другие свойства, т.к. высока вероятность их повторения или переопределения. 
// Для создания записи используется метод create, который принимает объект с данными (он должен соответствовать модели):
db.models.user.create(data, {
    include: [{
        all: true
    }]
});
// Параметр include позволяет связать все необходимые модели. Вы можете связывать только некоторые модели, а можете не связывать их вовсе. Для обновления и удаления алгоритм немного сложнее — сначала вам необходимо найти конкретную запись (data в данном случае — id изменяемой записи, а newData — новые данные модели).
let findedUser = await sequelize.models.user.findOne({ where: { id: data } });
findedUser.update(newData); // Обновление
findedUser.destroy(); // Удаление

// *************************************************************************************
// Работа с нереляционными БД(Mongo) (Mongoose)
// *************************************************************************************
// mongod --config mongodb.config - запуск сервера баз данных (в командной строке, не bash)
// mongo - подключиться к серверу баз данных
// mlab.com - облачный сервер баз данных (при подключении из studio 3t ввести хостинг mlab, порт, пользователь, пароль и бд)

// Показать текущую базу данных
// $ db
// Выбрать базу данных
// $ use db_name
// Все существующие базы
// $ show dbs

// запросы к бд
// удалить БД можно командой.
db.dropDatabase()
// { "dropped" : "local", "ok" : 1 } - вывод
// создание коллекции
db.createCollection(name, options)
// удаление коллекций: 
db.COLLECTION_NAME.drop()

// Методы insert()и save()позволяют добавлять новые документы в коллекцию. Также, если вызвать вставку на несуществующую коллекцию, то она будет создана и в нее будет добавлен этот документ. 
db.employees.insert({ 
    "employee_id":1, 
    "name":"employee1" 
}); 
WriteResult({ "nInserted" : 1 })

// Чтобы найти нужный документ, следует выполнить метод find(). Также можно опционально добавить вызов метода pretty(), что сделает вывод красивее. 
db.employees.find().pretty()
// обновление записей
db.employees.update({"employee_id":2},{"name":"Employee2"}) 
WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 }) 
db.employees.save({"employee_id":1,"name":"Sanjeev"}) 
WriteResult({ "nInserted" : 1 }) 
db.employees.find() 
// { "_id" : ObjectId("579c6efbb87b4b49be12664d"), "employee_id" : 1, "name" : "Sanjeev" }
// Для удаления используется метод remove(). Он принимает два параметра: критерий для выборки, что будет удалено и флаг justOne (удалить только первое совпадение с выборки). 
db.employees.remove({"_id":ObjectId("579c6ecab87b4b49be12664c")})
WriteResult({ "nRemoved" : 1 })

// show dbs	Список всех баз данных	
// use	Перейти в базу (даже если базы нет)	
// show collections	Список всех коллекций в текущей базе	
// db..find()	Список документов в коллекции	
// db..find({gender:’f’})	Список документов с условиями

// db..insert({name:’Barsik’, age: 4})	Добавить данные в коллекцию	
// db..remove({age: 5})	Удаление данных	
// db..update({age: 4},{name:’Murzik’})	Полная замена	
// db..update({age:4},{‘$set’:{name:’Murzik’}) db..updateOne(…) (v 3.2 >)	Модификатор $set позволит изменить только нужное поле	
// db..update({age:4’},{‘$set’:{name:’Murzik’}, {multi: true}) db..updateMany (…) (v 3.2 >)	Множественные обновления

// запросы с параметрами
// $eq(равно), $gt(больше чем), $lt(меньше чем), $gte(больше или равно), $lte(меньше или равно)
// db.cats.find((age: ($in : [2, 10, 5]))) - выбираются объекты с полем age, равным 2, 5, или 10
// db.cats.find((age: ($nin : [2, 5]))) - все, кроме 2, 5
// db.cats.find(('characteristics': ($all : ['белый', 'вонючий']))) - все, которые и белый и вонючий
// db.cats.find(('characteristics': ($size : 3))) - все, у кого длина массива characteristics равна 3
// db.cats.find((age: ($eq : 3))) - выбираются объекты с полем age, равным 3
// db.cats.find((age: ($exists : true))) - все у кого есть поле age

// Для добавления в коллекцию могут использоваться три ее метода:

// insertOne(): добавляет один документ
// insertMany(): добавляет несколько документов
// insert(): может добавлять как один, так и несколько документов
db.cats.insertOne({name: 'barsik', age: 3, characteristics: ['гадит в тапки', 'дает себя гладить', 'рябой']})
// Некоторые ограничения при использовании имен ключей:
// Символ $ не может быть первым символом в имени ключа
// Имя ключа не может содержать символ точки .
// Имя _id не рекомендуется использовать
db.cats.insertMany([{name: 'Lama', age: 2, characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый']}, {name: 'Liza', age: 4, characteristics: ['гадит в лоток', 'дает себя гладить', 'белый']}])

db.cats.insert([{name: 'Boris', age: 12, characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый']}, {name: 'Murzik', age: 1, characteristics: ['гадит в лоток', 'дает себя гладить', 'черный']}])
// Для вывода документов в более удобном наглядном представлении мы можем добавить вызов метода pretty():
db.cats.find().pretty()
db.cats.find({age: {$lte: 3}, characteristics: 'дает себя гладить'}).pretty()
// Проекция:
db.cats.find({age: {$lte: 3}, characteristics: 'дает себя гладить'}, {name: 0}).pretty()
db.cats.find({age: {$lte: 3}, characteristics: 'дает себя гладить'}, {name: 1, age: 1}).pretty()
// Запрос к вложенным объектам
db.cats.insert({name: 'Dariy', age: 10, characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый'], owners: {name: 'Nata', age: 23, adress: 'Poltava'}})
db.cats.find({'owners.name': 'Nata'})
// Настройка запросов и сортировка:
// db.cats.find().limit(3) - первые три
// db.cats.find().skip(3) - пропустить первые три
// db.cats.find().sort({name: 1}) 
db.cats.findOne({age: {$lte: 3}})
// Курсоры
// Результат выборки, получаемой с помощью функции find, называется курсором
// Курсоры инкапсулируют в себе наборы получаемых из бд объектов. Используя синтаксис языка javascript и методы курсоров, мы можем вывести полученные документы на экран и как-то их обработать.
var cursor = db.cats.find();
while(cursor.hasNext()){
	obj = cursor.next();
	print(obj["name"]);
}
// С помощью функции count() можно получить число элементов в коллекции:
db.cats.count()
db.cats.find({age: {$lte: 3}}).count()
// В MongoDB в запросах можно использовать условные конструкции с помощью операторов сравнения:
// $eq - (равно)
// $gt - (больше чем)
// $lt - (меньше чем)
// $gte - (больше или равно)
// $lte - (меньше или равно)
db.cats.find ({age: {$lte: 10, $gte:2}})
// Поиск по массивам и операторы $in, $nin, $all
// Оператор $in определяет массив возможных выражений и ищет те ключи, значение которых имеется в массиве:
db.cats.find({age: {$in : [2, 10]}})
// Противоположным образом действует оператор $nin - он определяет массив возможных выражений и ищет те ключи, значение которых отсутствует в этом массиве
db.cats.find({age: {$nin : [2, 10]}})
// Оператор $all похож на $in: он также определяет массив возможных выражений, но требует, чтобы документы имели весь определяемый набор выражений.
db.cats.find ({"characteristics": {$all : ["гадит в лоток", "дает себя гладить"]}})
// Оператор $size
// Оператор $size используется для нахождения документов, в которых массивы имеют число элементов, равным значению $size.
db.cats.find({"characteristics": {$size:3}})
// Оператор $exists
// Оператор $exists позволяет извлечь только те документы, в которых определенный ключ присутствует или отсутствует.
db.cats.find({owners: {$exists:true}})
// Оператор $type
// Оператор $type извлекает только те документы, в которых определенный ключ имеет значение определенного типа, например, строку или число
db.cats.find({age: {$type:"number"}})
// Оператор $regex
// Оператор $regex задает регулярное выражение, которому должно соответствовать значение поля.
db.cats.find({name: {$regex:"L"}})
// Оператор $or
db.cats.find({$or: [{name: {$regex:"L"}}, {age: {$lte: 3}}]})
// Оператор $and
db.cats.find({$and: [{name: {$regex:"L"}}, {age: {$lte: 3}}]})
// Метод save
// В этот документ в качестве поля можно передать параметр _id. Если метод находит документ с таким значением _id, то документ обновляется. Если же с подобным _id нет документов, то документ вставляется.
db.cats.save({"_id": ObjectId("5a571b186a51cf10a4383303"), name: "Bars", age: 3})
// Метод update
// Более детальную настройку при обновлении предлагает функция update. Она принимает три параметра:
// query: принимает запрос на выборку документа, который надо обновить
// objNew: представляет документ с новой информацией, который заместит старый при обновлении
// options: определяет дополнительные параметры при обновлении документов. Может принимать два аргумента: upsert и multi.
// Если параметр upsert имеет значение true, что mongodb будет обновлять документ, если он найден, и создавать новый, если такого документа нет. Если же он имеет значение false, то mongodb не будет создавать новый документ, если запрос на выборку не найдет ни одного документа.
// Параметр multi указывает, должен ли обновляться первый элемент в выборке (используется по умолчанию, если данный параметр не указан) или же должны обновляться все документы в выборке.
db.cats.update({name : "Bars"}, {name: "Tom", age : 5}, {upsert: true})
// оператор $set - если документ не содержит обновляемое поле, то оно создается
db.cats.update({name : "Tom"}, {$set: {characteristics: ['гадит в лоток', 'не дает себя гладить', 'серый']}})
// Указав значение multi:true, мы можем обновить все документы выборки
{multi:true}
// Для удаления отдельного ключа используется оператор $unset:
db.cats.update({name : "Tom"}, {$unset: {age: 1}})
// Метод updateOne и updateMany
// Метод updateOne похож на метод update за тем исключением, что он обновляет только один документ.
// Если необходимо обновить все документы, соответствующие некоторому критерию, то применяется метод updateMany():
// Массивы
// Оператор $push
db.cats.updateOne({name : "Tom"}, {$push: {characteristics: "вонюч"}})
db.cats.updateOne({name : "Tom"}, {$push: {characteristics: {$each: ["храпит", "злой"]}}})
// Оператор $addToSet
// Оператор $addToSet подобно оператору $push добавляет объекты в массив. Отличие состоит в том, что $addToSet добавляет данные, если их еще нет в массиве:
db.cats.update({name : "Lama"}, {$addToSet: {characteristics: "безумен"}})
// Оператор $pop
// Позволяет удалять элемент из массива:
db.cats.update({name : "Tom"}, {$pop: {characteristics: 1}})
// 1 конец массива
// -1 начало массива
// Оператор $pull
// Удаляет по значению
db.cats.update({name : "Tom"}, {$pull: {characteristics: "серый"}})
// Оператор $pullAll
// А если мы хотим удалить не одно значение, а сразу несколько, тогда мы можем:
db.cats.update({name : "Tom"}, {$pullAll: {characteristics: ["не дает себя гладить", "вонюч", "храпит"]}})
// Удаление
// Для удаления документов в MongoDB предусмотрен метод remove:
db.cats.remove({name : "Tom"})
db.cats.remove({name : "Tom"}, true) //- once
db.cats.remove({name : "Tom"}, false) //- default multi 

//Mongoose*************
// файл author.js
var mongoose = require('mongoose');
// схема автора
var authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    biography: String,
    twitter: {
        type: String,
        validate: {
            validator: function(text) {
                return text.indexOf('https://twitter.com/') === 0;
            },
            message: 'Twitter handle must start with https://twitter.com/'
        }
    },
    facebook: {
        type: String,
        validate: { //валидация
            validator: function(text) {
                return text.indexOf('https://www.facebook.com/') === 0;
            },
            message: 'Facebook must start with https://www.facebook.com/'
        }
    },
    linkedin: {
        type: String,
        validate: {
            validator: function(text) {
                return text.indexOf('https://www.linkedin.com/') === 0;
            },
            message: 'LinkedIn must start with https://www.linkedin.com/'
        }
    },
    profilePicture: Buffer,
    created: { 
        type: Date,
        default: Date.now //значение по-умолчанию
    }
});
var Author = mongoose.model('Author', authorSchema);
module.exports = Author;
// файл book.js
var bookSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	title: String,
	summary: String,
	isbn: String,
	thumbnail: Buffer,
	author: { //указываем взяимосвязь с автором
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'Author'
	},
	ratings: [
			{
					summary: String,
					detail: String,
					numberOfStars: Number,
					created: { 
							type: Date,
							default: Date.now
					}
			}
	],
	created: { 
			type: Date,
			default: Date.now
	}
});
var Book = mongoose.model('Book', bookSchema);
module.exports = Book;
// index.js
var mongoose = require('mongoose');
var Author = require('./author');
var Book = require('./book');
mongoose.connect('mongodb://localhost/mongoose_basics', function (err) {
    if (err) throw err;
    console.log('Successfully connected');
    var jamieAuthor = new Author({ //создаем автора
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: 'Jamie',
            lastName: 'Munro'
        },
        biography: 'Jamie is the author of ASP.NET MVC 5 with Bootstrap and Knockout.js.',
        twitter: 'https://twitter.com/endyourif',
        facebook: 'https://www.facebook.com/End-Your-If-194251957252562/'
    });
    jamieAuthor.save(function(err) { //сохраняем автора
        if (err) throw err;
        console.log('Author successfully saved.');
        var mvcBook = new Book({ //создаем книгу
            _id: new mongoose.Types.ObjectId(),
            title: 'ASP.NET MVC 5 with Bootstrap and Knockout.js',
            author: jamieAuthor._id, //передаем id автора для взаимосвязи
            ratings:[{
                summary: 'Great read'
            }]
        });
        mvcBook.save(function(err) { //сохраняем книгу
            if (err) throw err;
            console.log('Book successfully saved.');
        });
        var knockoutBook = new Book({
            _id: new mongoose.Types.ObjectId(),
            title: 'Knockout.js: Building Dynamic Client-Side Web Applications',
            author: jamieAuthor._id
        });
        knockoutBook.save(function(err) {
            if (err) throw err;
            console.log('Book successfully saved.');
        });
    });
});
// функции
Book.find({ //найдет 5 наиболее новых книг в названии которых есть mvc
	title: /mvc/i
}).sort('-created') //сортировка по дате создания по убыванию
.limit(5)
.exec(function(err, books) {
	if (err) throw err;
	 
	console.log(books);
});

Author.findById('59b31406beefa1082819e72f', function(err, author) {
	if (err) throw err;
	author.linkedin = 'https://www.linkedin.com/in/jamie-munro-8064ba1a/';
	author.save(function(err) {
			if (err) throw err;
			console.log('Author updated successfully');
	});
});
Author.findByIdAndUpdate('59b31406beefa1082819e72f', { linkedin: 'https://www.linkedin.com/in/jamie-munro-8064ba1a/' }, function(err, author) {
	if (err) throw err;
	console.log(author);
});

module.exports.update = function (data, paramsId) {
  if (isNotValid(data)) {
    return Promise.reject(new Error('Data format is not correct'));
  }
  let updateCat = {
    name: data.name,
    age: parseInt(data.age)
  };
  return Cats.findByIdAndUpdate({
    "_id": paramsId
  }, {
    $set: updateCat
  }, {new: true}) //возвращать новый объект
};

exports.Login = (req, res) => { //авторизация юзера
	User.findOne({Name: req.body.username})
		.populate('PermissionId') //включаем в выборку поля связанного объекта
		.exec()
		.then(user => {
				console.log(user);
				if (!user)
						return res.status(404).send('No user found');
				const passwordIsValid = bcrypt.compareSync(req.body.password, user.Password); //проверка пароля
				if (!passwordIsValid)
						return res.status(401).send('Password not valid');
				
				const response = userMapper.Map(user); //объект юзера
				response.permission = user.PermissionId.Value[0];
				response.permissionId = user.PermissionId._id.toString();
				response['access_token'] = jwt.sign({ id: user._id }, config.authSecret, { expiresIn: 86400 }); // создаем токен для сессии, expires in 24 hours;
				console.log(response);
				return res.status(200).send(response); //возвращаем объект юзера клиенту
		}).catch((err) => {
				return res.status(500).send(`Error finding user: ${err.message}`);
		});
};
exports.Delete = (req, res) => { //удалить новость
	News.findOneAndDelete({ _id: req.params.id})
		.exec()
		.then((result) => {
				// console.log(result);
				News.find()
					.then(newsCollection => {
						// console.log(newsCollection);
						const response = [];
						newsCollection.forEach((news) => { response.push(newsMapper.Map(news)) });
						res.status(200).send(response); //отправляем ответ клиенту
						})
						.catch((err) => {
								res.status(500).send(`Error finding news: ${err.message}`);
						});
		})
		.catch((err) => { res.status(500).send(`Error deleting user: ${err.message}`); });
};
exports.Update = (req, res) => { //обновление существующей новости
	console.log(typeof req.params.id);
	News.findOneAndUpdate({_id: req.params.id}, {
			Theme: req.body.theme,
			Text: req.body.text,
			Date: Date.parse(req.body.date),
			UserId: mongoose.Types.ObjectId(req.body.userId)
	})
	.exec()
	.then((news) => {
		News.find()
			.then(newsCollection => {
				// console.log(newsCollection);
				const response = [];
				newsCollection.forEach((news) => { 
						response.push(newsMapper.Map(news));
				});
				// console.log(response);
				res.status(200).send(response); //отправляем ответ клиенту
				})
				.catch((err) => {
						res.status(500).send(`Error finding news: ${err.message}`);
				});
	})
	.catch((err) => {
			res.status(500).send(`Error updating news: ${err.message}`);
	});
};
// APIdb
//############ controllers/cats.js
const db = require('../models/db');
module.exports.getCats = function (req, res) {
  db
    .gets()
    .then((results) => { //получаем результаты
      if (results) {
        res.json(results); //выводим их
      } else {
        res
          .status(400)
          .json({err: 'Cats not found'}); //если null
      }
    })
    .catch((err) => { //если ошибка
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.getCat = function (req, res) {
  db
    .getById(req.params.id) //передаем id определенного кота
    .then((results) => {
      if (results) {
        res.json(results);
      } else { //нет кота
        res
          .status(400)
          .json({err: 'Cat not found'});
      }
    })
    .catch((err) => { // ошибка
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.addCat = function (req, res) {
  db
    .add(req.body) //пробрасываем данные через body
    .then((results) => {
      res
        .status(201)
        .json(results);
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.editCat = function (req, res) {
  db
    .update(req.body, req.params.id)
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res
          .status(400)
          .json({err: 'Cat not found'});
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.deleteCat = function (req, res) {
  db
    .delete(req.params.id)
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res
          .status(400)
          .json({err: 'Cat not found'});
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};

//############ models/db.js
const mongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://root:567234@ds121965.mlab.com:21965/it651'; //запись mlab
const isNotValid = data => {
  return !!!data.name || !!!data.age;
};
module.exports.gets = function () { //получить всех
  return new Promise((resolve, reject) => {
    mongoClient
      .connect(url, function (err, db) {
        if (err) {
          reject(err);
        }
        db
          .collection('cats')
          .find() //возвращает объект cursor
          .toArray(function (err, results) { //переводим его в массив
            if (err) {
              reject(err);
            }
            db.close(); //закрываем соединение с бд
            resolve(results);
          });
      });
  })
}
module.exports.getById = function (paramsId) {
  return new Promise((resolve, reject) => {
    const id = new ObjectID(paramsId);
    mongoClient.connect(url, function (err, db) {
      if (err) {
        reject(err);
      }
      db
        .collection('cats')
        .find({"_id": id})
        .toArray(function (err, cat) {
          if (err) {
            reject(err);
          }
          db.close();
          resolve(cat[0]);
        })
    })
  })
}
module.exports.add = function (data) {
  return new Promise((resolve, reject) => {
    if (isNotValid(data)) { //если нет поля name и age то возвращаем ошибку
      reject('Data format is not correct')
    }
    let Cat = { //создаем кота
      name: data.name,
      age: parseInt(data.age)
    };
    mongoClient.connect(url, function (err, db) {
      if (err) {
        reject(err);
      }
      db
        .collection('cats')
        .insertOne(Cat, function (err, result) { //добавляем кота в бд
          if (err) {
            reject(err);
          }
          db.close();
          resolve(result.ops[0]); //возвращаем результат
        });
    });
  })
}
module.exports.update = function (data, paramsId) {
  return new Promise((resolve, reject) => {
    const id = new ObjectID(paramsId);
    if (isNotValid(data)) {
      reject('Data format is not correct')
    }
    mongoClient
      .connect(url, function (err, db) {
        if (err) {
          reject(err);
        }
        let updateCat = {
          name: data.name,
          age: parseInt(data.age)
        };

        db
          .collection('cats')
          .findOneAndUpdate({
            _id: id
          }, {
            $set: updateCat
          }, {
            returnOriginal: false //возвращает обновленные данные
          }, function (err, result) {
            if (err) {
              reject(err);
            }
            db.close();
            resolve(result.value);
          });
      });
  })
}
module.exports.delete = function (paramsId) {
  return new Promise((resolve, reject) => {
    const id = new ObjectID(paramsId);
    mongoClient.connect(url, function (err, db) {
      if (err) {
        reject(err);
      }
      db
        .collection('cats')
        .deleteOne({
          _id: id
        }, function (err, result) {
          if (err) {
            reject(err);
          }
          db.close();
          if (result.result.n === 0) { //если 1 - то кот был удален, если 0 - то его нет
            resolve(null);
          } else {
            resolve({result: 'The cat was deleted'});
          }
        });
    });
  })
}
// APImongoose
//############ models/db.js
const mongoose = require('mongoose');
const Cats = require('./schema');
const isNotValid = data => {
  let isName = !!data.name;
  let isAge = !!data.age;
  return !isName || !isAge;
};
module.exports.gets = function () {
  return Cats.find()
};
module.exports.getById = function (paramsId) {
  return Cats.findById({"_id": paramsId})
};
module.exports.add = function (data) {
  if (isNotValid(data)) {
    return Promise.reject('Data format is not correct');
  }
  let Cat = new Cats({
    name: data.name,
    age: parseInt(data.age)
  });
  return Cat.save()
};
module.exports.update = function (data, paramsId) {
  if (isNotValid(data)) {
    return Promise.reject(new Error('Data format is not correct'));
  }
  let updateCat = {
    name: data.name,
    age: parseInt(data.age)
  };
  return Cats.findByIdAndUpdate({
    "_id": paramsId
  }, {
    $set: updateCat
  }, {new: true}) //возвращать новый объект
};
module.exports.delete = function (paramsId) {
  return Cats.findByIdAndRemove({"_id": paramsId})
};
//############ controllers/cats.js
const db = require('../models/db');
module.exports.getCats = function (req, res) {
  db
    .gets()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.getCat = function (req, res) {
  db
    .getById(req.params.id)
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res
          .status(400)
          .json({err: 'Cat not found'});
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.addCat = function (req, res) {
  db
    .add(req.body)
    .then((results) => {
      res
        .status(201)
        .json(results);
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.editCat = function (req, res) {
  db
    .update(req.body, req.params.id)
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res
          .status(400)
          .json({err: 'Cat not found'});
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.deleteCat = function (req, res) {
  db
    .delete(req.params.id)
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res
          .status(400)
          .json({err: 'Cat not found'});
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};



// *************************************************************************************
// Сокеты и работа с ними
// 01-ws
// app.js
const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({port: 8080}); //создаем сервер
const clients = []; //массив клиентов
webSocketServer.on('connection', ws => { //на событие подключения 
  const id = clients.length;
  clients[id] = ws; //в clients[id] лежат сокеты
  console.log(`Новое соединение ${id}`);
  // приветствуем клиента и сообщаем ему id (делаем json объект и отправляем его на клиент)
  clients[id].send(JSON.stringify({type: 'hello', message: `Приветствуем! ваш идентификатор  ${id}`, data: id}));
  // оповещаем всех клиентов, что к нам присоединился новый
  clients.forEach((elem) => {
    elem.send(JSON.stringify({type: 'info', message: `K нам присоединился #${id}`}));
  });
  ws.on('message', message => { //если отправлено сообщение, показываем всем клиентам его
    console.log(`Пoлyчeнo сообщение: ${message}`);
    clients.forEach((elem) => {
      elem.send(JSON.stringify({type: 'message', message: message, author: id}));
    });
  });
  ws.on('close', () => { //при закрытии соединения удаляем клиента
    console.log(`delete ${id}`);
    delete clients[id];
  });
  ws.on('error', err => console.log(err.message));
})
// main.js - client
// создаем соединение
const ws = new WebSocket('ws://localhost:8080');
// для клиентской части нужно поднять отдельный сервер (для index.html)
const form = document.querySelector('#send');
const message = document.querySelector('#message');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  ws.send(message.value);
})
ws.onmessage = function (e) {
  // парсим json в обычный объект
  const message = JSON.parse(e.data);
  let text = '';
  switch (message.type) {
    case 'info':
      {
        text = message.message
        break;
      }
    case 'message':
      {
        text = `${message.author} : ${message.message}`;
        break;
      }
    default:
      {
        alert(message.message);
        break;
      }
  }
  const result = document.getElementById('subscribe');
  const messageElem = document.createElement('div');
  messageElem.textContent = text;
  result.appendChild(messageElem);
}
// index.html
// <!DOCTYPE HTML>
// <html>
// <head>
//   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
//   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
//   <link rel="stylesheet" href="main.css">
// </head>
// <body>
//   <form id="send">
//     <input type="text" id="message" />
//     <button type="submit">Отnравить</button>
//   </form>
//   <div id="subscribe">
//   </div>
//   <script src="main.js"></script>
// </body>
// </html>

// 02-socket
// #### Предопределенные события сервера
// 1. connection - событие наступает при установке соединения с клиентом;
// 2. message - событие наступает при получении сообщения от клиента;
// 3. disconnect - дисконект, то есть разрыв соединения.
// #### События клиента
// 1. connecting - событие наступает в процессе установления соединения с сервером;
// 2. connect_failed - событие наступает при неудачной попытке соединения;
// 3. connect - событие наступает при установке соединения с сервером;
// 4. message - событие наступает при получении сообщения от сервера;
// 5. disconnect - событие наступает при разрыве соединения с сервером;
// 6. reconnecting (может возникать неоднократно) - событие наступает при попытке восстановления соединения;
// 7. reconnect - событие наступает при восстановлении соединения;
// 8. error - ошибки;
// 9. anything - свои события.

// app.js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
//статические ресурсы
app.use(express.static(path.join(__dirname, 'public')));
server.listen(3000, function () {
  console.log('Server running in port 3000');
});
const clients = {};
let count = 0;
io
  .sockets
  .on('connection', function (socket) {
    let id = count++;
    clients[id] = socket.id;
    console.log(clients);
    // socket.send - сообщение себе
    socket.send({type: 'hello', message: `Приветствуем! ваш идентификатор  ${id}`, data: id});
    socket.send({type: 'info', message: `K нам присоединился #${id}`});
    // socket.broadcast - сообщение всем остальным
    socket
      .broadcast
      .send({type: 'info', message: `K нам присоединился #${id}`});
    socket.on('message', message => {
      socket.send({type: 'message', message: message, author: id});
      socket
        .broadcast
        .send({type: 'message', message: message, author: id});
    });
    socket.on('disconnect', (data) => {
      delete clients[id];
      console.log(clients);
    });
  })
// public/main.js - client
// создаем соединение
const socket = io();
const form = document.querySelector('#send');
const message = document.querySelector('#message');
form.addEventListener('submit', function (e) {
  e.preventDefault();
  socket.send(message.value);
})
socket.on('message', (data) => {
  const message = data;
  let text = '';
  switch (message.type) {
    case 'info':
      {
        text = message.message
        break;
      }
    case 'message':
      {
        text = `${message.author} : ${message.message}`;
        break;
      }
    default:
      {
        alert(message.message);
        break;
      }
  }
  const result = document.getElementById('subscribe');
  const messageElem = document.createElement('div');
  messageElem.textContent = text;
  result.appendChild(messageElem);
})
// public/index.html
// <!DOCTYPE HTML>
// <html>
// <head>
//   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
//   <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
//   <link rel="stylesheet" href="main.css">
//   <!-- socket.io.js - появляется при подключении библиотеки socket.io -->
//   <script src="/socket.io/socket.io.js"></script> 
// </head>
// <body>
//   <form id="send">
//     <input type="text" id="message" />
//     <button type="submit">Отnравить</button>
//   </form>
//   <div id="subscribe">
//   </div>
//   <script src="main.js"></script>
// </body>
// </html>

// 03-chat
// app.js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const path = require('path');
//статические ресурсы
app.use(express.static(path.join(__dirname, 'public')));
server.listen(3000, function () {
  console.log('Server running in port 3000');
});
const users = {}; // все пользователи чата
const rooms = ['general', 'random', 'boltalka'];
io
  .sockets
  .on('connection', function (socket) {
    // функция возвращает массив пользователей, кто находится в комнате room
    let updateUsers = room => {
      // здесь будет список пользователей в комнате room
      let usersRoom = [];
      for (let i in users) {
        // в цикле проходим всех пользователей и если комнаты совпадают пушим в массив
        if (users[i].room === room) {
          usersRoom.push(users[i].name);
        }
      }
      return usersRoom;
    };
    // событие наступает когда пользователь впервые заходит в чат
    socket.on('adduser', function (username) {
      // установим комнату по умолчанию
      let defaultRoom = rooms[0];
      // создадим объект пользователя
      users[socket.id] = {};
      // присвоем ему его имя или по умолчанию Гость
      users[socket.id].name = username || 'Guest';
      // запомним его комнату
      users[socket.id].room = defaultRoom;
      // присоеденим его к команте по умолчанию
      socket.join(defaultRoom);
      // выполним событие updatechat для сообщения куда он попал
      socket
        .json
        .emit('updatechat', {
          name: 'System',
          msg: `<i>Вы попали в комнату ${defaultRoom}</i>`
        });
      // генерируем событие чтобы сгенерировать ссылки на комнаты на клиенте
      socket
        .json
        .emit('updaterooms', {rooms, current: defaultRoom});
      let newUsers = updateUsers(defaultRoom);
      // сообщаем пользователю список пользователей в комнате
      socket.emit('updateusers', newUsers);
      // сообщаем всем в комнате, что список пользоватлей поменялся
      socket
        .broadcast
        .to(defaultRoom)
        .emit('updateusers', newUsers);
    })
    // событие когда пользователь меняет комнату на другую
    socket.on('switchroom', function (newroom) {
      // запоминаем старую комнату пользователя
      let oldRoom = users[socket.id].room;
      // меняем комнаты у пользователя
      socket.leave(oldRoom);
      socket.join(newroom);
      // запоминаем новую комнату
      users[socket.id].room = newroom;
      // сообщаем пользователю в какую комнату он попал
      socket
        .json
        .emit('updatechat', {
          name: 'System',
          msg: `<i>Вы попали в комнату ${newroom}</i>`
        });
      // сообщаем в старую комнату, что пользователь ее покинул
      socket
        .broadcast
        .to(oldRoom)
        .json
        .emit('updatechat', {
          name: 'System',
          msg: `<i>${users[socket.id].name} покинул комнату</i>`
        });
      // сообщаем в новую комнату, что зашел новый пользователь
      socket
        .broadcast
        .to(newroom)
        .json
        .emit('updatechat', {
          name: 'System',
          msg: `<i>${users[socket.id].name} присоединился к комнате</i>`
        });
      // пересоздаем на клиенте список комнат куда можно перейти
      socket.emit('updaterooms', {rooms, current: newroom});
      let newUsers = updateUsers(newroom);
      // у пользователя формируем новый список пользователей комнаты
      socket.emit('updateusers', newUsers);
      socket
        .broadcast
        .to(newroom)
        .emit('updateusers', newUsers);
      // в старой комнате формируем новый список пользователей комнаты другим
      // пользователям
      socket
        .broadcast
        .to(oldRoom)
        .emit('updateusers', updateUsers(oldRoom));
    });
    // обрабатываем событие когда пользователь, что-то написал в чат
    socket.on('message', function (data) {
      // возвращаем пользователю то, что он написал обратно
      socket
        .json
        .emit('updatechat', {
          name: users[socket.id].name,
          msg: data
        });
      // сообщаем всем пользователям комнаты, что написал пользователь
      socket
        .broadcast
        .to(users[socket.id].room)
        .json
        .emit('updatechat', {
          name: users[socket.id].name,
          msg: data
        });
    });
    socket.on('disconnect', function (data) {
      // запоминаем текущую комнату пользователя
      let room = users[socket.id].room;
      // покидаем комнату
      socket.leave(room);
      // сообащем в комнату, что пользователь ушел с чата
      socket
        .broadcast
        .to(room)
        .json
        .emit('updatechat', {
          name: 'System',
          msg: `<i>${users[socket.id].name} покинул чат</i>`
        });
      // удаляем пользователя
      delete users[socket.id];
      // в команте обновляем список пользователей на клиенте
      socket
        .broadcast
        .to(room)
        .emit('updateusers', updateUsers(room));
    });
  });
// public/js/main.js
const socket = io();
// событие происходит при присоединении к чату
socket.on('connect', function () {
  // спрашиваем польззователя как его зовут и отправляем на сервер событие
  socket.emit('adduser', prompt('Как вас зовут?'));
});
// обрабатываем от сервера событие обновить пользователей
socket.on('updateusers', function (data) {
  console.log('updateusers: ', data);
  // очищаем список пользователей
  $('.users__list').empty();
  // и заново формируем
  data.forEach(element => {
    $('.users__list').append(`<li class="users__item">${element}</li>`);
  });
});
// получаем событие что комната изменилась
socket.on('updaterooms', function (data) {
  console.log('updaterooms: ', data);
  $('#room').text(data.current);
  $('.rooms__list').empty();
  data
    .rooms
    .forEach(element => {
      if (element === data.current) {
        $('.rooms__list').append(`<li class="rooms__item">${element}</li>`);
      } else {
        $('.rooms__list').append(`
        <li class="rooms__item">
          <a href="#" id=${element}>
          ${element}
          </a>
        </li>`);
      }
    });
  // вешаем события на комнаты
  $('a').on('click', function (e) {
    e.preventDefault();
    let room = $(this).attr('id');
    socket.emit('switchroom', room);
  })
});
// событие чат изменился
socket.on('updatechat', function (data) {
  console.log('updatechat: ', data);
  // добавляем сообщение в чат
  let div = document.createElement('DIV');
  let b = document.createElement('B');
  b.textContent = data.name;
  let text = document.createTextNode(data.msg);
  div.appendChild(b);
  div.appendChild(text);
  $('.chat').prepend(div);
});
$(function () {
  // событие отправки сообщения с формы
  $('.msg')
    .on('submit', function (e) {
      e.preventDefault();
      const message = $('#msg').val();
      $('#msg').val('');
      socket.send(message); // socket.emit('message', message)
    });
  // можем отправить нажатием клавиши
  $('#msg').on('keypress', function (e) {
    if (e.which == 13) {
      $('.msg').submit();
      e.preventDefault();
    }
  });
});
// public/index.html
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <meta http-equiv="X-UA-Compatible" content="ie=edge">
//   <link rel="stylesheet" href="./css/style.css">
//   <script src="/socket.io/socket.io.js"></script>
//   <script
//   src="https://code.jquery.com/jquery-3.2.1.min.js"
//   integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
//   crossorigin="anonymous"></script>
//   <title>Chat</title>
// </head>
// <body>
//   <div class="wrapper">
//     <div class="header">
//       Наш простой чат на Socket.io
//     </div>
//     <div class="content">
//       <sidebar class="sidebar">
//         <div class="users">
//           <div class="users__title">Текущие пользователи: <span id='room'></span></div>
//           <ul class="users__list">
//             <li class="users__item">Test</li>
//           </ul>
//         </div>
//         <div class="rooms">
//           <div class="rooms__title">Текущие комнаты</div>
//           <ul class="rooms__list">
//             <li class="rooms__item">First</li>
//             <li class="rooms__item">Second</li>
//             <li class="rooms__item">Third</li>
//           </ul>
//         </div>
//       </sidebar>
//       <main class="main">
//         <form action="" class="msg">
//           <input type="text" id="msg" class="msg__input">
//           <button type="submit" class="msg__btn">Отправить</button>
//         </form>
//         <div class="chat">
//         </div>
//       </main>
//     </div>
//   </div>
//   <script src="./js/main.js"></script>
// </body>
// </html>

// ***************************************************************************************************************************
// Авторизация и аутентификация
// ***************************************************************************************************************************
// Модель пользователя
// Для начала, я думаю, можно создать модель пользователя:
var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});
mongoose.model('user', UserSchema);
// Здесь можно было бы посолить пароль, и добавить немного магии безопасности для бога безопасности, но я оставляю это на вас =).
// Стратегия авторизации
// Верификация
// Подключим и настроим стратегию авторизации. 
var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function(username, password,done){
  User.findOne({ username : username},function(err,user){
    return err 
      ? done(err)
      : user
        ? password === user.password
          ? done(null, user)
          : done(null, false, { message: 'Incorrect password.' }) //3й параметр - info
        : done(null, false, { message: 'Incorrect username.' });
  });
}));
// LocalStrategy принимает 2 параметра: объект с опциями и middleware для верификации пользователя. 
// По-умолчанию, если в `LocalStrategy` не передавать никаких опций — стратегия будет искать параметры для авторизации пользователя в формах с именами `username` и `password`. При желании, можно указать свои имена форм, как я, собственно, и сделал.
// Второй аргумент — middleware — принимает параметры `username`, `passport` и `done`. В done, вторым аргументом, передаем объект пользователя, если такой есть. 
// Привязка авторизации к пользователю
// В типичном веб-приложении, учетные данные, используемые для аутентификации пользователя будет передаваться только во время авторизации. Если все в порядке, и пользователь существует, то информация о нем сохраняется в сессию, а идентификатор сессии, в свою очередь, сохраняется в cookies браузера.
// Каждый последующй запрос будет содержать cookies, с помощью которого passport сможет опознать пользователя, и достать его данные из сессии. Для того, чтобы сохранять или доставать пользовательские данные из сессии, паспорт использует функции `passport.serializeUser()` и `passport.deserializeUser()`. 
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err,user){
    err 
      ? done(err)
      : done(null,user);
  });
});
// Подключение Passport к Express
// Окей, с этим разобрались, теперь нужно подключить Passport к Express:
// Middlewares, которые должны быть определены до passport:
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'SECRET' }));
// Passport:
app.use(passport.initialize());
app.use(passport.session());
// Создание роутера и контроллеров
// Настало время настройки роутера. Привяжем запросы к соответствующим контроллерам:
// Auth system
app.post('/login', controllers.users.login);
app.post('/register', controllers.users.register);
app.get('/logout', controllers.users.logout);
// Теперь создадем сами контроллеры:
// Здесь мы проверяем, передаем данные о пользователе в функцию верификации, котоую мы определили выше. 
// Вообще, passport.authenticate() вызывает метод req.logIn автоматически, здесь же я указал это явно. Это добавляет удобство в отладке. Например, можно вставить сюда console.log(), чтобы посмотреть, что происходит...
// При удачной авторизации данные пользователя будут храниться в req.user
module.exports.login = function(req, res, next) {
  passport.authenticate('local',
    function(err, user, info) { //info передавался 3м параметром в new LocalStartegy
      return err 
        ? next(err)
        : user
          ? req.logIn(user, function(err) {
              return err
                ? next(err)
                : res.redirect('/private');
            })
          : res.redirect('/');
    }
  )(req, res, next);
};
// Здесь все просто =)
module.exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};
// Регистрация пользователя. Создаем его в базе данных, и тут же, после сохранения, вызываем метод `req.logIn`, авторизуя пользователя
module.exports.register = function(req, res, next) {
  var user = new User({ username: req.body.email, password: req.body.password});
  user.save(function(err) {
    return err
      ? next(err)
      : req.logIn(user, function(err) {
        return err
          ? next(err)
          : res.redirect('/private');
      });
  });
};
// Проверка авторизации
// Проверку авторизации можно делать с помощью req.isAuthenticated(). Я вынесу проверку в middleware.
exports.mustAuthenticatedMw = function (req, res, next){
  req.isAuthenticated()
    ? next()
    : res.redirect('/');
};
// И добавлю в routes.
App.all('private', mustAuthenticatedMw);
App.all('private/*', mustAuthenticatedMw);

// 01-example-passport
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session); //для хранения сессий
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({store: new FileStore(), secret: 'secret of loftschool', resave: false, saveUninitialized: true}));
// хранилище пользователей, в примере он один и хранится в объекте
const userDB = {
  id: '1',
  email: 'loft@loftschool.com',
  password: 'password'
};
// описываем локальную стратегию аутентификации
passport.use(new LocalStrategy({
  usernameField: 'email'
}, (email, password, done) => {
  // Сравниваем пользователя из хранилища (в нашем случае это объект) с тем что
  // пришло с POST запроса на роутер /login в полях email и password
  if (email === userDB.email && password === userDB.password) {
    // если они совпадают передаем объект user в callback функцию done
    console.log('Возвращаем пользователя: ' + JSON.stringify(userDB));
    return done(null, userDB);
  } else {
    // если не соответствуют то отдаем false
    return done(null, false);
  }
}));
passport.serializeUser((user, done) => {
  console.log('Сериализация: ' + JSON.stringify(user));
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  // здесь необходимо найти пользователя с данным id но он у нас один и мы просто
  // сравниваем
  console.log('Десериализация: ' + id);
  const user = (userDB.id === id)
    ? userDB
    : false;
  done(null, user);
});
app.use(passport.initialize());
app.use(passport.session());
// роуты
app.get('/', (req, res) => {
  res.send('Это главная страница');
});
app.get('/login', (req, res) => {
  res.send('Это страница авторизации, отправьте сюда POST запрос {email, password}');
});
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send('Укажите правильный email и пароль!');
    }
    req.login(user, err => {
      return res.send('Вы удачно прошли аутентификацию!');
    });
  })(req, res, next);
});
app.get('/secret', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Вы прошли авторизацию и оказались на закрытой странице');
  } else {
    res
      .status(403)
      .send('Доступ запрещен');
  }
});
app.listen(3000, () => {
  console.log('Сервер запущен на localhost:3000');
});
// 02-passport-github
// bin/www

// #!/usr/bin/env node
/**
 * Module dependencies.
 */
var app = require('../app');
var debug = require('debug')('app-passport:server');
var http = require('http');
/**
 * Get port from environment and store in Express.
 */
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
/**
 * Create HTTP server.
 */
var server = http.createServer(app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
// app.js
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); //позволяет хранить сессии в бд
const passport = require('passport');
mongoose.Promise = global.Promise; //говорим mongoose использовать глобальные промисы(так как своих у него нет)
// useMongoClient - нужен для 4 версии, для 5 нет
mongoose.connect('mongodb://admin:567234a@ds135537.mlab.com:35537/passport', {useMongoClient: true});
require('./models/user'); //подключаем модель пользователя
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  key: 'keys',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}) //сессия будет храниться в монго
}));
require('./config/config-passport'); //стратегии аутентификации (локальная, гитхаб)
app.use(passport.initialize());
app.use(passport.session());
//Маршруты
app.use('/', require('./routes/index'));
app.use('/private', require('./routes/private'));
app.use('/auth', require('./routes/github'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req
    .app
    .get('env') === 'development'
    ? err
    : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
// ######## addUser.js
'use strict';
/*
 Задача скрипта - создать нового пользователя
 */
//подключаем модули
const mongoose = require('mongoose');
const readline = require('readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:567234a@ds135537.mlab.com:35537/passport', {useMongoClient: true});
//логин и пароль, изначально пустые
let login = '',
  password = '';
//спрашиваем логин
rl.question('Логин: ', answer => {
  //записываем введенный логин
  login = answer;
  //спрашиваем пароль
  rl.question('Пароль: ', answer => {
    //записываем введенный пароль
    password = answer;
    //завершаем ввод
    rl.close();
  });
});
//когда ввод будет завершен
rl.on('close', () => {
  //подключаем модель пользователя
  require('./models/user');
  //создаем экземпляр пользователя и указываем введенные данные
  const User = mongoose.model('login');
  const adminUser = new User({login: login});
  adminUser.setPassword(password);
  //пытаемся найти пользователя с таким логином
  User
    .findOne({login: login})
    .then(u => {
      //если такой пользователь уже есть - сообщаем об этом
      if (u) {
        throw new Error('Такой пользователь уже существует!');
      }
      //если нет - добавляем пользователя в базу
      return adminUser.save();
    })
    .then(u => console.log('ok!'), e => console.error(e.message))
    .then(() => mongoose.connection.close(function () {
      process.exit(0);
    }));
});
// ########## routes/github.js
const express = require('express');
const router = express.Router();
const passport = require('passport');
router.get('/github', passport.authenticate('github'), function (req, res) {});
router.get('/github/callback', passport.authenticate('github', {failureRedirect: '/'}), function (req, res) {
  res.redirect('/private');
});
module.exports = router;
// ########### routes/index.js
var express = require('express');
var router = express.Router();
const passport = require('passport');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Passport' });
});
router.post('/submit', (req, res, next) => {
  passport.authenticate('loginUsers', (err, user) => { //loginUsers - задается в config-passport.js
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({status: 'Укажите правильный логин и пароль!'}) //json обрабатывается на клиенте в main.js
    }
    req
      .logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.json({status: 'Все ок, Добро пожаловать'});
      });
  })(req, res, next);
});
router.post('/del', (req, res) => {
  req.session.destroy();
  res.json({status: 'Сессия удалена'});
});
module.exports = router;
// ########## routes/private.js
const express = require('express');
const router = express.Router();
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) { 
    return next();
  }
  res
    .status(401)
    .render('denied', {});
}
router.get('/', isLoggedIn, (req, res) => { //если аутентификация пройдена рендерим admin, если нет - denied
  res.render('admin', {});
});
module.exports = router;
// ######### models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bCrypt = require('bcryptjs');
const UserSchema = new Schema({
    login: {
      type: String,
      required: [true, 'Укажите логин']
    },
    hash: String
  });
  UserSchema.methods.setPassword = function (password) {
    this.hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };
  UserSchema.methods.validPassword = function (password) {
    return bCrypt.compareSync(password, this.hash);
  };
//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('login', UserSchema);
// ######### config/config.js
module.exports = {
  github: {
      clientID: '4cbf11707d238ed79f0e',
      clientSecret: '619e65e95fd1544a075b1b32cca22fe9f5fc8859',
      callbackURL: "http://localhost:3000/auth/github/callback"
  }
};
// ########### config/config-passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const config = require('./config');
const mongoose = require('mongoose');
require('../models/user');
const User = mongoose.model('login');
passport.serializeUser(function (user, done) {
  console.log(user);
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  if (!mongoose.Types.ObjectId.isValid(id)) { //если id не мангусовский, значит гитхабовский
    done(null, id);
  } else { //мангусовский ищем в бд
    User
      .findById(id, function (err, user) {
        done(err, user);
      });
  }
});
// локальная стратегия
passport.use('loginUsers', new LocalStrategy((username, password, done) => {
  console.log(username);
  User
    .findOne({login: username})
    .then(user => {
      console.log(user);
      if (user.validPassword(password)) {
        console.log(user);
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
}));
passport.use(new GithubStrategy({
  clientID: config.github.clientID,
  clientSecret: config.github.clientSecret,
  callbackURL: config.github.callbackURL
}, function (accessToken, refreshToken, profile, done) {
  console.log('profile: ' + JSON.stringify(profile));
  return done(null, profile);
}));
// ########## public/javascript/main.js
const status = document.querySelector('.status');
const del = document.querySelector('.del');
const form = document.querySelector('#form');
form.addEventListener('submit', function(e) {
  e.preventDefault();
  let data = {
    username : form.username.value,
    password : form.password.value
  };
  sendData('/submit', data);
});
form.addEventListener('reset', function(e) {
  status.innerHTML =  '';
});
del.addEventListener('click', function(e) {
  e.preventDefault();
  sendData('/del', {});
});
function sendData(url, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(data));
  xhr.onreadystatechange = function() {
      if (this.readyState != 4) return;
      if (xhr.status != 200) {
          console.warn( xhr.status + ': ' + xhr.statusText );
      }
      var result = JSON.parse(xhr.responseText);
      status.innerHTML =  result.status;
  }
}
// 03-passport-registration
// файл bin/www - в примере выше
// app.js
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://loftschool:567234@ds123080.mlab.com:23080/myportfolio', {useMongoClient: true});
require('./models/user'); //схема просто юзера
require('./models/logintoken'); //схема для залогиненного юзера
const index = require('./routes/index');
const reg = require('./routes/reg');
const tokenReq = require('./routes/login-token');
const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  key: 'keys',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(flash());
require('./config/config-passport');
app.use(passport.initialize());
app.use(passport.session());
app.use('*', tokenReq);
app.use('/', index);
app.use('/registration', reg);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req
    .app
    .get('env') === 'development'
    ? err
    : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
// ######### routes/index.js
var express = require('express');
var router = express.Router();
const passport = require('passport');
const uuidv4 = require('uuid/v4'); //генерация уникального токена
const mongoose = require('mongoose');
const User = mongoose.model('user');
const loginToken = mongoose.model('loginToken');
const setCookie = require('../lib/setcookie');
var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('message', 'Зарегистрируйтесь или войдите в профиль');
  res.redirect('/');
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user, message: req.flash('message') });
});
router.post('/login', (req, res, next) => {
  passport.authenticate('loginUsers', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('message', ' укажите правильный логин и пароль!');
      return res.redirect('/');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      if (req.body.remember) {
        let data = {};
        data.series = uuidv4();
        data.token = uuidv4();
        data.login = user.login;
        let recordDb = new loginToken(data); //в итоге получается 2 коллекции, для пользователей и пользователей которые поставили галочку запомнить (с 2мя токенами)
        loginToken
          .remove({ login: user.login }) //удаляем запись для текущего пользователя, если она есть (полностью)
          .then(user => {
            recordDb
              .save() //сохраняем текущего пользователя
              .then(user => {
                setCookie(res, {series: user.series, token: user.token, login: user.login}); //устанавливаем куки на клиенте
                return res.redirect('/profile');
              })
              .catch(next);
          })
          .catch(next);
      } else {
        return res.redirect('/profile'); //если чекбокс запомнить не поставлена
      }
    });
  })(req, res, next);
});
// router.post('/login', passport.authenticate('loginUsers', {
//   successRedirect: '/profile',
//   failureRedirect: '/',
//   failureFlash: true
// }));
router.get('/profile', isAuthenticated, function(req, res) {
  res.render('profile', { user: req.user, message: req.flash('message') });
});
router.get('/out', function(req, res) {
  req.logout();
  // res.clearCookie('logintoken');
  res.redirect('/');
});
module.exports = router;
// ######### routes/reg.js
var express = require('express');
var router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const bCrypt = require('bcrypt-nodejs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('reg', { message: req.flash('message') });
});
router.post('/', function(req, res, next) {
  User.findOne({ login: req.body.username })
    .then(user => {
      if (user) {
        req.flash('message', 'Пользователь с таким логином уже существует');
        res.redirect('/registration');
      } else {
        const newUser = new User();
        newUser.login = req.body.username;
        newUser.password = createHash(req.body.password);
        newUser.email = req.body.email;
        newUser.name = req.body.name;
        newUser
          .save()
          .then(user => {
            req.logIn(user, function(err) { //сразу залогиниваем юзера
              if (err) {
                return next(err);
              }
              req.flash('message', 'User create');
              return res.redirect('/profile');
            });
          })
          .catch(next);
      }
    })
    .catch(next);
});
var createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
module.exports = router;
// ######### routes/login-token.js
const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const loginToken = mongoose.model('loginToken');
const asyncMiddleware = require('../middleware/asyncmiddleware');
const setCookie = require('../lib/setcookie');
const isValidCookie = (cookieSeries, userSeries) => {
  return cookieSeries === userSeries ? true : false;
};
const isValidToken = (cookieToken, userToken) => {
  return cookieToken === userToken ? true : false;
};
const registerUser = async (req, res, login) => {
  let token = uuidv4(); //создаем новый токен
  await loginToken.update({ login }, { $set: { token } }); //обновляем токен у юзера
  let loginUser = await loginToken.findOne({ login }); //ищем юзера
  setCookie(res, loginUser); //устанавливаем куку
  let user = await User.findOne({ login }); //ищем юзера
  return new Promise((resolve, reject) => {
    req.logIn(user, err => { //логиним юзера
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};
router.get('/', asyncMiddleware(async (req, res, next) => {
  if (!!req.cookies.logintoken) { //если есть кука
    let objTokens = JSON.parse(req.cookies.logintoken); //вытаскиваем из нее объект
    let login = objTokens.login;
    let user = await loginToken.findOne({ login }); //ищем ющера по логину
    if (!!user && isValidCookie(objTokens.series, user.series)) { //есть ли юзер и валидна ли кука
      if (isValidToken(objTokens.token, user.token)) { //совпадает ли токен в бд и токен в куке
        await registerUser(req, res, login); //регистрируем юзера
      } else {
        req.flash(
          'message',
          'Внимание!  Похоже вы утратили контроль над своим аккаунтом. Смените срочно пароль!'
        );
        res.clearCookie('logintoken'); //чистим куку
        await loginToken.remove({ login }); //удаляем юзера
      }
    }
  }
  next();
}));
module.exports = router;
// ########## models/logintoken.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const  loginToken = new Schema({
    login: {
      type: String
    },
    series: {
      type: String
    },
    token: {
      type: String
    }
  });
//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('loginToken', loginToken);
// ########## models/user.js
const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  UserSchema = new Schema({
    login: {
      type: String,
      required: [true, 'Укажите логин']
    },
    password: {
      type: String,
      required: [true, 'Укажите пароль']
    },
    email: {
      type: String
    },
    name: {
      type: String,
      set: i => (i == '' ? 'Anonim' : i)
    }
  });
//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('user', UserSchema);
// ########### middleware/asyncmiddleware.js
// для того чтобы не отлавливать ошибки у каждого async/await в try/catch (для чистоты кода)
const asyncMiddleware = fn => //функция, которая принимает функцию
  (req, res, next) => { //возвращает промис
    Promise.resolve(fn(req, res, next)) //промис резолвится с переданной функцией
      .catch(next); //ошибки пробрасываются дальше
  };
module.exports = asyncMiddleware;
// ########## lib/setcookie.js
module.exports = (res, data) => {
  res.cookie('logintoken', JSON.stringify(data), {
    //TODO change maxAge
    expires: new Date(Date.now() + 2 * 604800000),
    path: '/'
  });
}
// ########## config/config-passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bCrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const User = mongoose.model('user');
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ', user);
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser: ', id);
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// локальная стратегия
passport.use(
  'loginUsers',
  new LocalStrategy(
    {
      passReqToCallback: true //для прокадывания req в колбэк
    },
    (req, username, password, done) => {
      User.findOne({ login: username })
        .then(user => {
          if (!user) {
            return done(
              null,
              false,
              req.flash('message', 'Пользователь не найден') //пользуемся прокинутым колбэком
            );
          }
          if (!isValidPassword(user, password)) {
            return done(null, false, req.flash('message', 'Не верный пароль'));
          }
          return done(null, user);
        })
        .catch(err => {
          done(err);
        });
    }
  )
);
const isValidPassword = function(user, password) {
  return bCrypt.compareSync(password, user.password);
};
// 04-jwt-api
// ######### app.js
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require("jwt-simple"); //jwt - авторизация для API, генерирует токен
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const config = require('./config/config');
const routerCats = require('./routes/cats');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:567234@ds121965.mlab.com:21965/it651', {useMongoClient: true});
require('./models/user');
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// parse application/json
app.use(bodyParser.json())
app.use(session({
  secret: 'secret',
  key: 'keys',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
require('./config/passport-config');
app.use(passport.initialize({userProperty: 'payload'})); //указываем что в поле хранится payload
app.use(passport.session());
app.post('/token', function (req, res, next) {
  passport.authenticate('loginUsers', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({status: 'Укажите правильный логин и пароль!'});
    }
    req
      .logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        var payload = {
          id: user.id
        };
        var token = jwt.encode(payload, config.secret); // line 10 passport-config, генерируем токен
        res.json({token: token}); //отправляем токен клиенту, на клиенте его нужно сохранить(куки, localStorage)
      });
  })(req, res, next);
});
app.use('/api/cats', routerCats);
app.use((req, res, next) => {
  res
    .status(404)
    .json({err: '404'});
});
app.use((err, req, res, next) => {
  console.log(err.stack);
  res
    .status(500)
    .json({err: '500'});
})
app.listen(3000, function () {
  console.log('Server running. Use our API');
})
// ######### addUser.js
'use strict';
/*
 Задача скрипта - создать нового пользователя
 */
//подключаем модули
const mongoose = require('mongoose');
const readline = require('readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:567234@ds121965.mlab.com:21965/it651', {useMongoClient: true});
  //логин и пароль, изначально пустые
let login = '',
password = '';
//спрашиваем логин
rl.question('Логин: ', answer => {
  //записываем введенный логин
  login = answer;
  //спрашиваем пароль
  rl.question('Пароль: ', answer => {
    //записываем введенный пароль
    password = answer;
    //завершаем ввод
    rl.close();
  });
});
//когда ввод будет завершен
rl.on('close', () => {
  //подключаем модель пользователя
  require('./models/user');
  //создаем экземпляр пользователя и указываем введенные данные
  const User = mongoose.model('login');
  const adminUser = new User({login: login});
  adminUser.setPassword(password);
  //пытаемся найти пользователя с таким логином
  User
    .findOne({login: login})
    .then(u => {
      //если такой пользователь уже есть - сообщаем об этом
      if (u) {
        throw new Error('Такой пользователь уже существует!');
      }
      //если нет - добавляем пользователя в базу
      return adminUser.save();
    })
    .then(u => console.log('ok!'), e => console.error(e.message))
    .then(() => mongoose.connection.close(function () {
      process.exit(0);
    }));
});
// ########### routes/cats.js
const express = require('express');
const router = express.Router();
const ctrlCats = require('../controllers/cats');
var passport = require('passport');
let auth = passport.authenticate('jwt', { //jwt - стратегия из passport-config.js
  session: false //указываем, что сессии не нужны
});
router.get('/', auth, ctrlCats.getCats);
router.get('/:id', auth, ctrlCats.getCat);
router.post('/', auth, ctrlCats.addCat);
router.put('/:id', auth, ctrlCats.editCat);
router.delete('/:id', auth, ctrlCats.deleteCat);
module.exports = router;
// ######### controllers/cats.js
const db = require('../models/db');
module.exports.getCats = function (req, res) {
  db
    .gets()
    .then((results) => {
      res.json(results);
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.getCat = function (req, res) {
  db
    .getById(req.params.id)
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res
          .status(400)
          .json({err: 'Cat not found'});
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.addCat = function (req, res) {
  db
    .add(req.body)
    .then((results) => {
      res
        .status(201)
        .json(results);
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.editCat = function (req, res) {
  db
    .update(req.body, req.params.id)
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res
          .status(400)
          .json({err: 'Cat not found'});
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
module.exports.deleteCat = function (req, res) {
  db
    .delete(req.params.id)
    .then((results) => {
      if (results) {
        res.json(results);
      } else {
        res
          .status(400)
          .json({err: 'Cat not found'});
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({err: err.message});
    })
};
// ########### models/cats.js
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let catSchema = new Schema({
  name: {
    type: String,
    required: [
      true, 'Укажите имя кота'
    ],
    unique: true
  },
  age: {
    type: Number
  }
});
const Cat = mongoose.model('cat', catSchema);
module.exports = Cat;
// ########### models/db.js
const mongoose = require('mongoose');
const Cats = require('./cats');
const isNotValid = data => {
  let isName = !!data.name;
  let isAge = !!data.age;
  return !isName || !isAge;
};
module.exports.gets = function () {
  return Cats.find()
};
module.exports.getById = function (paramsId) {
  return Cats.findById({"_id": paramsId})
};
module.exports.add = function (data) {
  if (isNotValid(data)) {
    return Promise.reject('Data format is not correct');
  }
  let Cat = new Cats({
    name: data.name,
    age: parseInt(data.age)
  });
  return Cat.save()
};
module.exports.update = function (data, paramsId) {
  if (isNotValid(data)) {
    return Promise.reject(new Error('Data format is not correct'));
  }
  let updateCat = {
    name: data.name,
    age: parseInt(data.age)
  };
  return Cats.findByIdAndUpdate({
    "_id": paramsId
  }, {
    $set: updateCat
  }, {new: true})
};
module.exports.delete = function (paramsId) {
  return Cats.findByIdAndRemove({"_id": paramsId})
};
// ######## models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bCrypt = require('bcryptjs');
const UserSchema = new Schema({
  login: {
    type: String,
    required: [true, 'Укажите логин']
  },
  hash: String
});
UserSchema.methods.setPassword = function(password) {
  this.hash = bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
UserSchema.methods.validPassword = function(password) {
  return bCrypt.compareSync(password, this.hash);
};
//просим mongoose сохранить модель для ее дальнейшего использования
mongoose.model('login', UserSchema);
// ########### config/passport-config.js
const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy; //нужна чтобы получить токен
const mongoose = require('mongoose');
const User = mongoose.model('login');
const config = require('./config');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() //указываем, что токен будет передаваться через заголовок
};
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
passport.use(
  'loginUsers',
  new LocalStrategy((username, password, done) => {
    User.findOne({ login: username })
      .then(user => {
        if (user.validPassword(password)) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch(err => {
        console.log(err);
        done(err);
      });
  })
);
var strategy = new Strategy(params, function(payload, done) {
  const User = mongoose.model('login');
  User.find({ id: payload.id })
    .then(user => {
      if (user) {
        return done(null, {
          id: user.id
        });
      } else {
        return done(new Error('User not found'), null);
      }
    })
    .catch(err => {
      console.log(err);
      done(err);
    });
});
passport.use(strategy);
// ########### config/config.json
// {
//   "secret" : "secret"
// }

// *************************************************************************************
// Тестирование
// *************************************************************************************
// Test-driven development (TDD)
// Пишем несколько тестов.
// Запускаем эти тесты и (очевидно) они терпят неудачу, потому что
// ни одна из этих функций еще не реализована.
// Реализуем эти тесты в коде.
// Если все хорошо, то тесты проходят.
// Затем следующая итерация.

// Behavior-driven development (BDD)
// описываем поведение и спецификации (описываем что должно
// происходить, каково поведение функции. Пишем, не что мы
// проверяем, а то, что мы ожидаем от работы еще не реализованной
// функциональности
// Пишем несколько тестов.
// Запускаем эти тесты
// Реализуем эти тесты в коде.
// Если все хорошо, то тесты проходят.
// Затем следующая итерация.

// Spy
// - используется для интеграционных тестов, основной функцией
// является запись данных и вызовов, поступающих из тестируемого
// объекта для последующей проверки корректности вызова зависимого
// объекта. Позволяет проверить логику именно нашего тестируемого
// объекта, без проверок зависимых объектов.
it('should call method once with each argument', function () {
  var object = { method: function () {} };
  var spy = sinon.spy(object, "method");
  object.method(42);
  object.method(1);
  assert(spy.withArgs(42).calledOnce);
  assert(spy.withArgs(1).calledOnce);
})

// Stub
// - заглушка, используется для получения данных из внешней
// зависимости, подменяя её. При этом игнорирует все данные, могущие
// поступать из тестируемого объекта в stub. Один из самых популярных
// видов тестовых объектов.
it('test should stub method differently based on arguments', function () {
  var callback = sinon.stub();
  callback.withArgs(42).returns(1);
  callback.withArgs(1).throws("TypeError");
  callback(); // No return value, no exception
  callback(42); // Returns 1
  callback(1); // Throws TypeError
})

// Mock
// - очень похож на spy, однако не записывает последовательность вызовов с
// переданными параметрами для последующей проверки, а может сам выкидывать
// исключения при некорректно переданных данных. Т.е. именно мок-объект проверяет
// корректность поведения тестируемого объекта.
it('test should call all subscribers when exceptions', function () {
  var myAPI = { method: function () {} };
  var spy = sinon.spy();
  var mock = sinon.mock(myAPI);
  mock.expects("method").once().throws();
  PubSub.subscribe("message", myAPI.method);
  PubSub.subscribe("message", spy);
  PubSub.publish("message", "hello !");
  mock.verify();
  assert(spy.calledOnce);
})

// на примере кода из урока по REST API
// ########### test/helpers.js
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const server = require('../server');
chai.use(chaiHttp);
// chai - assert для tdd, expect и should для bdd
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./db.json');
const db = low(adapter);
global.server = server;
global.expect = expect;
global.request = chai.request(server);
global.db = db;
// ########### test/api.get.test.js
  // const chai = require('chai');
  // const expect = chai.expect;
  // const chaiHttp = require('chai-http');
  // const server = require('../server');
  // chai.use(chaiHttp);
  describe('initial test', function () {
    it('should true to be true', function () {
      expect(true).to.be.true;
    });
    it.skip('postpone your assertion', () => {
    });
    it.skip('postpone your assertion')
  });
// Test the /GET route
describe('/GET users', () => {
  // it('it should GET all the users', (done) => {
  //   chai.request(server)
  //     .get('/api/v1.0/users')
  //     .end((err, res) => {
  //       expect(res).to.have.status(200);
  //       expect(res.body).to.be.a('array');
  //       expect(res.body.length).to.not.be.equal(0);
  //       done();
  //     });
  // });
  // использование колбэка - способ работы с асинхронностью
  it('it should GET all the users', (done) => {
    request //global.request = chai.request(server); в helpers.js
      .get('/api/v1.0/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.not.be.equal(0);
        done(); //сообщаем моке, что асинхронная проверка завершилась
      });
  });
  it('it should return a right error for the wrong GET request', (done) => {
    request
      .get('/api/v1.0/user')
      .end((err, res) => {
        if (err || !res.ok) {
          expect(err).to.have.status(404);
          done();
        } else {
          done(new Error('the route is not wrong'));
        }
      });
  });
});
describe('GET /users/:id', () => {
  it('it should return the user by id', (done) => {
    const user = db.get('users').first().value();
    const userId = db.get('users').value().indexOf(user);
    request
      .get('/api/v1.0/users/' + userId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(user);
        done();
      });
  });
  it('it should return status 404 when user id is not found', (done) => {
    const userId = 'fake id';
    request
      .get('/api/v1.0/users/' + userId)
      .end((err, res) => {
        if (err || !res.ok) {
          expect(err).to.have.status(404);
          done();
        } else {
          done(new Error('the id is found'));
        }
      });
  });
});
// ########### test/api.post.test.js
// Test the /POST route
describe('/POST users', () => {
  it.skip('it should POST a user', (done) => {
    const user = {
      firstName: 'testUser'
    };
    request
      .post('/api/v1.0/users')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('message').equal('User added');
        expect(res).to.have.header('Location');
        expect(res.headers.location).to.match(/^http:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/);
        done();
      });
  });
  it('it should not POST a user without required field', (done) => {
    const user = {};
    request
      .post('/api/v1.0/users')
      .send(user)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.a('object');
        expect(res).to.not.have.header('Location');
        done();
      });
  });
});
// ########### test/api.delete.test.js
// Test the /DELETE route
describe('DELETE /users/:id', () => {
  it.skip('it should delete the user by id', (done) => {
    const user = db.get('users').last().value();
    const userId = db.get('users').value().indexOf(user);
    request
      .delete('/api/v1.0/users/' + userId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(user);
        done();
      });
  });
  it('it should return status 404 when user id is not found', (done) => {
    const userId = 'fake id';
    request
      .delete('/api/v1.0/users/' + userId)
      .end((err, res) => {
        if (err || !res.ok) {
          expect(err).to.have.status(404);
          done();
        } else {
          done(new Error('the user id is found'));
        }
      });
  });
});
// ########### test/mocha.opts
// --require test/helpers
//     --reporter spec
// ########### package.json
// {
//   "name": "templates",
//   "version": "1.0.0",
//   "description": "using templates",
//   "main": "index.js",
//   "scripts": {
//     "start": "nodemon ./server.js ",
//     "test": "mocha --exit"
//   },
//   "author": "ivashchenko a.",
//   "license": "ISC",
//   "devDependencies": {
//     "chai": "^4.1.2",
//     "chai-http": "^3.0.0",
//     "eslint": "^4.11.0",
//     "eslint-config-standard": "^10.2.1",
//     "eslint-plugin-import": "^2.8.0",
//     "eslint-plugin-promise": "^3.6.0",
//     "eslint-plugin-standard": "^3.0.1",
//     "mocha": "^4.1.0",
//     "nodemon": "^1.12.1"
//   },
//   "dependencies": {
//     "express": "^4.16.2",
//     "lowdb": "^1.0.0",
//     "pug": "^2.0.0-rc.4"
//   }
// }

// *************************************************************************************
// Deployment
// *************************************************************************************
// Быстрая настройка VDS хостинга для работы с Node.js и Mongo.db
// https://www.youtube.com/watch?v=5lXVkB-yZWU
// Настройка VDS: PHP, Apache, Nginx и Node.js
// https://www.youtube.com/watch?v=y9zBXU28kUY
// Установка на хостинг и базовое использование Node
// https://www.youtube.com/watch?v=I9eTASMnd-E
// How To Set Up a Node.js Application for Production on Ubuntu 16.04
// https://gist.github.com/andrIvash/52a175768b90ea21df11d609c0ba9ad2
// для деплоя на облачный сервак используем travis

// *************************************************************************************
// Процесс написания ботов
// *************************************************************************************
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = '556179222:AAGmOyvfmkdOg7EdUpXs6kAINffQUsC_cgE';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
bot.on('message', (msg) => {
  const id = msg.chat.id;
  const text = msg
    .text
    .toLowerCase();
  if (text === 'hi') {
    bot.sendMessage(id, 'Hello bro!');
  }
  if (text === 'answer') {
    bot.sendMessage(id, 'Test', {
      reply_markup: {
        force_reply: true
      }
    });
  }
  if (text === 'close') {
    bot.sendMessage(id, 'close keyboard', {
      reply_markup: {
        remove_keyboard: true
      }
    });
  }
});
bot.onText(/\/audio/, (msg, match) => {
  const id = msg.chat.id;
  const file = './files/no-milk-today.mp3';
  bot.sendMessage(id, 'Begin download...');
  bot.sendAudio(id, file, {
    caption: 'My music'
  }, {filename: 'myname'}).then(() => {
    bot.sendMessage(id, 'Done');
  });
});
bot.onText(/\/doc/, (msg, match) => {
  const id = msg.chat.id;
  const stream = fs.createReadStream(__dirname + '/files/sql.pdf');
  bot.sendDocument(id, stream)
});
bot.onText(/\/pic/, (msg, match) => {
  const id = msg.chat.id;
  const stream = fs.createReadStream(__dirname + '/files/sova.jpg');
  bot.sendPhoto(id, './files/sova.jpg')
});
bot.onText(/\/video/, (msg, match) => {
  const id = msg.chat.id;
  const stream = fs.createReadStream(__dirname + '/files/train.3gp');
  bot.sendVideo(id, stream)
});
bot.onText(/\/kbd/, (msg, match) => { // /kbd вызывает клавиатуру 
  const id = msg.chat.id;
  bot.sendMessage(id, 'Keyboard', {
    reply_markup: {
      keyboard: [
        [
          {
            text: 'Close'
          }, {
            text: 'Answer'
          }
        ],
        [
          {
            text: 'Send my contact',
            request_contact: true
          }
        ]
      ],
      one_time_keyboard: true
    }
  })
});
bot.onText(/\/ikbd/, (msg, match) => { //инлайн клавиатура
  const id = msg.chat.id;
  bot.sendMessage(id, 'Inline Keyboard', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'LoftSchool',
            url: 'https://loftschool.com/'
          }
        ],
        [
          {
            text: 'About',
            callback_data: 'about'
          }, {
            text: 'Contact',
            callback_data: 'contact'
          }
        ]
      ]
    }
  })
});
bot.on('callback_query', query => { //читает callback_data
  const id = query.message.chat.id;
  if (query.data === 'about') {
    bot.sendMessage(id, 'Мы лучшая компания всех времен!');
  }
  if (query.data === 'contact') {
    bot.sendMessage(id, 'Наш адрес www.leningrad.ru!');
    bot.answerCallbackQuery(query.id, 'Только для ВАС!'); //всплывашка
  }
})
// @node018(название бота) - выведет меню с названиями статей, определенными ниже, нажатие на статью покажет саму статью
bot.on('inline_query', query => {
  const results = [
    {
      id: 1,
      type: 'article',
      title: 'Head part One',
      input_message_content: {
        message_text: 'Irure ea mollit sunt in aute voluptate. Nulla ut labore nisi deserunt consequat ' +
            'nulla dolor reprehenderit. Id ipsum laborum cillum enim laborum mollit non volup' +
            'tate pariatur. Ex est id velit anim dolor sit est amet aliquip esse tempor sunt ' +
            'ex. Ea est minim in culpa velit exercitation fugiat laboris ex cupidatat ad. Com' +
            'modo quis minim exercitation nulla ad irure consectetur esse. Qui magna eu conse' +
            'quat veniam do cupidatat.'
      }
    }, {
      id: 2,
      type: 'article',
      title: 'Head part Two',
      input_message_content: {
        message_text: 'Ipsum voluptate velit pariatur dolore do mollit. Esse ut reprehenderit ad qui qu' +
            'is officia labore et labore incididunt. Ea reprehenderit pariatur pariatur aliqu' +
            'a sint dolor velit elit officia irure. Adipisicing ad velit duis elit pariatur c' +
            'ulpa do. Cupidatat ad ullamco sunt mollit anim reprehenderit aliqua tempor elit.'
      }
    }
  ]
  bot.answerInlineQuery(query.id, results, {
    cache_time: 0,
    switch_pm_text: 'Читайте нас везде',
    switch_pm_parameter: 'test'
  })
})
bot.onText(/\/help/, (msg, match) => {
  const id = msg.chat.id;
  const md = `
  *Список команд*
  audio - _Получить любимую песню бота_
  doc - _Получить SQL cheats_
  pic - _Получить картинку аватарки_
  video - _Получить паравозик_
  kbd - _Вызвать клавиатуру_
  ikbd - _Вызвать инлайн клавиатуру_
  help - _Взывать эту помощь_
  about - _О боте немного_
  `
  bot.sendMessage(id, md, {parse_mode: 'Markdown'}); //тип вывода маркдаун
});
bot.onText(/\/about/, (msg, match) => {
  const id = msg.chat.id;
  const html = `
  <b>About</b>
  <i>I am the best Bot</i>
  <a href="http://loftschool.com/">LoftSchool</a>
  `
  bot.sendMessage(id, html, { //тип вывода html
    // disable_web_page_preview: true,
    parse_mode: 'HTML'
  });
});

// *************************************************************************************
// Серверный рентеринг

// *************************************************************************************
// Безопасность
// helmet - меняет заголовки
// csrf - для защиты формы отправки

// *************************************************************************************
// Всякое
// использование переменных окружения, задаются в файле .env, необходим пакет require('dotenv').config()
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});

// использование показа ошибок и их описания прямо в браузере
// npm i errorhandler node-notifier --save
app.get('/err', (req, res, next) => { //эмулируем ошибку
	const errror = new Error('DB crushed');
	errror.status = 500;
	next(errror);
});
switch(app.get('env')) {
	case 'development': //если режим разработки
		app.use(errorhandler({log: errorNotification}));
	break;
	case 'production':
		// production code
	break;
}
function startServer() {
	app.listen(app.get('port'), () => {
		console.log(`Server is running on port ${app.get('port')}`);
	});
}
if(require.main === module) { //если приложение было вызвано (nodemon)
	startServer();
} else { //если мы его require'им
	module.exports = startServer;
}
function errorNotification(err, str, req) {
	let title = `Error in ${req.method} ${req.url}`;
	notifier.notify({
		title: title,
		message: str
	});
}

// дебаггинг в хроме
// node --inspect app.js
// chrome://inspect

// кластеры (на каждое ядро процессора по экземпляру приложения, для повышения его производительности)
const cluster = require('cluster');
const cpus = require('os');

function startsWorker() {
	const worker = cluster.fork();
	console.log(`Cluster: ${worker.id}`);
}

if(cluster.isMaster) {
	cpus.forEach(() => {
		startsWorker();
	});
	cluster.on('disconnect', (worker) => {
		console.log(`crushed worker: ${worker.id}`);
	});
	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker %d died with code %d (%s). restarting...`, worker.id, code, signal);
		startsWorker();
	});
} else {
	require('./app.js')(); // function startServer()
}

// посмотреть на каком кластере работает приложение
app.use((req, res, next) => {
	if(cluster.isWorker) {
		console.log(`ID: ${cluster.worker.id}`);
	}
	next();
});