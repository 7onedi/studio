import Image from "next/image";
import Link from "next/link";
import { TagButton } from "@blocks/BlogSlider/BlogCard";

type ArticleHeroProps = {
  title: string;
  image: string;
  tags?: readonly string[];
  tegsBgColor?: string;
  date?: string;
  gradient?: string;
  gradientMob?: string;
  creator?: { name: string; src: string };
};

export default function ArticleHero({
  title,
  image,
  tags = [],
  tegsBgColor,
  date,
  gradient,
  gradientMob,
  creator = {
    name : "",
    src : "",
  },
}: ArticleHeroProps) {
  return (
    <div>
    <section className="bg-transparent lg:mt-20 relative w-full h-[700px] mb-8 lg:mb-16 overflow-hidden rounded-3xl">
      {/* IMAGE */}
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="h-[700px] w-full object-cover"
      />

      {/* GRADIENT */}
      {gradient && (
        <div className={`absolute inset-0 ${gradientMob}`} />
      )}

      {/* CONTENT */}
      <div className="absolute bottom-8 inset-0 flex flex-col justify-end items-center px-8 lg:px-16">

        <div className="mb-8 text-white text-headline_1_mobile lg:text-headline_1">
          {title}
        </div>

        <div className="hidden lg:flex px-20 flex flex-row grid grid-cols-12 w-full gap-8 lg:gap-16">
          <div className="flex flex-row items-center col-span-6 lg:col-span-4 gap-4">
            <div className="h-[80px] rounded-full w-[80px] relative mb-4 overflow-hidden">
              <Image
                src={creator?.src}
                alt={creator?.name}
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="text-Headline_5_mobile lg:text-Headline_5 text-white text h-auto">
              <b>Автор:</b>
              <div><b>{creator?.name}</b> </div>
            </div>
          </div>

        {tags.length > 0 && (
          <div className="flex justify-center items-center col-span-6 lg:col-span-4 gap-2">
            <div className="">
              {tags.map((tag, i) => (
                <span key={i} className="mr-3">
                  <TagButton tag={tag} ClassName={`${tegsBgColor} hover:${tegsBgColor}/80 text-button`}/>
                </span>
              ))}
            </div>            
          </div>

        )}
          <div className="text-right relative flex justify-end items-center col-span-6 lg:col-span-4">
            {date && (
              <span className="mb-4 text-Headline_5_mobile lg:text-Headline_5 text-white">
                <b>{date}</b>
              </span>
            )}        
          </div>
        </div>
      </div>
    </section>
    <div className="lg:hidden grid grid-cols-12 w-full">
      {tags.length > 0 && (
        <div className="flex justify-center items-center col-span-12 lg:col-span-4 gap-2">
          <div className="grid grid-cols-2">
            {tags.map((tag, i) => (
              <span key={i} className="mb-3 mr-3 col-span-1">
                <TagButton tag={tag} ClassName={`${tegsBgColor} hover:${tegsBgColor}/80 text-button`}/>
              </span>
            ))}
          </div>            
        </div>
      )}
      <div className="mt-4 flex flex-row items-center col-span-6 lg:col-span-4 gap-4">
        <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full shrink-0">
          <Image
            src={creator?.src ?? ""}
            alt={creator?.name ?? ""}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="text-Headline_5_mobile lg:text-Headline_5 h-auto">
          <b>Автор:</b>
          <div><b>{creator?.name}</b></div>
        </div>
      </div>


        <div className="text-right relative flex justify-end items-center col-span-6 lg:col-span-4">
          {date && (
            <span className="mb-4 text-Headline_5_mobile lg:text-Headline_5">
              <b>{date}</b>
            </span>
          )}        
        </div>
      </div>
    </div>
  );
}
