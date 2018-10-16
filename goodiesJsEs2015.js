//у стрелочных функций нет своего this, arguments и super, она берет их из внешней функции
const keks = {
  name: 'Keks',
  friends: ['Snowy', 'Barsik'],
  showFriends: function () {
    this.friends.forEach((name) => { //стрелочная функция
      console.log(`${this.name} дружит с ${name}`); // this.name ссылается на keks; `${name}` - шаблонные строки, в них легко подставлять переменные
    });
  }
}
keks.showFriends(); //Keks дружит с Snowy, Keks дружит с Barsik
//стрелочная функция не может использоваться как конструктор

//****************************************************************************** */
//Деструктуризация (разбивка массива(объекта) на переменные, объединение массивов)
//****************************************************************************** */
//ES6
const array1 = ["Vijendra","Singh"];
const array2 = ["Singh", "Shakya"];
const array3 = [...array1, ...array2]; //объединение массивов
//ES5
var array1 = ["Vijendra","Singh"];
var array2 = ["Singh", "Shakya"];
var array3 = array1.concat(array2); //объединение массивов
// [ 'Vijendra', 'Singh', 'Singh', 'Shakya' ]
//********************************************************************* */
let first = "Igor";
let second = "Egor";
console.log(first, second); //Igor, Egor
[first, second] = [second, first]; //можно использовать, чтобы поменять значения переменных
console.log(first, second); //Egor, Igor
/* ********************************************************************** */
const printSomeValues = ([first = `Не передали`, , third = `Ничего`]) => {
  console.log(`Первый: "${first}", Третий: "${third}"`);
}
printSomeValues(); //ошибка, ничего не передали
printSomeValues([]); //выведет значения по умолчанию
printSomeValues([`Одын`]); //Первый: Одын, Третий: Ничего
printSomeValues([`Уронили`, `мишку`, `на пол`]); //Первый: Уронили, Третий: на пол

printSomeValues([``]); //Первый: Не передали, Третий: Ничего (по умолчанию)
printSomeValues([`12`]); //Первый: 1, Третий: Ничего
printSomeValues([`123,,fmg`]); //Первый: 1, Третий: 3
printSomeValues(document.querySelectorAll(`p`)); //Первый: [object HTMLParagraphElement], Третий: [object HTMLParagraphElement]
/* ********************************************************************** */
// ES2015
const list = [1, 2, 3];
let [ first, ,last ] = list; //берет первый элемент и последний, и присваивает их значения переменным first и last.
//если в массиве нет элемента - [ first, ,last, fourth], fourth = undefined. [ first, ,last, fourth = 44] - значение по-умолчанию, берется если такого элемента в массиве нет.
[ last, first ] = [ first, last ]; //меняем местами значения переменных
console.info(first, last); // 3, 1
// ES5
var list = [ 1, 2, 3 ];
var first = list[0], last = list[2];
var tmp = first; first = last; last = tmp;
//***************************

const geherateMagicNums = () => [ //стрелочная функция возвращает массив
  Math.trunc(Math.random()*42),
  Math.trunc(Math.random()*42),
  Math.trunc(Math.random()*42)
];
const [first, , third] = geherateMagicNums(); //присваивает переменным first и third значения 1го и 3го элементов массива
//Math.trunc - отрезает от числа все знаки после запятой

// ES2015
const cat = { //деструктуризация объекта, также можно применять к массивоподобным элементам, например Node list
//можно деструктурировать и вложенные объекты
name: 'Keks',
male: true,
age: 7,
weight: 10
};
const { name, age } = cat; // можно задать другое имя переменным - const {name: catName, age: catAge} = cat;
console.info(name, age); // "Keks", 7
// ES5
var cat = {
name: 'Keks',
male: true,
age: 7,
weight: 10
};
var name = cat.name;
var age = cat.age;
console.info(name, age); // "Keks", 7

const paragraphs = document.querySelectorAll('p'); //берем node list и вытаскиваем из его элементов textContent в переменную text
for (let i = paragraphs.length; i--;) {
  const {textContent: text} = paragraphs[i];
  console.log(text);
}
Array.from(document.querySelectorAll(`p`)).forEach(({textContent: text}) => console.log(text)); //тоже самое в одну строку(Array.from создает массив из массиво-подобных элементов типа NodeList)

//****************************************************//****************************************************
// Прочие параметры(rest), rest можно использовать при деструктуризации(все прочие элементы пойдут в новый массив ...array)
//****************************************************//****************************************************
const getFullName = (name, surename, ...titles) => { //все прочие параметры идут в ...titles и образуют массив
const space = titles.length > 0 ? ' ' : '';
return `${titles.join(' и ')}${space}${name} ${surename}`;
};
console.info(`Уважаемый ${getFullName('Кот', 'Матроскин')}!`); // Уважаемый Кот Матроскин!
console.info(`Уважаемый ${getFullName('Кот', 'Матроскин', 'Единственный')}!`);
// Уважаемый Единственный Кот Матроскин!
console.info(`Уважаемый ${getFullName('Кот', 'Матроскин',
'Единственный', 'Неповторимый')}!`); // Уважаемый Единственный и Неповторимый Кот Матроскин!

//Разыменование в список параметров (spread), обратная операция операции rest 
const getFullName = (name, surename, ...titles) => {
const space = titles.length > 0 ? ' ' : '';
return `${titles.join(' и ')}${space}${name} ${surename}`;
};
const president = ['Владимир', 'Путин', 'Президент'];
console.info(`Уважаемый ${getFullName(...president)}!`);
// Уважаемый Президент Владимир Путин!
console.info(`Уважаемый ${getFullName(...president.slice(0, 2))}!`);
// Уважаемый Владимир Путин!

//********************************************* */
//шаблонные строки - сохраняют все отступы (пробелы, табуляцию и переносы), спец. символы тоже в них работают (\n перенос строки и пр.)
const escapeString = `Спец. символы \${можно} экранировать\
и переносы тоже`;
console.log(escapeString);
//********************************************* */
//Новое в строках
const countries = ['UK', 'USA', 'Ireland', 'France'];
console.log(countries.includes('UK')); // true
console.log(countries.includes('Ireland', 1)); // true
console.log(countries.includes('USA', 3)); // false
console.log(countries.includes('France', -2)); // true

