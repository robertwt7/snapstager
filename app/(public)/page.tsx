import Image from "next/image";
import Link from "next/link";
import SquigglyLines from "../../src/components/SquigglyLines";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20">
      <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal sm:text-7xl">
        Virtual Staging{" "}
        <span className="relative whitespace-nowrap text-primary">
          <SquigglyLines />
          <span className="relative">using AI</span>
        </span>{" "}
        for everyone.
      </h1>
      <h2 className="mx-auto mt-12 max-w-xl text-lg leading-7">
        Take a picture of your empty room and let AI does magic - use SnapStager
        today.
      </h2>
      <Link
        className="bg-primary rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-primary/80 transition"
        href="/dashboard"
      >
        Instant Virtual Staging
      </Link>
      <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6">
        <div className="flex flex-col space-y-10 mt-4 mb-16">
          <div className="flex sm:space-x-8 sm:flex-row flex-col">
            <div>
              <h3 className="mb-1 font-medium text-lg">Original Room</h3>
              <Image
                alt="Original photo of a room with snapstager.com"
                src="/original-pic.jpg"
                className="w-full object-cover h-96 rounded-2xl"
                width={400}
                height={400}
              />
            </div>
            <div className="sm:mt-0 mt-8">
              <h3 className="mb-1 font-medium text-lg">Generated Room</h3>
              <Image
                alt="Generated photo of a room with snapstager.com"
                width={400}
                height={400}
                src="/generated-pic-2.jpg"
                className="w-full object-cover h-96 rounded-2xl sm:mt-0 mt-2"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default HomePage;
