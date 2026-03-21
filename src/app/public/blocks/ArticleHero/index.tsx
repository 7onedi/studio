import Image from "next/image";
import { TagButton } from "@/app/public/blocks/BlogSlider/BlogCard";
import { Avatar } from "@mui/material";


type ArticleHeroProps = {
  title: string;
  image: string;

  tags?: readonly string[];

  category?: string;
  subCategory?: string;

  tegsBgColor?: string;
  date?: string;
  gradient?: string;
  creator?: { name: string; src: string };
};

export default function ArticleHero({
  title,
  image,
  tags = [],
  category,
  subCategory,
  tegsBgColor,
  date,
  gradient,
  creator = { name: "", src: "" },
}: ArticleHeroProps) {
const categoryTags = Array.from(
  new Set([category, subCategory].filter(Boolean))
) as string[];

const tagTags = Array.from(
  new Set([...(tags ?? [])].filter(Boolean))
) as string[];

  const formattedDate = formatDate(date ?? "");

    function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  const formattedDate = formatDate(date ?? "");

    function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div>
      <section className="bg-transparent relative w-full h-[700px] mb-8 lg:mb-16 overflow-hidden rounded-3xl">
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="h-[700px] w-full object-cover"
        />

        {gradient && <div className={`absolute inset-0 ${gradient}`} />}

        <div className="absolute lg:bottom-8 inset-0 flex flex-col justify-end items-center px-8 lg:px-16">
          <div className="lg:mb-8 text-white text-headline_1_mobile lg:text-headline_1">
            {title}
          </div>

          <div className="invisible lg:visible px-20 flex flex-row grid grid-cols-12 w-full gap-8 lg:gap-16">
            <div className="hidden lg:flex flex-row items-center col-span-4 lg:col-span-4 gap-4">
              <div className="h-[80px] rounded-full w-[80px] relative mb-4 overflow-hidden">
                {creator?.src ? (
                  <Image
                    src={creator.src}
                    alt={creator.name}
                    fill
                    priority
                    className="object-cover"
                  />
                ) : (
                  <Avatar
                    src="/images/profile/user-1.jpg"
                    sx={{ width: 80, height: 80 }}
                  />
                )}
              </div>
              <div className="text-Headline_5_mobile lg:text-Headline_5 text-white text h-auto">
                <span>Автор:</span>
                <div>
                  <b>{creator?.name}</b>
                </div>
              </div>
            </div>

              {(categoryTags.length > 0 || tagTags.length > 0) && (
                <div className="flex justify-center items-center col-span-4 lg:col-span-4">
                  <div className="flex flex-wrap justify-center gap-3">
                    {categoryTags.map((tag, i) => (
                      <TagButton
                        key={`cat-${tag}-${i}`}
                        tag={tag}
                        ClassName="bg-main-amarant hover:bg-main-amarant/80 whitespace-nowrap"
                      />
                    ))}
                    {tagTags.map((tag, i) => (
                      <TagButton
                        key={`tag-${tag}-${i}`}
                        tag={tag}
                        ClassName="bg-main-blue hover:bg-main-blue/80 whitespace-nowrap"
                      />
                    ))}
                  </div>
                </div>
              )}


            <div className="text-right relative flex justify-end items-center col-span-4 lg:col-span-4">
              {date && (
                <span className="mb-4 text-Headline_5_mobile lg:text-Headline_5 text-white">
                  <b>{formattedDate}</b>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="lg:hidden grid grid-cols-12 w-full">
        {(categoryTags.length > 0 || tagTags.length > 0) && (
          <div className="flex justify-center items-center col-span-12 lg:col-span-4 gap-2">
            <div className="grid grid-cols-2">
              {categoryTags.map((tag, i) => (
                <span key={`cat-${tag}-${i}`} className="mb-3 mr-3 col-span-1">
                  <TagButton
                    tag={tag}
                    ClassName="bg-main-amarant hover:bg-main-amarant/80 text-button"
                  />
                </span>
              ))}
              {tagTags.map((tag, i) => (
                <span key={`tag-${tag}-${i}`} className="mb-3 mr-3 col-span-1">
                  <TagButton
                    tag={tag}
                    ClassName="bg-main-blue hover:bg-main-blue/80 text-button"
                  />
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-row items-center col-span-6 lg:col-span-4 gap-4">
          <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full shrink-0">
            {creator?.src ? (
              <Image
                src={creator.src}
                alt={creator.name}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <Avatar
                src="/images/profile/user-1.jpg"
                sx={{ width: 80, height: 80 }}
              />
            )}
          </div>

          <div className="text-Headline_5_mobile lg:text-Headline_5 h-auto">
            <b>Автор:</b>
            <div>
              <b>{creator?.name}</b>
            </div>
          </div>
        </div>

        <div className="text-right relative flex justify-end items-center col-span-6 lg:col-span-4">
          {date && (
            <span className="mb-4 text-Headline_5_mobile lg:text-Headline_5">
              <b>{formattedDate}</b>
            </span>
          )}
        </div>
      </div>
   </div>
  );
}
