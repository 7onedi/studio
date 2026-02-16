export type Placement = "hero" | "featured" | "list";
export type ArticleStatus = "draft" | "published" | "archived";

export const placement = (v: readonly Placement[]): readonly Placement[] => v;

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: readonly string[];
  status: ArticleStatus;
  placement?: readonly Placement[];
  category: string;
  SubCategory?: string;
};

export type ArticleHero = {
  gradient: string;
  gradientMob: string;
  img: string;
  tegsBgColor: string;
  textStyle: string;
};

export type ArticleAuthor = {
  name: string;
  src: string;
};

export type VideoProvider = "youtube" | "instagram" | "facebook";

export type ParagraphBlock = {
  id: string;
  type: "paragraph";
  data: { text: string };
};

export type HeaderBlock = {
  id: string;
  type: "header";
  data: {
    text: string;
    level?: 1 | 2 | 3 | 4 | 5;
  };
};

export type ListBlock = {
  id: string;
  type: "list";
  data: {
    style: "ordered" | "unordered";
    items: readonly string[]; // важливо: readonly під as const
  };
};


export type VideoBlock = {
  id: string;
  type: "video";
  data: {
    provider: VideoProvider;
    url: string;
    title?: string;
    preview?: string;
  };
};

type GalleryBlock = {
  id: string;
  type: "gallery";
  data: {
    files: readonly { url: string; alt?: string }[];
    caption?: string;
    withBorder?: boolean;
    withBackground?: boolean;
    stretched?: boolean;
  };
};


export type EditorBlock =
  | ParagraphBlock
  | HeaderBlock
  | ListBlock
  | GalleryBlock
  | VideoBlock;

export type ArticleBody = {
  blocks: readonly EditorBlock[];
};

export type Article = {
  meta: ArticleMeta;
  hero: ArticleHero;
  author: ArticleAuthor;
  body: ArticleBody;
};

