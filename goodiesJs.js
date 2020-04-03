//lesson one***************************************************************
window.onload = function(e){
	
	/*
	 document.querySelector -> один элемент дом
	 document.querySelectorAll -> массив элементов дом
	 
	 document.querySelector(css селектор)
	 
	 */
	
	var buttons = document.querySelectorAll('.actions input');
	
	for(var i = 0; i < buttons.length; i++){
		buttons[i].onclick = btnClick1;
	}
	
}

function btnClick1(e){
	// this - элемент DOM
	/* for(var k in this){
	 document.body.innerHTML += '<b>' + k + '</b> ' + this[k] + '<br>';
	 } */
	var name = this.getAttribute('name');
	
	if(name == 'save'){
		console.log('1');
	}
	else if(name == 'delete'){
		console.log('2');
	}
}
//********************************************************************
window.onload = function(e){
	
	var a = ['a', 'b', 'c']; //массив
	
	for(var i = 0; i < a.length; i++){
		console.log(a[i]);
	}
	
	var b = { //объект
		russia: 'Moscow',
		usa: 'Vashington',
		knr: 'Beijing'
	};
	
	console.log(b.knr);
	console.log(b['knr']);
	
	/* у объектов НЕТ length !!!!!!!!!!!!!!! */
	
	for(var key in b){
		console.log(b[key]); //подставляется строка
	}
	
	for(var i in a){ //отстой для обхода массива
		console.log(a[i]);
		/* у массива есть length __PROTO__ */
	}
}
//***********************************************************
var items = document.querySelectorAll('.items .item');

for(var i = 0; i < items.length; i++){
	items[i].onclick = function(){ //на клик задается\удаляется класс
		this.classList.toggle('item-active');
	}
}
//**************************************************************
var items = document.querySelectorAll('.items .item');
var divPrice = document.querySelector('.value');

for(var i = 0; i < items.length; i++){
	items[i].onclick = function(){
		this.classList.toggle('item-active');
		calcPrice();
	}
}

function calcPrice(){
	var price = 0;
	
	for(var i = 0; i < items.length; i++){
		if(items[i].classList.contains('item-active')){
			price += parseInt(items[i].getAttribute('data-price')); //пользовательский атрибут data-price
		}
	}
	
	divPrice.innerHTML = price;
}
//****************************************************
var btn = document.querySelector('input[name=calc]');
var inp1 = document.querySelector('input[name=num1]');
var inp2 = document.querySelector('input[name=num2]');
var span = document.querySelector('.res');

btn.onclick = function(){
	
	var res = parseInt(inp1.value) + parseInt(inp2.value);
	span.innerHTML = res;
}
//lesson two***********************************************************************************************
//lesson two***********************************************************************************************
var links = document.querySelectorAll('a[target=_blank]');

for(var i = 0; i < links.length; i++){
	links[i].onclick = confimAway;
}

function confimAway(e){
	if(!confirm('Мы не гарантируем, что Вы переходите на какой-то сайт. Перейти?')){
		return false;
		e.preventDefault(); //запретить стандартное поведение
	}
}

var images = document.querySelectorAll('.gallery img');

for(var i = 0; i < images.length; i++){ //запретить скачивать картинки перетаскиванием и событие контекстного меню
	images[i].onmousedown = stopMove;
	images[i].oncontextmenu = stopMove;
}

function stopMove(e){ //запретить стандартное поведение
	return false;
	e.preventDefault();
}
//***************************************************************
var btn_prev = document.querySelector('#gallery .buttons .prev');
var btn_next = document.querySelector('#gallery .buttons .next');

var images = document.querySelectorAll('#gallery .photos img');
var i = 0;

btn_prev.onclick = function(){
	images[i].classList.remove('showed');
	i--;
	
	if(i < 0){
		i = images.length - 1;
	}
	
	images[i].classList.add('showed');
};

btn_next.onclick = function(){
	images[i].classList.remove('showed');
	i++;
	
	if(i >= images.length){
		i = 0;
	}
	
	images[i].classList.add('showed');
};
//*****************************************************************
var items = document.querySelectorAll('.items .item');

function activeItem() {
	this.classList.toggle('active');
}

setInterval(function () {
	var rand = mtRand(0, items.length - 1);
	activeItem.call(items[rand]); //вызов в контексте items[rand]
});

function mtRand(min, max) { //рандомный элемент из диапазона
	return Math.floor(Math.random() * (max - min + 1));
}
//*****************************************************************
var cat1 = new Cat('Мурзик');
console.log(cat1);

var cat2 = new Cat('Мурзик1');
console.log(cat2);

var cat3 = new Cat('Мурзик2');
console.log(cat3);

cat3.eat();
cat3.eat();
cat3.eat();
console.log(cat3);
cat3.age++;
cat3.run();
cat3.run();
cat3.run();
cat3.run();
console.log(cat3);

function Cat(name) { //создание класса
	this.name = name; //поля класса пишутся со словом this, var не видится извне
	this.age = 0;
	this.weight = 1;
	
	this.eat = function () {
		this.weight++;
	}
	
	this.run = function () {
		this.weight--;
	}
}
//************************************************
var images = document.querySelectorAll('.gallery-1 .photos img');
var slider = new Slider(images);

document.querySelector('.gallery-1 .buttons .prev').onclick = function(){
	slider.prev();
}

