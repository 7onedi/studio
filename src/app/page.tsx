import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <div className="max-w-md">
        <Image 
          src="/logo.png" 
          alt="Логотип" 
          width={256} 
          height={256} 
          className="mx-auto"
        />
        <h1 className="mt-4 text-2xl font-semibold text-gray-800">Сайт у розробці</h1>
        <p className="mt-2 text-gray-600">Ми працюємо над оновленням. Заходьте пізніше!</p>
      </div>
    </div>
  );
}