`abc`.padStart(10); // " abc"
`abc`.padStart(10, `foo`); // "foofoofabc"
`abc`.padStart(6, `123465`);// "123abc"
`abc`.padStart(8, `0`); // "00000abc"
`abc`.padStart(1); // "abc"
`abc`.padEnd(10); // "abc "
`abc`.padEnd(10, `foo`); // "abcfoofoof"
`abc`.padEnd(6, `123456`); // "abc123"
`abc`.padEnd(1); // "abc"

/* ********************************************************************************************** */
//Функции шаблонизации
/* ********************************************************************************************** */
const anonymize = function (strings, ...values) {
console.log(strings[0]); // "Пока, "
console.log(strings[1]); // "!"
console.log(values[0]); // "Михаил"
return `${strings[0]}Неопознанный Енот${strings[1]}`;
};
const name = 'Михаил';
console.info(anonymize`Привет, ${name}!`); // "Привет, Неопознанный Енот!"
console.info(anonymize`Пока, ${name}!`); // "Пока, Неопознанный Енот!"
console.info(String.raw `foo\n${ 42 }ba\tr`) // "foo\n42ba\tr" - String.raw возвращает строку (ненужно экранировать спец. символы, ${42} отработает)
/* ********************************* */
const production = false;
const sensitive = (strings, ...[value, ...other]) => {
  const info = production ? Array(value.length).fill(`*`).join(``) : value; //если false то заполняем массив звездочками, если true берем переданное значение
  return `${strings[0]}${info}${strings[1]}`;
}
console.log(sensitive`Мой пароль от вконтакта: ${`chugeboBecause`}!`);

/* ********************************************************************************************** */
//Modules
/* ********************************************************************************************** */
//npm i --save-dev --save-exact gulp-better-rollup - плагин для галпа, чтобы собирать модули
//npm i --save-dev --save-exact gulp-sourcemaps - плагин для галпа, создает карту файла, чтобы браузер правильно понимал на какой строке и в каком файле произошла ошибка или вывод(console.log) и пр.
// Файл mother.js
export const name = `Мама`; //экспортирует переменные определенные в mother.js
export const age = 12;
export const male = false;

// Файл father.js
export default {
name: `Папа`,
age: 12,
male: true
};

// Файл family.js
import {name as motherName} from './mother'; //импортирует переменную name как motherName из файла mother.js
import father from './father'; //импортирует весь default объект из father.js
const makeChild = () => `Отец: ${father.name}, мать: ${motherName}`;
export default makeChild();

// Import/Export*************************************************
// lib/mathplusplus.js
export * from 'lib/math'; //экспортирует все из math
export const EPSILON = 2.220446049250313e-16;
export const sign = (x) => {
return isNaN(x) ? NaN : x < 0 ? -1 : x > 0 ? 1 : 0;
};
// count.js
import {EPSILON, sign, abs} from 'lib/mathplusplus';
console.info(sign(EPSILON)); // 1
console.info(abs(-100)); // 100

// Import по-умолчанию**********************************
// lib/mathplusplus.js
import * as math from 'lib/math';
export const PI2 = 2 * math.PI;
export * from 'lib/math';
export const EPSILON = 2.220446049250313e-16;
export default sign = (x) => {
  return isNaN(x) ? NaN : x < 0 ? -1 : x > 0 ? 1 : 0;
};
// count.js
import sign, {EPSILON, abs} from 'lib/mathplusplus'; //sign импортируется без скобок, так как export default, в скобках импортируются отдельные переменные или функции; abs заимпортируется потому что в файле libs/mathplusplus.js импортировали всю библиотеку math
console.info(sign(EPSILON)); // 1
console.info(abs(-100)); // 100

// import запрещен во вложенных конструкция
// lib/mathplusplus.js
const MyMath = require('lib/math');
let library;
if(MyMath.random() > 0.5) {
library = require('library1');
} else {
library = require('library2');
}
library = require('library3');
//****************************************************************************** */
//Структуры данных
//****************************************************************************** */
/* Array */
const nums = [5,4,3,2,1];
nums.find((it) => it % 2 === 0); //метод find ищет элемент в массиве, соответствующий заданным критериям(четное число)
nums.filter(); //возвращает массив всех найденных совпадений, соответствующих заданным критериям
nums.indexOf(2); //возвращает индекс элемента (3)
nums.map((it) => it % 2 !== 0); //[true, false, true, false, true] //map() создаёт новый массив с результатом вызова указанной функции для каждого элемента массива
nums.concat([3,4,5],6,7,[3,7,9]); //соединяет 2 и более массивов, можно добавлять и обычные свойства(возвращает новый массив)
nums.slice(1, 4); //возвращает часть или целый массив в виде нового массива (без аргументов возвращает целый массив, удобно если надо скопировать исходный массив)
let numss = nums.slice(); //скопировали массив

let ids = '1,2,3,4,5';
ids.split(","); //log: ["1", "2", "3", "4", "5"] - создает массив из строки по разделителю
"test".split(""); //log: ["t", "e", "s", "t"] - разбивает по буквам
ids.split(",").join("-"); //log: "1-2-3-4-5" - создает строку из массива

let idss = [1, 12, 5, 7];
idss.sort((a,b) => a > b ? 1 : -1); //сортирует массив по возрастанию


//одно и то же
let arr = [1, 10, 15, 20, -5, 8, 14];
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
arr.forEach(function(item, i) {
  console.log(item);
});
//Array.filter********************* */
let neg = [];
for (let i = 0; i < arr.length; i++) {
  if(arr[i] < 0) { //находим все отрицательные числа и добавляем их в новый массив
    neg.push(arr[i]);
  }
}
let neg2 = arr.filter((item) => {
  return item < 0; //находим все отрицательные числа и добавляем их в новый массив
});
//Array.map********************* */
let data = ['1', '-10', '15', '20', '-5', '8', '14'];
let nums2 = [];
for (let i = 0; i < data.length; i++) {
  nums2.push(parseInt(data[i])); //преобразуем строки в числа
}
let nums3 = data.map((item) => {
  return parseInt(item);
});
//Array.every********************* */
let numArr = [1, -10, 15, 20, -5, 8, 14];
let allPositive = true;
for (let i = 0; i < numArr.length; i++) {
  if (numArr[i] < 0) { //проверяем, все ли числа в массиве положительные, устанавливая соответствующий фоаг
    allPositive = false;
    break;
  }
}
let allPositive2 = numArr.every((item) => { //идет по массиву пока не получит false по условию или не дойдет до конца
  return item >= 0;
});
//Array.some********************* */
let hasNeg = false;
for (let i = 0; i < numArr.length; i++) {
  if (numArr[i] < 0) {
    hasNeg = true;
    break;
  }
}
let hasNeg2 = numArr.some((item) => { //возвращает true, если хотя бы для одного элемента верно условие
  return item < 0;
});
//Array.reduce********************* */
let sum = 0;
for (let i = 0; i < numArr.length; i++) {
  sum += numArr[i]; //считаем сумму всех чисел в массиве
}
let sum2 = numArr.reduce((total, utem) => { // 0 - начальное значение, цикл идет слева направо
  return total + item;
}, 0);

