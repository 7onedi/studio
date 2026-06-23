import DonorsSection from "./DonorsSection";
import PartnersSection from "./PartnersSection";
import JoinForm from "@/app/public/blocks/JoinForm";
import ClientBg from "@/app/public/providers/ClientBg";
import TranslatedText from "@components/TranslatedText";

export default async function PartnersPage() {
  return (
    <>
      <ClientBg bg="alt" />
      <main className="lg:mt-16 bg-transparent">
        <h1 className="my-6 text-headline_1_mobile lg:text-headline_1 font-semibold text-main-text md:text-4xl text-center">
          <TranslatedText tKey="partners_data.topic" />
        </h1>

        <h2 className="lg:mt-20 mb-4 text-center text-headline_2_mobile lg:text-headline_3">
          <TranslatedText tKey="partners_data.subtitle1" />
        </h2>

        <DonorsSection />

        <h2 className="mt-8 lg:mt-24 text-center text-headline_3_mobile lg:text-headline_3">
          <TranslatedText tKey="partners_data.subtitle2" />
        </h2>

        <PartnersSection />

        <div id="joinUs" className="lg:my-12 lg:px-[10%] xl:px-[25%]">
          <JoinForm />
        </div>
      </main>
    </>
  );
}