document.querySelector('.gallery-1 .buttons .next').onclick = function(){
	slider.next();
}

var images2 = document.querySelectorAll('.gallery-2 .photos img');
var slider2 = new Slider(images2);

document.querySelector('.gallery-2 .buttons .prev').onclick = function(){
	slider2.prev();
}

document.querySelector('.gallery-2 .buttons .next').onclick = function(){
	slider2.next();
}

//по интервалу
setInterval(slider.next, 1000); //потеря контекста

setInterval(function () { //сохранение контекста
	slider.next();
}, 1000);

function Slider(images) { //слайдер ООП
	this.images = images;
	var i = 0;
	
	this.prev = function () {
		this.images[i].classList.remove('showed');
		i--;
		
		if (i < 0) {
			i = this.images.length - 1;
		}
		
		this.images[i].classList.add('showed');
	}
	
	this.next = function () {
		this.images[i].classList.remove('showed');
		i++;
		
		if (i >= this.images.length) {
			i = 0;
		}
		
		this.images[i].classList.add('showed');
	}
}
//************************************************************
setInterval(slider.next, 1000); //контекст сохраняется

function Slider(images) { //слайдер ООП с переменной this
	this.images = images;
	var i = 0;
	var slider = this; //сохранение контекста
	
	this.prev = function () {
		slider.images[i].classList.remove('showed');
		i--;
		
		if (i < 0) {
			i = slider.images.length - 1;
		}
		
		slider.images[i].classList.add('showed');
	}
	
	this.next = function () {
		slider.images[i].classList.remove('showed');
		i++;
		
		if (i >= slider.images.length) {
			i = 0;
		}
		
		slider.images[i].classList.add('showed');
	}
}
//************************************************************
new Slider({
	images: '.gallery img',
	btnPrev: '.buttons .prev',
	btnNext: '.buttons .next',
	auto: false
});

function Slider(obj) { //слайдер ООП с передаваемым объектом с полями
	this.images = document.querySelectorAll(obj.images);
	this.btnPrev = obj.btnPrev;
	this.btnNext = obj.btnNext;
	this.auto = obj.auto;
	this.rate = obj.rate || 1000; //указывается в объекте, если нет, то берется значение 1000
	var i = 0;
	var slider = this; //сохранение контекста
	
	this.prev = function () {
		slider.images[i].classList.remove('showed');
		i--;
		
		if (i < 0) {
			i = slider.images.length - 1;
		}
		
		slider.images[i].classList.add('showed');
	};
	
	this.next = function () {
		slider.images[i].classList.remove('showed');
		i++;
		
		if (i >= slider.images.length) {
			i = 0;
		}
		
		slider.images[i].classList.add('showed');
	};
	document.querySelector(slider.btnPrev).onclick = slider.prev;
	document.querySelector(slider.btnNext).onclick = slider.next;
	
	if(slider.auto) {
		setInterval(slider.next, slider.rate);
	}
}
//************************************************************
var inputs = document.querySelectorAll('.check');
var _form = document.querySelector('form');

_form.onsubmit = function (e) { //валидация формы
	var err = false;
	
	for (var i = 0; i < inputs.length; i++) {
		if(inputs[i].value === '') {
			inputs[i].classList.add('err');
			err = true;
		} else {
			inputs[i].classList.remove('err');
		}
	}
	if(err) {
		e.preventDefault();
	}
};
//lesson three*******************************************************************************************
//lesson three*******************************************************************************************
function $(selector){
	var elements;
	
	if(selector instanceof HTMLElement) { //если передан html элемент, то сразу помещаем его в массив
		elements = [selector];
	} else { //если передан селектор, то создаем элемент и кладем в массив
		elements = document.querySelectorAll(selector);
	}
	return new OurJquery(elements); //возвращает новый экземпляр класса OurJquery
}