const numbers = [10, 20, 30, 40];
const doubledOver50 = numbers.reduce((finalList, num) => {
  num = num * 2; //удвоить каждое число (аналог map)
  //отобрать числа > 50 (аналог filter)
  if (num > 50) {
    finalList.push(num);
  }
  return finalList;
}, []);
doubledOver50; // [60, 80]

var cars = ['BMW','Benz', 'Benz', 'Tesla', 'BMW', 'Toyota'];
var carsObj = cars.reduce(function (obj, name) { 
   obj[name] = obj[name] ? ++obj[name] : 1;
  return obj;
}, {});
carsObj; // => { BMW: 2, Benz: 2, Tesla: 1, Toyota: 1 } получили объект
//Array.reduceRight********************* */
let numArr2 = [
  [1, -10],
  [15, 20],
  [5, 8],
  [14, 6]
];
let arrr = numArr2.reduce((total, item) => {
  return total.concat(item); //соединияет 2 и более массивов в 1 //log: [1, -10, 15, 20, -5, 8, 14]
}, []);
let arrr2 = numArr2.reduceRight((total, item) => { //тоже самое, что и reduce, только справа налево
  return total.concat(item); //соединияет 2 и более массивов в 1 //log: [14, 8, -5, 20, 15, -10, 1]
}, []);

/* Object */
let a = Object.keys({a: 1, b: 1}); //log ["a", "b"] - преобразует ключи объекта в массив строк
Object.keys({a: 1, b: 1}).forEach(); //итерация по объекту
Object.freeze(); //Метод Object.freeze() замораживает объект: это значит, что он предотвращает добавление новых свойств к объекту, удаление старых свойств из объекта и изменение существующих свойств или значения их атрибутов перечисляемости, настраиваемости и записываемости. В сущности, объект становится эффективно неизменным. Метод возвращает замороженный объект.
Object.assign(target, ...sources); //Метод Object.assign() используется для копирования значений всех собственных перечисляемых свойств из одного или более исходных объектов в целевой объект. После копирования он возвращает целевой объект. target - целевой объект, ...sources - все остальные.
Object.values(); //возвращает список значений
const obj = {a: 5, b: 7, c: 9};
for (const value of Object.values(obj)) {
console.log(value); // "5", "7", "9"
}
Object.entries(); //возвращает массив пар ключ - значение
for (const [key, value] of Object.entries(obj)) {
  console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
  }

/* Map - типа объекта, где и ключ и значение могут быть любого типа   */
/* WeakMap - для более эффективной работы с памятью, сложная */
const map = new Map(); //создаем мапу
map.set(`a`, 1); //присваиваем ключ - значение
map.get(`a`); //получаем значение по ключу
map.has(`a`); //true/false - есть ли данный ключ
map.forEach((val, key, map) => { //итерация по мапе, можно получить ключ, значение и саму мапу
  console.log(val);
});
map.keys() /* – возвращает итерируемый объект для ключей, */
map.values() /* – возвращает итерируемый объект для значений, */
map.entries() /* – возвращает итерируемый объект для записей [ключ, значение], он используется по умолчанию в for..of. */
let recipeMap = new Map([
  ['огурцов',   '500 гр'],
  ['помидоров', '350 гр'],
  ['сметаны',   '50 гр']
]);
// цикл по ключам
for(let fruit of recipeMap.keys()) {
  alert(fruit); // огурцов, помидоров, сметаны
}
// цикл по значениям
for(let amount of recipeMap.values()) {
  alert(amount); // 500 гр, 350 гр, 50 гр
}
// цикл по записям [ключ,значение]
for(let entry of recipeMap) { // то же что и recipeMap.entries()
  alert(entry); // огурцов,500 гр , и т.д., массивы по 2 значения
}
const map2 = new Map([['a', 1], ['b', 2]]); //можно создавать мапы передавая в нее массив массивов
//WeakMap
// текущие активные пользователи
let activeUsers = [
  {name: "Вася"},
  {name: "Петя"},
  {name: "Маша"}
];
// вспомогательная информация о них,
// которая напрямую не входит в объект юзера,
// и потому хранится отдельно
let weakMap = new WeakMap();
weakMap.set(activeUsers[0], 1);
weakMap.set(activeUsers[1], 2);
weakMap.set(activeUsers[2], 3);
weakMap.set('Katya', 4); //Будет ошибка TypeError: "Katya" is not a non-null object
alert( weakMap.get(activeUsers[0]) ); // 1
activeUsers.splice(0, 1); // Вася более не активный пользователь
// weakMap теперь содержит только 2 элемента, если ссылка на объект осталась только в weakmap она автоматом удаляется
activeUsers.splice(0, 1); // Петя более не активный пользователь // weakMap теперь содержит только 1 элемент
/* Set - множество, набор уникальных элементов, их тип может быть любым, одно и то же значение может встречаться только один раз */
/* WeakSet - для более эффективной работы с памятью, сложный */
const set = new Set(); //создаем множество
set.add(`milk`); //добавляем элемент
set.has(`milk`); //проверяем наличие элемента (true)
set.delete(item) //– удаляет item из коллекции, возвращает true, если он там был, иначе false.
set.clear() //– очищает set.
const set2 = new Set([1,2,3,4,5]); //можно создавать Set передавая в него массив
const mySet = new Set(['left', 'right', 'jump']);
let arr = [...new Set([1,2,2,2,1,3])]; //массив уникальных свойств //log: [1, 2, 3]
console.log([...mySet.entries()].forEach(([el]) => console.log(el))); //entries - создает массив массивов с парами ключ - значение внутри

