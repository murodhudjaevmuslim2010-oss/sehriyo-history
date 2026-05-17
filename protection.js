/**
 * 2history - Модуль защиты и анти-отладки
 * Этот скрипт реализует меры для предотвращения просмотра исходного кода.
 */

(function() {
    'use strict';

    // 1. Отключение правой кнопки мыши (контекстного меню)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, false);

    // 2. Блокировка горячих клавиш
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            return false;
        }

        // Ctrl+Shift+I (Инспектор), Ctrl+Shift+J (Консоль), Ctrl+Shift+C (Элементы)
        if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
            e.preventDefault();
            return false;
        }

        // Ctrl+U (Просмотр кода страницы)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            return false;
        }

        // Ctrl+S (Сохранить страницу)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            return false;
        }
    }, false);

    // 3. Анти-отладочная ловушка (Debugger Trap)
    // Этот цикл постоянно вызывает паузу отладчика, если инструменты разработчика открыты.
    // Это делает использование инспектора практически невозможным.
    const detector = function() {
        setInterval(function() {
            (function() {
                return false;
            }['constructor']('debugger')['call']());
        }, 100);
    };

    try {
        detector();
    } catch (err) {}

    // 4. Защита консоли
    // Регулярно выводим предупреждение в консоль
    setInterval(function() {
        console.log("%cОСТАНОВИТЕСЬ!", "color: red; font-size: 50px; font-weight: bold; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113);");
        console.log("%cЭто функция браузера, предназначенная для разработчиков. Если кто-то сказал вам скопировать и вставить что-то здесь, чтобы «взломать» чью-то учетную запись, знайте, что это мошенничество и даст им доступ к вашему аккаунту.", "font-size: 16px; color: #555;");
    }, 2000);

})();