function OurJquery(elements){
	
	this.elements = elements;
	
	this.on = function(eventname, f){ //подвешивает любое событие
		for(var i = 0; i < this.elements.length; i++){
			this.elements[i].addEventListener(eventname, f);
		}
		
		return this; //возвращает себя, с помощью чего можно делать цепочки функций (addClass().on().removeClass())
	};
	
	this.addClass = function(name){ //добавляет класс
		for(var i = 0; i < this.elements.length; i++){
			this.elements[i].classList.add(name);
		}
		
		return this;
	};
	
	this.removeClass = function(name){ //удаляет класс
		for(var i = 0; i < this.elements.length; i++){
			this.elements[i].classList.remove(name);
		}
		
		return this;
	};
	
	this.html = function(html){ //вставляет\возвращает html содержимое
		if(typeof(html) === "undefined"){
			return this.elements[0].innerHTML; //если не передан аргумент html, то вернет html-содержимое элемента
		}
		
		for(var i = 0; i < this.elements.length; i++){
			this.elements[i].innerHTML = html; //если передан аргумент html, то вставляет html-содержимое в элемент
		}
		
		return this;
	}
	
	this.fade = function (time, callback) {
		var func = callback || function(){};
		
		for (var i = 0; i < this.elements.length; i++) {
			tehFade(this.elements[i], time, 50, func);
		}
	}
	
	function tehFade(elem, t, f, callback) {
		// кадров в секунду (по умолчанию 50)
		var fps = f || 50;
		// время работы анимации (по умолчанию 500мс)
		var time = t || 500;
		// сколько всего покажем кадров
		var steps = time / (1000 / fps);
		// текущее значение opacity - изначально 0
		var op = 1;
		// изменение прозрачности за 1 кадр
		var d0 = op / steps;
		
		// устанавливаем интервал (1000 / fps)
		// например, 50fps -> 1000 / 50 = 20мс
		var timer = setInterval(function () {
			// уменьшаем текущее значение opacity
			op -= d0;
			// устанавливаем opacity элементу DOM
			elem.style.opacity = op;
			// уменьшаем количество оставшихся шагов анимации
			steps--;
			
			// если анимация окончена
			if (steps == 0) {
				// убираем интервал выполнения
				clearInterval(timer);
				// и убираем элемент из потока документа
				elem.style.display = 'none';
				
				callback.call(elem); //вызываем в контексте elem, чтобы в колбеке можно было продолжать работать с этим элементов по средствам this
			}
		}, (1000 / fps));
	}
	/*$('.items .item').on('click', function(){ пример использования
		$(this).fade(1000, function(){
			this.style.opacity = 1;
			this.style.display = 'block';
		});
	});*/
}
//lesson four*************************************************************************************************************
//lesson four*************************************************************************************************************
var p = new Popup({
	modal: '.modal',
	overlay: '.overlay',
	container: '.container'
});
document.querySelector('.button').onclick = function () {
	p.open('Chugebo because');
};
document.querySelector('.button').onclick = function () {
	var form = document.querySelector('.form');
	p.open(form.innerHTML);
};

function Popup(options) { //popup на чистом JS
	this.modal = document.querySelector(options.modal) || document.createElement('div');
	this.overlay = document.querySelector(options.overlay) || document.createElement('div');
	this.container = document.querySelector(options.container) || document.body;
	
	var popup = this;
	
	this.open = function (text) {
		popup.modal.innerHTML = text;
		
		popup.modal.classList.add('open');
		popup.overlay.classList.add('open');
		
		if(options.container === '') {
			popup.container.insertBefore(popup.modal, popup.container.firstChild);
			popup.container.insertBefore(popup.overlay, popup.container.firstChild);
		}
	};
	
	this.close = function () {
		popup.modal.classList.remove('open');
		popup.overlay.classList.remove('open');
		
		// popup.modal.style.display = 'none';
		// popup.overlay.style.display = 'none';
	};
	
	popup.overlay.onclick = popup.close;
}
//lesson five*************************************************************************************************************
//lesson five*************************************************************************************************************
//****************************************jQuery
$('.faq .ask').on('click', function(){ //по клику на элемент открыть следующий за ним элемент
	$(this).next().slideToggle(400);
});
//***********************************************
$('.faq .ask').on('click', function(){ //по клику на элем. открывает след. за ним и закрывает другие открытые
	var answer = $(this).next();
	
	$('.faq .answer:visible').not(answer).slideUp(400);
	answer.slideToggle(400);
});
//**********************************************
$('.faq .answer:first').show(); //аккордеон

$('.faq .ask').on('click', function(){
	var answer = $(this).next();
	
	$('.faq .answer:visible').not(answer).slideUp(400);
	answer.slideDown(400);
});
//************************************************
$('.faq .ask').on('click', function(){
	//по клику на элем. с дата-атрибутом(data-open) открывает элем. с дата-атрибутом(data-id) с таким же содержимым
	var id = $(this).attr('data-open');
	
	$('.faq .answer[data-id=' + id + ']').slideToggle(400);
});
//***********************************************
$('.faq .ask').on('click', function(){ //анимация со свойством ease
	$(this).next().slideToggle({
		duration: 1000,
		easing: $.bez([.51,1.92,.43,-0.98])
	});
});
//************************************************
$('.item').on('click', function () {
	//цепочка анимаций, функц. stop предотвращает большую очередь при многократном нажатии на эелм.
	$(this).stop(true, true).fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300);
});

$('.item').on('contextmenu', function (e) { //функция animate
	e.preventDefault();
	
	/*
	 $(this).animate({
	 height: 100
	 }, 500).animate({
	 opacity: 0.5
	 }, 500);
	 */
	
	$(this).animate({
		height: '-=100px',
		opacity: 0.5
	}, 500, $.bez([.51,1.92,.43,-0.98]));
});
//********************************************
$('.menu a').on('click', function (e) { //скрол к елементу по нажатию на якорь
	e.preventDefault();
	
	$('.menu a').removeClass('active').filter(this).addClass('active'); //удалить у всех элем-в класс, а текущему вновь добавить
	
	var selector = $(this).attr('href'); /* #about - строка */
	var h = $(selector); /* jquery-элемент заголовка */
	
	$('html, body').animate({
		scrollTop: h.offset().top - 70 //-70 это компенсация за марджин\паддинг у элемента
	}, 400);
});
//********************************************
$('input[type=text]').on('focus', function () {//на вновь добавленные инпуты не будут распространяться события фокус и блюр
 $(this).addClass('active');
 });
 $('input[type=text]').on('blur', function () {//на вновь добавленные инпуты не будут распространяться события фокус и блюр
 $(this).removeClass('active');
 });