//****************************************************************************** */
//Тестирование
//****************************************************************************** */
//mocha - тестовый фреймворк
//html разметка для работы mocha
{/* <html>
<head>
  <meta charset="utf-8">
  <title>Mocha Tests</title>
  <link href="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.css" rel="stylesheet" />
</head>
<body>
<div id="mocha"></div>
<script src="https://cdn.rawgit.com/mochajs/mocha/2.2.5/mocha.js"></script>
</body>
</html> */}
//указываем стиль описания наших тестов - BDD или TDD
mocha.setup('bdd');
const sum = (left, right) => left + right; 
/* здесь будут располагаться тесты */
//describe - описание того, что мы будем тестировать
describe(`3rd Grade Math`, () => {
  //it - описывается непосредственно то, что собираемся тестировать
  it(`should sun two and two correctly`, () => {
    //тело теста должно выкинуть ошибку, если условие не верно
    if(sum(2, 2) !== 4) {
      throw new Error(`2 + 2 should be equal 4, but was ${sum(2, 2)}`);
    }
  });
  it(`should sun negative numbers correctly`, () => {
    //тело теста должно выкинуть ошибку, если условие не верно
    if(sum(-1, -1) !== -2) {
      throw new Error(`-1 + -1 should be equal -2, but was ${sum(-1, -1)}`);
    }
  });
  it(`should sun negative and positive numbers correctly`, () => {
    //тело теста должно выкинуть ошибку, если условие не верно
    if(sum(-1, 2) !== 1) {
      throw new Error(`-1 + 2 should be equal 1, but was ${sum(-1, 2)}`);
    }
  });
});

//очевидно, что код проверок можно обощить
const assert = (truthy) => {
  if(!truthy) {
    throw new Error(`Expected to be true: ${truthy} == true`);
  }
}
describe(`3rd Grade Math`, () => {
  it(`should sum two and two correctly`, () => {
    assert(sum(2, 2) === 4);
    assert(sum(2, 3) !== 4);
  });
  it(`should sum negative numbers correctly`, () => {
    assert(sum(-1, -1) === -2);
    assert(sum(-1, -2) === -3);
  });
  it(`should sum negative and positive numbers correctly`, () => {
    assert(sum(-1, 2) === 1);
    assert(sum(-1, 1) === 0);
  });
});
//если мы имеем дело с числами и сравнениями, то было бы удобно понимать, что произошло если мы ошиблись и какие значения получились
const equals = (expected, actual) => {
  if(expected !== actual) {
    throw new Error(`Expected: ${expected}, equal to: ${actual}`);
  }
}
const nowEquals = (expected, actual) => {
  if(expected === actual) {
    throw new Error(`Expected: ${expected}, not equal to: ${actual}`);
  }
}
describe(`3rd Grade Math`, () => {
  it(`should sum two and two correctly`, () => {
    equals(sum(2, 2), 4);
    nowEquals(sum(2, 3), 4);
  });
  it(`should sum negative numbers correctly`, () => {
    equals(sum(-1, -1), -2);
    equals(sum(-1, -2), -3);
  });
  it(`should sum negative and positive numbers correctly`, () => {
    equals(sum(-1, 2), 1);
    equals(sum(-1, 1), 0);
  });
});

//assertion framework для тестирования - assert
const assert2 = chai.assert;
describe(`3rd Grade Math`, () => {
  it(`should sum two and two correctly`, () => {
    assert2.equal(sum(2, 2), 4);
    assert2.nowEqual(sum(2, 3), 4);
  });
  it(`should sum negative numbers correctly`, () => {
    assert2.equal(sum(-1, -1), -2);
    assert2.equal(sum(-1, -2), -3);
  });
  it(`should sum negative and positive numbers correctly`, () => {
    assert2.equal(sum(-1, 2), 1);
    assert2.equal(sum(-1, 1), 0);
  });
});
//assert позволяет нам сравнивать не только примитивы, но и объекты между собой. Проверять строгие и не строгие сравнения и тд.
describe(`JavaScript Language`, () => {
  //выдаст ошибки
  it(`should check that null bs not undefined`, () => {
    assert2.nowEqual(null, undefined);
  });
  it(`should check equal arrays`, () => {
    assert2.equal([1,2,3], [1,2,3]);
  });
  it(`should sum 0.1 and 0.2`, () => {
    assert2.nowEqual(0.1 + 0.2, 0.3);
  });
  //тесту пройдут
  it(`should check that null bs not undefined`, () => {
    assert2.nowStrictEqual(null, undefined);
  });
  it(`should check equal arrays`, () => {
    assert2.deepEqual([1,2,3], [1,2,3]);
  });
  it(`should sum 0.1 and 0.2`, () => {
    assert2.ok(0.1 + 0.2 > 0.3);
  });
});
//разные тестовые фреймворки предоставляют разные стили для написания проверок. Например, стиль expect
const expect = chai.expect;
describe(`JavaScript Langueage`, () => {
  it(`string should not be equal to number`, () => {
    expect(`42`).to.not.equal(42);
  });
  it(`string be an array without 3`, () => {
    expect([1, 2]).to.be.an(`array`).that.does.not.include(3);
  });
  it(`shouldn't have property 'b'`, () => {
    expect({a: 1}).to.not.have.property('b');
  });
  //те же тесты с помощью assert
  it(`string should not be equal to number`, () => {
    assert2.nowStrictEqual(`42`, 42);
  });
  it(`string be an array without 3`, () => {
    const array = [1,2];
    assert2(Array.isArray(array));
    assert2.equal(-1, array.indexOf((it) => it === 3)); //-1 возвращается, если в массиве нет такого элемента
  });
  it(`shouldn't have property 'b'`, () => {
    assert2.equal(undefined, ({a: 1})[`b`])
  });
});
//запускаем тесты
mocka.run();
//*********************************** */
//Методологии */
//*********************************** */

