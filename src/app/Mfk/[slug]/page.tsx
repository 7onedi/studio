import Image from "next/image";
import { initialCategories } from "@blocks/LeafletMap/mapData";
import BlogSlider from "@blocks/BlogSlider";
import MfkList from "@blocks/MfkList";

interface MfkPageProps {
  params: Promise<{
    slug?: string;
  }>;
}

const mfkCategory = initialCategories.find(c => c.id === "#mfk")!;

export default async function MfkPage({ params }: MfkPageProps) {
  const { slug } = await params;

  // знаходимо маркер по slug
  let mfk;
  for (const category of initialCategories) {
    const found = category.markers.find(
      (marker) => marker.popupContent.slug === slug
    );
    if (found) {
      mfk = found.popupContent;
      break;
    }
  }

  if (!mfk) {
    return (
      <div className="p-8 text-center text-xl font-semibold">
        MFK не знайдено
      </div>
    );
  }

  const otherMfkMarkers = mfkCategory.markers.filter(
    (marker) => marker.popupContent.slug !== slug
  );

  return (
    <div className="mx-auto">
<div className="relative mb-16 lg:mb-0">
  {/* Основне фото */}
  <div className="relative w-full h-[145px] lg:h-[700px] mb-6 rounded-[20px] overflow-hidden">
    <Image
      src={mfk.imageUrl}
      alt={mfk.title}
      fill
      className="object-cover"
      priority
    />
    {mfk.gradient && (
      <div className={`absolute inset-0 ${mfk.gradient}`} />
    )}
  </div>

  {/* Лого + заголовок */}
  <div className="-bottom-[40px] w-full absolute lg:bottom-0 lg:left-16 lg:bottom-16 z-20 flex flex-col-reverse lg:flex-row items-start lg:items-center">

    {mfk.mfkLogo && (
      <div className="flex justify-center w-full lg:w-[376px] h-auto rounded-[20px] overflow-hidden">
        <img
          src={mfk.mfkLogo}
          alt="MFK logo"
          className="w-auto h-[65px] lg:w-[376px] lg:h-auto object-cover rounded-[20px]"
        />
      </div>
    )}

    <div className="mb-5 lg:mb-0 lg:mt-4 text-white text-center text-headline_2_mobile lg:text-headline_1 w-full lg:flex lg:ml-6">
      {mfk.title}
    </div>
  </div>
</div>



      <div className="mt-8 flex justify-center">
        <p className="text-headline_4_mobile lg:text-headline_4">Про МФК</p>
      </div>

      {mfk.description && (
        <p className="mt-4 text-body_mobole lg:text-body">
          {mfk.description}
        </p>
      )}

      <div className="my-8">
        <BlogSlider />
      </div>

      <div className="my-12 lg:mt-16 px-4 lg:px-0">
        <MfkList markers={otherMfkMarkers} />
      </div>
    </div>
  );
}
