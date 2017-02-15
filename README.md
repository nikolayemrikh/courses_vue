# courses

JS Courses on Vue.js


Доступно по адресу:
https://courses-redishko.c9users.io/

### Каталог с курсами:

#### Общая структура:
<pre>
.
└── i-course-name
    ├── j-task-name
    │   ├── meta.json
    │   └── theory.html
    ├── files
    └── meta.json
</pre>

meta.json:
```json
{
  "type": "<ТИП ЗАДАНИЯ>",
  "name": "Название",
  "description": "Описание",
  "isChallenge": false
}
```

Используются при маршрутизации в браузере и отображении списков:
* i - номер курса
* j - номер задания

Пользовательские названия, не используются:
* course-name - пользовательское название, не используется
* task-name - пользовательское название, не используется

files - файлы, которые будут загружены в iframe в каждом задании курса
 (если он присутствует)
 
Каждое задание может быть испытанием
(поведение задания в режиме испытания задается
 отдельно для каждого типа задания)

Для каждого задания доступна теория 
(которая также служит описание задания)

#### Задания с HTML, CSS, JS
В испытании и в задании доступно:
* iframe (в который загружаются файлы из папки /initial)
* редакторы кода HTML, CSS, JS
(в которые помещаются файлы из папки /initial)

Для задания доступна:
* панель с целями (в которую загружаются goals.html)

Для испытания доступна:
* картинка, показывающая к какому виду нужно привести
находящееся в iframe (создается в браузере на основе
 solution.html и check.js)

<pre>
.
└── j-task-name
    ├── initial
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    ├── meta.json
    ├── goals.html
    ├── solution.html
    ├── check.js
    └── theory.html
</pre>

Специфичные для данного типа параметры в meta.json:
```json
{
  "type": "htmlCssJs",
  "blockedCSS": false,
  "blockedHTML": false,
  "blockedJS": false,
  "activeTab": "<CSS|HMTL|JS>"
}
```

#### Задания на программирование JS

В испытании и в задании доступно:
* редактор кода JS (в который помещен файл script.js из папки /initial)

<pre>
.
└── j-task-name
    ├── initial
    │   └── script.js
    ├── meta.json
    ├── goals.html
    ├── check.js
    └── theory.html
</pre>

Специфичные для данного типа параметры в meta.json:
```json
{
  "type": "jsProgramming"
}
```

#### Задания, в которых нужно дать ответ в виде строки (числа)

<pre>
.
└── j-task-name
    ├── meta.json
    ├── check.js
    └── theory.html
</pre>

Специфичные для данного типа параметры в meta.json:
```json
{
  "type": "question"
}
```

#### Задания, в которых нужно выбрать правильный ответ из списка (radio)

<pre>
.
└── j-task-name
    ├── initial
    │   └── answers.json
    ├── meta.json
    └── theory.html
</pre>

k - номер ответа (правильный ответ (число) указывается в meta.json задания)

Специфичные для данного типа параметры в meta.json:
```json
{
  "type": "radio",
  "correctAnswer": <k>
}
```

#### Задания, в которых нужно выбрать один или несколько правильных ответов из списка (чекбоксы)

<pre>
.
└── j-task-name
    ├── initial
    │   └── answers.json
    ├── meta.json
    └── theory.html
</pre>

answers.json
```json
{
  "1": "Первый вариант ответа",
  "2": "Второй вариант ответа",
  "3": "Третий вариант ответа"
}
```

Правильный ответ (массив чисел) указывается в meta.json задания

Специфичные для данного типа параметры в meta.json:
```json
{
  "type": "checkbox",
  "correctAnswers": <[k, k + 1]>
}
```

