import {EQuestionType, TQuestionsByLevel} from "../types/questions.js";

const data : TQuestionsByLevel = {
    "junior": [
        {
            "id": 1,
            "text": "Что выведет console.log(typeof null)?",
            "type": EQuestionType.CLICK,
            "hasOptions": true,
            "options": [
                { "id": 1, "text": "null", "isCorrect": false },
                { "id": 2, "text": "object", "isCorrect": true },
                { "id": 3, "text": "undefined", "isCorrect": false },
                { "id": 4, "text": "string", "isCorrect": false }
            ]
        },
        {
            "id": 2,
            "text": "Что такое hoisting в JavaScript?",
            "type": EQuestionType.CLICK,
            "hasOptions": true,
            "options": [
                { "id": 1, "text": "Поднятие переменных и функций в начало области видимости", "isCorrect": true },
                { "id": 2, "text": "Оптимизация кода движком JavaScript", "isCorrect": false },
                { "id": 3, "text": "Сборка мусора", "isCorrect": false },
                { "id": 4, "text": "Асинхронное выполнение кода", "isCorrect": false }
            ]
        },
        {
            "id": 3,
            "text": "Какое ключевое слово используется для объявления константы?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "let", "isCorrect": false },
                { "id": 2, "text": "var", "isCorrect": false },
                { "id": 3, "text": "const", "isCorrect": true },
                { "id": 4, "text": "static", "isCorrect": false }
            ]
        },
        {
            "id": 4,
            "text": "Что такое замыкание (closure) в JavaScript?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Функция вместе с лексическим окружением", "isCorrect": true },
                { "id": 2, "text": "Способ скрытия переменных", "isCorrect": false },
                { "id": 3, "text": "Метод оптимизации памяти", "isCorrect": false },
                { "id": 4, "text": "Тип данных для хранения функций", "isCorrect": false }
            ]
        },
        {
            "id": 5,
            "text": "Какой метод массива используется для преобразования элементов?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "forEach", "isCorrect": false },
                { "id": 2, "text": "map", "isCorrect": true },
                { "id": 3, "text": "filter", "isCorrect": false },
                { "id": 4, "text": "reduce", "isCorrect": false }
            ]
        },
        {
            "id": 6,
            "text": "Что такое Promise в JavaScript?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Объект для работы с асинхронными операциями", "isCorrect": true },
                { "id": 2, "text": "Способ объявления переменных", "isCorrect": false },
                { "id": 3, "text": "Метод для создания классов", "isCorrect": false },
                { "id": 4, "text": "Тип данных для хранения промокодов", "isCorrect": false }
            ]
        },
        {
            "id": 7,
            "text": "Как проверить, что переменная является массивом?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "typeof variable === 'array'", "isCorrect": false },
                { "id": 2, "text": "variable.isArray()", "isCorrect": false },
                { "id": 3, "text": "Array.isArray(variable)", "isCorrect": true },
                { "id": 4, "text": "variable instanceof Array", "isCorrect": true }
            ]
        },
        {
            "id": 8,
            "text": "Что выведет console.log(1 + '2' + 3)?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "6", "isCorrect": false },
                { "id": 2, "text": "123", "isCorrect": true },
                { "id": 3, "text": "15", "isCorrect": false },
                { "id": 4, "text": "NaN", "isCorrect": false }
            ]
        },
        {
            "id": 9,
            "text": "Какой оператор используется для строгого сравнения?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "==", "isCorrect": false },
                { "id": 2, "text": "===", "isCorrect": true },
                { "id": 3, "text": "=", "isCorrect": false },
                { "id": 4, "text": "!==", "isCorrect": false }
            ]
        },
        {
            "id": 10,
            "text": "Что такое event bubbling?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Всплытие события от целевого элемента к document", "isCorrect": true },
                { "id": 2, "text": "Погружение события от document к целевому элементу", "isCorrect": false },
                { "id": 3, "text": "Создание пользовательских событий", "isCorrect": false },
                { "id": 4, "text": "Обработка ошибок в событиях", "isCorrect": false }
            ]
        },
        {
            "id": 11,
            "text": "Как создать копию объекта без ссылки?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Object.copy(obj)", "isCorrect": false },
                { "id": 2, "text": "JSON.parse(JSON.stringify(obj))", "isCorrect": true },
                { "id": 3, "text": "obj.clone()", "isCorrect": false },
                { "id": 4, "text": "Object.assign(obj)", "isCorrect": false }
            ]
        },
        {
            "id": 12,
            "text": "Что такое деструктуризация?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Извлечение значений из объектов и массивов в переменные", "isCorrect": true },
                { "id": 2, "text": "Удаление свойств из объекта", "isCorrect": false },
                { "id": 3, "text": "Разрушение объекта на части", "isCorrect": false },
                { "id": 4, "text": "Очистка памяти от неиспользуемых объектов", "isCorrect": false }
            ]
        },
        {
            "id": 13,
            "text": "Какой метод используется для обработки ошибок в Promise?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "catch", "isCorrect": true },
                { "id": 2, "text": "error", "isCorrect": false },
                { "id": 3, "text": "fail", "isCorrect": false },
                { "id": 4, "text": "then", "isCorrect": false }
            ]
        },
        {
            "id": 14,
            "text": "Что такое IIFE?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Немедленно вызываемое функциональное выражение", "isCorrect": true },
                { "id": 2, "text": "Интерфейс для импорта модулей", "isCorrect": false },
                { "id": 3, "text": "Способ объявления классов", "isCorrect": false },
                { "id": 4, "text": "Метод итерации по объектам", "isCorrect": false }
            ]
        },
        {
            "id": 15,
            "text": "Как добавить элемент в конец массива?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "array.push(element)", "isCorrect": true },
                { "id": 2, "text": "array.append(element)", "isCorrect": false },
                { "id": 3, "text": "array.add(element)", "isCorrect": false },
                { "id": 4, "text": "array.concat(element)", "isCorrect": false }
            ]
        },
        {
            "id": 16,
            "text": "Что такое this в JavaScript?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Контекст выполнения функции", "isCorrect": true },
                { "id": 2, "text": "Ссылка на текущий объект", "isCorrect": false },
                { "id": 3, "text": "Глобальный объект", "isCorrect": false },
                { "id": 4, "text": "Ключевое слово для классов", "isCorrect": false }
            ]
        },
        {
            "id": 17,
            "text": "Как работает оператор остатка (%)?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Возвращает остаток от деления", "isCorrect": true },
                { "id": 2, "text": "Вычисляет процент от числа", "isCorrect": false },
                { "id": 3, "text": "Округляет число", "isCorrect": false },
                { "id": 4, "text": "Делит числа", "isCorrect": false }
            ]
        },
        {
            "id": 18,
            "text": "Что такое стрелочные функции?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Функции с укороченным синтаксисом и без своего this", "isCorrect": true },
                { "id": 2, "text": "Функции для работы со стрелками", "isCorrect": false },
                { "id": 3, "text": "Асинхронные функции", "isCorrect": false },
                { "id": 4, "text": "Функции-конструкторы", "isCorrect": false }
            ]
        },
        {
            "id": 19,
            "text": "Как проверить наличие свойства в объекте?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "'prop' in object", "isCorrect": true },
                { "id": 2, "text": "object.hasProperty('prop')", "isCorrect": false },
                { "id": 3, "text": "object.prop !== undefined", "isCorrect": true },
                { "id": 4, "text": "object.contains('prop')", "isCorrect": false }
            ]
        },
        {
            "id": 20,
            "text": "Что такое async/await?",
            "hasOptions": true,
            "type": EQuestionType.CLICK,
            "options": [
                { "id": 1, "text": "Синтаксический сахар для работы с Promise", "isCorrect": true },
                { "id": 2, "text": "Способ объявления асинхронных переменных", "isCorrect": false },
                { "id": 3, "text": "Метод для создания потоков", "isCorrect": false },
                { "id": 4, "text": "Инструмент для измерения времени выполнения", "isCorrect": false }
            ]
        },
        {
            "id": 21,
            "type": EQuestionType.ANSWER,
            "text": "Для чего используется EventLoop в JavaScript?",
            "hasOptions": false,
            "answer": "EventLoop (цикл событий) - это механизм, который позволяет JavaScript обрабатывать асинхронные операции. Он постоянно проверяет call stack и callback queue. Когда call stack пуст, EventLoop берет первую задачу из очереди и помещает ее в call stack для выполнения."
        },
        {
            "id": 22,
            "type": EQuestionType.ANSWER,
            "text": "Что такое hoisting (поднятие) в JavaScript?",
            "hasOptions": false,
            "answer": "Hoisting - это поведение JavaScript, при котором объявления переменных (var) и функций поднимаются вверх своей области видимости перед выполнением кода. Однако, только объявления поднимаются, а не инициализации."
        },
        {
            "id": 23,
            "type": EQuestionType.ANSWER,
            "text": "В чем разница между let, const и var?",
            "hasOptions": false,
            "answer": "var - function scoped, поднимается (hoisted), можно переопределять. let - block scoped, не поднимается, можно переназначать. const - block scoped, не поднимается, нельзя переназначать, но можно изменять свойства объектов и элементы массивов."
        },
        {
            "id": 24,
            "type": EQuestionType.ANSWER,
            "text": "Что такое замыкание (closure) и приведите пример?",
            "hasOptions": false,
            "answer": "Замыкание - это функция, которая имеет доступ к переменным из внешней области видимости даже после того, как внешняя функция завершила выполнение. Пример: function createCounter() { let count = 0; return function() { return ++count; }; }"
        },
        {
            "id": 25,
            "type": EQuestionType.ANSWER,
            "text": "Что такое Promise и для чего он используется?",
            "hasOptions": false,
            "answer": "Promise - это объект, представляющий результат асинхронной операции. Он может находиться в состоянии pending, fulfilled или rejected. Используется для обработки асинхронных операций и избежания callback hell."
        },
        {
            "id": 26,
            "type": EQuestionType.ANSWER,
            "text": "Объясните разницу между == и ===",
            "hasOptions": false,
            "answer": "== (нестрогое равенство) выполняет преобразование типов перед сравнением. === (строгое равенство) сравнивает значения без преобразования типов. Рекомендуется использовать === для избежания неожиданного поведения."
        },
        {
            "id": 27,
            "type": EQuestionType.ANSWER,
            "text": "Что такое this в JavaScript и как он работает?",
            "hasOptions": false,
            "answer": "this - это ключевое слово, которое ссылается на контекст выполнения функции. Его значение зависит от того, как вызвана функция: в методах объекта - this это объект, в обычных функциях - global object (или undefined в strict mode), в стрелочных функциях - наследуется из внешней области."
        },
        {
            "id": 28,
            "type": EQuestionType.ANSWER,
            "text": "Что такое стрелочные функции и чем они отличаются от обычных?",
            "hasOptions": false,
            "answer": "Стрелочные функции имеют shorter syntax, не имеют своего this (наследуют из внешней области), не имеют arguments object, не могут быть использованы как конструкторы, не имеют prototype property."
        },
        {
            "id": 29,
            "type": EQuestionType.ANSWER,
            "text": "Что такое деструктуризация и приведите пример?",
            "hasOptions": false,
            "answer": "Деструктуризация - это синтаксис для извлечения значений из объектов и массивов в отдельные переменные. Пример: const {name, age} = person; или const [first, second] = array;"
        },
        {
            "id": 30,
            "type": EQuestionType.ANSWER,
            "text": "Что такое async/await и как это работает?",
            "hasOptions": false,
            "answer": "async/await - это синтаксический сахар для работы с Promise. async функция всегда возвращает Promise. await приостанавливает выполнение async функции до разрешения Promise, делая асинхронный код похожим на синхронный."
        },
        {
            "id": 31,
            "type": EQuestionType.ANSWER,
            "text": "Что такое CORS и для чего он нужен?",
            "hasOptions": false,
            "answer": "CORS (Cross-Origin Resource Sharing) - это механизм, который позволяет веб-страницам делать запросы к доменам, отличным от домена самой страницы. Браузеры блокируют cross-origin запросы по умолчанию для безопасности."
        },
        {
            "id": 32,
            "type": EQuestionType.ANSWER,
            "text": "Что такое прототипное наследование в JavaScript?",
            "hasOptions": false,
            "answer": "JavaScript использует прототипное наследование - объекты могут наследовать свойства и методы от других объектов через цепочку прототипов. Каждый объект имеет скрытое свойство [[Prototype]], которое ссылается на его прототип."
        },
        {
            "id": 33,
            "type": EQuestionType.ANSWER,
            "text": "Что такое callback-функция и приведите пример?",
            "hasOptions": false,
            "answer": "Callback-функция - это функция, передаваемая в другую функцию в качестве аргумента и вызываемая позже. Пример: setTimeout(() => { console.log('Callback executed'); }, 1000);"
        },
        {
            "id": 34,
            "type": EQuestionType.ANSWER,
            "text": "Что такое IIFE и для чего используется?",
            "hasOptions": false,
            "answer": "IIFE (Immediately Invoked Function Expression) - это функция, которая выполняется сразу после определения. Используется для создания изолированной области видимости и избежания загрязнения глобального namespace. Пример: (function() { /* code */ })();"
        },
        {
            "id": 35,
            "type": EQuestionType.ANSWER,
            "text": "Что такое event bubbling и event capturing?",
            "hasOptions": false,
            "answer": "Event bubbling - событие всплывает от целевого элемента к document. Event capturing - событие погружается от document к целевому элементу. По умолчанию используется bubbling, но можно использовать capturing через addEventListener с третьим параметром true."
        },
        {
            "id": 36,
            "type": EQuestionType.ANSWER,
            "text": "Что такое localStorage и sessionStorage?",
            "hasOptions": false,
            "answer": "localStorage и sessionStorage - Web Storage API для хранения данных в браузере. localStorage сохраняет данные без срока действия, sessionStorage - только на время сессии (до закрытия вкладки). Данные хранятся в формате ключ-значение."
        },
        {
            "id": 37,
            "type": EQuestionType.ANSWER,
            "text": "Что такое REST API и основные HTTP методы?",
            "hasOptions": false,
            "answer": "REST API - архитектурный стиль для создания веб-сервисов. Основные HTTP методы: GET (получить данные), POST (создать новый ресурс), PUT (обновить ресурс), DELETE (удалить ресурс), PATCH (частичное обновление)."
        },
        {
            "id": 38,
            "type": EQuestionType.ANSWER,
            "text": "Что такое мемоизация и приведите пример?",
            "hasOptions": false,
            "answer": "Мемоизация - это техника оптимизации, при которой результаты дорогостоящих вызовов функций кешируются и возвращаются при повторных вызовах с теми же аргументами. Пример: функция вычисления чисел Фибоначчи с кешированием результатов."
        },
        {
            "id": 39,
            "type": EQuestionType.ANSWER,
            "text": "Что такое JSON и методы для работы с ним?",
            "hasOptions": false,
            "answer": "JSON (JavaScript Object Notation) - текстовый формат для обмена данными. Методы: JSON.stringify() - преобразует объект в JSON строку, JSON.parse() - преобразует JSON строку обратно в объект."
        },
        {
            "id": 40,
            "type": EQuestionType.ANSWER,
            "text": "Что такое CORS и как решать CORS ошибки?",
            "hasOptions": false,
            "answer": "CORS ошибки возникают когда браузер блокирует cross-origin запросы. Решения: настройка CORS на сервере (Access-Control-Allow-Origin), использование proxy, JSONP (для GET запросов), или настройка веб-сервера для разрешения cross-origin запросов."
        }
    ],
    "middle": [],
    "senior": []
}

export default data;