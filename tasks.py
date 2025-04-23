import requests
import os
import time
import json
import urllib.request
from pathlib import Path
import urllib.parse

# Пути для сохранения
IMG_DIR = Path("frontend/public/images/movies")
DATA_DIR = Path("frontend/src/data")

# Создаем директории, если они не существуют
os.makedirs(IMG_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# Альтернативные URL для изображений (более надежные источники)
ALTERNATIVE_IMAGES = {
    "avengers": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
    "shawshank": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    "green-mile": "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_.jpg"
}

# Расширенный список фильмов (20 фильмов)
MOVIES = [
    # Существующие фильмы
    {
        "id": "1",
        "title": "Мстители: Финал",
        "original_title": "Avengers: Endgame",
        "year": 2019,
        "rating": 8.4,
        "duration": "3ч 1м",
        "genre": "Фантастика, боевик, приключения",
        "director": "Энтони Руссо, Джо Руссо",
        "description": "Оставшиеся в живых члены команды Мстителей и их союзники должны разработать новый план, который поможет противостоять разрушительным действиям могущественного титана Таноса. После наиболее масштабной и трагической битвы в истории они не могут допустить ошибку.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
        "filename": "avengers.jpg",
        "cast": ["Роберт Дауни мл.", "Крис Эванс", "Марк Руффало", "Крис Хемсворт", "Скарлетт Йоханссон"]
    },
    {
        "id": "2",
        "title": "Побег из Шоушенка",
        "original_title": "The Shawshank Redemption",
        "year": 1994,
        "rating": 9.1,
        "duration": "2ч 22м",
        "genre": "Драма",
        "director": "Фрэнк Дарабонт",
        "description": "Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием, царящими по обе стороны решётки. Энди, обладающий живым умом и доброй душой, находит подход как к заключённым, так и к охранникам, добиваясь их особого к себе расположения.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        "filename": "shawshank.jpg",
        "cast": ["Тим Роббинс", "Морган Фриман", "Боб Гантон", "Уильям Сэдлер", "Клэнси Браун"]
    },
    {
        "id": "3",
        "title": "Зеленая миля",
        "original_title": "The Green Mile",
        "year": 1999,
        "rating": 9.1,
        "duration": "3ч 9м",
        "genre": "Драма, фэнтези, криминал",
        "director": "Фрэнк Дарабонт",
        "description": "Пол Эджкомб — начальник блока смертников в тюрьме «Холодная гора», каждый из узников которого однажды проходит «зеленую милю» по пути к месту казни. Пол повидал много заключённых и надзирателей за время работы. Однако гигант Джон Коффи, обвинённый в страшном преступлении, стал одним из самых необычных обитателей блока.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BMTUxMzQyNjA5MF5BMl5BanBnXkFtZTYwOTU2NTY3._V1_.jpg",
        "filename": "green-mile.jpg",
        "cast": ["Том Хэнкс", "Дэвид Морс", "Майкл Кларк Дункан", "Бонни Хант", "Джеймс Кромуэлл"]
    },
    # Новые фильмы (4-10)
    {
        "id": "4",
        "title": "Крестный отец",
        "original_title": "The Godfather",
        "year": 1972,
        "rating": 9.0,
        "duration": "2ч 55м",
        "genre": "Драма, криминал",
        "director": "Фрэнсис Форд Коппола",
        "description": "Глава семьи, Дон Вито Корлеоне, выдаёт замуж свою дочь. В это время со Второй мировой войны возвращается его любимый сын Майкл. Майкл, герой войны, гордость семьи, не выражает желания заняться жестоким семейным бизнесом. Дон Корлеоне ведёт дела по старым правилам, но наступают иные времена, и появляются люди, желающие изменить сложившиеся порядки, преступная организация, предлагающая новые паразитические схемы бизнеса.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        "filename": "godfather.jpg",
        "cast": ["Марлон Брандо", "Аль Пачино", "Джеймс Каан", "Роберт Дюваль", "Дайан Китон"]
    },
    {
        "id": "5",
        "title": "Тёмный рыцарь",
        "original_title": "The Dark Knight",
        "year": 2008,
        "rating": 8.9,
        "duration": "2ч 32м",
        "genre": "Боевик, криминал, драма",
        "director": "Кристофер Нолан",
        "description": "Бэтмен поднимает ставки в войне с преступностью. С помощью лейтенанта Джима Гордона и прокурора Харви Дента он намерен очистить улицы от преступности, отравляющей город. Сотрудничество оказывается эффективным, но скоро они сами становятся добычей для хаоса, царящего в городе, который был создан восходящей криминальной фигурой, известной как Джокер.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
        "filename": "dark-knight.jpg",
        "cast": ["Кристиан Бэйл", "Хит Леджер", "Аарон Экхарт", "Мэгги Джилленхол", "Гэри Олдман"]
    },
    {
        "id": "6",
        "title": "Список Шиндлера",
        "original_title": "Schindler's List",
        "year": 1993,
        "rating": 8.9,
        "duration": "3ч 15м",
        "genre": "Биография, драма, история",
        "director": "Стивен Спилберг",
        "description": "Фильм рассказывает реальную историю загадочного Оскара Шиндлера, члена нацистской партии, преуспевающего фабриканта, спасшего во время Второй мировой войны более тысячи ста евреев от гибели. Это триумф одного человека, не похожего на других, и драма тех, кто, благодаря ему, выжил в ужасный период человеческой истории.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        "filename": "schindlers-list.jpg",
        "cast": ["Лиам Нисон", "Бен Кингсли", "Рэйф Файнс", "Кэролайн Гудолл", "Эмбет Дэвидц"]
    },
    {
        "id": "7",
        "title": "Властелин колец: Возвращение короля",
        "original_title": "The Lord of the Rings: The Return of the King",
        "year": 2003,
        "rating": 8.9,
        "duration": "3ч 21м",
        "genre": "Фэнтези, приключения, драма",
        "director": "Питер Джексон",
        "description": "Последняя часть трилогии о Кольце Всевластия и о героях, взявших на себя бремя спасения Средиземья. Повелитель сил Тьмы Саурон направляет свои бесчисленные армии под стены Минас-Тирита, крепости Последней Надежды. Он предвкушает близкую победу, но именно это и мешает ему заметить две крохотные фигурки — хоббитов, приближающихся к Роковой Горе, где им предстоит уничтожить Кольцо Всевластия.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        "filename": "lotr-return-of-the-king.jpg",
        "cast": ["Элайджа Вуд", "Вигго Мортенсен", "Иэн Маккеллен", "Орландо Блум", "Шон Астин"]
    },
    {
        "id": "8",
        "title": "Форрест Гамп",
        "original_title": "Forrest Gump",
        "year": 1994,
        "rating": 8.8,
        "duration": "2ч 22м",
        "genre": "Драма, мелодрама",
        "director": "Роберт Земекис",
        "description": "От лица главного героя Форреста Гампа, слабоумного безобидного человека с благородным и открытым сердцем, рассказывается история его необыкновенной жизни. Фантастическим образом превращается он в известного футболиста, героя войны, преуспевающего бизнесмена. Он становится миллиардером, но остается таким же бесхитростным и добрым. Форреста ждет постоянный успех во всем, а он любит девочку, с которой дружил в детстве, но взаимность приходит слишком поздно.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg",
        "filename": "forrest-gump.jpg",
        "cast": ["Том Хэнкс", "Робин Райт", "Гэри Синиз", "Майкелти Уильямсон", "Салли Филд"]
    },
    {
        "id": "9",
        "title": "Бойцовский клуб",
        "original_title": "Fight Club",
        "year": 1999,
        "rating": 8.8,
        "duration": "2ч 19м",
        "genre": "Драма, триллер",
        "director": "Дэвид Финчер",
        "description": "Терзаемый хронической бессонницей и отчаянно пытающийся вырваться из мучительно скучной жизни, клерк встречает некоего Тайлера Дёрдена, харизматического торговца мылом с извращенной философией. Тайлер уверен, что самосовершенствование — удел слабых, а саморазрушение — единственное, ради чего стоит жить. Пройдет немного времени, и вот уже оба приятеля колотят друг друга на стоянке перед баром, и очищающий мордобой доставляет им высшее блаженство.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        "filename": "fight-club.jpg",
        "cast": ["Брэд Питт", "Эдвард Нортон", "Хелена Бонем Картер", "Джаред Лето", "Мит Лоаф"]
    },
    {
        "id": "10",
        "title": "Матрица",
        "original_title": "The Matrix",
        "year": 1999,
        "rating": 8.7,
        "duration": "2ч 16м",
        "genre": "Фантастика, боевик",
        "director": "Лана Вачовски, Лилли Вачовски",
        "description": "Жизнь Томаса Андерсона разделена на две части: днём он — самый обычный офисный работник, получающий нагоняи от начальства, а ночью превращается в хакера по имени Нео, и нет места в сети, куда он не смог бы дотянуться. Но однажды всё меняется — герой узнаёт ужасающую правду о реальности.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        "filename": "matrix.jpg",
        "cast": ["Киану Ривз", "Лоренс Фишбёрн", "Кэрри-Энн Мосс", "Хьюго Уивинг", "Глория Фостер"]
    },
    # Новые фильмы (11-20)
    {
        "id": "11",
        "title": "Интерстеллар",
        "original_title": "Interstellar",
        "year": 2014,
        "rating": 8.6,
        "duration": "2ч 49м",
        "genre": "Фантастика, драма, приключения",
        "director": "Кристофер Нолан",
        "description": "Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину (которая предположительно соединяет области пространства-времени через большое расстояние) в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
        "filename": "interstellar.jpg",
        "cast": ["Мэттью МакКонахи", "Энн Хэтэуэй", "Джессика Честейн", "Маккензи Фой", "Майкл Кейн"]
    },
    {
        "id": "12",
        "title": "Гладиатор",
        "original_title": "Gladiator",
        "year": 2000,
        "rating": 8.5,
        "duration": "2ч 35м",
        "genre": "Боевик, драма, приключения",
        "director": "Ридли Скотт",
        "description": "В великой Римской империи не было военачальника, равного генералу Максимусу. Непобедимые легионы, которыми командовал этот благородный воин, боготворили его и могли последовать за ним даже в ад. Но случилось так, что отважный Максимус, готовый сразиться с любым противником в честном бою, оказался бессилен против вероломных придворных интриг. Генерала предали и приговорили к смерти. Чудом избежав гибели, Максимус становится гладиатором.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        "filename": "gladiator.jpg",
        "cast": ["Рассел Кроу", "Хоакин Феникс", "Конни Нильсен", "Оливер Рид", "Ричард Харрис"]
    },
    {
        "id": "13",
        "title": "Леон",
        "original_title": "Léon",
        "year": 1994,
        "rating": 8.5,
        "duration": "1ч 50м",
        "genre": "Боевик, драма, криминал",
        "director": "Люк Бессон",
        "description": "Профессиональный убийца Леон, не знающий пощады и жалости, знакомится со своей очаровательной соседкой Матильдой, семью которой расстреливают полицейские, замешанные в торговле наркотиками. Благодаря этой встрече он впервые испытывает чувство любви, но… когда девочка случайно узнаёт, чем он занимается, она просит его научить её убивать, чтобы отомстить за смерть своего младшего брата.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BODllNWE0MmEtYjUwZi00ZjY3LThmNmQtZjZlMjI2YTZjYmQ0XkEyXkFqcGdeQXVyNTc1NTQxODI@._V1_.jpg",
        "filename": "leon.jpg",
        "cast": ["Жан Рено", "Гэри Олдман", "Натали Портман", "Дэнни Айелло", "Питер Эппел"]
    },
    {
        "id": "14",
        "title": "Начало",
        "original_title": "Inception",
        "year": 2010,
        "rating": 8.4,
        "duration": "2ч 28м",
        "genre": "Фантастика, боевик, триллер",
        "director": "Кристофер Нолан",
        "description": "Кобб – талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадет ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим. Редкие способности Кобба сделали его ценным игроком в привычном к предательству мире промышленного шпионажа, но они же превратили его в извечного беглеца и лишили всего, что он когда-либо любил. И вот у Кобба появляется шанс исправить ошибки.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
        "filename": "inception.jpg",
        "cast": ["Леонардо ДиКаприо", "Джозеф Гордон-Левитт", "Эллен Пейдж", "Том Харди", "Кен Ватанабе"]
    },
    {
        "id": "15",
        "title": "Пианист",
        "original_title": "The Pianist",
        "year": 2002,
        "rating": 8.4,
        "duration": "2ч 30м",
        "genre": "Биография, драма, музыка",
        "director": "Роман Полански",
        "description": "Фильм снят по автобиографии Владислава Шпильмана, одного из лучших пианистов Польши 30-х годов прошлого века. Главный герой фильма — Владек — занимается искусством до тех пор, пока территорию Польши не занимают нацисты. Жизнь всех евреев меняется: их помещают в Варшавское гетто, запрещают работать, унижают, заставляют носить отличительные повязки, а через некоторое время отправляют в концлагерь.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BOWRiZDIxZjktMTA1NC00MDQ2LWEzMjUtMTliZmY3NjQ3ODJiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
        "filename": "pianist.jpg",
        "cast": ["Эдриен Броуди", "Томас Кречманн", "Фрэнк Финлей", "Эмилия Фокс", "Морин Липман"]
    },
    {
        "id": "16",
        "title": "Джентльмены",
        "original_title": "The Gentlemen",
        "year": 2019,
        "rating": 8.3,
        "duration": "1ч 53м",
        "genre": "Боевик, комедия, криминал",
        "director": "Гай Ричи",
        "description": "Один ушлый американец ещё со студенческих лет приторговывал наркотиками, а теперь придумал схему нелегального обогащения с использованием поместий обедневшей английской аристократии и очень неплохо на этом разбогател. Другой пронырливый журналист приходит к Рэю, правой руке американца, и предлагает тому купить компромат на босса, но, вести переговоры с малознакомым парнем на деликатную тему — не самое правильное решение.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BMTlkMmVmYjktYTc2NC00ZGZjLWEyOWUtMjM2MDc3YzZhYWNlXkEyXkFqcGdeQXVyNTI4MzE4MDU@._V1_.jpg",
        "filename": "gentlemen.jpg",
        "cast": ["Мэттью МакКонахи", "Чарли Ханнэм", "Мишель Докери", "Джереми Стронг", "Колин Фаррелл"]
    },
    {
        "id": "17",
        "title": "Достать ножи",
        "original_title": "Knives Out",
        "year": 2019,
        "rating": 8.2,
        "duration": "2ч 10м",
        "genre": "Детектив, комедия, драма",
        "director": "Райан Джонсон",
        "description": "На следующее утро после празднования 85-летия известного автора криминальных романов Харлана Тромби виновника торжества находят мёртвым. Налицо — явное самоубийство, но полиция по протоколу опрашивает всех присутствующих в особняке членов семьи, хотя, в этом деле больше заинтересован частный детектив Бенуа Блан. Тем же утром он получил конверт с наличными от неизвестного и заказ на расследование смерти Харлана.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BMGUwZjliMTAtNzAxZi00MWNiLWE2NzgtZGUxMGQxZjhhNDRiXkEyXkFqcGdeQXVyNjU1NzU3MzE@._V1_.jpg",
        "filename": "knives-out.jpg",
        "cast": ["Дэниэл Крэйг", "Крис Эванс", "Ана де Армас", "Джейми Ли Кёртис", "Майкл Шеннон"]
    },
    {
        "id": "18",
        "title": "Джокер",
        "original_title": "Joker",
        "year": 2019,
        "rating": 8.1,
        "duration": "2ч 2м",
        "genre": "Драма, триллер, криминал",
        "director": "Тодд Филлипс",
        "description": "Готэм, начало 1980-х годов. Комик Артур Флек живет с больной матерью, которая с детства учит его «ходить с улыбкой». Пытаясь нести в мир хорошее и дарить людям радость, Артур сталкивается с человеческой жестокостью и постепенно приходит к выводу, что этот мир получит от него не добрую улыбку, а улыбку злодея Джокера.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
        "filename": "joker.jpg",
        "cast": ["Хоакин Феникс", "Роберт Де Ниро", "Зази Битц", "Фрэнсис Конрой", "Бретт Каллен"]
    },
    {
        "id": "19",
        "title": "Однажды в Голливуде",
        "original_title": "Once Upon a Time in Hollywood",
        "year": 2019,
        "rating": 7.8,
        "duration": "2ч 41м",
        "genre": "Драма, комедия",
        "director": "Квентин Тарантино",
        "description": "Фильм повествует о череде событий, произошедших в Голливуде в 1969 году, на закате его «золотого века». По сюжету, известный ТВ-актер Рик Далтон и его дублер Клифф Бут пытаются найти свое место в стремительно меняющемся мире киноиндустрии.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BOTg4ZTNkZmUtMzNlZi00YmFjLTk1MmUtNWQwNTM0YjcyNTNkXkEyXkFqcGdeQXVyNjg2NjQwMDQ@._V1_.jpg",
        "filename": "once-upon-a-time-in-hollywood.jpg",
        "cast": ["Леонардо ДиКаприо", "Брэд Питт", "Марго Робби", "Эмиль Хирш", "Маргарет Куэлли"]
    },
    {
        "id": "20",
        "title": "Паразиты",
        "original_title": "Gisaengchung",
        "year": 2019,
        "rating": 8.6,
        "duration": "2ч 12м",
        "genre": "Драма, триллер, комедия",
        "director": "Пон Джун-хо",
        "description": "Обычное корейское семейство Кимов жизнь не балует. Приходится жить в сыром грязном полуподвале, воровать интернет у соседей и перебиваться случайными подработками. Однажды друг сына семейства, уезжая на стажировку за границу, предлагает тому заменить его и поработать репетитором у старшеклассницы в богатой семье Пак. Подделав диплом о высшем образовании, парень отправляется в шикарный дизайнерский особняк и производит на хозяйку дома хорошее впечатление.",
        "image_url": "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
        "filename": "parasite.jpg",
        "cast": ["Сон Кан-хо", "Ли Сон-гюн", "Чо Ё-джон", "Чхве У-щик", "Пак Со-дам"]
    }
]

def download_image(movie):
    """Скачивает изображение фильма"""
    filename = movie["filename"]
    file_path = IMG_DIR / filename
    
    # Если файл уже существует и имеет размер > 0, пропускаем скачивание
    if file_path.exists() and file_path.stat().st_size > 1000:  # Размер больше 1KB считаем нормальным
        print(f"✅ Файл {filename} уже существует, пропускаем")
        return True
    
    # Функция для скачивания с указанного URL
    def try_download(url):
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
            }
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response, open(file_path, 'wb') as out_file:
                data = response.read()
                out_file.write(data)
            return True
        except Exception as e:
            print(f"  ⚠️ Ошибка при загрузке с {url}: {e}")
            return False
    
    # Пробуем скачать с URL
    print(f"📥 Загрузка {movie['title']}...")
    if try_download(movie["image_url"]):
        print(f"  ✅ Загружено: {filename}")
        return True
    
    # Создаем заглушку, если не удалось скачать изображение
    print(f"  ⚠️ Не удалось скачать изображение, создаем заглушку")
    create_placeholder(file_path, movie["title"])
    return False