// slideContent.ts
export const slides : readonly Article[] = [

                                // #1

  {
    meta: {
      slug: "special-offers",
      title: "Особливі пропозиції",
      description: "",
      date: "22 лист. 2019 р.",
      tags: ["#mfkstina", "#special-offers"],
      status: "published",
      placement: placement(["hero"]),
      category: "#CountrysideStudio",
      SubCategory: "YFC-Stina",
    },

    hero: {
      gradient:
        "lg:bg-gradient-to-r lg:from-main-amarant/100 lg:via-main-amarant/15 lg:to-transparent",
      gradientMob:
        "bg-gradient-to-t from-main-amarant/100 via-main-amarant/15 to-transparent",
      img: "/articles/article_11.webp",
      tegsBgColor: "bg-main-blue",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ярослав Геращенко",
      src: "/review/profile2.jpg",
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "<b>Стіна</b> - це родзинка красивого краю, у якому перетинаються культурні та природні елементи Наддністрянщини та Поділля. Тут живуть добрі та працьовиті люди, спілкування з якими може стати справжнім задоволенням. Тому ми запрошуємо вас сюди задовольнити свою унікальну потребу та насолодитись справжнім українським селом.",
          },
        },
        {
          id: "h2-1",
          type: "header",
          data: {
            text: 'Фестиваль "Стіна запрошує"',
          },
        },
        {
          id: "video-1",
          type: "video",
          data: {
            provider: "youtube",
            url: "https://www.youtube.com/watch?v=-qeoYLRAxao",
            title: '"Stina Welcomes" Festival / Фестиваль "Стіна запрошує"',
            preview: "",
          },
        },
        {
          id: "p2",
          type: "paragraph",
          data: {
            text: "Ми раді, що проект досягнув своєї мети, а саме активізував місцеве населення, місцеву молодь, котра ще більше повірив в значний потенціал села. І він криється саме в них – молодих і впевнених лідерах. Також ми вдячні всім місцевим жителям, котрі створили це свято і котрі готові експериментувати у співпраці із командою Еко-Центра Стіна!",
          },
        },
      ],
    },
  },

                                // #2

  {
    meta: {
      slug: "interesting-places",
      title: "Місцеві цікавинки",
      description: "",
      date: "15 січня 2026",
      tags: ["#mfkstina", "#interesting-places"],
      status: "published",
      placement: placement(["hero"]),
category: "#CountrysideStudio",
      SubCategory: "YFC-Stina",
    },
    hero: {
      gradient:
        "lg:bg-gradient-to-r lg:from-main-blue/100 lg:via-main-blue/15 lg:to-transparent",
      gradientMob:
        "bg-gradient-to-t from-main-blue/100 via-main-blue/15 to-transparent",
      img: "/articles/article_5.webp",
      tegsBgColor: "bg-main-amarant",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ася Козлова",
      src: "/review/profile3.jpg"
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "Стіна має унікальний ландшафт, тільки в межах долини затишної ріки Русави ви тричі в межах села повернете на 180 градусів. У цих містичних лабіринтах криються секрети сивої історії, фольклору та побуту. Вапняк, що вирізняє село архітектурно створює особливу автентичну атмосферу, а на околицях розташовані два природних заказники місцевго значення.",
          },
        },
        {
          id: "video-1",
          type: "video",
          data: {
            provider: "instagram",
            url: "https://www.instagram.com/reel/DSswinGDHgj/?igsh=ZWN5ZTJybmg5cms4",
            title: "Трейлер фестивалю",
            preview:
              "https://stina.pangeya.org.ua/static/media/interesting_places.a1f84ef6.webp",
          },
        },
      ],
    },
  },

                                // #3

  {
    meta: {
      slug: "active-recreation",
      title: "Активний відпочинок",
      description: "",
      date: "15 січня 2026",
      tags: ["#mfkstina", "#active-recreation"],
      status: "published",
      placement: placement(["hero"]),
      category: "#CountrysideStudio",
      SubCategory: "YFC-Stina",
    },
    hero: {
      gradient:
        "lg:bg-gradient-to-r lg:from-main-blue/100 lg:via-main-blue/15 lg:to-transparent",
      gradientMob:
        "bg-gradient-to-t from-main-blue/100 via-main-blue/15 to-transparent",
      img: "/articles/article_1.webp",
      tegsBgColor: "bg-main-amarant",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ярослав Геращенко",
      src: "/review/profile2.jpg",
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "Місцеві природні краєвиди перехоплюють подих і тому не даремно гості Стіни нарекли її «Маленькими Карпатами». Мандрівка річкою, непрохідними хащами заказників та балок, або подолання висот різного ухилу - це ідеальні умови для всіх, хто полюбляє пригоди та відчуття здорової втоми. Велосипедисти, скелелази та любителі відпочинку у кемпінгу - всім знайдеться що робити у Стіні.",
          },
        },
      ],
    },
  },

                                // #4

  {
    meta: {
      slug: "cave-monastery",
      title: "Печерний монастир у Яланецькій скелі",
      description: "",
      date: "15 січня 2026",
      tags: ["#mfkZhmerynka"],
      status: "published",
      placement: placement(["list"]),
      category: "#CountrysideStudio",
      SubCategory: "YFC-Zhmerynka",
    },

    hero: {
      gradient: "bg-gradient-to-t from-main-blue/80 via-main-blue/10 to-transparent",
      gradientMob: "bg-gradient-to-t from-main-blue/100 via-main-blue/15 to-transparent",
      img: "/articles/article_10.webp",
      tegsBgColor: "bg-main-amarant",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ярослав Геращенко",
      src: "/review/profile2.jpg"
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "Залишки печерного монастиря знаходяться біля покинутих штолень. Значна частина печер була зруйнована штольнями з видобування вапняку у радянську добу (1950ті роки)."
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "Стіна на р. Русаві згадується серед подільських поселень з найстарішими скельними монастирями, заснованими приблизно в XI ст., майже одночасно з Києво-Печерською лаврою:"
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: '"Основание скального монастыря в с. Стене Ямпольского у., местное предание ... относит к временам преподобних Антония и Феодосия Печерских".'
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: '"По местному преданию, преподобний Антоний Печерский, следуя с Афона в Киев, продолжительное время провел у Лядавы, занимаясь подвижничеством и поучением народа. Такое же предание сушествует и о других скальных монастырях, как например, Бакотском и Стенском".'
          }
        },
        {
          id: "gallery-1",
          type: "gallery",
          data: {
            files: [
              { url: "/articles/Rock_Monaste/Rock_Monaste_1.webp", alt: "Rock_Monaste_1" },
            ],
            caption: "Печерний монастир у Яланецькій скелі",
            withBorder: false,
            withBackground: false,
            stretched: true,
          },
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: 'Вищезгаданий стінянський скельний монастир, очевидно, можна ототожнити з так званою Яланецькою скелею. Це — печера, видовбана в цільному камені у скелі, що відома під назвою Стінка, яка розташована проти Замкової гори. Щодо печери, то ще в кінці XIX ст. було зафіксовано легенду, ніби тут починається підземний хід в с. Яланець, віддалене на відстані 10 верст від Стіни. На той час печера являла собою видовбаний у скелі з піску і вапняку вузький прохід у 1/2 аршина заввишки і 4 аршина завширшки. Далі прохід звужувався і ніби розгалужувався у вигляді вузьких отворів, які могли мати продовження у менші печери, але потрапити в них виявилося неможливо через обвали і нестачу повітря.'
          }
        },
        {
          id: "gallery-1",
          type: "gallery",
          data: {
            files: [
              { url: "/articles/Rock_Monaste/Rock_Monaste_2.webp", alt: "Rock_Monaste_2" },
              { url: "/articles/Rock_Monaste/Rock_Monaste_3.webp", alt: "Rock_Monaste_3" },
              { url: "/articles/Rock_Monaste/Rock_Monaste_4.webp", alt: "Rock_Monaste_4" },
            ],
            caption: "Печерний монастир у Яланецькій скелі",
            withBorder: false,
            withBackground: false,
            stretched: true,
          },
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: 'Яланецька печера це природна печера закладена у вапнистих пісковиках. Праворуч від сучасного входу у штольні збереглись залишки стіни з склепінням (довжина 3,70 м). Вперше у науковій літературі пам’ятка згадується у 1887 р. у статті «Сказание о Подольском городе Баре и Барском Свято-Покровском монастыре» в «Подольских епархиальных ведомостях». У 1999 р. пам’ятку обстежували П.О. Нечитайло та С. Белінський.'
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: 'У печері зафіксовано значну кількість петрогліфів, які, умовно, можна розділити на три групи: антропоморфні, символічні та буквено-цифрові. До антропоморфних зображень належить іконка, розміром: 0,12 х 0,16 м, висічена в скелі, зліва від входу, за 2,0 м вглиб печери. Ікона напівстерта, поганої збереженості. З символічних зображень найбільшу кількість становлять чисельні варіанти хрестів. З написів дослідникам вдалось прочитати лише декілька, написаних кирилицею: «Помяни Г(оспо)ди Григория». На початку речення чітко вирізьблені чотири цифри: 1496. Також є ще написи: «Помяни Г(оспо)ди Илію и тому свое НБ…», «Помяни свого…», автографи: «Антоній», «Григорий», «Гаврн» та ще один напівстертий напис, але з чіткою датою: 1756 р.'
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: 'Більшість написів поганої збереженості через процеси вивітрювання та вологість у печері. Сучасні дослідники розділяють існування печери на два періоди: язичницьке святилище та християнський скит або монастир. Другий період існування комплексу можна датувати 9–18 ст.'
          }
        },
        {
          id: "h2-1",
          type: "header",
          data: {
            text: "Джерела:",
            level: 5
          }
        },
        {
          id: "list-1",
          type: "list",
          data: {
            style: "ordered",
            items: [
              "1. Одвічна Русава, Вінницький обласний центр Народної Творчості, Вінниця 2003",
              "2. Пам'ятки історії та культури Вінницької області. Частина ІІ. Оратівський-Ямпільський райони, А.В.Войнаровський та співатори, Житомир 2021",
              "3. «Сказание о Подольском городе Баре и Барском Свято-Покровском монастыре», «Подольские епархиальные ведомости», 1887",
              "4. Дослідження печерного монастиря в с. Стіна // Матеріали Х Подільської історико-краєзнавчої конференції, Нечитайло П.О., Кам'янець-Подільський 2000",
              "5. Подолия. Историческое описание, Батюшков П.Н., Санкт-Петербург, 1891",
              "6. Приходы и церкви Подольской епархии // Труды Подольского епархиального историко-статистического комитета, Сецинский Е., Каменец-Подольский 1901",
              "7. Памятники старины в Подолии, Гульдман В.К., Каменец-Подольский 1901"
            ]
          }
        },
      ]
    }
  },

                                // #5

  {
    meta: {
      slug: "rusava-ensemble",
      title: 'Жіночий ансамбль "Русава"',
      description: "",
      date: "15 січня 2026",
      tags: ["#yi-2017"],
      status: "published",
      placement: placement(["list"]),
      category: "youthinsight",
      SubCategory: "yi-2017",
    },
    hero: {
      gradient: "bg-gradient-to-t from-main-amarant/80 via-main-amarant/10 to-transparent",
      gradientMob: "bg-gradient-to-t from-main-amarant/100 via-main-amarant/15 to-transparent",
      img: "/articles/article_3.webp",
      tegsBgColor: "bg-main-blue",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ярослав Геращенко",
      src: "/review/profile2.jpg"
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "<b>Стіна</b> - це родзинка красивого краю, у якому перетинаються культурні та природні елементи Наддністрянщини та Поділля. Тут живуть добрі та працьовиті люди, спілкування з якими може стати справжнім задоволенням. Тому ми запрошуємо вас сюди задовольнити свою унікальну потребу та насолодитись справжнім українським селом.",
          },
        },
        {
          id: "h2-1",
          type: "header",
          data: {
            text: 'Фестиваль "Стіна запрошує"',
          },
        },
        {
          id: "video-1",
          type: "video",
          data: {
            provider: "youtube",
            url: "https://www.youtube.com/watch?v=-qeoYLRAxao",
            title: '"Stina Welcomes" Festival / Фестиваль "Стіна запрошує"',
            preview: "",
          },
        },
        {
          id: "p2",
          type: "paragraph",
          data: {
            text: "Ми раді, що проект досягнув своєї мети, а саме активізував місцеве населення, місцеву молодь, котра ще більше повірив в значний потенціал села. І він криється саме в них – молодих і впевнених лідерах. Також ми вдячні всім місцевим жителям, котрі створили це свято і котрі готові експериментувати у співпраці із командою Еко-Центра Стіна!",
          },
        },
      ]
    }
  },

                                // #6

  {
    meta: {
      slug: "burnt-mill",
      title: "Погорений млин",
      description: "",
      date: "15 січня 2026",
      tags: ["#mfkZhmerynka"],
      status: "published",
      placement: placement(["list"]),
      category: "#CountrysideStudio",
      SubCategory: "YFC-Zhmerynka",
    },
    hero: {
      gradient: "bg-gradient-to-t from-main-amarant/80 via-main-amarant/10 to-transparent",
      gradientMob: "bg-gradient-to-t from-main-amarant/100 via-main-amarant/15 to-transparent",
      img: "/articles/article_7.webp",
      tegsBgColor: "bg-main-blue",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ася Козлова",
      src: "/review/profile3.jpg"
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "<b>Стіна</b> - це родзинка красивого краю, у якому перетинаються культурні та природні елементи Наддністрянщини та Поділля. Тут живуть добрі та працьовиті люди, спілкування з якими може стати справжнім задоволенням. Тому ми запрошуємо вас сюди задовольнити свою унікальну потребу та насолодитись справжнім українським селом.",
          },
        },
        {
          id: "h2-1",
          type: "header",
          data: {
            text: 'Фестиваль "Стіна запрошує"',
          },
        },
        {
          id: "video-1",
          type: "video",
          data: {
            provider: "youtube",
            url: "https://www.youtube.com/watch?v=-qeoYLRAxao",
            title: '"Stina Welcomes" Festival / Фестиваль "Стіна запрошує"',
            preview: "",
          },
        },
        {
          id: "p2",
          type: "paragraph",
          data: {
            text: "Ми раді, що проект досягнув своєї мети, а саме активізував місцеве населення, місцеву молодь, котра ще більше повірив в значний потенціал села. І він криється саме в них – молодих і впевнених лідерах. Також ми вдячні всім місцевим жителям, котрі створили це свято і котрі готові експериментувати у співпраці із командою Еко-Центра Стіна!",
          },
        },
      ]
    }
  },

                                // #7

  {
    meta: {
      slug: "alive-picture-stina",
      title: 'Жива Картина "Image Mapping"',
      description: "",
      date: "22 лист. 2019 р.",
      tags: ["#mfkYampil"],
      status: "published",
      placement: placement(["list"]),
      category: "#CountrysideStudio",
      SubCategory: "YFC-Yampil",
    },

    hero: {
     gradient: "bg-gradient-to-t from-main-blue/80 via-main-blue/10 to-transparent",
      gradientMob: "bg-gradient-to-t from-main-blue/100 via-main-blue/15 to-transparent",
      img: "/articles/article_4.webp",
      tegsBgColor: "bg-main-amarant",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ярослав Геращенко",
      src: "/review/profile2.jpg"
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "<b>Стіна</b> - це родзинка красивого краю, у якому перетинаються культурні та природні елементи Наддністрянщини та Поділля. Тут живуть добрі та працьовиті люди, спілкування з якими може стати справжнім задоволенням. Тому ми запрошуємо вас сюди задовольнити свою унікальну потребу та насолодитись справжнім українським селом."
          }
        },
        {
          id: "h2-1",
          type: "header",
          data: {
            text: 'Фестиваль "Стіна запрошує"',
          }
        },
        {
          id: "video-1",
          type: "video",
          data: {
            provider: "youtube", // "youtube" | "instagram" | "facebook"
            url: "https://www.youtube.com/watch?v=-qeoYLRAxao",
            title: '"Stina Welcomes" Festival / Фестиваль "Стіна запрошує"',
            // опційно: якщо ти вже з беку даєш готове превʼю
            preview: ""
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "Ми раді, що проект досягнув своєї мети, а саме активізував місцеве населення, місцеву молодь, котра ще більше повірив в значний потенціал села. І він криється саме в них – молодих і впевнених лідерах. Також ми вдячні всім місцевим жителям, котрі створили це свято і котрі готові експериментувати у співпраці із командою Еко-Центра Стіна!"
          }
        },
      ]
    }
  },

                                // #8

  {
    meta: {
      slug: "museum",
      title: "Краєзнавчий музей",
      description: "",
      date: "15 січня 2026",
      tags: ["#mfkstina"],
      status: "published",
      placement: placement(["list"]),
      category: "#CountrysideStudio",
      SubCategory: "YFC-Stina",
    },
    hero: {
      gradient: "bg-gradient-to-t from-main-blue/80 via-main-blue/10 to-transparent",
      gradientMob: "bg-gradient-to-t from-main-blue/100 via-main-blue/15 to-transparent",
      img: "/articles/article_8.webp",
      tegsBgColor: "bg-main-amarant",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ярослав Геращенко",
      src: "/review/profile2.jpg"
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "<b>Стіна</b> - це родзинка красивого краю, у якому перетинаються культурні та природні елементи Наддністрянщини та Поділля. Тут живуть добрі та працьовиті люди, спілкування з якими може стати справжнім задоволенням. Тому ми запрошуємо вас сюди задовольнити свою унікальну потребу та насолодитись справжнім українським селом."
          }
        },
        {
          id: "h2-1",
          type: "header",
          data: {
            text: 'Фестиваль "Стіна запрошує"',
          }
        },
        {
          id: "video-1",
          type: "video",
          data: {
            provider: "youtube", // "youtube" | "instagram" | "facebook"
            url: "https://www.youtube.com/watch?v=-qeoYLRAxao",
            title: '"Stina Welcomes" Festival / Фестиваль "Стіна запрошує"',
            // опційно: якщо ти вже з беку даєш готове превʼю
            preview: ""
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "Ми раді, що проект досягнув своєї мети, а саме активізував місцеве населення, місцеву молодь, котра ще більше повірив в значний потенціал села. І він криється саме в них – молодих і впевнених лідерах. Також ми вдячні всім місцевим жителям, котрі створили це свято і котрі готові експериментувати у співпраці із командою Еко-Центра Стіна!"
          }
        },
      ]
    }
  },

                                // #9

  {
    meta: {
      slug: "Main_figure",
      title: '"Фігура" при в`їзді в село',
      description: "",
      date: "15 січня 2026",
      tags: ["#mfkZhmerynka"],
      status: "published",
      placement: placement(["list"]),
      category: "#CountrysideStudio",
      SubCategory: "YFC-Zhmerynka",
    },
    hero: {
      gradient: "bg-gradient-to-t from-main-amarant/80 via-main-amarant/10 to-transparent",
      gradientMob: "bg-gradient-to-t from-main-amarant/100 via-main-amarant/15 to-transparent",
      img: "/articles/article_6.webp",
      tegsBgColor: "bg-main-blue",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ярослав Геращенко",
      src: "/review/profile2.jpg"
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "<b>Стіна</b> - це родзинка красивого краю, у якому перетинаються культурні та природні елементи Наддністрянщини та Поділля. Тут живуть добрі та працьовиті люди, спілкування з якими може стати справжнім задоволенням. Тому ми запрошуємо вас сюди задовольнити свою унікальну потребу та насолодитись справжнім українським селом."
          }
        },
        {
          id: "h2-1",
          type: "header",
          data: {
            text: 'Фестиваль "Стіна запрошує"',
          }
        },
        {
          id: "video-1",
          type: "video",
          data: {
            provider: "youtube", // "youtube" | "instagram" | "facebook"
            url: "https://www.youtube.com/watch?v=-qeoYLRAxao",
            title: '"Stina Welcomes" Festival / Фестиваль "Стіна запрошує"',
            // опційно: якщо ти вже з беку даєш готове превʼю
            preview: ""
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "Ми раді, що проект досягнув своєї мети, а саме активізував місцеве населення, місцеву молодь, котра ще більше повірив в значний потенціал села. І він криється саме в них – молодих і впевнених лідерах. Також ми вдячні всім місцевим жителям, котрі створили це свято і котрі готові експериментувати у співпраці із командою Еко-Центра Стіна!"
          }
        },        
      ]
    }
  },

                                // #10

  {
    meta: {
      slug: "pasika-na-lisoviy",
      title: 'Пасіка "На Лісовій"',
      description: "",
      date: "15 січня 2026",
      tags: ["#mfkstina"],
      status: "published",
      placement: placement(["list"]),
      category: "#CountrysideStudio",
      SubCategory: "YFC-Stina",
    },
    hero: {
      gradient: "bg-gradient-to-t from-main-amarant/80 via-main-amarant/10 to-transparent",
      gradientMob: "bg-gradient-to-t from-main-amarant/100 via-main-amarant/15 to-transparent",
      img: "/articles/article_9.webp",
      tegsBgColor: "bg-main-blue",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ярослав Геращенко",
      src: "/review/profile2.jpg"
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "<b>Стіна</b> - це родзинка красивого краю, у якому перетинаються культурні та природні елементи Наддністрянщини та Поділля. Тут живуть добрі та працьовиті люди, спілкування з якими може стати справжнім задоволенням. Тому ми запрошуємо вас сюди задовольнити свою унікальну потребу та насолодитись справжнім українським селом."
          }
        },
        {
          id: "h2-1",
          type: "header",
          data: {
            text: 'Фестиваль "Стіна запрошує"',
          }
        },
        {
          id: "video-1",
          type: "video",
          data: {
            provider: "youtube", // "youtube" | "instagram" | "facebook"
            url: "https://www.youtube.com/watch?v=-qeoYLRAxao",
            title: '"Stina Welcomes" Festival / Фестиваль "Стіна запрошує"',
            // опційно: якщо ти вже з беку даєш готове превʼю
            preview: ""
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "Ми раді, що проект досягнув своєї мети, а саме активізував місцеве населення, місцеву молодь, котра ще більше повірив в значний потенціал села. І він криється саме в них – молодих і впевнених лідерах. Також ми вдячні всім місцевим жителям, котрі створили це свято і котрі готові експериментувати у співпраці із командою Еко-Центра Стіна!"
          }
        },
      ]
    }
  },

                                // #11

  {
    meta: {
      slug: "castle-hill",
      title: "Замкова гора",
      description: "",
      date: "15 січня 2026",
      tags: ["#mfkstina"],
      status: "published",
      placement: placement(["list"]),
      category: "#CountrysideStudio",
      SubCategory: "YFC-Stina",
    },
    hero: {
      gradient: "bg-gradient-to-t from-main-blue/80 via-main-blue/10 to-transparent",
      gradientMob: "bg-gradient-to-t from-main-blue/100 via-main-blue/15 to-transparent",
      img: "/articles/article_2.webp",
      tegsBgColor: "bg-main-amarant",
      textStyle: "lg:text-headline_1",
    },
    author: {
      name: "Ярослав Геращенко",
      src: "/review/profile2.jpg"
    },
    body: {
      blocks: [
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "<b>Стіна</b> - це родзинка красивого краю, у якому перетинаються культурні та природні елементи Наддністрянщини та Поділля. Тут живуть добрі та працьовиті люди, спілкування з якими може стати справжнім задоволенням. Тому ми запрошуємо вас сюди задовольнити свою унікальну потребу та насолодитись справжнім українським селом."
          }
        },
        {
          id: "h2-1",
          type: "header",
          data: {
            text: 'Фестиваль "Стіна запрошує"',
          }
        },
        {
          id: "video-1",
          type: "video",
          data: {
            provider: "youtube", // "youtube" | "instagram" | "facebook"
            url: "https://www.youtube.com/watch?v=-qeoYLRAxao",
            title: '"Stina Welcomes" Festival / Фестиваль "Стіна запрошує"',
            // опційно: якщо ти вже з беку даєш готове превʼю
            preview: ""
          }
        },
        {
          id: "p1",
          type: "paragraph",
          data: {
            text: "Ми раді, що проект досягнув своєї мети, а саме активізував місцеве населення, місцеву молодь, котра ще більше повірив в значний потенціал села. І він криється саме в них – молодих і впевнених лідерах. Також ми вдячні всім місцевим жителям, котрі створили це свято і котрі готові експериментувати у співпраці із командою Еко-Центра Стіна!"
          }
        },
      ]
    }
  },
] as const satisfies readonly Article[];
