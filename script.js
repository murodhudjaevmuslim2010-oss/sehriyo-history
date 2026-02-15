// Основной объект игры
const game = {
    // Настройки
    settings: {
        continent: 'europe',
        period: 'any',
        difficulty: 2,
        mapSize: 'medium',
        language: 'ru',
        theme: 'dark',
        soundEnabled: true
    },

    // Состояние игры
    state: {
        gameActive: false,
        currentQuestion: null,
        territories: [],
        capturedTerritories: 0,
        totalTerritories: 21,
        score: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        timeLeft: 30,
        timer: null,
        questionStartTime: null,
        currentTerritoryColors: [],
        learnedFacts: []
    },

    // База данных вопросов (основана на фактах)
    questions: [
        // Античность (примеры)
        {
            id: 1,
            text: "В каком году произошла знаменитая битва при Марафоне?",
            answers: ["480 г. до н.э.", "490 г. до н.э.", "500 г. до н.э.", "510 г. до н.э."],
            correct: 1,
            explanation: "Битва при Марафоне произошла в 490 году до н.э. между персами и афинянами. Это была ключевая битва в ходе греко-персидских войн.",
            continents: ["europe", "asia"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 2,
            text: "Кто основал Рим согласно легенде?",
            answers: ["Ромул", "Рем", "Юлий Цезарь", "Август"],
            correct: 0,
            explanation: "Согласно легенде, Рим был основан братьями-близнецами Ромулом и Ремом в 753 году до н.э. Ромул стал первым царём Рима.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 3,
            text: "В каком году Александр Македонский начал завоевание Персии?",
            answers: ["334 г. до н.э.", "323 г. до н.э.", "356 г. до н.э.", "300 г. до н.э."],
            correct: 0,
            explanation: "Александр Македонский начал свой поход против Персидской империи в 334 году до н.э. К 331 году он полностью завоевал её.",
            continents: ["europe", "asia"],
            period: "antiquity",
            difficulty: 2
        },
        // Средневековье
        {
            id: 4,
            text: "В каком году произошла битва при Гастингсе?",
            answers: ["1066", "1215", "1346", "1485"],
            correct: 0,
            explanation: "Битва при Гастингсе произошла 14 октября 1066 года. Вильгельм Завоеватель разбил армию короля Гарольда и стал королём Англии.",
            continents: ["europe"],
            period: "middle_ages",
            difficulty: 1
        },
        {
            id: 5,
            text: "Кто возглавил монгольское нашествие на Русь в 1237 году?",
            answers: ["Чингисхан", "Батый", "Хубилай", "Угэдэй"],
            correct: 1,
            explanation: "Монгольское нашествие на Русь возглавил хан Батый, внук Чингисхана. Нашествие продолжалось с 1237 по 1240 годы.",
            continents: ["europe", "asia"],
            period: "middle_ages",
            difficulty: 2
        },
        {
            id: 6,
            text: "В каком году была подписана Великая хартия вольностей?",
            answers: ["1215", "1066", "1348", "1415"],
            correct: 0,
            explanation: "Великая хартия вольностей была подписана королём Англии Иоанном Безземельным 15 июня 1215 года. Это один из первых документов, ограничивающих власть монарха.",
            continents: ["europe"],
            period: "middle_ages",
            difficulty: 3
        },
        // Ренессанс/Просвещение
        {
            id: 7,
            text: "Кто открыл Америку в 1492 году?",
            answers: ["Фернан Магеллан", "Васко да Гама", "Христофор Колумб", "Америго Веспуччи"],
            correct: 2,
            explanation: "Христофор Колумб достиг берегов Америки 12 октября 1492 года, открыв Багамские острова. Он совершил четыре экспедиции в Новый Свет.",
            continents: ["europe", "americas"],
            period: "renaissance",
            difficulty: 1
        },
        {
            id: 8,
            text: "В каком году Лютер запустил Реформацию?",
            answers: ["1517", "1521", "1492", "1545"],
            correct: 0,
            explanation: "31 октября 1517 года Мартин Лютер прибил 95 тезисов к двери церкви в Виттенберге, что положило начало Реформации.",
            continents: ["europe"],
            period: "renaissance",
            difficulty: 2
        },
        // XIX век
        {
            id: 9,
            text: "В каком году началась Гражданская война в США?",
            answers: ["1861", "1865", "1776", "1812"],
            correct: 0,
            explanation: "Гражданская война в США началась 12 апреля 1861 года с нападения на форт Самтер и продолжалась до 1865 года.",
            continents: ["americas"],
            period: "19th_century",
            difficulty: 2
        },
        {
            id: 10,
            text: "В каком году произошло объединение Германии?",
            answers: ["1870", "1871", "1848", "1888"],
            correct: 1,
            explanation: "Германская империя была провозглашена 18 января 1871 года в Версальском дворце после победы во франко-прусской войне.",
            continents: ["europe"],
            period: "19th_century",
            difficulty: 3
        },
        // XX век
        {
            id: 11,
            text: "В каком году началась Первая мировая война?",
            answers: ["1914", "1918", "1939", "1941"],
            correct: 0,
            explanation: "Первая мировая война началась 28 июля 1914 года с объявления Австро-Венгрией войны Сербии.",
            continents: ["europe", "asia", "africa"],
            period: "20th_century",
            difficulty: 1
        },
        {
            id: 12,
            text: "В каком году человек впервые полетел в космос?",
            answers: ["1961", "1957", "1969", "1975"],
            correct: 0,
            explanation: "12 апреля 1961 года Юрий Гагарин стал первым человеком в космосе, совершив орбитальный полёт на корабле «Восток-1».",
            continents: ["world"],
            period: "20th_century",
            difficulty: 1
        },
        {
            id: 13,
            text: "В каком году произошло падение Берлинской стены?",
            answers: ["1989", "1991", "1990", "1985"],
            correct: 0,
            explanation: "Берлинская стена пала 9 ноября 1989 года, что стало символом окончания Холодной войны и воссоединения Германии.",
            continents: ["europe"],
            period: "20th_century",
            difficulty: 2
        },
        // XXI век
        {
            id: 14,
            text: "В каком году произошли теракты 11 сентября?",
            answers: ["2001", "2003", "1999", "2005"],
            correct: 0,
            explanation: "Террористические акты 11 сентября 2001 года в США стали крупнейшим терактом в истории, изменив мировую политику.",
            continents: ["americas"],
            period: "modern",
            difficulty: 1
        },
        {
        },
        // --- Древний мир ---
        {
            id: 16,
            text: "Что появилось в Месопотамии около 3000 г. до н.э.?",
            answers: ["Письменность (клинопись)", "Порох", "Колесо со спицами", "Шелк"],
            correct: 0,
            explanation: "Около 3000 г. до н.э. в Месопотамии появилась письменность (клинопись), что стало началом исторической эры.",
            continents: ["asia"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 17,
            text: "В какой стране находится Стоунхендж, строительство которого началось около 2900 г. до н.э.?",
            answers: ["Англия", "Ирландия", "Франция", "Германия"],
            correct: 0,
            explanation: "Строительство Стоунхенджа началось около 2900 г. до н.э. в Англии. Это один из самых известных археологических памятников в мире.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 18,
            text: "Какое чудо света было построено около 2600 г. до н.э.?",
            answers: ["Пирамида Хеопса", "Висячие сады Семирамиды", "Статуя Зевса", "Маяк в Александрии"],
            correct: 0,
            explanation: "Пирамида Хеопса в Гизе, построенная около 2600 г. до н.э., является единственным сохранившимся из 7 чудес света.",
            continents: ["africa"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 19,
            text: "Какой свод законов появился около 2000 г. до н.э.?",
            answers: ["Кодекс Хаммурапи", "Законы Двенадцати таблиц", "Кодекс Юстиниана", "Великая хартия вольностей"],
            correct: 0,
            explanation: "Кодекс Хаммурапи, созданный около 1750 г. до н.э. (в вопросе округление), является одним из древнейших правовых памятников в мире.",
            continents: ["asia"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 20,
            text: "Какая цивилизация, вероятно, погибла из-за извержения вулкана Санторини около 1600-1450 гг. до н.э.?",
            answers: ["Минойская", "Микенская", "Египетская", "Хеттская"],
            correct: 0,
            explanation: "Минойская цивилизация на Крите пришла в упадок после катастрофического извержения вулкана Санторини.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 3
        },
        {
            id: 21,
            text: "Как называется древнейший священный текст Индии, составленный около 1500 г. до н.э.?",
            answers: ["Ригведа", "Махабхарата", "Рамаяна", "Упанишады"],
            correct: 0,
            explanation: "Ригведа — собрание религиозных гимнов, составленное около 1500 г. до н.э., является древнейшим памятником индийской литературы.",
            continents: ["asia"],
            period: "antiquity",
            difficulty: 3
        },
        {
            id: 22,
            text: "Какое событие произошло около 1200 г. до н.э., приведя к исчезновению многих цивилизаций?",
            answers: ["Крах бронзового века", "Всемирный потоп", "Ледниковый период", "Нашествие гуннов"],
            correct: 0,
            explanation: "Катастрофа бронзового века (около 1200 г. до н.э.) привела к распаду многих государств Восточного Средиземноморья.",
            continents: ["europe", "asia", "africa"],
            period: "antiquity",
            difficulty: 3
        },
        {
            id: 23,
            text: "В каком году состоялись первые Олимпийские игры в Древней Греции?",
            answers: ["776 г. до н.э.", "753 г. до н.э.", "490 г. до н.э.", "336 г. до н.э."],
            correct: 0,
            explanation: "Первые задокументированные Олимпийские игры состоялись в 776 году до н.э. в Олимпии.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 24,
            text: "Кто считается автором поэм «Илиада» и «Одиссея» (ок. 700 г. до н.э.)?",
            answers: ["Гомер", "Гесиод", "Софокл", "Вергилий"],
            correct: 0,
            explanation: "Гомер — легендарный древнегреческий поэт-сказитель, которому приписывается создание «Илиады» и «Одиссеи».",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 25,
            text: "Какой город в 600 г. до н.э. считался крупнейшим в мире?",
            answers: ["Вавилон", "Рим", "Афины", "Мемфис"],
            correct: 0,
            explanation: "Вавилон в период расцвета Нововавилонского царства был крупнейшим городом мира с населением около 200 000 человек.",
            continents: ["asia"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 26,
            text: "Кто основал Персидскую империю Ахеменидов в 550 г. до н.э.?",
            answers: ["Кир Великий", "Дарий I", "Ксеркс", "Камбис"],
            correct: 0,
            explanation: "Кир II Великий основал персидскую державу Ахеменидов, объединив большинство стран Ближнего Востока.",
            continents: ["asia"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 27,
            text: "В каком году Рим стал республикой?",
            answers: ["509 г. до н.э.", "753 г. до н.э.", "44 г. до н.э.", "27 г. до н.э."],
            correct: 0,
            explanation: "В 509 году до н.э. римляне изгнали царя Тарквиния Гордого и установили республиканскую форму правления.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 28,
            text: "Кто совершил подвиг 300 спартанцев в 480 г. до н.э.?",
            answers: ["Царь Леонид", "Фемистокл", "Перикл", "Александр Македонский"],
            correct: 0,
            explanation: "Царь Леонид I и 300 спартанцев героически погибли в битве при Фермопилах, сдерживая армию персов.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 29,
            text: "Какой храм начали строить в Афинах в 447 г. до н.э.?",
            answers: ["Парфенон", "Пантеон", "Колизей", "Храм Зевса"],
            correct: 0,
            explanation: "Парфенон, храм богини Афины на Акрополе, начали строить в 447 г. до н.э. при Перикле.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 30,
            text: "Какой город основал Александр Македонский в Египте в 332 г. до н.э.?",
            answers: ["Александрия", "Каир", "Фивы", "Мемфис"],
            correct: 0,
            explanation: "Александр Великий основал Александрию Египетскую, которая стала одним из главных культурных центров античного мира.",
            continents: ["africa"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 31,
            text: "Какая династия объединила Китай в 221 г. до н.э.?",
            answers: ["Цинь", "Хань", "Тан", "Мин"],
            correct: 0,
            explanation: "Император Цинь Шихуанди из династии Цинь впервые объединил Китай в единую централизованную империю в 221 г. до н.э.",
            continents: ["asia"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 32,
            text: "В каком году Рим уничтожил Карфаген?",
            answers: ["146 г. до н.э.", "202 г. до н.э.", "218 г. до н.э.", "44 г. до н.э."],
            correct: 0,
            explanation: "В 146 году до н.э. римляне захватили и разрушили Карфаген, завершив Третью Пуническую войну.",
            continents: ["africa"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 33,
            text: "Какую реку перешел Юлий Цезарь в 49 г. до н.э. со словами «Жребий брошен»?",
            answers: ["Рубикон", "Тибр", "Дунай", "Рейн"],
            correct: 0,
            explanation: "Переход через Рубикон в 49 г. до н.э. означал начало гражданской войны, в результате которой Цезарь пришел к власти.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 34,
            text: "В каком году убили Юлия Цезаря?",
            answers: ["44 г. до н.э.", "27 г. до н.э.", "14 г. н.э.", "49 г. до н.э."],
            correct: 0,
            explanation: "Юлий Цезарь был убит заговорщиками в сенате 15 марта 44 года до н.э.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 35,
            text: "С какого года отсчитывается начало Римской империи?",
            answers: ["27 г. до н.э.", "44 г. до н.э.", "1 г. н.э.", "476 г. н.э."],
            correct: 0,
            explanation: "В 27 году до н.э. Октавиан получил титул Августа, что считается началом Римской империи.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 2
        },

        // --- Наша эра (I - XV века) ---
        {
            id: 36,
            text: "Какой император обвинил христиан в пожаре Рима в 64 году?",
            answers: ["Нерон", "Август", "Калигула", "Траян"],
            correct: 0,
            explanation: "Император Нерон обвинил христиан в Великом пожаре Рима 64 года н.э., начав первые масштабные гонения.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 37,
            text: "Какой город был уничтожен извержением Везувия в 79 году?",
            answers: ["Помпеи", "Рим", "Неаполь", "Афины"],
            correct: 0,
            explanation: "Извержение Везувия в 79 году уничтожило города Помпеи, Геркуланум и Стабии.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 38,
            text: "В каком году император Константин перенес столицу в Константинополь?",
            answers: ["330 г.", "313 г.", "395 г.", "476 г."],
            correct: 0,
            explanation: "В 330 году император Константин Великий освятил новую столицу империи — Константинополь (бывший Византий).",
            continents: ["europe", "asia"],
            period: "antiquity",
            difficulty: 2
        },
        {
            id: 39,
            text: "В каком году пал Рим (Западная Римская империя)?",
            answers: ["476 г.", "410 г.", "395 г.", "1453 г."],
            correct: 0,
            explanation: "В 476 году вождь наемников Одоакр сверг последнего императора Ромула Августула, положив конец Западной Римской империи.",
            continents: ["europe"],
            period: "antiquity",
            difficulty: 1
        },
        {
            id: 40,
            text: "Какое событие произошло в 622 году и стало началом исламского календаря?",
            answers: ["Хиджра (переселение в Медину)", "Битва при Бадре", "Взятие Мекки", "Рождение пророка"],
            correct: 0,
            explanation: "Хиджра — переселение пророка Мухаммеда из Мекки в Медину в 622 году — является начальной точкой исламского лунного календаря.",
            continents: ["asia"],
            period: "middle_ages",
            difficulty: 2
        },
        {
            id: 41,
            text: "Кто стал императором Запада в 800 году?",
            answers: ["Карл Великий", "Юстиниан", "Хлодвиг", "Оттон I"],
            correct: 0,
            explanation: "В 800 году Папа Римский Лев III короновал Карла Великого титулом римского императора.",
            continents: ["europe"],
            period: "middle_ages",
            difficulty: 1
        },
        {
            id: 42,
            text: "В каком году произошло крещение Руси?",
            answers: ["988 г.", "862 г.", "882 г.", "1054 г."],
            correct: 0,
            explanation: "Крещение Руси произошло в 988 году при князе Владимире Святославиче.",
            continents: ["europe"],
            period: "middle_ages",
            difficulty: 1
        },
        {
            id: 43,
            text: "Когда начался Первый крестовый поход?",
            answers: ["1096 г.", "1066 г.", "1204 г.", "1242 г."],
            correct: 0,
            explanation: "Первый крестовый поход начался в 1096 году после призыва Папы Урбана II на Клермонском соборе.",
            continents: ["europe", "asia"],
            period: "middle_ages",
            difficulty: 2
        },
        {
            id: 44,
            text: "Кто объединил монгольские племена в 1206 году?",
            answers: ["Чингисхан", "Батый", "Тамерлан", "Мамай"],
            correct: 0,
            explanation: "В 1206 году на курултае Темуджин был провозглашен Чингисханом — великим ханом всех монголов.",
            continents: ["asia"],
            period: "middle_ages",
            difficulty: 1
        },
        {
            id: 45,
            text: "Какой европейский путешественник отправился в Китай в 1271 году?",
            answers: ["Марко Поло", "Афанасий Никитин", "Христофор Колумб", "Васко да Гама"],
            correct: 0,
            explanation: "Венецианский купец Марко Поло отправился в путешествие в Азию в 1271 году и прожил в Китае 17 лет.",
            continents: ["asia", "europe"],
            period: "middle_ages",
            difficulty: 1
        },
        {
            id: 46,
            text: "Что унесло жизни до половины населения Европы в 1347–1351 годах?",
            answers: ["Черная смерть (Чума)", "Столетняя война", "Голод", "Нашествие монголов"],
            correct: 0,
            explanation: "Эпидемия бубонной чумы («Черная смерть») в середине XIV века уничтожила от 30% до 60% населения Европы.",
            continents: ["europe"],
            period: "middle_ages",
            difficulty: 1
        },
        {
            id: 47,
            text: "Какое событие в 1453 году ознаменовало конец Средневековья?",
            answers: ["Падение Константинополя", "Открытие Америки", "Начало Реформации", "Изобретение печатного станка"],
            correct: 0,
            explanation: "Захват Константинополя турками-османами в 1453 году положил конец Византийской империи.",
            continents: ["europe", "asia"],
            period: "middle_ages",
            difficulty: 2
        },
        {
            id: 48,
            text: "Кто изобрел книгопечатание в Европе около 1439 года?",
            answers: ["Иоганн Гутенберг", "Франциск Скорина", "Леонардо да Винчи", "Иван Федоров"],
            correct: 0,
            explanation: "Иоганн Гутенберг изобрел печатный станок с подвижными литерами в 1440-х годах, что вызвало информационную революцию.",
            continents: ["europe"],
            period: "middle_ages",
            difficulty: 1
        },
        {
            id: 49,
            text: "Когда произошло Стояние на реке Угре, положившее конец ордынскому игу?",
            answers: ["1480 г.", "1380 г.", "1240 г.", "1552 г."],
            correct: 0,
            explanation: "Стояние на реке Угре в 1480 году закончилось отступлением хана Ахмата, что означало окончание монголо-татарского ига.",
            continents: ["europe"],
            period: "middle_ages",
            difficulty: 2
        },

        // --- Новое время (XVI - XVIII века) ---
        {
            id: 50,
            text: "Кто открыл морской путь в Индию в 1498 году?",
            answers: ["Васко да Гама", "Христофор Колумб", "Фернан Магеллан", "Бартоломеу Диаш"],
            correct: 0,
            explanation: "Португальский мореплаватель Васко да Гама первым из европейцев достиг Индии морским путем в 1498 году.",
            continents: ["europe", "asia"],
            period: "renaissance",
            difficulty: 2
        },
        {
            id: 51,
            text: "Какой ученый опубликовал гелиоцентрическую систему мира в 1543 году?",
            answers: ["Николай Коперник", "Галилео Галилей", "Исаак Ньютон", "Джордано Бруно"],
            correct: 0,
            explanation: "Николай Коперник в книге «О вращении небесных сфер» (1543) предложил, что Земля вращается вокруг Солнца.",
            continents: ["europe"],
            period: "renaissance",
            difficulty: 2
        },
        {
            id: 52,
            text: "Разгром какого флота произошел в 1588 году?",
            answers: ["Непобедимой армады", "Французского флота", "Турецкого флота", "Голландского флота"],
            correct: 0,
            explanation: "Английский флот разгромил испанскую Непобедимую армаду в 1588 году, что подорвало морское могущество Испании.",
            continents: ["europe"],
            period: "renaissance",
            difficulty: 2
        },
        {
            id: 53,
            text: "Какая династия пришла к власти в России в 1613 году?",
            answers: ["Романовы", "Рюриковичи", "Годуновы", "Шуйские"],
            correct: 0,
            explanation: "Избрание Михаила Федоровича царем в 1613 году положило начало династии Романовых, правившей до 1917 года.",
            continents: ["europe"],
            period: "renaissance",
            difficulty: 1
        },
        {
            id: 54,
            text: "Какой мирный договор завершил Тридцатилетнюю войну в 1648 году?",
            answers: ["Вестфальский", "Версальский", "Утрехтский", "Ништадтский"],
            correct: 0,
            explanation: "Вестфальский мир 1648 года завершил Тридцатилетнюю войну и заложил основы современной системы международных отношений.",
            continents: ["europe"],
            period: "renaissance",
            difficulty: 3
        },
        {
            id: 55,
            text: "В каком году Исаак Ньютон опубликовал свои «Начала» с законами физики?",
            answers: ["1687 г.", "1666 г.", "1700 г.", "1725 г."],
            correct: 0,
            explanation: "В 1687 году Ньютон опубликовал «Математические начала натуральной философии», изложив закон всемирного тяготения и три закона механики.",
            continents: ["europe"],
            period: "renaissance",
            difficulty: 3
        },
        {
            id: 56,
            text: "Какой город был основан Петром I в 1703 году?",
            answers: ["Санкт-Петербург", "Москва", "Екатеринбург", "Кронштадт"],
            correct: 0,
            explanation: "16 (27) мая 1703 года Петр I основал Санкт-Петербург в устье Невы.",
            continents: ["europe"],
            period: "renaissance",
            difficulty: 1
        },
        {
            id: 57,
            text: "В каком году была принята Декларация независимости США?",
            answers: ["1776 г.", "1789 г.", "1861 г.", "1492 г."],
            correct: 0,
            explanation: "4 июля 1776 года была принята Декларация независимости США, провозгласившая отделение колоний от Великобритании.",
            continents: ["americas"],
            period: "renaissance",
            difficulty: 1
        },
        {
            id: 58,
            text: "Какое событие началось в 1789 году во Франции?",
            answers: ["Великая французская революция", "Правление Наполеона", "Реставрация Бурбонов", "Столетняя война"],
            correct: 0,
            explanation: "Взятие Бастилии 14 июля 1789 года считается началом Великой французской революции.",
            continents: ["europe"],
            period: "renaissance",
            difficulty: 1
        },
        {
            id: 59,
            text: "Кто пришел к власти во Франции в 1799 году?",
            answers: ["Наполеон Бонапарт", "Людовик XVI", "Робеспьер", "Людовик XVIII"],
            correct: 0,
            explanation: "Переворот 18 брюмера (1799 год) привел к власти Наполеона Бонапарта, ставшего первым консулом.",
            continents: ["europe"],
            period: "renaissance",
            difficulty: 1
        },

        // --- XIX век ---
        {
            id: 60,
            text: "В каком году произошла Отечественная война в России?",
            answers: ["1812 г.", "1805 г.", "1825 г.", "1853 г."],
            correct: 0,
            explanation: "Отечественная война 1812 года — война Российской империи против вторгшейся армии Наполеона.",
            continents: ["europe"],
            period: "19th_century",
            difficulty: 1
        },
        {
            id: 61,
            text: "Какое событие произошло в России в 1861 году?",
            answers: ["Отмена крепостного права", "Декабрьское восстание", "Продажа Аляски", "Воцарение Александра III"],
            correct: 0,
            explanation: "19 февраля 1861 года император Александр II подписал манифест об отмене крепостного права.",
            continents: ["europe"],
            period: "19th_century",
            difficulty: 1
        },
        {
            id: 62,
            text: "Что открылось для судоходства в 1869 году, соединив Средиземное и Красное моря?",
            answers: ["Суэцкий канал", "Панамский канал", "Кильский канал", "Беломорканал"],
            correct: 0,
            explanation: "Суэцкий канал был открыт в 1869 году, значительно сократив морской путь из Европы в Азию.",
            continents: ["africa", "asia"],
            period: "19th_century",
            difficulty: 2
        },
        {
            id: 63,
            text: "Какую лампу создал Томас Эдисон в 1879 году?",
            answers: ["Лампу накаливания", "Люминесцентную лампу", "Керосиновую лампу", "Неоновую лампу"],
            correct: 0,
            explanation: "В 1879 году Томас Эдисон запатентовал коммерчески успешную электрическую лампу накаливания.",
            continents: ["americas"],
            period: "19th_century",
            difficulty: 1
        },

        // --- XX век ---
        {
            id: 64,
            text: "Кто совершил первый полет на самолете в 1903 году?",
            answers: ["Братья Райт", "Альберто Сантос-Дюмон", "Луи Блерио", "Игорь Сикорский"],
            correct: 0,
            explanation: "Братья Уилбер и Орвилл Райт совершили первый управляемый полет на самолете «Флайер-1» 17 декабря 1903 года.",
            continents: ["americas"],
            period: "20th_century",
            difficulty: 1
        },
        {
            id: 65,
            text: "Какое событие произошло в России в октябре 1917 года?",
            answers: ["Октябрьская революция", "Февральская революция", "Начало Первой мировой", "Отречение царя"],
            correct: 0,
            explanation: "Октябрьская революция 1917 года привела к власти большевиков и созданию советского государства.",
            continents: ["europe"],
            period: "20th_century",
            difficulty: 1
        },
        {
            id: 66,
            text: "В каком году образовался СССР?",
            answers: ["1922 г.", "1917 г.", "1924 г.", "1936 г."],
            correct: 0,
            explanation: "Союз Советских Социалистических Республик был образован 30 декабря 1922 года.",
            continents: ["europe", "asia"],
            period: "20th_century",
            difficulty: 2
        },
        {
            id: 67,
            text: "Какое событие началось в США в 1929 году?",
            answers: ["Великая депрессия", "Сухой закон", "Вторая мировая война", "Холодная война"],
            correct: 0,
            explanation: "Крах на Нью-Йоркской бирже в 1929 году положил начало Великой депрессии — мировому экономическому кризису.",
            continents: ["americas"],
            period: "20th_century",
            difficulty: 2
        },
        {
            id: 68,
            text: "Когда началась Вторая мировая война?",
            answers: ["1 сентября 1939 г.", "22 июня 1941 г.", "9 мая 1945 г.", "28 июля 1914 г."],
            correct: 0,
            explanation: "Вторая мировая война началась 1 сентября 1939 года с нападения Германии на Польшу.",
            continents: ["europe"],
            period: "20th_century",
            difficulty: 1
        },
        {
            id: 69,
            text: "В каком году Юрий Гагарин полетел в космос?",
            answers: ["1961 г.", "1957 г.", "1969 г.", "1963 г."],
            correct: 0,
            explanation: "12 апреля 1961 года Юрий Гагарин стал первым человеком в мировой истории, совершившим полёт в космическое пространство.",
            continents: ["world"],
            period: "20th_century",
            difficulty: 1
        },
        {
            id: 70,
            text: "Кто первым ступил на поверхность Луны в 1969 году?",
            answers: ["Нил Армстронг", "Базз Олдрин", "Юрий Гагарин", "Майкл Коллинз"],
            correct: 0,
            explanation: "Нил Армстронг стал первым человеком, ступившим на Луну 20 июля 1969 года в рамках миссии «Аполлон-11».",
            continents: ["world"],
            period: "20th_century",
            difficulty: 1
        },
        {
            id: 71,
            text: "В каком году перестал существовать СССР?",
            answers: ["1991 г.", "1989 г.", "1993 г.", "1999 г."],
            correct: 0,
            explanation: "Распад СССР официально произошел 26 декабря 1991 года.",
            continents: ["europe", "asia"],
            period: "20th_century",
            difficulty: 1
        },

        // --- XXI век ---
        {
            id: 72,
            text: "Какая социальная сеть, запустившая эру соцсетей, появилась в 2004 году?",
            answers: ["Facebook", "Twitter", "Instagram", "VK"],
            correct: 0,
            explanation: "Facebook был запущен Марком Цукербергом в 2004 году.",
            continents: ["americas", "world"],
            period: "modern",
            difficulty: 1
        },
        {
            id: 73,
            text: "В каком году в продажу поступил первый iPhone?",
            answers: ["2007 г.", "2005 г.", "2009 г.", "2010 г."],
            correct: 0,
            explanation: "Стив Джобс представил первый iPhone 9 января 2007 года.",
            continents: ["americas", "world"],
            period: "modern",
            difficulty: 1
        },
        {
            id: 74,
            text: "Какое событие вызвало глобальный кризис в 2020 году?",
            answers: ["Пандемия COVID-19", "Мировой финансовый кризис", "Извержение вулкана", "Кибератака"],
            correct: 0,
            explanation: "Пандемия COVID-19, вызванная коронавирусом, привела к глобальным локдаунам и экономическому кризису в 2020 году.",
            continents: ["world"],
            period: "modern",
            difficulty: 1
        },
        {
            id: 75,
            text: "Что произошло в мире ИТ в 2023 году, став массовым трендом?",
            answers: ["Массовое внедрение ИИ", "Запуск метавселенных", "Крах криптовалют", "Изобретение квантового ПК"],
            correct: 0,
            explanation: "В 2023 году инструменты ИИ (наподобие ChatGPT) стали массового использоваться в повседневной жизни и работе.",
            continents: ["world"],
            period: "modern",
            difficulty: 1
        }
    ],

    // Переводы
    translations: {
        ru: {
            title: "Исторический Захват Территории",
            play: "Играть",
            createLobby: "Создать лобби",
            joinLobby: "Присоединиться",
            settings: "Настройки",
            continent: "Континент",
            period: "Период",
            difficulty: "Сложность",
            easy: "Легко",
            medium: "Средне",
            hard: "Сложно",
            startGame: "Начать игру",
            back: "Назад",
            captured: "Захвачено",
            territories: "территорий",
            timeLeft: "Осталось",
            seconds: "сек",
            score: "Очков",
            correctAnswer: "Правильный ответ!",
            wrongAnswer: "Неправильный ответ",
            gameOver: "Игра завершена!",
            victory: "Победа!",
            defeat: "Поражение",
            playAgain: "Играть снова",
            mainMenu: "Главное меню",
            share: "Поделиться",
            pause: "Пауза",
            resume: "Продолжить",
            restart: "Начать заново",
            quit: "Выйти"
        },
        en: {
            title: "Historical Territory Conquest",
            play: "Play",
            createLobby: "Create Lobby",
            joinLobby: "Join",
            settings: "Settings",
            continent: "Continent",
            period: "Period",
            difficulty: "Difficulty",
            easy: "Easy",
            medium: "Medium",
            hard: "Hard",
            startGame: "Start Game",
            back: "Back",
            captured: "Captured",
            territories: "territories",
            timeLeft: "Time left",
            seconds: "sec",
            score: "Score",
            correctAnswer: "Correct answer!",
            wrongAnswer: "Wrong answer",
            gameOver: "Game Over!",
            victory: "Victory!",
            defeat: "Defeat",
            playAgain: "Play Again",
            mainMenu: "Main Menu",
            share: "Share",
            pause: "Pause",
            resume: "Resume",
            restart: "Restart",
            quit: "Quit"
        }
    },

    // Инициализация игры
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.updateStats();
        this.showScreen('mainMenu');
    },

    // Загрузка настроек из localStorage
    loadSettings() {
        const savedSettings = localStorage.getItem('historyGameSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }

        // Применяем настройки
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        document.documentElement.lang = this.settings.language;

        // Обновляем элементы управления
        this.updateUI();
    },

    // Сохранение настроек
    saveSettings() {
        localStorage.setItem('historyGameSettings', JSON.stringify(this.settings));
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        // Кнопки главного меню
        document.getElementById('startSinglePlayer')?.addEventListener('click', () => {
            this.showScreen('settingsScreen');
        });

        document.getElementById('showSettings')?.addEventListener('click', () => {
            this.showScreen('settingsScreen');
        });

        // Переключение темы
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Как играть
        document.getElementById('showHowToPlay')?.addEventListener('click', () => {
            this.showScreen('howToPlayScreen');
        });

        // Мультиплеер (пока заглушка)
        document.getElementById('startMultiplayer')?.addEventListener('click', () => {
            alert('Мультиплеер находится в разработке! Скоро вы сможете сразиться с друзьями.');
        });

        // Логотип (возврат в меню)
        document.querySelector('.logo')?.addEventListener('click', () => {
            if (this.state.gameActive) {
                // Immediate exit without blocking confirm
                this.showScreen('mainMenu');
                this.state.gameActive = false;
                clearInterval(this.state.timer);
                // Also hide pause screen if open
                const pauseScreen = document.getElementById('pauseScreen');
                if (pauseScreen) pauseScreen.style.display = 'none';
            } else {
                this.showScreen('mainMenu');
            }
        });

        // Переключение языка
        document.getElementById('languageToggle')?.addEventListener('click', () => {
            this.toggleLanguage();
        });

        // Выбор континента
        document.querySelectorAll('.continent-card').forEach(card => {
            card.addEventListener('click', (e) => {
                document.querySelectorAll('.continent-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.settings.continent = card.dataset.continent;
                this.saveSettings();
            });
        });

        // Выбор периода
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.period = btn.dataset.period;
                this.saveSettings();
            });
        });

        // Выбор сложности
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.difficulty = parseInt(btn.dataset.diff);
                this.saveSettings();
            });
        });

        // Выбор размера карты
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.mapSize = btn.dataset.size;

                // Обновляем количество территорий
                const sizes = { small: 13, medium: 21, large: 33 };
                this.state.totalTerritories = sizes[this.settings.mapSize];

                this.saveSettings();
            });
        });

        // Кнопка входа
        document.getElementById('loginBtn')?.addEventListener('click', () => {
            document.getElementById('loginModal').style.display = 'flex';
        });

        document.getElementById('closeLogin')?.addEventListener('click', () => {
            document.getElementById('loginModal').style.display = 'none';
        });

        // Переключение табов в логине
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab).classList.add('active');
            });
        });

        // Кнопка начала игры
        document.getElementById('startGameBtn')?.addEventListener('click', () => {
            this.startGame();
        });

        // Пауза игры
        document.getElementById('pauseGame')?.addEventListener('click', () => {
            this.pauseGame();
        });

        // Пропуск вопроса
        document.getElementById('skipQuestion')?.addEventListener('click', () => {
            this.showAnswer(false);
        });

        // Следующий вопрос (теперь кнопка "Продолжить")
        document.getElementById('nextQuestion')?.addEventListener('click', () => {
            // Скрываем карточку с объяснением
            document.getElementById('explanationCard').style.display = 'none';
            // Разблокируем карту для выбора следующей территории
            this.state.isAnswering = false;

            // Сбрасываем текст вопроса, чтобы побудить игрока выбрать новую территорию
            document.getElementById('questionText').textContent = "Выберите страну на карте, чтобы атаковать!";
            document.getElementById('answersContainer').innerHTML = '';
            document.getElementById('timer').textContent = "--";

            // Trigger Bot Turn AFTER player continues (or maybe immediately after answer?)
            // If we do it here, it feels like "New Round".
            // Let's do it here so player sees map updates.
            this.botTurn();
        });
    },

    // Показать экран
    showScreen(screenId) {
        // Скрыть все экраны
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Скрыть оверлеи (пауза и т.д.)
        const pauseScreen = document.getElementById('pauseScreen');
        if (pauseScreen) pauseScreen.style.display = 'none';

        // Показать нужный экран
        document.getElementById(screenId)?.classList.add('active');

        // Особые действия для экранов
        if (screenId === 'mainMenu') {
            this.updateStats();
        } else if (screenId === 'settingsScreen') {
            this.updateSettingsUI();
        } else if (screenId === 'gameScreen' && this.state.map) {
            // Invalidate map size to fix rendering issues
            setTimeout(() => {
                this.state.map.invalidateSize();
            }, 200);
        }
    },

    // Переключение темы
    toggleTheme() {
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.settings.theme);

        // Toggle Map Base Layer if map exists
        if (this.state.map && this.state.baseLayers) {
            if (this.settings.theme === 'dark') {
                this.state.map.removeLayer(this.state.baseLayers.light);
                this.state.baseLayers.dark.addTo(this.state.map);
            } else {
                this.state.map.removeLayer(this.state.baseLayers.dark);
                this.state.baseLayers.light.addTo(this.state.map);
            }
        }

        this.saveSettings();
        this.updateThemeText();
    },

    // Обновление текста темы
    updateThemeText() {
        const themeText = document.getElementById('theme-text');
        if (themeText) {
            themeText.textContent = this.settings.theme === 'light' ? 'Темная' : 'Светлая';
        }
    },

    // Переключение языка
    toggleLanguage() {
        this.settings.language = this.settings.language === 'ru' ? 'en' : 'ru';
        document.documentElement.lang = this.settings.language;
        this.saveSettings();
        this.updateUI();
    },

    // Обновление всего UI
    updateUI() {
        // Обновляем текст на кнопках
        const langText = document.getElementById('lang-text');
        if (langText) {
            langText.textContent = this.settings.language === 'ru' ? 'EN' : 'RU';
        }

        this.updateThemeText();

        // Обновляем заголовок
        const titleText = document.getElementById('title-text');
        if (titleText) {
            titleText.textContent = this.translations[this.settings.language].title;
        }
    },

    // Обновление настроек в UI
    updateSettingsUI() {
        // Выделяем выбранный континент
        document.querySelectorAll('.continent-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.continent === this.settings.continent);
        });

        // Выделяем выбранный период
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.period === this.settings.period);
        });

        // Выделяем выбранную сложность
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.diff) === this.settings.difficulty);
        });

        // Выделяем выбранный размер карты
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.size === this.settings.mapSize);
        });
    },

    // Обновление статистики
    updateStats() {
        const stats = JSON.parse(localStorage.getItem('historyGameStats') || '{}');

        document.getElementById('totalGames').textContent = stats.totalGames || 0;
        document.getElementById('territoriesCaptured').textContent = stats.totalTerritories || 0;

        const correctPercentage = stats.totalQuestions ?
            Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0;
        document.getElementById('correctAnswers').textContent = `${correctPercentage}%`;
    },

    // Начало игры
    startGame() {
        this.resetGameState();
        this.showScreen('gameScreen'); // Show screen FIRST to ensure container has dimensions

        // Small delay to allow layout to settle before map generation
        setTimeout(() => {
            this.generateMap();
            this.updateGameInfo();
        }, 50);

        // Show initial hint
        document.getElementById('questionText').textContent = "Выберите страну на карте, чтобы атаковать!";
        // Hide answers until selected
        document.getElementById('answersContainer').innerHTML = '';
        document.getElementById('timer').textContent = "--";
    },

    // Сброс состояния игры
    resetGameState() {
        this.state = {
            gameActive: true,
            currentQuestion: null,
            territories: [],
            capturedTerritories: 0,
            totalTerritories: this.settings.mapSize === 'small' ? 13 :
                this.settings.mapSize === 'medium' ? 21 : 33,
            score: 0,
            correctAnswers: 0,
            totalQuestions: 0,
            timeLeft: 30,
            timer: null,
            questionStartTime: null,
            currentTerritoryColors: [],
            learnedFacts: [],
            learnedFacts: [],
            usedQuestions: new Set(), // Initialize used questions set
            learnedFacts: [],
            usedQuestions: new Set(), // Initialize used questions set
            isAnswering: false,       // Lock functionality
            botTerritories: 0         // Bot score
        };

        document.getElementById('capturedCount').textContent = '0';
        document.getElementById('totalTerritories').textContent = this.state.totalTerritories;
        document.getElementById('score').textContent = '0';
        document.getElementById('questionNumber').textContent = '1';
    },

    // Генерация карты (Leaflet)
    // Генерация карты (Leaflet)
    generateMap() {
        const mapContainer = document.getElementById('territoryMap');
        if (this.state.map) {
            this.state.map.remove();
        }
        mapContainer.innerHTML = '';

        // Инициализируем карту
        this.state.map = L.map('territoryMap', {
            zoomControl: false,
            attributionControl: false,
            preferCanvas: true // Optimization
        }).setView([20, 0], 2);

        // Zoom control
        L.control.zoom({ position: 'topright' }).addTo(this.state.map);

        // Base layers
        const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        });

        const cartoVoyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        });

        // Store layers to switch later
        this.state.baseLayers = {
            dark: cartoDark,
            light: cartoVoyager
        };

        // Select base layer based on theme
        if (this.settings.theme === 'dark') {
            cartoDark.addTo(this.state.map);
        } else {
            cartoVoyager.addTo(this.state.map);
        }

        // Load GeoJSON
        this.loadTerritories();
    },

    async loadTerritories() {
        try {
            document.getElementById('mapTitle').textContent = "Загрузка всего мира...";

            let data;
            // Check cache
            if (this.geoJsonCache) {
                data = this.geoJsonCache;
            } else {
                // Using a low-res world countries GeoJSON for performance
                const response = await fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json');
                if (!response.ok) throw new Error("Network response was not ok");
                data = await response.json();
                this.geoJsonCache = data; // Cache it
            }

            this.generateTerritoryPolygons(data);

            // Adjust map view to show only selected territories
            if (this.state.geoJsonLayer) {
                const bounds = this.state.geoJsonLayer.getBounds();
                if (bounds.isValid()) {
                    this.state.map.fitBounds(bounds, { padding: [50, 50] });
                }
            }

            document.getElementById('mapTitle').textContent = this.settings.continent === 'world' ? "Карта Мира" : `Карта: ${this.getContinentName(this.settings.continent)}`;
        } catch (e) {
            console.error("Failed to load map data", e);
            document.getElementById('mapTitle').textContent = "Ошибка загрузки карты";
        }
    },

    getContinentName(code) {
        const names = { europe: 'Европа', asia: 'Азия', americas: 'Америка', africa: 'Африка', world: 'Мир' };
        return names[code] || code;
    },

    // Генерация полигонов из GeoJSON
    generateTerritoryPolygons(geoJsonData) {
        this.state.territories = [];
        let idCounter = 0;

        // Фильтрация по региону
        let features = geoJsonData.features;

        if (this.settings.continent !== 'world') {
            const regionKeyword = this.settings.continent;
            // mapping properties to regions if possible, or just a naive list for now
            // Some GeoJSONs have 'continent' property, some don't. 
            // We'll use a helper to determine which countries belong where if needed.
            // For this specific URL (johan/world.geo.json), we might need a manual list or property check.

            // Let's assume we filter by a custom property or name for demonstration, 
            // but ideally we'd have a mapping.
            const continentMap = {
                'europe': ['Russia', 'Germany', 'France', 'United Kingdom', 'Italy', 'Spain', 'Ukraine', 'Poland', 'Romania', 'Netherlands', 'Belgium', 'Greece', 'Czech Republic', 'Portugal', 'Sweden', 'Hungary', 'Belarus', 'Austria', 'Switzerland', 'Serbia', 'Bulgaria', 'Denmark', 'Finland', 'Slovakia', 'Norway', 'Ireland', 'Croatia', 'Moldova', 'Bosnia and Herz.', 'Albania', 'Lithuania', 'North Macedonia', 'Slovenia', 'Latvia', 'Estonia', 'Montenegro', 'Luxembourg', 'Malta', 'Iceland', 'Andorra', 'Monaco', 'Liechtenstein', 'San Marino', 'Holy See'],
                'asia': ['China', 'India', 'Japan', 'Indonesia', 'Pakistan', 'Bangladesh', 'Vietnam', 'Turkey', 'Iran', 'Thailand', 'Myanmar', 'South Korea', 'Iraq', 'Afghanistan', 'Saudi Arabia', 'Uzbekistan', 'Malaysia', 'Yemen', 'Nepal', 'Sri Lanka', 'Kazakhstan', 'Syria', 'Cambodia', 'Jordan', 'Azerbaijan', 'United Arab Emirates', 'Tajikistan', 'Israel', 'Laos', 'Lebanon', 'Kyrgyzstan', 'Turkmenistan', 'Singapore', 'Oman', 'State of Palestine', 'Kuwait', 'Georgia', 'Mongolia', 'Armenia', 'Qatar', 'Bahrain', 'Timor-Leste', 'Cyprus', 'Bhutan', 'Maldives', 'Brunei'],
                'africa': ['Nigeria', 'Ethiopia', 'Egypt', 'DR Congo', 'Tanzania', 'South Africa', 'Kenya', 'Uganda', 'Algeria', 'Sudan', 'Morocco', 'Angola', 'Mozambique', 'Ghana', 'Madagascar', 'Cameroon', "Côte d'Ivoire", 'Niger', 'Burkina Faso', 'Mali', 'Malawi', 'Zambia', 'Senegal', 'Chad', 'Somalia', 'Zimbabwe', 'Guinea', 'Rwanda', 'Benin', 'Tunisia', 'Burundi', 'South Sudan', 'Togo', 'Sierra Leone', 'Libya', 'Congo', 'Liberia', 'Central African Rep.', 'Mauritania', 'Eritrea', 'Namibia', 'Gambia', 'Botswana', 'Gabon', 'Lesotho', 'Guinea-Bissau', 'Equatorial Guinea', 'Mauritius', 'Eswatini', 'Djibouti', 'Comoros', 'Cabo Verde', 'Sao Tome and Principe', 'Seychelles'],
                'americas': ['United States', 'Brazil', 'Mexico', 'Colombia', 'Argentina', 'Peru', 'Venezuela', 'Chile', 'Ecuador', 'Guatemala', 'Cuba', 'Haiti', 'Bolivia', 'Dominican Rep.', 'Honduras', 'Paraguay', 'El Salvador', 'Nicaragua', 'Costa Rica', 'Panama', 'Uruguay', 'Jamaica', 'Trinidad and Tobago', 'Guyana', 'Suriname', 'Belize', 'Bahamas', 'Barbados', 'Saint Lucia', 'Grenada', 'St. Vincent and the Grenadines', 'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis', 'Canada']
            };

            const allowed = continentMap[this.settings.continent] || [];
            features = features.filter(f => allowed.includes(f.properties.name));
        }

        // Все страны континента теперь отображаются
        // Но мы устанавливаем цель (нужное количество баллов) согласно настройке размера
        const sizes = { small: 13, medium: 21, large: 33 };
        this.state.totalTerritories = sizes[this.settings.mapSize] || features.length;

        // Если стран на континенте меньше, чем выбранный размер, корректируем цель
        if (features.length < this.state.totalTerritories) {
            this.state.totalTerritories = features.length;
        }

        document.getElementById('totalTerritories').textContent = this.state.totalTerritories;

        // Style function
        const getStyle = (feature) => {
            return {
                fillColor: 'transparent',
                weight: 2,
                opacity: 1,
                color: 'rgba(212, 175, 55, 0.7)', // Brighter gold borders
                dashArray: '',
                fillOpacity: 0
            };
        };

        // GeoJSON Layer
        this.state.geoJsonLayer = L.geoJSON({ type: "FeatureCollection", features: features }, {
            style: getStyle,
            onEachFeature: (feature, layer) => {
                const territoryId = idCounter++;
                const territoryName = feature.properties.name || `Territory ${territoryId}`;

                const territory = {
                    id: territoryId,
                    name: territoryName,
                    element: layer,
                    captured: false,
                    feature: feature
                };

                this.state.territories.push(territory);

                layer.on({
                    mouseover: (e) => {
                        const l = e.target;
                        if (!territory.captured) {
                            l.setStyle({
                                weight: 3,
                                color: '#d4af37', // Gold highlight
                                dashArray: '',
                                fillOpacity: 0.3,
                                fillColor: '#d4af37'
                            });
                            l.bringToFront();
                            // Add hover state class
                            l._path.classList.add('free-territory-hover');
                        }
                    },
                    mouseout: (e) => {
                        const l = e.target;
                        if (!territory.captured) {
                            this.state.geoJsonLayer.resetStyle(l);
                            l._path.classList.remove('free-territory-hover');
                        }
                    },
                    click: (e) => {
                        if (this.state.gameActive) {
                            this.handleTerritoryClick(territory);
                            L.DomEvent.stopPropagation(e);
                        }
                    }
                });

                // Tooltip
                layer.bindTooltip(`<b>${territoryName}</b>`, {
                    permanent: false,
                    direction: 'center',
                    className: 'country-label'
                });
            }
        }).addTo(this.state.map);

        // Apply initial class to all uncaptured territories
        this.state.territories.forEach(t => {
            if (!t.captured && t.element._path) {
                t.element._path.classList.add('free-territory');
            }
        });

        // Update stats UI
        document.getElementById('totalTerritories').textContent = this.state.totalTerritories;
    },

    // Обработка клика по территории
    handleTerritoryClick(territory) {
        // Если игрок уже отвечает на вопрос, игнорируем клики
        if (this.state.isAnswering) return;

        if (territory.captured) {
            this.playSound('wrong'); // Already captured
            return;
        }

        // Блокируем карту
        this.state.isAnswering = true;

        // Set target
        this.state.targetTerritory = territory;

        // Scroll to question section/Focus user attention
        document.querySelector('.question-container').scrollIntoView({ behavior: 'smooth' });

        // Generate question
        this.nextQuestion();
    },

    // Placeholder to keep structure
    createRandomPolygon(lat, lng) { return []; },

    // Получение случайного вопроса
    // Получение случайного вопроса
    getRandomQuestion() {
        // Используем Set для отслеживания уникальных вопросов, если нужно
        if (!this.state.usedQuestions) this.state.usedQuestions = new Set();

        // Фильтруем вопросы
        let filteredQuestions = this.questions.filter(q => {
            // Basic filters
            if (this.settings.period !== 'any' && q.period !== this.settings.period) return false;
            // if (this.settings.difficulty !== q.difficulty) return false; // Maybe too strict if limited questions
            return !this.state.usedQuestions.has(q.id);
        });

        // Если вопросов не осталось
        if (filteredQuestions.length === 0) {
            // Если вопросы кончились, можно завершить игру или (временно) сбросить, но по запросу "не повторяться" - лучше просто не выдавать.
            // Однако, чтобы игра не сломалась, если вопросов мало, можно вернуть null и обработать это.
            // В данном случае, если вопросов очень много, этого не произойдёт.
            // Для безопасности вернем случайный из всех, если совсем пусто, или оставим пустым.

            // Вариант: Сбросить, если хотим бесконечную игру, НО пользователь просил "не повторяются".
            if (this.state.totalQuestions >= this.questions.length) {
                // Тут можно вызвать endGame, если вопросы кончились?
                // Пока просто вернем случайный, чтобы не крашнулось, но в идеале нужно больше вопросов.
                // Или просто не сбрасываем usedQuestions.
            }

            // Fallback: если фильтр по периоду слишком строгий и вопросы кончились
            if (filteredQuestions.length === 0) {
                // Попробуем взять из всех доступных, которые еще не были использованы (игнорируя период)
                filteredQuestions = this.questions.filter(q => !this.state.usedQuestions.has(q.id));
            }

            // Если совсем всё кончилось
            if (filteredQuestions.length === 0) {
                // Reset provided logic only as last resort or notify user
                console.warn("All questions used!");
                // For now, allow repeats only if absolutely exhausted
                filteredQuestions = this.questions;
            }
        }

        // Выбираем случайный вопрос
        const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
        const question = filteredQuestions[randomIndex];

        if (question) this.state.usedQuestions.add(question.id);

        return question;
    },

    // Следующий вопрос
    nextQuestion() {
        // Скрываем объяснение
        document.getElementById('explanationCard').style.display = 'none';

        // Получаем новый вопрос
        this.state.currentQuestion = this.getRandomQuestion();
        this.state.totalQuestions++;
        this.state.questionStartTime = Date.now();

        // Обновляем номер вопроса
        document.getElementById('questionNumber').textContent = this.state.totalQuestions;

        // Обновляем текст вопроса
        document.getElementById('questionText').textContent = this.state.currentQuestion.text;

        // Обновляем мета-информацию
        const periodNames = {
            antiquity: 'Античность',
            middle_ages: 'Средневековье',
            renaissance: 'Ренессанс',
            '19th_century': 'XIX век',
            '20th_century': 'XX век',
            modern: 'Современность'
        };

        document.getElementById('questionCategory').textContent =
            periodNames[this.state.currentQuestion.period] || 'Разное';

        const diffNames = { 1: 'Легко', 2: 'Средне', 3: 'Сложно' };
        document.getElementById('questionDifficulty').textContent =
            diffNames[this.state.currentQuestion.difficulty];

        // Создаем кнопки ответов
        const answersContainer = document.getElementById('answersContainer');
        answersContainer.innerHTML = '';

        // Create an array of objects with original index to shuffle
        const shuffledAnswers = this.state.currentQuestion.answers
            .map((answer, index) => ({ text: answer, originalIndex: index }))
            .sort(() => Math.random() - 0.5);

        shuffledAnswers.forEach((answerObj) => {
            const button = document.createElement('button');
            button.className = 'answer-btn historical-btn';
            button.textContent = answerObj.text;
            button.dataset.index = answerObj.originalIndex; // Store original index

            button.addEventListener('click', () => {
                if (this.state.gameActive) {
                    this.submitAnswer(answerObj.originalIndex);
                }
            });

            answersContainer.appendChild(button);
        });

        // Сбрасываем таймер
        this.state.timeLeft = 30;
        this.updateTimer();

        // Запускаем таймер
        if (this.state.timer) {
            clearInterval(this.state.timer);
        }

        this.state.timer = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimer();

            if (this.state.timeLeft <= 0) {
                clearInterval(this.state.timer);
                this.showAnswer(false);
            }
        }, 1000);
    },

    // Обновление таймера
    updateTimer() {
        document.getElementById('timer').textContent = this.state.timeLeft;
        document.getElementById('timeLeft').textContent = this.state.timeLeft;

        const progress = (this.state.timeLeft / 30) * 100;
        document.getElementById('timerProgress').style.width = `${progress}%`;
    },

    // Отправка ответа
    submitAnswer(answerIndex) {
        if (!this.state.gameActive || !this.state.currentQuestion) return;

        clearInterval(this.state.timer);

        const isCorrect = answerIndex === this.state.currentQuestion.correct;
        this.showAnswer(isCorrect, answerIndex);
    },

    // Показать результат ответа
    showAnswer(isCorrect, selectedIndex = null) {
        // Подсвечиваем правильный и выбранный ответы
        const answerButtons = document.querySelectorAll('.answer-btn');

        answerButtons.forEach((button) => {
            button.classList.remove('correct', 'incorrect', 'selected');
            const originalIndex = parseInt(button.dataset.index);

            if (originalIndex === this.state.currentQuestion.correct) {
                button.classList.add('correct');
            } else if (originalIndex === selectedIndex && !isCorrect) {
                button.classList.add('incorrect');
            }

            if (originalIndex === selectedIndex) {
                button.classList.add('selected');
            }
        });

        // Обновляем статистику
        if (isCorrect) {
            this.state.correctAnswers++;
            this.playSound('correct');

            // Only capture if we have a target
            if (this.state.targetTerritory) {
                this.captureTerritory();
            }
        } else {
            this.playSound('wrong');
            // Failed to capture - clear target and reset style if needed
            if (this.state.targetTerritory) {
                // If we want to show it briefly as red/error?
                const territory = this.state.targetTerritory;
                // Currently just clear the target
                this.state.targetTerritory = null;
            }
        }

        // Рассчитываем очки
        const timeTaken = 30 - this.state.timeLeft;
        const timeBonus = Math.max(0, 15 - timeTaken) * 10;
        const difficultyBonus = this.state.currentQuestion.difficulty * 50;
        const questionScore = isCorrect ? (100 + timeBonus + difficultyBonus) : 0;

        this.state.score += questionScore;
        document.getElementById('score').textContent = this.state.score;

        // Показываем объяснение
        document.getElementById('explanationText').textContent = this.state.currentQuestion.explanation;
        document.getElementById('explanationCard').style.display = 'block';

        // Сохраняем факт для истории
        if (isCorrect) {
            this.state.learnedFacts.push({
                question: this.state.currentQuestion.text,
                explanation: this.state.currentQuestion.explanation
            });
        }
    },

    // Захват территории
    captureTerritory(territoryArg = null, owner = 'player') {
        const territory = territoryArg || this.state.targetTerritory;
        if (!territory) return;

        territory.captured = true;
        territory.owner = owner;

        // Remove free territory visual markers
        if (territory.element._path) {
            territory.element._path.classList.remove('free-territory');
            territory.element._path.classList.remove('free-territory-hover');
        }

        // Visual feedback based on owner
        if (owner === 'player') {
            territory.element.setStyle({
                color: '#2e7d32', // Dark Green border
                fillColor: '#4caf50', // Light Green fill
                fillOpacity: 0.6,
                weight: 2,
                dashArray: ''
            });
            territory.element.bindPopup(`<b>${territory.name}</b><br>Статус: <span style="color:#4caf50; font-weight:bold;">ЗАХВАЧЕНА ВАМИ</span>`);
            this.state.capturedTerritories++;
            document.getElementById('capturedCount').textContent = this.state.capturedTerritories;
        } else {
            // Bot style - RED
            territory.element.setStyle({
                color: '#c62828', // Dark Red border
                fillColor: '#ef5350', // Red fill
                fillOpacity: 0.6,
                weight: 2,
                dashArray: ''
            });
            territory.element.bindPopup(`<b>${territory.name}</b><br>Статус: <span style="color:#ef5350; font-weight:bold;">ЗАХВАЧЕНА БОТОМ</span>`);
            this.state.botTerritories++;
            // Update UI for bot score? Ideally add element, or just track internally for end game
        }

        territory.element.openPopup();

        // Проверяем окончание игры
        const totalCaptured = this.state.capturedTerritories + this.state.botTerritories;
        if (totalCaptured >= this.state.totalTerritories) {
            // Game Over
            setTimeout(() => this.endGame(), 2000);
        }

        // Clear target if player captured
        if (owner === 'player') {
            this.state.targetTerritory = null;
        }
    },

    // Ход бота
    botTurn() {
        if (!this.state.gameActive) return;

        // Find neutral territories
        const neutralTerritories = this.state.territories.filter(t => !t.captured);

        // If no neutral, maybe try to steal? For now just return if empty (end game handles logic)
        if (neutralTerritories.length === 0) return;

        // Select random target
        const randomInfo = Math.floor(Math.random() * neutralTerritories.length);
        const target = neutralTerritories[randomInfo];

        // Difficulty check
        // 1: Easy (40%), 2: Medium (60%), 3: Hard (100%)
        let successChance = 0;
        if (this.settings.difficulty === 1) successChance = 0.4;
        else if (this.settings.difficulty === 2) successChance = 0.6;
        else successChance = 1.0;

        // Roll
        if (Math.random() < successChance) {
            // Success
            console.log(`Bot capturing ${target.name}`);
            this.captureTerritory(target, 'bot');

            // Optional: Show toast/message "Бот захватил [Страна]"
        } else {
            // Miss
            console.log(`Bot missed capture of ${target.name}`);
            // Optional: Show toast "Бот не смог захватить [Страна]"
        }
    },

    // Обновление информации об игре
    updateGameInfo() {
        // Континент
        const continentNames = {
            europe: 'Европа',
            asia: 'Азия',
            americas: 'Америки',
            africa: 'Африка',
            world: 'Весь мир'
        };

        document.getElementById('currentContinent').textContent =
            continentNames[this.settings.continent];

        // Период
        const periodNames = {
            antiquity: 'Античность',
            middle_ages: 'Средневековье',
            renaissance: 'Ренессанс',
            '19th_century': 'XIX век',
            '20th_century': 'XX век',
            modern: 'Современность',
            any: 'Любой'
        };

        document.getElementById('currentPeriod').textContent =
            periodNames[this.settings.period];

        // Сложность
        const diffNames = { 1: 'Легкая', 2: 'Средняя', 3: 'Сложная' };
        document.getElementById('currentDifficulty').textContent =
            diffNames[this.settings.difficulty];
    },

    // Завершение игры
    endGame() {
        this.state.gameActive = false;
        clearInterval(this.state.timer);

        // Determine winner
        const playerWins = this.state.capturedTerritories > this.state.botTerritories;
        const isTie = this.state.capturedTerritories === this.state.botTerritories; // Rare

        // Сохраняем статистику
        this.saveStatistics();

        // Обновляем экран результатов
        this.showResults(playerWins, isTie);
    },

    // Показать результаты
    showResults(playerWins, isTie) {
        // Сообщение о результате
        const resultMessage = document.getElementById('resultMessage');
        if (isTie) {
            resultMessage.textContent = 'Ничья!';
        } else {
            resultMessage.textContent = playerWins ?
                'Победа! Вы захватили больше территорий!' :
                'Поражение! Бот захватил больше территорий.';
        }

        // Обновляем статистику
        document.getElementById('resultTerritories').textContent =
            this.state.capturedTerritories;
        document.getElementById('resultCorrect').textContent =
            this.state.correctAnswers;
        document.getElementById('resultTotal').textContent =
            this.state.totalQuestions;
        document.getElementById('resultScore').textContent =
            this.state.score;

        // Время в среднем на вопрос
        const avgTime = this.state.totalQuestions > 0 ?
            Math.round((30 * this.state.totalQuestions - this.state.timeLeft) / this.state.totalQuestions) : 0;
        document.getElementById('resultTime').textContent = avgTime;

        // Показываем изученные факты
        const factsContainer = document.getElementById('learnedFacts');
        factsContainer.innerHTML = '';

        this.state.learnedFacts.slice(-5).forEach(fact => {
            const factElement = document.createElement('div');
            factElement.className = 'fact-item';
            factElement.innerHTML = `
                <div class="fact-icon">
                    <i class="fas fa-scroll"></i>
                </div>
                <div class="fact-text">
                    <strong>${fact.question}</strong>
                    <p>${fact.explanation}</p>
                </div>
            `;
            factsContainer.appendChild(factElement);
        });

        this.showScreen('resultsScreen');
    },

    // Сохранение статистики
    saveStatistics() {
        const stats = JSON.parse(localStorage.getItem('historyGameStats') || '{}');

        stats.totalGames = (stats.totalGames || 0) + 1;
        stats.totalTerritories = (stats.totalTerritories || 0) + this.state.capturedTerritories;
        stats.correctAnswers = (stats.correctAnswers || 0) + this.state.correctAnswers;
        stats.totalQuestions = (stats.totalQuestions || 0) + this.state.totalQuestions;
        stats.totalScore = (stats.totalScore || 0) + this.state.score;

        localStorage.setItem('historyGameStats', JSON.stringify(stats));
    },

    // Перезапуск игры
    restartGame() {
        this.startGame();
    },

    // Пауза игры
    pauseGame() {
        if (!this.state.gameActive) return;

        clearInterval(this.state.timer);
        this.state.gameActive = false;

        document.getElementById('pauseScreen').style.display = 'flex';
    },

    // Продолжить игру
    resumeGame() {
        if (this.state.gameActive) return;

        this.state.gameActive = true;
        document.getElementById('pauseScreen').style.display = 'none';

        // Перезапускаем таймер
        this.state.timer = setInterval(() => {
            this.state.timeLeft--;
            this.updateTimer();

            if (this.state.timeLeft <= 0) {
                clearInterval(this.state.timer);
                this.showAnswer(false);
            }
        }, 1000);
    },

    // Показать настройки из паузы
    showSettings() {
        this.showScreen('settingsScreen');
        document.getElementById('pauseScreen').style.display = 'none';
    },

    // Воспроизведение звука
    playSound(type) {
        if (!this.settings.soundEnabled) return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            if (type === 'correct') {
                // Восходящий тон для правильного ответа
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.5); // C6

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            } else if (type === 'wrong') {
                // Нисходящий тон для неправильного ответа
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                oscillator.frequency.exponentialRampToValueAtTime(261.63, audioContext.currentTime + 0.5); // C4

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.5);
            } else if (type === 'capture') {
                // Звук захвата территории
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);

                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.3);
            }
        } catch (e) {
            console.log('Web Audio API не поддерживается');
        }
    },

    // Поделиться результатами
    shareResults() {
        const text = `Я захватил ${this.state.capturedTerritories} территорий в Историческом Захвате Территории! 
                     Счёт: ${this.state.score}, Правильных ответов: ${this.state.correctAnswers}/${this.state.totalQuestions}`;

        if (navigator.share) {
            navigator.share({
                title: 'Исторический Захват Территории',
                text: text,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Копируем в буфер обмена
            navigator.clipboard.writeText(text).then(() => {
                alert('Результаты скопированы в буфер обмена!');
            });
        }
    },

    // Стартовый таймер
    startTimer() {
        // В будущем можно добавить обратный отсчет перед началом
    }
};

// Инициализация игры при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    game.init();

    // Автовыбор континента и сложности по умолчанию
    setTimeout(() => {
        const defaultContinent = document.querySelector('[data-continent="europe"]');
        if (defaultContinent) defaultContinent.classList.add('selected');

        const defaultPeriod = document.querySelector('[data-period="any"]');
        if (defaultPeriod) defaultPeriod.classList.add('active');

        const defaultDiff = document.querySelector('[data-diff="2"]');
        if (defaultDiff) defaultDiff.classList.add('active');

        const defaultSize = document.querySelector('[data-size="medium"]');
        if (defaultSize) defaultSize.classList.add('active');
    }, 100);
});