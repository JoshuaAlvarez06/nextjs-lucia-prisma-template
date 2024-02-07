import { Logo } from "@/components";
import { NAVBAR_HEIGHT } from "@/constants";
import { APP_NAME } from "@/constants/branding";
import Image from "next/image";

export function LandingHero() {
  return (
    <section
      className="w-screen max-w-[1240px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 items-center gap-10"
      style={{
        minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <div className="flex flex-col justify-between h-[75%] space-y-5 md:block md:space-y-12 xl:space-y-14 text-white col-span-6">
        <div className="flex items-center gap-3">
          <Logo width="3rem" color="#fff" />
          <p className="text-2xl font-semibold italic">GET IN THE LOOP</p>
        </div>
        <h2 className="font-bold text-7xl">
          {APP_NAME}:
          <br />
          Connect, Chat, Create.
        </h2>
        <button className="rounded-full font-semibold text-white px-7 py-4 bg-brand-600 hover:opacity-70 text-lg max-w-[480px]">
          GET STARTED
        </button>
      </div>
      <div className="hidden md:block col-span-6">
        <Image
          src={"/images/landing/hero-img.webp"}
          alt="Hero Image"
          layout="responsive"
          width={400}
          height={600}
          className="max-w-[400px] md:ml-auto rounded-lg overflow-hidden shadow-2xl"
        />
      </div>
    </section>
  );
}