//всплытие события, полезно при добавлении новых элементов, если к таким же элем-м уже было применено какое то действие
$('.items').on('focus', 'input[type="text"]', function(){ //отслеживание события на родителе и применение действия к потомку
	$(this).addClass('active');
});

$('.items').on('blur', 'input[type="text"]', function(){ //отслеживание события на родителе и применение действия к потомку
	$(this).removeClass('active');
});

$('.addField').on('click', function(){ //добавление .item, а в нем input.check[type="text"], все это помещается в контейнер .items
	var $div = $('<div/>').addClass('item');
	$('<input>').attr('type', 'text').addClass('check').appendTo($div);
	$('.items').append($div);
});
//*******************************************
function topBtn() { //кнопка наверх
	var topBtn = $('.top-btn');
	
	if($(this).scrollTop() > $(this).height()) {
		topBtn.addClass('active');
	} else {
		topBtn.removeClass('active');
	}
}
topBtn();//чтобы при обновлении страницы кнопка показалась
$(document).scroll(function () {
	topBtn();
});

$('.top-btn').on('click', function () {
	$('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
});
//lesson six*************************************************************************************************************
//lesson six*************************************************************************************************************
//свой плагин jQuery****************************************
(function($){
	$.fn.duplicate = function(settings){
		var defaults = {
			d: ' ',
			cnt: 2
		};
		
		var options = $.extend(defaults, settings);
		
		/*for(var k in defaults) { //ручная проверка
			if(typeof(settings[k])) {
				settings[k] = defaults[k];
			}
		}*/
		
		this.each(function(){
			var elem = $(this);
			var text = elem.html();
			var out = '';
			
			for(var i = 0; i < options.cnt; i++){
				out += text;
				
				if(i < options.cnt - 1){
					out += options.d;
				}
			}
			
			elem.html(out);
		});
		
		return this;
	};
})(jQuery);
//****************************************************
(function($){ //плагин animate.css
	$.fn.animated = function(settings){
		var defaults = {
			in: 'fadeInDown',
			out: 'fadeOutUp'
		};
		
		var options = $.extend(defaults, settings);
		
		this.each(function(){
			var elem = $(this);
			
			elem.css("opacity", "0").addClass('animated').waypoint(function(dir) {
				console.log(1);
				if (dir === "down") {
					elem.removeClass(options.out).addClass(options.in).css("opacity", "1");
				} else {
					elem.removeClass(options.in).addClass(options.out).css("opacity", "1");
				}
			}, {
				offset: "75%"
			});
			elem.waypoint(function(dir) {
				if (dir === "down") {
					elem.removeClass(options.in).addClass(options.out).css("opacity", "1");
				} else {
					elem.removeClass(options.out).addClass(options.in).css("opacity", "1");
				}
			}, {
				offset: -$(window).height()
			});
		});
		
		return this;
	};
})(jQuery);
//**********************************************************
(function ($) { //плагин анимации чисел, очень простой
	$.fn.animateNum = function (time) {
		
		
		this.each(function(){
			var i = 0;
			var elem = $(this);
			var num = elem.data('num');
			var step = time / num;
			var int = setInterval(function () {
				i++;
				if(i <= num) {
					elem.html(i);
				} else {
					clearInterval(int);
				}
			}, step);
		});
	}
})(jQuery);
//**********************************************************
(function ($) { //плагин слайдера
	$.fn.slider = function (settings) {
		var images = $(this).children();
		var i = 0;
		var isActive = false;
		var defaults = {
			time: 400
		};
		var options = $.extend(defaults, settings);
		
		this.prev = function () {
			if(isActive) {
				return;
			}
			isActive = true;
			
			images.eq(i).css({'top':'0', 'left':'0', 'bottom':'auto', 'right':'auto'}).animate({
				width: 0
			}, options.time);
			i--;
			
			if (i < 0) {
				i = images.length - 1;
			}
			
			images.eq(i).css({'top':'auto', 'left':'auto', 'bottom':'0', 'right':'0'}).animate({
				width: '100%'
			}, options.time, function () {
				isActive = false;
			});
		}
		this.next = function () {
			if(isActive) {
				return;
			}
			isActive = true;
			
			images.eq(i).css({'top':'auto', 'left':'auto', 'bottom':'0', 'right':'0'}).animate({
				width: 0
			}, options.time);
			i++;
			
			if (i >= images.length) {
				i = 0;
			}
			
			images.eq(i).css({'top':'0', 'left':'0', 'bottom':'auto', 'right':'auto'}).animate({
				width: '100%'
			}, options.time, function () {
				isActive = false;
			});
		}
		return this;
	};
})(jQuery);
//*****************************************************
function Timer(time, f) { //класс таймера
	this.time = time;
	this.worker = null;
	
	var that = this;
	var renderer = f || function (data) {}
	
	this.start = function () {
		that.worker = setInterval(function () {
			that.tick();
		}, 1000);
	}
	
	this.stop = function () {
		if (that.worker != null) {
			clearInterval(that.worker);
		}
	}
	
	this.tick = function () {
		if(that.time <= 0){
			that.stop();
			that.render();
			return;
		}
		
		that.time--;
		that.render();
	}
	
	this.getData = function () {
		var data = {};
		
		var d_free = that.time % (3600 * 24);
		var d = (that.time - d_free) / (3600 * 24);
		data.d = d;
		data.d_s = endings(d, ['аДаНаЕаЙ', 'аДаЕаНб', 'аДаНб'])
		
		var h_free = d_free % 3600;
		var h = (d_free - h_free) / 3600;
		data.h = h;
		data.h_s = endings(h, ['баАбаОаВ', 'баАб', 'баАбаА']);
		
		var m_free = h_free % 60;
		var m = (h_free - m_free) / 60;
		data.m = m;
		data.m_s = endings(m, ['аМаИаНбб', 'аМаИаНббаА', 'аМаИаНббб']);
		
		data.s = m_free;
		data.s_s = endings(m_free, ['баЕаКбаНаД', 'баЕаКбаНаДаА', 'баЕаКбаНаДб']);
		
		return data;
	}
	
	this.render = function () {
		var data = that.getData();
		renderer(data);
	}
	
	function endings(t, variants) {
		var t0 = t % 10;
		
		if (t > 4 && t < 21) {
			return variants[0];
		} else if (t0 == 1) {
			return variants[1];
		} else if (t0 > 1 && t0 < 5) {
			return variants[2];
		} else {
			return variants[0];
		}
	}
}
//lesson seven**********************************************************************************************************
//lesson seven**********************************************************************************************************
$(function () { //owl-carousel
	
	var $items = $('.faq .item');
	
	$('.faq').owlCarousel({
		loop: true,
		margin: 10,
		responsiveClass: true,
		responsive: {
			0: {
				items: 1,
				nav: true
			},
			600: {
				items: 3,
				nav: false
			},
			1000: {
				items: 5,
				nav: true,
				loop: false
			}
		},
		onInitialized: function () {
			equalsHeight($items);
		},
		onResized: function () {
			equalsHeight($items);
		}
	});
	
	function equalsHeight($items) { //выравнивает высоту элементов
		var max = 0;
		
		$items.each(function () {
			var h = $(this).find('> div').outerHeight(); //.height() // необходимо добавить див-обертку, по кот. идет выравнивание
			
			if (h > max) {
				max = h;
			}
		});
		
		$items.css('min-height', max + 'px');
		
		setTimeout(function () {
			$('.faq').trigger('refresh.owl.carousel');
		}, 1);
	}
});
//******************************************************
"use strict"; //ES6 стандарт

window.onload = function(e){
	
	const a = {some: 1};
	let i = 10; //локальная переменная, видимость ограничивается {...}, var огранивается функцией
	
	for(let i  = 0; i < 100; i++){
	
	}
	
	a.some1 = 1;
	console.log(a);
	console.log(`Значение i = ${i} - ура! А значение а = ${a.some} - ага!`); //конкатинация
	
	let items = document.querySelectorAll('.items .item');
	let divPrice = document.querySelector('.value');
	
	for(let i = 0; i < items.length; i++){
		items[i].onclick = function(){
			this.classList.toggle('item-active');
			calcPrice();
		}
	}
	
	function calcPrice(){
		let price = 0;
		
		for(let i = 0; i < items.length; i++){
			if(items[i].classList.contains('item-active')){
				price += parseInt(items[i].getAttribute('data-price'));
			}
		}
		
		divPrice.innerHTML = price;
	}
	
	console.log(sum(1, 2, 3, 4, 5));
	
	let t = new Timer(500);
	t.start();
	
	let min = (a, b) => a - b;
	
	let divide = (a, b) => {
		if(b == 0){
			return null;
		}
		
		return a - b;
	}
	
	console.log(min(5, 3));
}

function sum(...args){
	let sum = 0;
	
	for(let val of args){
		sum += val;
	}
	
	return sum;
}

class Timer{ //ООП
	constructor(time = 100){
		this.time = time;
	}
	
	tick(){
		this.time--;
		console.log(this.time);
	}
	
	start(){
		setInterval(() => { //стрелочная функция, вызывается в текущем контексте
			this.tick();
	}, 1000);
	}
}
//other*****************************************************************************************************************
//other*****************************************************************************************************************
//other*****************************************************************************************************************
function Animal() { //прототип, как наследование в других языках, старый синтаксис
	this.age = 10;
	this.eat = function () {
	
	}
}

function Cat() {
	this.tail = 10;
}

Cat.prototype.ears = true; //расширение класса полем
Cat.prototype.meow = function (meow) { //расширение класса функцией
	console.log(meow);
};

Cat.prototype = new Animal(); //расширение класса другим классом
//*********************************************
class Animal { //прототип, новый синтаксис ES6
	constructor() {
		this.age = 10;
	}
	
	eat() {
	
	}
}

class Cat extends Animal{
	constructor() {
		super(); //вызов конструктора родителя
		this.tail = 5;
	}
	
	getVoice() {
		return 'aaaaaa';
	}
}
//***************************************************************
//функция проверки поддержки calc браузером
function checkCalc() {
	var div = document.createElement('div');
	div.style.cssText = 'width: calc(100%)';
	return div.style.length > 0;
}

if (!checkCalc()) {
	var style = document.createElement('link');
	style.setAttribute('rel', 'stylesheet');
	style.setAttribute('href', 'css/style-nocalc.css');
	document.body.appendChild(style);
}
//*****************************************************************
//проверка на не число
var a = 'yo';
var n = 1;
isNaN(a); //true
isNaN(n); //false

parseFloat('15'); //приведение к Number
parseInt('11', 2); //приведение к Number, можно задать систему счисления
n.toString(); //приведение к строке
n.toFixed(2); //отброс знаков после запятой, аргумент - количество знаков

//прерывают исполнение кода js
alert(1);
confirm('привет, лошара?'); //да/нет
prompt('введите номер...'); //ввести значение
//****************************************************************
(function (a, b) { //задание и немедленный вызов функции
	var a1 = a;
	var b1 = b;
	
	var c = a1 % b1; //проверка на остаток при делении
	
	if(c == 0) {
		console.log('a кратно b');
	} else {
		console.log('остаток ' + c);
	}
	return c;
})();

var sum = (function (a, b) { //присваивание функции и немедленный вызов
	var a1 = a;
	var b1 = b;
	
	return a1 + b1;
})();

sum(); //возможность вызвать в другом месте
//****************************************************
// пузырьковая сортировка
var list = [1, 2, 15, -4];
var temp;

for(var i = 0; i < list.length; i++) {
	for (var j = 0; j < list.length-1; j++) {
		if(list[j] > list[j+1]) { //сортировка от меньшего к большему
			temp = list[j+1];
			list[j+1] = list[j];
			list[j] = temp;
		}
		/*if(list[j] < list[j+1]) { //сортировка от большего к меньшему
			temp = list[j+1];
			list[j+1] = list[j];
			list[j] = temp;
		}*/
	}
}

var maxmin = list[0];

for(var i = 0; i < list.length; i++) { //нахождение наименьшего числа в массиве
	if(maxmin > list[i]) {
		maxmin = list[i];
	}
}
for(var i = 0; i < list.length; i++) { //нахождение наибольшего числа в массиве
	if(maxmin < list[i]) {
		maxmin = list[i];
	}
}
//***************************************************
Array.prototype.bubble = function () { //расширение класса Array функцией bubble
		var list = this;
		var temp;
		
		for(var i = 0; i < list.length; i++) {
			for (var j = 0; j < list.length-1; j++) {
				/*if(list[j] > list[j+1]) { //сортировка от меньшего к большему
					temp = list[j+1];
					list[j+1] = list[j];
					list[j] = temp;
				}*/
				if(list[j] < list[j+1]) { //сортировка от большего к меньшему
				 temp = list[j+1];
				 list[j+1] = list[j];
				 list[j] = temp;
				 }
			}
		}
	}
//**********************************************************************
function extend(Child, Parent) { //функция наследования
		var F = function () {};
		F.prototype = Parent.prototype;
		Child.prototype = new F();
		Child.prototype.constructor = Child;
		Child.superclass = Parent.prototype;
		
	}
	
	function Base() {
		var list = [];
		
		this.set = function (name, money) {
			list.push([name, money]);
		};
		this.get = function (key) {
			return list[key];
		}
		this.getter = function () {
			return list;
		}
	}
	
	function Temporary() {
		Base.apply(this, arguments); //типа вызов конструктора
		
		var parent = this;
		
		this.getSum = function (key) {
			var l = parent.getter();
			var name = l[key][0];
			var money = l[key][1];
			
			var result = 'Сотрудник ' + name + ' имеет зарплату ' + money + ' в месяц';
			return result;
		}
	}
	
	function Standing() {
	
	}
	
	extend(Temporary, Base);
	extend(Standing, Base);
	
	var tempGroup = new Temporary();
	
	tempGroup.set('Ivan', 3000);
	tempGroup.set('Vitya', 4000);
	
	console.log(tempGroup.getter());
//*****************************************************************
var JSMath = { //объект math
		sum: function (a, b) {
			return a+b;
		},
		abs: function (a) {
			return (a > 0) ? a : a*(-1); //тернарный оператор, если х больше ноля, то возвращаем х, если нет, то умножаем на -1 и возвращаем
		},
		koren: function (a) {
			var x = 1;
			var xn = (1/2)*(x + (a/x));
			
			var eps = 0.000001;
			while(this.abs(x - (a/x)) > eps) {
				xn = (1/2)*(x + (a/x));
				x = xn;
			}
			return xn;
		}
	}
	
	var x = JSMath.sum(10, 13);
//**********************************************************************
//patterns**************************************************************
//module
var Basket = (function () { 
		var sum = 0;
		var goods = [];
		
		return {
			addProduct: function (product) {
				sum += product.price;
				goods.push(product);
			},
			printProducts: function () {
				for(var i = 0; i < goods.length; i++) {
					console.log(goods[i].name, goods[i].price);
				}
			}
		}
		
	})();
	
	var sault = {
		name: 'соль',
		price: '23 руб.'
	};
	var sugar = {
		name: 'сахар',
		price: '41 руб.'
	};
	
	Basket.addProduct(sault);
	Basket.addProduct(sugar);
	Basket.printProducts();
	//********************************************************************************
	//singleton
	var Singleton = (function () { //несколько экземпляров ссылаются на один и тот же объект
		var instance;
		var SERVER = 'localhost';
		
		function Singleton() {
			if(!instance) {
				instance = this;
			} else {
				return instance;
			}
		}
		
		Singleton.prototype.connect = function () { //расширение функциональности
			console.log("connect " + SERVER);
		};
		
		return Singleton; //возвращаем конструктор
	})();

	var s1 = new Singleton();
	var s2 = new Singleton();
	
	console.log(s1 === s2);
	s2.connect();
//***************************************************************
//observer
function Observable() { //добавляет в себя прослушиваемых и отправляет им сообщение
		var observers = [];
		this.sendMessage = function (msg) {
			for(var i = 0; i < observers.length; i++) {
				observers[i].notify(msg);
			}
		};
		this.addObserver = function (observer) { //добавить прослушиваемого
			observers.push(observer);
		}
	}
	
	function Observer(behavior) { //прослушиваемый
		this.notify = function (msg) {
			behavior(msg);
		};
	}
	
	var observable = new Observable();
	
	var basketObs = new Observer(function (id) { //добавление в корзину
		$('.basket-products-list').append(
			$('<li></li>').addClass('basket-product').text('Товар ' + id)
		);
	});
	
	var modalObs = new Observer(function (id) { //модальное окно
		var msg = 'Товар ' + id + ' добавлен в корзину!';
		$('.buy-modal-message').text(msg);
		$('.buy-modal').removeClass('.buy-modal-hide');
		setTimeout(function () {
			$('.buy-modal').addClass('.buy-modal-hide');
		}, 2000);
	});
	
	var serverObs = new Observer(function (id) { //отправка на сервер
		console.log('id: ' + id);
	});
	
	observable.addObserver(basketObs); //добавление прослушиваемых
	observable.addObserver(modalObs);
	observable.addObserver(serverObs);
	
	$('.product-btn').on('click', function () { //по клику рассылает сообщения
		var id = $(this).attr('data-id');
		observable.sendMessage(id);
	});
//*********************************************************************************************
//strategy
function SortStrategy() {}
	SortStrategy.prototype.sort = function () {}; //расширение функцией сортировки
	
	function NameSS() {}
	NameSS.prototype = Object.create(SortStrategy.prototype);
	NameSS.prototype.sort = function (data) { //переопределение функции сортировки 
		data.sort(function (a, b) {
			return (a.name > b.name) ? 1 : -1;
		});
	};
	
	function PriceSS() {}
	PriceSS.prototype = Object.create(SortStrategy.prototype);
	PriceSS.prototype.sort = function (data) { //переопределение функции сортировки
		data.sort(function (a, b) {
			return (a.price - b.price);
		});
	};
	
	function RatingSS() {}
	RatingSS.prototype = Object.create(SortStrategy.prototype);
	RatingSS.prototype.sort = function (data) { //переопределение функции сортировки
		data.sort(function (a, b) {
			return (a.rating - b.rating);
		});
	};
	
	var Catalog = (function () {
		var strategy = {};
		var data = [
			{name: 'Кола', price: 60, rating: 2},
			{name: 'Валенки', price: 1500, rating: 4},
			{name: 'Телефон', price: 6000, rating: 1},
			{name: 'Шаурма', price: 150, rating: 5}
			];
		
		function printData() { //вывод полей data
			$('.catalog-list').empty();
			data.forEach(function (product) {
				$('.catalog-list').append(
					$('<li></li>').text(product.name + ', ' + product.price + ', ' + product.rating)
				);
			});
		}
		
		return {
			sort: function () {
				strategy.sort(data);
				printData();
			},
			setStrategy: function (s) {
				strategy = s;
			}
		};
	}());
	
	$('.catalog-sort-type').change(function () { //<select class='catalog-sort-type'> <option value='name'>Название</option> </select>
		var val = $(this).val();
		if(val === 'name') Catalog.setStrategy(new NameSS());
		if(val === 'price') Catalog.setStrategy(new PriceSS());
		if(val === 'rating') Catalog.setStrategy(new RatingSS());
	});
	
	$('.catalog-sort-btn').on('click', function () { //кнопка сортировки
		Catalog.sort();
	});
//*******************************************************************************
//decorator
	function Input(labelText) {
		var $element = $('<div></div>').addClass('input').append(
			$('<span></span>').addClass('input-label').text(labelText),
			$('<input>').addClass('input-field')
		);
		this.get = function () {
			return $element;
		}
	}
	
	function Decorator(obj) {
		this._obj = obj;
		this.get = function () { //переопределение метода get() в Input
			return this._obj.get();
		}
	}
	Decorator.prototype = Object.create(Input.prototype);
	Decorator.prototype.constructor = Decorator;
	
	function ClearDec(obj) {
		Decorator.call(this, obj); //вызов конструктора
		this._obj.get().append(
			$('<span>x</span>').addClass('input-clear') //добвление кнопки очистки
		);
		$(document.body).on('click', '.input-clear', function (e) { //всплытие события, так как объект добавляется программно
			$(e.target).siblings('.input-field').val('');
		});
	}
	ClearDec.prototype = Object.create(Decorator.prototype); //расширение прототипа
	ClearDec.prototype.constructor = ClearDec; //назначение конструктора
	
	function ValidDec(obj) {
		Decorator.call(this, obj); //вызов конструктора
		this._obj.get().children('.input-field').attr('data-validate', '');
		$(document.body).on('input', '.input-field[data-validate]', function (e) {
			if(/[0-9]/.test($(e.target).val())) {
				$(e.target).parent().addClass('input-wrong');
			} else {
				$(e.target).parent().removeClass('input-wrong');
			}
		});
	}
	ValidDec.prototype = Object.create(Decorator.prototype); //расширение прототипа
	ValidDec.prototype.constructor = ValidDec; //назначение конструктора
	
	var i = new Input('простой');
	var iClear = new ClearDec(new Input('очищаемый'));
	var iValid = new ValidDec(new Input('проверяемый'));
	var iBoth = new ValidDec(new ClearDec(new Input('совмещенный')));
	
	$(document.body).append(i.get(), iClear.get(), iValid.get(), iBoth.get()); //вставляем в боди
//********************************************************************************
//advancedJs**********************************************************************
//шаблоны вызова функций
	var obj = { //внутри объектра this ссылается на этот объект
		p: '21',
		method: function () {
			console.log(this.p); //21
		}
	};
	obj.method();
	//**********************************************************
	function Cons(a) { //конструктор
		this.p = a;
		console.log(this.p); //this ссылается на объект, созданный этим конструктором
	}
	
	var cons = new Cons('12');
	//**********************************************************
	function Cons1() {
		this.p = '444';
		var self = this; //сохранение контекста
		
		function pm() {
			console.log(self.p);
		}
		
		this.method = function () {
			pm();
		}
	}
	
	(new Cons1()).method();
	//**********************************************************
	var obj1 = { //call/apply
		p: '21',
		method: function (a, b) {
			console.log(this.p, a, b); //21
		}
	};
	
	var trap = {
		p: 'chugebo'
	};
	
	obj1.method.call(trap, 14, 12); //вызов функции method() в контексте объекта trap
	obj1.method.apply(trap, [14, 13]); //apply принимает в качестве аргументов массивы
	//**********************************************************
	function func() { //массив из аргументов, arguments изначально объект
		var arg = [].slice.call(arguments);
		console.log(arg, arg instanceof Array);
	}
	func(1,3,5,7,94);
	//**********************************************************
	function Cons2() {
		this.p = '444';
		
		function pm() {
			console.log(this.p);
		}
		
		this.method = function () {
			pm.call(this);
		}
	}
	
	(new Cons2()).method();
//*************************************************************************************************
//defineProperty***********************************************************************************
var acc = {
		id: '66',
		name: 'Vasya',
		passHash: 'ksjdcksjdh98y87qgwbhbsmnbx',
		role: 'user'
	};
	
	Object.defineProperty(acc, 'passHash', { //скрывает поле passHash
		enumerable: false,
		configurable: false, //можно/нельзя удалять
		writable: true //по умолчанию все свойства false
	});
	
	Object.defineProperty(acc, 'role', { //запрещает изменение
		enumerable: true,
		configurable: false,
		writable: false //по умолчанию все свойства false
	});
	
	Object.defineProperty(acc, 'new Prop', { //добавляет новое поле
		value: 'test',
		enumerable: true
	});
	
	acc.role = 'admin'; // = 'user'
	// delete acc.role;
	
	for(var k in acc) {
		console.log(acc[k]);
	}
//асинхронность/стек вызовов************************************
	setTimeout(function () { //вызовется только после цикла
		console.log('event');
	}, 50);
	for(var i = 0;i < 10; i++ ) console.log(i);
	//**************************************************************
	function nextArrayItem(len) { //стек переполнится
		if(len > 0) nextArrayItem(len-1);
	}
	nextArrayItem(1000000);
	console.log('ok');
	//**************************************************************
	function nextArrayItem(len) { //хак переполнения стека
		if(len > 0) setTimeout(function () {
			nextArrayItem(len-1);
		}, 0);
	}
	nextArrayItem(10000000000000);
	console.log('ok');
	//**************************************************************
	//цепочка асинхронных запросов, ES6
	var promise = new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve();
		}, 500);
	});
	
	promise.then(function () {
		var i = 500;
		return i;
	}).then(function (val) {
		return val*3;
	}).then(function (val) {
		return val/100;
	}).then(function (val) {
		console.log(val);              //15
	});
	//**************************************************************
	var promise = new Promise(function (resolve, reject) {
		setTimeout(function () {
			resolve();
		}, 500);
	});
	
	promise.then(function () {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				var id = '60';
				resolve(id);
			}, 500);
		});
	}).then(function (id) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				var rawData = {
					id: id,
					name: 'Vasya',
					surName: 'Stroltsman'
				};
				resolve(rawData);
			}, 500);
		});
	}).then(function (rawData) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				var data = 'id = ' + rawData.id + ' name = ' + rawData.name + ' surName = ' + rawData.surName;
				resolve(rawData);
			}, 500);
		});
	}).then(function (data) {
		console.log(data);
	});
//***************************************************************************************************************************
//***************************************************************************************************************************
//плагины********************************************************************************
magnific-popup - всплывающее окно
mixitup - разбивка по категориям (айтемы, фото в галерее) с анимацией
mmenu - мобайл меню
owlCarousel - слайдер
slick - слайдер
parallax - параллакс
superfish menu - выпадающее меню
stellar - параллакс
selectize - выпадающий список
waypoints - действие при прокрутке(скролл до определенного объекта)
animate.js - анимация при скролле до определенного объекта
jquery.countTo - анимированный счетчик цифр
jquery.bez.min - возможность использования функций безье при анимации, помимо 2х стандартных
uniMail - скрипт отправки письма на почту с сайта
















