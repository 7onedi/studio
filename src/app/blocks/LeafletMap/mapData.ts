export interface MarkerInfo {
  id: string;
  position: [number, number];
  popupContent: {
    slug?: string;
    title: string;
    description?: string;
    imageUrl: string;
    linkUrl?: string;
    mfkLogo?: string;
    gradient?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Шлях до зображення іконки (наприклад, '/map/Mark1.png')
  color: string; // Колір Tailwind CSS
  center: [number, number]; // [lat, lng] для центрування
  zoom: number;            // Рівень зуму для цієї категорії
  markers: MarkerInfo[];
}

// Конфігурація для стану "Показати всі" (для широкого огляду)
export const ALL_CATEGORIES_VIEW = {
    // !!! FIX: as const гарантує, що це кортеж [number, number]
    center: [49.0, 20.6] as const, 
    zoom: 5,
};

export const initialCategories: Category[] = [
  {
    id: '#mfk',
    name: '#mfk',
    icon: '/map/Mark1.png',
    color: 'text-red-600',
    center: [48.67045, 28.83748],
    zoom: 8,
    markers: [
      {
        id: 'mfk-1',
        position: [48.45262, 28.42077],
        popupContent: {
          slug: "YFC-Stina",
          title: 'МФК Стіна',
          description: 'Молодіжний Фольклорний Клуб в Стіні повертається🥳 Тепер в оновленому складі, ми готові взяти участь в збережені та популяризації нашої культурної та традиційної спадщини. Село Стіна багате на важливу історію, цінну культуру та особливі традиції, які притаманні нашому регіону.',
          imageUrl: '/mfk/mfkBaner/mfkBaner1.webp',
          linkUrl: '/Mfk/YFC-Stina',
          mfkLogo: '/mfk/mfkLogo/mfkLogo1.png',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        },
      },
      {
        id: 'mfk-2',
        position: [49.039, 28.1085],
        popupContent: {
          slug: "YFC-Zhmerynka",
          title: 'МФК Жмеринка',
          description: 'У Жмеринці стартував Молодіжний фольклорний клуб!! 😍🇺🇦🫶🏻У нашому місті розпочав роботу Молодіжний фольклорний клуб (МФК Жмеринка) - простір для тих, хто хоче відкрити для себе багатство українських традицій, пісень, танців та народної творчості.',
          imageUrl: '/mfk/mfkBaner/mfkBaner2.webp',
          linkUrl: '/Mfk/YFC-Zhmerynka',
          mfkLogo: '/map/mfk/mfk6.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        },
      },
      {
        id: 'mfk-3',
        position: [48.2436, 28.287],
        popupContent: {
          slug: "YFC-Yampil",
          title: 'МФК Ямпіль',
          description: 'Ми – молодіжний фольклорний клуб Ямпільщини. Наш дім – це мальовничий Ямпіль🇺🇦 Це не просто місто, а справжня перлина над Дністром. Мальовничі пагорби, старовинні вулиці та легенди живуть у серцях людей❤️ Тут природа і культура переплелися так, що кожен куточок дихає історією та красою🦋 А ми тут, щоб оживляти це все для молоді й разом творити світле майбутнє🫶🏻',
          imageUrl: '/mfk/mfkBaner/mfkBaner1.webp',
          linkUrl: '/Mfk/YFC-Yampil',
          mfkLogo: '/map/mfk/mfk3.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        },
      },
      {
        id: 'mfk-4',
        position: [48.67045, 28.83748],  // Тульчин
        popupContent: {
          slug: "YFC-Tulchyn",
          title: 'МФК Тульчин',
          description: '✨ Молодіжний фольклорний клуб Тульчина ✨ Тут ми зберігаємо традиції та творимо нову історію 💃🪗 Співи, танці, обряди й душевна атмосфера',  
          imageUrl: '/mfk/mfkBaner/mfkBaner2.webp',  // тут посилання на пост, але Instagram не дає прямої картинки з API — можна використати цей пост
          linkUrl: '/Mfk/YFC-Tulchyn',
          mfkLogo: '/map/mfk/mfk2.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        },
      },
      {
        id: 'mfk-5',
        position: [48.3728, 29.5326],  // Бершадь
        popupContent: {
          slug: "YFC-Bershad",
          title: 'МФК Бершадь',
          description: '✨Молодіжний фольклорний клуб✨ 🎶 Збереження та розвиток української культури й традицій Приєднуйся — разом зробимо Бершадь ще яскравішою!✨',  
          imageUrl: '/mfk/mfkBaner/mfkBaner1.webp',  // можна глянути відео чи фото
          linkUrl: '/Mfk/YFC-Bershad',
          mfkLogo: '/map/mfk/mfk1.png',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        },
      },
      {
        id: 'mfk-6',
        position: [49.107373, 28.691632],  // приблизні координати Вороновиця
        popupContent: {
          slug: "YFC-Voronovytsia",
          title: 'МФК Вороновиця',
          description: '🌿 Розпочинаємо роботу Молодіжного фольклорного клубу Вороновицької громади! 🌿 Молодіжний фольклорний клуб (МФК) – це про нашу історію, культуру, традиції та зв’язок поколінь. Тут ми не просто вивчаємо минуле – ми оживляємо його в сучасності, співаємо старовинні пісні, ділимося ремеслами та зберігаємо духовні скарби громади.',  
          imageUrl: '/mfk/mfkBaner/mfkBaner2.webp',  // не знайшов публікацій, які точно належать МФК Вороновиця
          linkUrl: '/Mfk/YFC-Voronovytsia',
          mfkLogo: '/map/mfk/mfk5.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        },
      },
      {
        id: 'mfk-7',
        position: [ 48.82770, 28.94194],  // Брацлав
        popupContent: {
          slug: "YFC-Bratslav",
          title: 'МФК Брацлав',
          description: 'МФК Брацлав 🌻 Творимо нові ідеї, відроджуємо старі традиції 🎵🎬 Молодь, яка пишається своє культурою 💫 Стань частиною нашої команди!⚡️',  
          imageUrl: '/mfk/mfkBaner/mfkBaner1.webp',
          linkUrl: '/Mfk/YFC-Bratslav',
          mfkLogo: '/map/mfk/mfk7.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        }
      },
      {
        id: 'mfk-8',
        position: [ 48.369281075685244, 26.83799604232788],
        popupContent: {
          slug: "YFC-Larga",
          title: 'МФК Ларга',
          description: '',  
          imageUrl: '/mfk/mfkBaner/mfkBaner3.webp',
          linkUrl: '/Mfk/YFC-Larga',
          mfkLogo: '/map/mfk/mfk8.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        }
      },
      {
        id: 'mfk-9',
        position: [ 47.85867348574443, 28.382760428836058],
        popupContent: {
          slug: "YFC-Ghindesti",
          title: 'МФК Гіндешть',
          description: 'Офіційна Молодіжна асоціація Гіндесті💯 / Asociația tinerilor din Ghindesti oficiall💯',  
          imageUrl: '/mfk/mfkBaner/mfkBaner3.webp',
          linkUrl: '/Mfk/YFC-Ghindesti',
          mfkLogo: '/map/mfk/mfk9.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        }
      },
      {
        id: 'mfk-10',
        position: [ 47.91471049858973, 27.610583674834103],
        popupContent: {
          slug: "YFC-Racaria",
          title: 'МФК Рекерія',
          description: '',  
          imageUrl: '/mfk/mfkBaner/mfkBaner3.webp',
          linkUrl: '/Mfk/YFC-Racaria',
          mfkLogo: '/map/mfk/mfk10.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        }
      },
      {
        id: 'mfk-11',
        position: [ 47.775326715304004, 27.517800882803332],
        popupContent: {
          slug: "YFC-Glodeni",
          title: 'МФК Глодяни',
          description: '',  
          imageUrl: '/mfk/mfkBaner/mfkBaner3.webp',
          linkUrl: '/Mfk/YFC-Glodeni',
          mfkLogo: '/map/mfk/mfk11.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
        }
      },
    ],
  },
  {
    id: 'youthinsight',
    name: 'Youthinsight фестиваль',
    icon: '/map/Mark2.png',
    color: 'text-pink-600',
    center: [49.23426822, 28.46456876], 
    zoom: 16,
    markers: [
      {
        id: 'yi-1',
        position: [49.23426822, 28.46456876], // Молодіжний центр "Квадрат", вул. Театральна, 15, Вінниця
        popupContent: {
          slug: "",
          title: 'Youthinsight фестиваль (Vinnytsia) — Youthinsight',
          description: 'Фестиваль аматорського медіа Youthinsight це щорічна подія, яка збирає молодь та любителів виробництва різноманітного медіа самотужки. Ця подія – міжкультурне свято, адже організатори фестивалю – волонтери європейської волонтерської служби та корпусу солідарності.',
          imageUrl: '/map/youthinsight/youthinsight1.jpg', // пост/івент (оголошення)
          linkUrl: 'https://www.facebook.com/events/2092904964335230/',
          mfkLogo: '',
        },
      }
    ],
  },
  {
    id: 'mozaika',
    name: 'mozaika',
    icon: '/map/Mark3.png',
    color: 'text-purple-600',
    center: [48.455, 28.43], 
    zoom: 13,
    markers: [
      {
        id: 'mozaika-1',
        position: [48.455419, 28.417462], // координати, вказані на сторінці "Як доїхати" Еко-центру Стіна (Pangeya)
        popupContent: {
          slug: "",
          title: 'MOZAЇKA / Pangeya — (Mozaika в с. Стіна / Еко-центр Стіна)',
          description: 'Mozaїka — журнал / проєкт Pangeya Ultima та міжкультурної молодіжної студії; частина активностей (презентації, табори, воркшопи) проходили в Еко-центрі Стіна (Томашпільська ТГ).',
          imageUrl: 'https://www.facebook.com/pangeyaultima/posts/', // посилання на пости/випуски Mozaїka на сторінці Pangeya (пост про Mozaїka #8 та активності в Стині)
          linkUrl: 'https://ngo.pangeya.org.ua/' ,
          mfkLogo: '',
        },
      }
    ],
  },
  {
    id: 'movers&shakers',
    name: 'Movers&Shakers',
    icon: '/map/Mark4.png',
    color: 'text-blue-600',
    center: [51.51935, -0.17330], 
    zoom: 15,
    markers: [
      {
        id: 'ms-1',
        position: [51.51935, -0.17330], // Wilde Aparthotels, London Paddington (адреса події: 4 North Wharf Road, W2 1NW)
        popupContent: {
          slug: "",
          title: 'Movers & Shakers — Paddington Pow-Wow (example event location)',
          description: 'Movers & Shakers — мережа/серія нетворкінг-івентів. Одна з подій — Paddington Pow-Wow (Wilde Aparthotels, 4 North Wharf Road, London). Використовуємо цю локацію як приклад для об’єкта "Movers & Shakers".',
          imageUrl: 'https://moversandshakers.events/', // сторінка подій/афіша
          linkUrl: 'https://moversandshakers.events/',
          mfkLogo: '',
        },
      }
    ],
  },
];