//Проверяем является ли переданная строка разрешенным email
//Файл email-validator.js
const EMAIL_REGEXP = /^[a-zа-я0-9.!#$%&'*+/=?^_`{|}~]+@[a-zа-я0-9-]+(?:\.[a-zа-я0-9-]+)+$/i;

const isValidEmail = (candidate) => EMAIL_REGEXP.test(candidate);

//Файл email-validator.test.js
mocha.setup(`bdd`);

//Прежде чем писать код, который проверит корректен ли переданный email, я пишу самый простой тест, который могу придумать, который должен будет проходить.
const assert3 = chai.assert;
describe(`Email validator`, () => {
  it(`should allow to enter valid email`, () => {
    assert3(isValidEmail('jban@mail.ru'));
    assert3(isValidEmail('jbanny@mail.ru'));
    assert3(isValidEmail('jban21@mail.ru'));
    //Теперь мы можем расширять тесты новыми случаями, при этом мы уверены, что старые тоже работают
    assert3(isValidEmail('русский@почта.рус'));
    assert3(isValidEmail('jbantwentyoneverylongmailname@gmail.ru'));
  });
  it(`should not allow to enter invalid email`, () => {
    assert3(!isValidEmail('Вася'));
    assert3(!isValidEmail('@sobaka'));
    //Теперь мы можем расширять тесты новыми случаями, при этом мы уверены, что старые тоже работают
    assert3(!isValidEmail('sobaka@'));
    assert3(!isValidEmail('sob@aka@'));
    assert3(!isValidEmail('test@.ru'));
    assert3(!isValidEmail('test@'));
    assert3(!isValidEmail('@'));
    assert3(!isValidEmail('@@@@@'));
    assert3(!isValidEmail('@@@.@@'));
    assert3(!isValidEmail('.@@@.@@'));

  });
  it(`should deal with corner cases correctly`, () => {
    assert3(!isValidEmail(''));
    assert3(!isValidEmail(null));
    assert3(!isValidEmail(undefined));
  });
  it(`should deal with invalid data`, () => {
    assert3(!isValidEmail(0));
    assert3(!isValidEmail(1));
    assert3(!isValidEmail(true));
    assert3(!isValidEmail({}));
    assert3(!isValidEmail([]));
  });
});

mocha.run();
//****************************************************************************** */
//Новые возможности объектов
//****************************************************************************** */

/* появидись сокращения при объявлении свойств объекта. Мы можем указать в качестве ключа - переменную 
и эта переменная автоматически раскроется в пару ключ-значение */
const catName = `esef`;
const catMale = true;
const catAge = 10;

const expected = {
  catName: catName,
  catMale: catMale,
  catAge: catAge
};

const actual = {catName, catMale, catAge};
//важно помнить - при переименовании переменной переименуется и ее ключ
const catName = `esef`;
const catMale = true;
const keksAge = 10;

const expected = {
  catName: catName,
  catMale: catMale,
  catAge: keksAge
};

const actual = {catName, catMale, keksAge};
//при объявлении метода объекта появилась короткая запись, которая позволяет записать сразу тело функции и имя
const yoName = `yo`;

const expected = {
  yoName: yoName,
  meow: function() {
    return `meow!`;
  }
};

const actual2 = {
  yoName,
  meow() {
    return `meow!`;
  }
};
//контекст данного метода обращается к объекту
//важно помнить, что метод это не стрелочная функция, а обыкновенная
const actual3 = {
  yoName,
  meow() {
    return `${this.yoName}: meow!`;
  }
};
//помимо обычных методов появились специальные методы - getter и setter
let name1 = `keks`;

const catt = {
  getName() {
    return name1;
  },
  setName(newName) {
    name1 = newName;
  }
};
//эти методы притворяются свойствами или полями объекта, хотя сами на самом деле являются функциями.
//чтобы вызвать getter надо обратиться к нему без скобок
const name2 = `keks`;
const catt2 = {
  get name() {
    console.log('getter is called');
    return `secret`;
  }
};
catt2.name;
//setter - устанавливает значение
const catt3 = {
  get name() {
    if(this.myName) {
      return this.myName;
    }
    return `secret`;
  },
  set name(newName) {
    this.myName = newName;
  }
}
//если определен только setter, то взять значение по этому имени невозможно
//спецификация явно запрещает использовать одновременно поле и getter или setter, однако не все браузеры выдают ошибку
const catt4 = {
  get name() {
    if(this.myName) {
      return this.myName;
    }
    return `secret`;
  },
  name,
  set name(newName) {
    this.myName = newName;
  }
}
//getter может быть только функцией без парметров, а setter - функцией ровно с одним параметром

//так же ключи объектов теперь можно вычислять во время создания
const states = [`fool`, `whole`, `small`];
const randomState = () => {
  states[Math.floor(Math.random() * states.length)];
}
const expected2 = {};
expected2[randomState()] = true;

const actualy = {
  [randomState()]: true
};
//благодаря этому можно использовать шаблонную строку в качестве ключа
const name3 = `keks`;
const owner = `alex`;
const actualy2 = {
  name3,
  [`owner - ${owner}`]: true
};
//getter, setter и метод также могут быть вычислимыми
const actualy2 = {
  get [`name3`]() {
    return name3;
  },
  [`owner - ${owner}`]() {
    return owner;
  }
};
//из мелких изменений в объектах - подвешеная запятая и возможность определить одно и то же поле несколько раз, при этом побеждает самое позднее объявление
const actualy3 = {
  name3,
  owner,
  owner: `petr`,
  [`owner`]: `leopold`,
};
//************************************************************** */
//конструкция class теперь сразу позволяет определить и конструктор и методы внутри одной конструкции
class Cat {
  constructor(name, age = 0, male = true) {
    this.name = name;
    this.age = age;
    this.male = male;
  }
  eat(food) {
    console.log(`${this.name} ate ${food}`);
  }
  meow() {
    return `meow!`;
  }
}
const catExample = new Cat(`alex`, 4, true);
//конструктора может не быть, но не может быть более одного конструктора
class Cat {
  eat(food) {
    console.log(`${this.name} ate ${food}`);
  }
  meow() {
    return `meow!`;
  }
}
//конструкция class ведет себя как переменная let
class Cat2 {
  clone() {
    return new Cat2();
  }
}
console.log(new Cat2().clone());
Cat2 = class {}; //перезаписываем класс
console.log(new Cat2().clone()); //ошибка
//конструкция class - возвращает функцию конструктор. причем если записать класс в переменную, 
// то на имя класса можно будет сослаться только внутри самого класса
const KeksCat = new class Cat {
  clone() {
    return new Cat();
  }
}
console.log(new KeksCat(`keks`)); //log: {}
console.log(new KeksCat(`keks`).clone()); //log: {}

//классы можно наследовать с помощью ключевого слова extends
//важно не забыть вызвать super из конструктора иначе можно получить неадекватное сообщение об ошибке
//наследование в классах работает точно так же, как и в прототипном наследовании
class Animal {
  constructor(name) {
    this.name = name;
  }
  say() {
    return `я лучше промолчу`
  }
}

class Cat extends Animal {
  constructor(name, age = 0, male = true) {
    super(name);
    this.age = age;
    this.male = male;
  }
  eat(food) {
    console.log(`${this.name} ate ${food}`);
  }
  meow() {
    return `meow!`;
  }
  say() {
    console.log(`${this,name}: ${super.say()}`); //обращение к родительскому методу с помощью super
    return this.meow();
  }
}
const thing = new Animal(`нечто`);
console.log(thing.say()); //log: я лучше промолчу
const keks = new Cat(`keks`);
console.log(keks.say()); //log: keks: я лучше промолчу //log: meow!

//у классов могут быть статические методы, они тоже наследуются
class Animal {
  constructor(name) {
    this.name = name;
  }
  static getDefaultAnimal() {
    return new Animal(`нечто`);
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
  }
  static getDefaultCat() {
    console.log(this); //внутри статического метода this ссылается на функцию конструктор
    return new Cat(`кекс`);
  }
  get sex() { //динамические методы, getter и setter работают в классах
    return `male`;
  }
  set age(age) {
    this._age = age;
  }
}
console.log(Animal.getDefaultAnimal()); //log: нечто
console.log(Cat.getDefaultCat()); //log: кекс
console.log(Cat.getDefaultAnimal()); //log: нечто

//важно помнить, что классы не избавляют нас от проблем, которые были с прототипами, например, от проблемы потери окружения.
// потому что внутри классы это все те же прототипы
class Popup {
  constructor(name) {
    this.name = name;
    this.link = document.querySelector('a');
    // this.link.onclick = this.greet;

    //как одно из решений - можно использовать стрелочную функцию
    this.link.onclick = (evt) => this.greet(evt);
  }
  greet(evt) {
    evt.preventDefault();
    this.link.innerHTML = `Привет, ${this.name}`;
  }
}
document.body.innerHTML = `<a href="/login">Войти</a>`;
new Popup(`igor`);

class Popup { //можно вешать событие на сам класс(объект), который вызовет метод handleEvent
  constructor({elem}) {
    this.elem = elem;
    elem.addEventListener('click', this); //this.handleEvent(event)
  }
  handleEvent(event) {
    if(event.type == 'click') {
      this.onClick();
    }
  }
  onClick() {

  }
}

//****************************************************************************** */
//Работа с объектом history, работа с адресной строкой
//****************************************************************************** */

/* Для управления историей браузера, в JS существует объект history.
Для перемещения между записями в истории у history есть методы go, back, forward.
Метод go принимает на вход число. Если это число отрицательное, он перемещается по истории
назад на указанное количество шагов, если положительное - вперед.
Методы back и forward это сокращенная запись для вызова history.go(-1) и history.go(1) */

/* Для работы с адресной строкой в JS есть два объекта типа Location. document.location и window.location.
document.location отличается от window.location тем, что в некоторых браузерах доступен только для чтения.

С помощью объекта location можно изменить адрес страницы, не создавая новой записи в истории. Длеается это вызовом метода
location.replace(); 
Изменение объекта location влечет за собой перезагрузку страницы. Чтобы изменить адресную строку, оставаясь на той же странице,
можно использовать методы history.pushState и history.replaceState. Эти методы принимают 3 параметра: stateObject, объект,
который будет передан аргументом в обработчик события window.onpopstate; title - название состояния (не используется); и адрес:*/
history.pushState(null, null, 'yandex.ru');
/* Таким образом адрес изменится только в пределах текущей страницы - http://jban.ru/yandex.ru */

/* Обработка изменения истории должна производиться в событии onpopstate, но оно поддерживается не всеми браузерами */
window.onpopstate = function() { console.log(arguments); }
history.pushState(null, null, 'something'); // http://www.yandex.ru/something
/* Событие одинаково срабатывает при переходах по истории, но ведет себя по-разному в разных браузерах при вызове pushState */

//****************************************************************************** */
//Работа с сетью
//****************************************************************************** */

// GET — запрос на получение информации с сервера
// HEAD — запрос для проверки, обновилась ли информация на сервере и стоит ли заново ее скачать
// или можно оставить закешированную версию
// OPTIONS — запрос для проверки, какие запросы можно делать на этот ресурс
// POST — запрос на создание новой записи на сервере
// PUT — запрос на перезапись существующей информации на сервере
// PATCH — запрос на частичную перезапись существующей информации на сервере






//****************************************************************************** */
//Метапрограммирование
//****************************************************************************** */

//Новый среуиальный тип данных - Symbol(без new)
const  symbol = Symbol('символ');
//Можно использовать в качестве ключа в объекте или имени метода в классе
//Особенность их в том, что они не видны в объекте и являются как бы скрытыми или приватными
const objWithSymbol = {
  field: 'value'
};
objWithSymbol[symbol] = `Hi, ${symbol}`; //log: {field: "value"}

console.log({
  [Symbol(`symbol`)]: `value`, //log: {}
  [symbol]: `other value` //log: {}
});

console.log(new class { //log: {}
  get [symbol]() {
    return symbol;
  }
});
//Поэтому символы можно использовать, чтобы скрывать методы и поля в классах и объектах
const totalDistance = Symbol(`total`);
class Cat {
  constructor(name, speed) {
    this.name = name;
    this.speed = speed;
    this[totalDistance] = 0;
  }
  run(time) {
    const distance = this.speed * time;
    this[totalDistance] += distance;
    return `Cat ${this.name} runned ${distance} km`;
  }
  get totalDistance() {
    return this[totalDistance];
  }
}
const keks = new Cat('keks', 5);
console.log(keks.run(3)); //log: keks runned 15 km
console.log(keks.run(5)); //log: keks runned 25 km
console.log(keks.totalDistance); //log: 40
console.log(keks); //log: {name: "keks", speed: 5}
//Так как символ ведет себя как объект, то он равен только самому себе, 
// поэтому взять значение символа может только тот, кто владеет ссылкой на него
console.log(total); //log: undefined
console.log(keks[Symbol(`total`)]); //log: undefined
//Это позволяет создавать по-настоящему уникальные перечисления(enum)
const Result = {
  DIE: Symbol(`die`),
  NOOP: Symbol(`noop`),
  NEXT: Symbol(`next`),
  WIN: Symbol(`win`),
};
const printResult = (result) => {
  let action;
  switch (result) {
    case Result.DIE:
      action = `умер`;
      break;
    case Result.NOOP:
      action = `потоптался на месте`;
      break;
    case Result.NOOP:
      action = `ушел дальше`;
      break;
    case Result.NOOP:
      action = `победил`;
      break;
    default:
      action = `непонятно что сзделал`;
      break;
  }
  console.log(`Игрок ${action}`);
}
printResult(Result.DIE); //log: Игрок умер
printResult(`die`); //log: Игрок непонятно что зделал
printResult(`next`);//log: Игрок непонятно что зделал
//Символ нельзя создать при помощи new, а также как и любой объект он равен только самому себе

//Взять символы у объекта все же можно, для этого есть мпетоды Object.getOwnProprtySymbols и Reflect.ownKeys
const state = {
  name: `fedor`,
  [Symbol(`hidden field`)]: `hidden`
};
console.log(state); //log: {name: "fedor"}
console.log(Reflect.ownKeys(state)); //log: {name: "fedor", Symbol(hidden field)}
console.log(Object.getOwnPropertySymbols(state)); //log: {Symbol(hidden field)}
/* 
Чтобы опубливать свой символ есть специальный реестр символов. Для того чтобы создать публичный символ
- нужно воспользоваться методом Symbol.for */
const publicSymbol = Symbol.for(`my.public.symbol`);
const state = {
  name: `fedor`,
  [publicSymbol]: `hidden`
};
console.log(state); //log: {name: "fedor"}
console.log(state[Symbol.for(`my.public.symbol`)]); //log: "hidden"
//Так как метод Symbol.for достает символ из базы символов, а если такого символа нет, то создает, поэтому
//чтобы проверить есть ли такой символ в реестре нужно воспользоваться методом Symbol.keyFor
console.log(Symbol.keyFor(publicSymbol)); //log: "my.public.symbol"
console.log(Symbol.keyFor(Symbol(`unknown`))); //log: undefined

//Главная польза от символов - то что появились встроенные в язык символы, которые помогают управлять поведением
// пользовательских объектов
// Symbol.toPrimitive - позволяет переопределить поведение по-умолчанию при приведении типов
const MyObject = {
  [Symbol.toPrimitive](hint) {
    console.log(hint);
    if(hint === `number`) {
      return 10;
    } 
    if(hint === `string`) {
      return `hello`;
    }
    return true;
  }
}
const one = new MyObject();
console.log(one);//log: {}
console.log(+one);//log: "number" //log: 10
console.log(`Hello ${one}!`);//log: "string" //log: Hello hello!
console.log(+one);//log: "default" //log: true

//Symbol.species - позволяет переопределять поведение по-умолчанию при наследовании встроенных структур данных
class MyArr extends Array {
  constructor(...params) {
    console.log(`constrector called`);
    super(...params);
  }
  static get [Symbol.species]() {return Array;}
}
const array = new MyArr(1,2,3,4,5);
console.log(array); //log: constructor called //log: [1,2,3,4,5]
const slice = array.slice(3);
console.log(slice);//log: constructor called //log: [4,5]
console.log(array instanceof MyArr);//log: true
console.log(slice instanceof MyArr);//log: true // с static get [Symbol.species]() {return Array;} - false

//Рассмотрим какие у нас есть способы обойти массив. Некоторые сущности можно обойти с помощью оператора for...of по-умолчанию.
const array = [0,1,2];
let i = 0;
while(i < array.length) {
  const val = array[i];
  i++;
}
for (let i = 0; i < array.length; i++) {
  const val = array[i];
}
for(const val of array) {
  console.log(val);
}
for(const val of `lol`) {
  console.log(val);
}
//сущность, которая знает кто следующий называется - iterator
const currentField = Symbol(`index`);

class Iterator {
  constructor(data = [0,1,2,3,4]) {
    this.levels = data;
    this[currentField] = 0;
  }
  next(skip = 0) {
    const next = this[currentField]++;
    const hasNext = next < this.levels.length;
    //В ES2015 итератор - двусторонний протокол, а это значит, что можно не только брать следующее значение,
    // но и передавать какие-то значения при необходимости
    this[currentField] += skip;
    return {
      done: !hasNext,
      value: hasNext ? this.levels[next] : void(0)
    };
  }
}
const iterator = new Iterator(['level1', 'level2', 'level3', 'level4']);

console.log(iterator.next()); //log: {done: false, value: "level1"}
console.log(iterator.next(2)); //log: {done: false, value: "level2"}
console.log(iterator.next()); //log: {done: false, value: "level4"}
console.log(iterator.next()); //log: {done: true, value: undefined}
//Итератор удобно использовать в цикле, например так
for (let it = iterator.next(); !it.done; it = iterator.next()) {
  console.log(it.value);
}
//Или так
for (let it; !(it = iterator.next()).done;) {
  console.log(it.value);
}
//Наш класс можно легко переписать ввиде функции - паттерн фабрика
const createIterator = (data = []) => {
  let current = 0;

  return {
    next() {
      const next = current++;
      const hasNext = next < data.length;
      return {
        done: !hasNext,
        value: hasNext ? data[next] : undefined
      };
    }
  }
};
const iterator = createIterator(['level1', 'level2', 'level3', 'level4']);

for (let it = iterator.next(); !it.done; it = iterator.next()) {
  console.log(it.value);
}
//Плюс итератора в том, что нам неважно сколько у него элементов. Итератор может быть бесконечным при необходимости
const createFibonacci = () => {
  let pre = 0, cur = 1;
  return {
    next() {
      [pre, cur] = [cur, pre + cur];
      return {done: false, value: cur}
    }
  }
};
const iterator = createFibonacci();
console.log(iterator.next()); //log: {done: false, value: 1}
console.log(iterator.next()); //log: {done: false, value: 2}
console.log(iterator.next()); //log: {done: false, value: 3}
console.log(iterator.next()); //log: {done: false, value: 5}
console.log(iterator.next()); //log: {done: false, value: 8}
//Итератор является ленивой структурой данных. А это значит ему не нужно много места в памяти, 
// чтобы хранить свои значения
//Если итератор конечен, то его можно использовать в цикле
const createFibonacci = (max = 5) => {
  let pre = 0, cur = 1;
  return {
    next() {
      [pre, cur] = [cur, pre + cur];
      const done = max-- <= 0;
      return {done: done, value: done ? void(0) : cur}
    }
  }
};
const iter = createFibonacci(8);
for (let it = iter.next(); !it.done; it = iter.next()) {
  console.log(it.value);
}
//Сущность у которой есть iterator - называется iterable(итерируемой)
class MyGame {
  constructor(levels) {
    this.levels = levels;
  }
  iterator() {
    return createIterator(this.levels);
  }
}
const myGame = new MyGame(['level1','level2','level3','level4']);
const iterator = myGame.iterator();
for (let it = iterator.next(); !it.done; it = iterator.next()) {
  const element = it.value;
}
//При помощи символа Symbol.iterator можно использовать пользовательский объект внутри всех 
// допустимых операций на перечислимых множествах. Цикл for...of работает с этим символом.
class MyGame {
  constructor(levels) {
    this.levels = levels;
  }
  [Symbol.iterator]() {
    return createIterator(this.levels);
  }
}
for (const level of myGame) {
  console.log(level);
}
//Встроенные перечислимые типы (Array, String, Set...) реализуют паттерн Iterable по-умолчанию при помощи Symbol.iterator
const iterator = ['level1','level2','level3','level4'][Symbol.iterator]();
console.log(iterator); //log: {}
console.log(iterator.next()); //log: {done: false, value: level1}
console.log(iterator.next()); //log: {done: false, value: level2}
console.log(iterator.next()); //log: {done: false, value: level3}
console.log(iterator.next()); //log: {done: false, value: level4}
console.log(iterator.next()); //log: {done: true, value: undefined}
//В ES2015 появился новый тип функций - функции-генераторы(FunctionGenerator), которые реализуют паттерн iterable
//Преимущество функций-генераторов в том, что они запоминают свое состояние и могут продолжить выполнение
// с предыдещей точки входа. У функции генератора есть свой контекст this.
const fibonacci = function*(numbers = 10) {
  console.log(this); //log: {context: "context"}
  
  let pre = 0, cur = 1;
  while(numbers-- > 0) {
    [pre, cur] = [cur, pre + cur];
    yield cur;
  }
};
for (const it of fibonacci(5)) {
  console.log(it);
}
for (const it of fibonacci.call({context: 'context'}, 3)) {
  console.log(it);//log: 1 //log: 2 //log: 3
}
//Функции генераторы помогают реализовать паттерн Iterator
const range = function*(from = 0, to = 10, step = 1) {
  for (let it = from; it < to; it+=step) {
    yield it;
  }
  return 'end!';
}
const levels = range(0, 5);
console.log(levels.next()); //log: {done: false, value: 0}
console.log(levels.next()); //log: {done: false, value: 1}

for (const iterator of range(0,3,2)) {
  console.log(iterator);
}
//Генераторы можно использовать везде, где можно использовать массивы и итерабл-объекты
function* range(start, end, step=1) {
  while(start < end) {
    yield start;
    start += step;
  }
}
for(let it of range(0,10,2)) {
  console.log(it);
}
console.log([...range(0, 5)]);//log: [0,1,2,3,4]
const [first, second, ...other] = [...range(2,9,2)];
console.log(first);//log: 2
console.log(second);//log: 4
console.log(other);//log: [6,8]
//Любые Iterable-объекты можно раскрывать внутри при помощи синтаксиса yield*
class Game {
  constructor(...data) {
    this.levels = data;
  }
  *[Symbol.iterator]() {
    yield* this.levels;
  }
}
const game = new Game([1,2,3,4]);
for(let it of game) {
  console.log(it); //log: 1 //log: 2 //log: 3 //log: 4 
}

//********************************************************************************************** */
//Транспайлеры
// **************************************************************************************************
// Установим плагин для Rollup — BabelJS
// npm install -DE rollup-plugin-babel
// или npm install --save-dev --save-exact rollupplugin-babel
/* Добавим дополнительные пакеты настройки BabelJS
npm install -DE babel-plugin-external-helpers babel-preset-env
или npm install --save-dev --save-exact babel-pluginexternal-helpers babel-preset-env */
/* Добавим полифиллы BabelJS и whatwg-fetch
npm install -SE babel-polyfill whatwg-fetch
npm install --save --save-exact babel-polyfill whatwg-fetch */
// Добавим babel в сборку
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
gulp.task('scripts', function () {
  return gulp.src('js/main.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    // note that UMD and IIFE format requires
    .pipe(rollup({
      plugins: [
        // resolve node_modules
        resolve({browser: true}),
        // resolve commonjs imports
        commonjs(),
        // use babel to transpile into ES5
        babel({
          babelrc: false,
          exclude: 'node_modules/**',
          presets: [
          ['env', {modules: false}]
          ],
          plugins: [
          'external-helpers',
          ]
        })
      ]
    }, 'iife'))
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('build/js'));
});
/* Добавим плагины для загрузки модулей в Rollup
npm install -DE rollup-plugin-node-resolve rollup-plugin-commonjs
или npm install --save-dev --save-exact rollupplugin-node-resolve rollup-plugin-commonjs */
// Добавим загрузчики в сборку(выше)
// Подключим полифиллы в main.js
import 'babel-polyfill';
import 'whatwg-fetch';












//****************************************************************************** */
//Паттерны проектирования
//****************************************************************************** */

//Паттерн перечисление. в условной конструкции switch понятно о чем идет речь, нежели если бы там были просто цифры case: 0
export const Result = {
  DIE: 0,
  NOOP: 1,
  NEXT: 2,
  WIN: 3
};

const func = () => {
  switch (answer.result) {
    case Result.DIE:
      onExit();
      die(gameState);
    break;
    case Result.NEXT:
      gameState = setCurrentLevel(gameState, gameState.level + 1);
      update();
    break;
    case Result.WIN:
      onExit();
      end();
    break;
    default:
      throw new Error(`Unknown result: ${answer.result}`);
  }
}

//Паттерн ленивое вычисление
export default class AbstractView {
  get element() {
    if (!this._element) { //если элемент не создан, то создаем его
      this._element = createElement(this.getMarkup());
      this.bindHandlers();
    }
    return this._element;
  }
  getMarkup() {
    throw new Error(`Abstract method should be implemented`);
  }
  bindHandlers() {
  // By default there is nothing to bind
  }
  clearHandlers() {
  // By default nothing to clear
  }
}

// Паттерн позднее связывание
function bindLate(context, funcName) {
  return function() {
    return context[funcName].apply(context, arguments);
  };
}
var user = {
  sayHi: function() { alert('Привет!'); }
}
var userSayHi = bindLate(user, 'sayHi');
user.sayHi = function() { alert('Здравствуйте!'); }
userSayHi(); // Здравствуйте!

function bindLate(context, funcName) {
  return function() {
    return context[funcName].apply(context, arguments);
  };
}
// метода нет
var user = {  };
// ..а привязка возможна!
var userSayHi = bindLate(user, 'sayHi');
// по ходу выполнения добавили метод..
user.sayHi = function() { alert('Привет!'); }
userSayHi(); // Метод работает: Привет!