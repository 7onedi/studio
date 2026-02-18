import type { RichTextItem } from "@/app/public/components/RenderRichText";

interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export interface MarkerInfo {
  id: string;
  position: [number, number];
  popupContent: {
    slug?: string;
    title: string;
    description?: string | string[] | RichTextItem[];
    imageUrl: string;
    linkUrl?: string;
    Logo?: string;
    gradient?: string;
    zoom?: boolean;
    iconNames?: { title: string; link: string }[];
    reviews?: {
        name: string;
        title: string;
        text: string;
        profileImg: string;
        links?: SocialLinks;
    }[];
  }
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
          description: ['<b>Село Стіна</b> — це затишне подільське село, яке вирізняється багатою історією, мальовничими краєвидами та глибоко вкоріненими народними традиціями.\n',
            'Стіна відома своїм самобутнім фольклором, традиціями, обрядами та пісенною спадщиною, що передаються з покоління в покоління. Поєднання природної краси, історичної пам’яті та активного громадського життя робить село унікальним та важливим осередком культури.\n\n',
            '<b>Молодіжний фольклорний клуб Стіна</b> — це сучасний культурно-освітній простір, створений з ініціативи активної молоді громади з метою збереження, дослідження та популяризації нематеріальної культурної спадщини рідного краю. Клуб діє у селі Стіна — мальовничому населеному пункті з багатою історією, глибокими народними традиціями та унікальною культурною самобутністю.\n',
            'Основним напрямом діяльності клубу є вивчення та відтворення українського фольклору: автентичних народних пісень, обрядових дійств, календарно-обрядових свят, місцевих звичаїв, традиційного одягу та елементів сільського побуту. Учасники клубу збирають усні свідчення старожилів, досліджують локальні традиції, відновлюють призабуті обряди й адаптують їх до сучасного культурного простору.\n\n',
            '<b>Клуб активно бере участь у культурному житті громади</b>: організовує та долучається до свят, фестивалів, тематичних заходів, майстер-класів, творчих зустрічей і виступів.\n',
            'Окремий напрям діяльності — популяризація фольклору через сучасні медіа. Клуб презентує свою роботу в соціальних мережах, поширює відео, фото та інформаційні матеріали, залучаючи ширшу аудиторію та формуючи сучасний образ традиційної культури.\n\n',
            'Соціальні мережі: <a href="https://stina.pangeya.org.ua/eco-center">@eco_center_stina</a>',
          ],
          imageUrl: '/mfk/mfkBaner/mfkBaner1.webp',
          linkUrl: '/Mfk/YFC-Stina',
          Logo: '/mfk/mfkLogo/mfkLogo1.png',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: false,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/eco_center_stina?igsh=MXN4MTFyenp3ZDFuYQ==" },
            { title: "facebook", link: "https://www.facebook.com/stinaecocenter" },
            { title: "tiktok", link: "https://www.tiktok.com/@stina_mfk?_t=ZM-8zX4oXqE3Jm&_r=1" },
            { title: "youtube", link: "https://www.youtube.com/channel/UCS9k8Er19EUxesrVPbLtE_w/videos" },
          ],
        },
      },
      {
        id: 'mfk-2',
        position: [49.039, 28.1085],
        popupContent: {
          slug: "YFC-Zhmerynka",
          title: 'МФК Жмеринка',
          description: [
            "🥰🇺🇦 <b>Жмеринка</b> - це місто, де перетинаються не лише залізничні колії, а й цілі пласти української та європейської історії. Це місце має свій особливий ритм, який задає один із найкрасивіших вокзалів України, що довгий час був «воротами» до Європи. Наш клуб працює в атмосфері цього постійного руху, де залізнична романтика переплітається з затишком подільського містечка, створюючи унікальне тло для творчості та медіа-досліджень.\n\n",
            "💙💛 <b>Наш клуб</b> - це простір для тих, хто хоче бачити більше за фасадами старих будівель. Ми фокусуємося на створенні авторських продуктів, що досліджують локальну ідентичність: від історій про залізничну велич минулого до портретів сучасників, які змінюють місто тут і зараз. Для нас важливо створювати якісний візуальний та текстовий продукт, який змусить глядача зупинитися і замислитися, так само як пасажири колись зупинялися на нашому славетному пероні.\n",
            "<b>Культурний контекст Жмеринки сьогодні</b> — це динамічний мікс провінційного затишку та креативного пошуку молоді. У своїх проєктах ми намагаємося дати голос місцевим ініціативам, підсвітити маловідомі локації та довести, що Жмеринка - це самобутній центр культурного життя Поділля. Наш клуб стає платформою, де юні медійники вчаться розповідати складні історії простою та зрозумілою мовою візуального мистецтва.\n\n",
            "Ми зберігаємо пам’ять, підтримуємо сучасні ініціативи і доводимо: <b>Жмеринка має свій голос</b> - і його має почути світ!\n",
          ],
          imageUrl: '/mfk/mfkBaner/mfkBaner2.webp',
          linkUrl: '/Mfk/YFC-Zhmerynka',
          Logo: '/mfk/mfkLogo/mfkLogo2.webp',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/folklore_zhmerynka?igsh=ZGFydGlwbnB6aTZu" },
            { title: "facebook", link: "https://www.facebook.com/profile.php?id=61585441253420" },
            { title: "tiktok", link: "https://www.tiktok.com/@folklore_zhmerynka" },
            { title: "youtube", link: "" },
          ],    
        },
      },
      {
        id: 'mfk-3',
        position: [48.2436, 28.287],
        popupContent: {
          slug: "YFC-Yampil",
          title: 'МФК Ямпіль',
          description: ['Ми – молодіжний фольклорний клуб Ямпільщини. Наш дім – це мальовничий Ямпіль🇺🇦 Це не просто місто, а справжня перлина над Дністром. Мальовничі пагорби, старовинні вулиці та легенди живуть у серцях людей❤️ Тут природа і культура переплелися так, що кожен куточок дихає історією та красою🦋 А ми тут, щоб оживляти це все для молоді й разом творити світле майбутнє🫶🏻'],
          imageUrl: '/mfk/mfkBaner/mfkBaner1.webp',
          linkUrl: '/Mfk/YFC-Yampil',
          Logo: '/map/mfk/mfk3.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/mfk.yampil?igsh=MWt5ejF4djl0eDhqMQ==" },
            { title: "facebook", link: "" },
            { title: "tiktok", link: "" },
            { title: "youtube", link: "" },
          ],
        },
      },
      {
        id: 'mfk-4',
        position: [48.67045, 28.83748],  // Тульчин
        popupContent: {
          slug: "YFC-Tulchyn",
          title: 'МФК Тульчин',
          description: ['Молодіжний фольклорний клуб «Тульчин» — це простір для творчої молоді, яка любить українську культуру, історію та сучасне мистецтво. Ми поєднуємо фольклор із театром, кіно та музикою, створюємо вистави, знімаємо фільми, відео й соціальні проєкти, у яких традиції оживають у сучасному форматі.',
            'Клуб об’єднує активних, креативних і небайдужих. Ми досліджуємо минуле рідного краю, розповідаємо його історії мовою мистецтва, беремо участь у культурних подіях, волонтерських ініціативах та підтримуємо ЗСУ. МФК «Тульчин» — це місце, де фольклор стає живим, а молодь творить майбутнє, спираючись на коріння.',
          ],
          imageUrl: '/mfk/mfkBaner/mfkBaner4.jpg',  // тут посилання на пост, але Instagram не дає прямої картинки з API — можна використати цей пост
          linkUrl: '/Mfk/YFC-Tulchyn',
          Logo: '/map/mfk/mfk2.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/tulchyn_youth_folklore_club?igsh=MWYweXB6dXFzcmd6eQ==" },
            { title: "facebook", link: "" },
            { title: "tiktok", link: "https://www.tiktok.com/@tulchyn_mfk?_r=1&_t=ZM-91B7cfIEmC0" },
            { title: "youtube", link: "https://youtube.com/channel/UCU9uXEgqfXIop9oUHUWtEbA?si=EZxZ1pymhazy3iTA" },
          ],
        },
      },
      {
        id: 'mfk-5',
        position: [48.3728, 29.5326],  // Бершадь
        popupContent: {
          slug: "YFC-Bershad",
          title: 'МФК Бершадь',
          description: ['<b>Молодіжний фольклорний клуб</b> — це місце, де традиції стають живими, а молодь творить зміни вже сьогодні. Ми про український фольклор, пісні, обряди та звичаї, але подаємо їх по-новому — щиро, яскраво й з енергією.',
            'Тут ми співаємо, танцюємо, відтворюємо традиції, вчимося один в одного та постійно пробуємо щось нове. У нашому клубі молодь розвивається на місці: знаходить друзів, відкриває таланти, стає впевненішою та активною частиною своєї громади.',
            'Ми організовуємо фольклорні події, виступи, майстер-класи, свята, творчі зустрічі та багато інших активностей, які об’єднують і надихають. Для нас традиції — не музей, а живий рух, який можна відчувати, проживати і передавати далі.',
            'Якщо тобі близька українська культура, драйвова атмосфера та бажання творити — тобі точно до нас. <b>Долучайся й роби наше місто ще яскравішим разом з нами!</b> ✨🇺🇦'
          ],
          imageUrl: '/mfk/mfkBaner/mfkBaner1.webp',  // можна глянути відео чи фото
          linkUrl: '/Mfk/YFC-Bershad',
          Logo: '/map/mfk/mfk1.png',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/mfk_bershad?igsh=MXdiN2hwaGtsOXQ0eA==" },
            { title: "facebook", link: "" },
            { title: "tiktok", link: "" },
            { title: "youtube", link: "" },
            
          ],
        },
      },
      {
        id: 'mfk-6',
        position: [49.107373, 28.691632],  // приблизні координати Вороновиця
        popupContent: {
          slug: "YFC-Voronovytsia",
          title: 'МФК Вороновиця',
          description: ['🌿 Розпочинаємо роботу Молодіжного фольклорного клубу Вороновицької громади! 🌿 Молодіжний фольклорний клуб (МФК) – це про нашу історію, культуру, традиції та зв’язок поколінь. Тут ми не просто вивчаємо минуле – ми оживляємо його в сучасності, співаємо старовинні пісні, ділимося ремеслами та зберігаємо духовні скарби громади.'],  
          imageUrl: '/mfk/mfkBaner/mfkBaner2.webp',  // не знайшов публікацій, які точно належать МФК Вороновиця
          linkUrl: '/Mfk/YFC-Voronovytsia',
          Logo: '/map/mfk/mfk5.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/mfk_voron?igsh=NmdmcTE2bTdvNHo4&utm_source=qr" },
            { title: "facebook", link: "" },
            { title: "tiktok", link: "" },
            { title: "youtube", link: "" },
            
          ],
        },
      },
      {
        id: 'mfk-7',
        position: [ 48.82770, 28.94194],  // Брацлав
        popupContent: {
          slug: "YFC-Bratslav",
          title: 'МФК Брацлав',
          description: ['МФК Брацлав 🌻 Творимо нові ідеї, відроджуємо старі традиції 🎵🎬 Молодь, яка пишається своє культурою 💫 Стань частиною нашої команди!⚡️'],  
          imageUrl: '/mfk/mfkBaner/mfkBaner1.webp',
          linkUrl: '/Mfk/YFC-Bratslav',
          Logo: '/map/mfk/mfk7.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/youth.wave_?igsh=Z3BwbGRyMjk0ZjBh" },
            { title: "facebook", link: "" },
            { title: "tiktok", link: "" },
            { title: "youtube", link: "" },
            
          ],
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
          Logo: '/map/mfk/mfk8.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/youthfolkclub_larga/" },
            { title: "facebook", link: "" },
            { title: "tiktok", link: "https://www.tiktok.com/@youth.folkclub_la" },
            { title: "youtube", link: "" },
            
          ],
        }
      },
      {
        id: 'mfk-9',
        position: [ 47.85867348574443, 28.382760428836058],
        popupContent: {
          slug: "YFC-Ghindesti",
          title: 'МФК Гіндешть',
          description: ['Офіційна Молодіжна асоціація Гіндесті💯 / Asociația tinerilor din Ghindesti oficiall💯'],  
          imageUrl: '/mfk/mfkBaner/mfkBaner3.webp',
          linkUrl: '/Mfk/YFC-Ghindesti',
          Logo: '/map/mfk/mfk9.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/yfc.ghindesti?igsh=eW1lM3l4ejZ4eDNt" },
            { title: "facebook", link: "" },
            { title: "tiktok", link: "https://www.tiktok.com/@youth.club.ghinde" },
            { title: "youtube", link: "" },
            
          ],
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
          Logo: '/map/mfk/mfk10.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/racaria_fs/" },
            { title: "facebook", link: "https://www.facebook.com/profile.php?id=61577867880160 " },
            { title: "tiktok", link: "" },
            { title: "youtube", link: "" },
            
          ],
        }
      },
      {
        id: 'mfk-11',
        position: [ 47.775326715304004, 27.517800882803332],
        popupContent: {
          slug: "YFC-Glodeni-1",
          title: 'МФК Глодяни 1',
          description: '',  
          imageUrl: '/mfk/mfkBaner/mfkBaner3.webp',
          linkUrl: '/Mfk/YFC-Glodeni-1',
          Logo: '/map/mfk/mfk11.jpg',
          gradient: "bg-gradient-to-t from-main-blue/100 via-main-blue/45 to-transparent",
          zoom: true,
          iconNames: [
            { title: "instagram", link: "https://www.instagram.com/centru_de_tineret_glodeni" },
            { title: "facebook", link: "" },
            { title: "tiktok", link: "" },
            { title: "youtube", link: "" },
          ],
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
          slug: "yi-2017",
          title: 'Youthinsight 2017',
          description: ['Фестиваль аматорського медіа Youthinsight це щорічна подія, яка збирає молодь та любителів виробництва різноманітного медіа самотужки. Ця подія – міжкультурне свято, адже організатори фестивалю – волонтери європейської волонтерської служби та корпусу солідарності.'],
          imageUrl: '/map/youthinsight/youthinsight1.jpg', // пост/івент (оголошення)
          linkUrl: 'https://www.facebook.com/events/2092904964335230/',
          Logo: '/festivals/2017.webp',
          zoom: true,
          reviews: [
            {
              name: "Ярослав Геращенко",
              title: "Програмний координатор",
              text: '"Працювати із молоддю за темою аматорського медіа - це дуже захоплююче..."',
              profileImg: "/review/profile2.jpg",
              links: { facebook: "#", instagram: "#", tiktok: "#" },
            },
            {
              name: "Ася Козлова",
              title: "Менеджерка проєкту #countrysidestudio",
              text: '"Мені подобається проєкт #countrysidestudio..."',
              profileImg: "/review/profile3.jpg",
            },
            {
              name: "Jules Marquet",
              title: "Volunteer MOZAIKA author",
              text: '"Before arriving in Ukraine I had little knowledge..."',
              profileImg: "/review/profile1.jpg",
            },
            {
              name: "Вероніка Шевчук",
              title: "Учасниця проекту #Countrysidestudio",
              text: '"Проєкт #countrysidestudio є неперевершеним досвідом..."',
              profileImg: "/review/profile4.jpg",
            },
            {
              name: "Ярослав Геращенко",
              title: "Програмний координатор",
              text: '"Працювати із молоддю за темою аматорського медіа - це дуже захоплююче..."',
              profileImg: "/review/profile2.jpg",
              links: { facebook: "#", instagram: "#", tiktok: "#" },
            },
          ],
        },
      },
      {
        id: 'yi-2',
        position: [49.23426822, 28.46456876], // Молодіжний центр "Квадрат", вул. Театральна, 15, Вінниця
        popupContent: {
          slug: "yi-2018",
          title: 'Youthinsight 2018',
          description: ['Фестиваль аматорського медіа Youthinsight це щорічна подія, яка збирає молодь та любителів виробництва різноманітного медіа самотужки. Ця подія – міжкультурне свято, адже організатори фестивалю – волонтери європейської волонтерської служби та корпусу солідарності.'],
          imageUrl: '/map/youthinsight/youthinsight1.jpg', // пост/івент (оголошення)
          linkUrl: 'https://www.facebook.com/events/2092904964335230/',
          Logo: '/festivals/2018.webp',
          zoom: true,
        },
      },
      {
        id: 'yi-3',
        position: [49.23426822, 28.46456876], // Молодіжний центр "Квадрат", вул. Театральна, 15, Вінниця
        popupContent: {
          slug: "yi-2019",
          title: 'Youthinsight 2019',
          description: ['Фестиваль аматорського медіа Youthinsight це щорічна подія, яка збирає молодь та любителів виробництва різноманітного медіа самотужки. Ця подія – міжкультурне свято, адже організатори фестивалю – волонтери європейської волонтерської служби та корпусу солідарності.'],
          imageUrl: '/map/youthinsight/youthinsight1.jpg', // пост/івент (оголошення)
          linkUrl: 'https://www.facebook.com/events/2092904964335230/',
          Logo: '/festivals/2019.webp',
          zoom: true,
        },
      },
      {
        id: 'yi-4',
        position: [49.23426822, 28.46456876], // Молодіжний центр "Квадрат", вул. Театральна, 15, Вінниця
        popupContent: {
          slug: "yi-2020",
          title: 'Youthinsight 2020',
          description: ['Фестиваль аматорського медіа Youthinsight це щорічна подія, яка збирає молодь та любителів виробництва різноманітного медіа самотужки. Ця подія – міжкультурне свято, адже організатори фестивалю – волонтери європейської волонтерської служби та корпусу солідарності.'],
          imageUrl: '/map/youthinsight/youthinsight1.jpg', // пост/івент (оголошення)
          linkUrl: 'https://www.facebook.com/events/2092904964335230/',
          Logo: '/festivals/2020.webp',
          zoom: true,
        },
      },
      {
        id: 'yi-5',
        position: [49.23426822, 28.46456876], // Молодіжний центр "Квадрат", вул. Театральна, 15, Вінниця
        popupContent: {
          slug: "yi-2021",
          title: 'Youthinsight 2021',
          description: ['Фестиваль аматорського медіа Youthinsight це щорічна подія, яка збирає молодь та любителів виробництва різноманітного медіа самотужки. Ця подія – міжкультурне свято, адже організатори фестивалю – волонтери європейської волонтерської служби та корпусу солідарності.'],
          imageUrl: '/map/youthinsight/youthinsight1.jpg', // пост/івент (оголошення)
          linkUrl: 'https://www.facebook.com/events/2092904964335230/',
          Logo: '/festivals/2021.webp',
          zoom: true,
        },
      },
    ],
  },
  {
    id: 'mozaika',
    name: 'mozaika',
    icon: '/map/Mark3.png',
    color: 'text-purple-600',
    center: [49.233607671530386, 28.442222437175693], 
    zoom: 13,
    markers: [
      {
        id: 'mozaika-1',
        position: [49.233607671530386, 28.44222243717569], // координати, вказані на сторінці "Як доїхати" Еко-центру Стіна (Pangeya)
        popupContent: {
          slug: "",
          title: 'MOZAЇKA / Pangeya — (Mozaika в с. Стіна / Еко-центр Стіна)',
          description: ['Mozaїka — журнал / проєкт Pangeya Ultima та міжкультурної молодіжної студії; частина активностей (презентації, табори, воркшопи) проходили в Еко-центрі Стіна (Томашпільська ТГ).'],
          imageUrl: 'https://www.facebook.com/pangeyaultima/posts/', // посилання на пости/випуски Mozaїka на сторінці Pangeya (пост про Mozaїka #8 та активності в Стині)
          linkUrl: 'https://ngo.pangeya.org.ua/' ,
          Logo: '',
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
          description: ['Movers & Shakers — мережа/серія нетворкінг-івентів. Одна з подій — Paddington Pow-Wow (Wilde Aparthotels, 4 North Wharf Road, London). Використовуємо цю локацію як приклад для об’єкта "Movers & Shakers".'],
          imageUrl: 'https://moversandshakers.events/', // сторінка подій/афіша
          linkUrl: 'https://moversandshakers.events/',
          Logo: '',
        },
      }
    ],
  },
];