def create_placeholder(file_path, title):
    """Создает простую заглушку с текстом названия фильма"""
    try:
        # Используем placeholder.com для создания заглушки
        # Кодируем название фильма для URL
        encoded_title = urllib.parse.quote(title, encoding='utf-8')
        url = f"https://placehold.co/600x900/333333/FFFFFF?text={encoded_title}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
        }
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response, open(file_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"  ✅ Создана заглушка для {title}")
        return True
    except Exception as e:
        print(f"  ❌ Ошибка при создании заглушки: {e}")
        # Если не удалось создать заглушку через сервис, создаем пустой файл
        try:
            with open(file_path, 'wb') as f:
                f.write(b'')
            print(f"  ⚠️ Создан пустой файл для {title}")
        except Exception as write_error:
            print(f"  ❌ Не удалось создать пустой файл: {write_error}")
        return False

def save_movies_data():
    """Сохраняет данные о фильмах в JSON-файл"""
    # Подготавливаем данные для сохранения (без URL, только пути к локальным файлам)
    movies_data = []
    for movie in MOVIES:
        movie_data = {
            "id": movie["id"],
            "title": movie["title"],
            "original_title": movie["original_title"],
            "year": movie["year"],
            "rating": movie["rating"],
            "duration": movie["duration"],
            "genre": movie["genre"],
            "director": movie["director"],
            "description": movie["description"],
            "image": f"/images/movies/{movie['filename']}",
            "cast": movie["cast"]
        }
        movies_data.append(movie_data)
    
    # Сохраняем в JSON-файл
    data_file = DATA_DIR / "movies.json"
    with open(data_file, 'w', encoding='utf-8') as f:
        json.dump(movies_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Данные о фильмах сохранены в {data_file}")
    return True

def main():
    print(f"🎬 Начинаем загрузку данных о фильмах ({len(MOVIES)})...")
    
    # Скачиваем изображения
    successful = 0
    for movie in MOVIES:
        if download_image(movie):
            successful += 1
        # Делаем паузу, чтобы не перегружать сервер
        time.sleep(1)
    
    print(f"✅ Загрузка изображений завершена. Успешно загружено {successful}/{len(MOVIES)} изображений.")
    
    # Сохраняем данные о фильмах
    save_movies_data()
    
    print("🎉 Все задачи выполнены успешно!")

if __name__ == "__main__":
    main() 