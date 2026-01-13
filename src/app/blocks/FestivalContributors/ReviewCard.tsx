import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/Button";
import { SvgIcon } from "@components/SvgIcon";

interface Review {
  name: string;
  title: string;
  text: string;
  profileImg: string;
  links?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

export default function ReviewCard({
  name,
  title,
  text,
  profileImg,
  links,
}: Review) {
  return (
    <div className="my-6 lg:my-0 flex flex-col items-center text-center">
      {/* IMAGE */}
      <div className="relative w-[280px] aspect-[3/4] rounded-[28px] overflow-hidden">
        <Image src={profileImg} alt={name} fill className="object-cover" />
      </div>

      {/* NAME */}
      <h3 className="mt-6 text-lg font-semibold text-main-blue">
        {name}
      </h3>

      {/* TITLE */}
      <p className="text-sm text-gray-500 mt-1">{title}</p>

      {/* LINE */}
      <div className="w-full h-px bg-red-500 my-4" />

            {/* SOCIAL LINKS */}
        <div className="w-full h-4 flex justify-center">
            {links && (
                <div className="flex gap-2 mt-4">
                {links.facebook && (
                    <Link href={links.facebook} className="flex items-center">
                    <Button
                        variant="accent-alt"
                        iconOnly
                        className="shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200"
                    >
                        <SvgIcon name="facebook" size={24} color="main-blue" />
                    </Button>
                    </Link>
                )}

                {links.instagram && (
                    <Link href={links.instagram} className="flex items-center">
                    <Button
                        variant="accent-alt"
                        iconOnly
                        className="shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200"
                    >
                        <SvgIcon name="instagram" size={24} color="main-blue" />
                    </Button>
                    </Link>
                )}

                {links.tiktok && (
                    <Link href={links.tiktok} className="flex items-center">
                    <Button
                        variant="accent-alt"
                        iconOnly
                        className="shadow-[0_4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_8px_rgba(0,0,0,0.3)] transition-shadow hover:bg-gray-200"
                    >
                        <SvgIcon name="tiktok" size={24} color="main-blue" />
                    </Button>
                    </Link>
                )}
                </div>
            )}
        </div>
      
    </div>
  );
}
