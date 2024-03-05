import Image from "next/image";
import Link from "next/link";
import SquigglyLines from "../../src/components/SquigglyLines";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <main className="mt-20 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mt-20">
      <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-normal sm:text-7xl">
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
        className="mt-8 rounded-xl bg-primary px-4 py-3 font-medium text-white transition hover:bg-primary/80 sm:mt-10"
        href="/dashboard"
      >
        Instant Virtual Staging
      </Link>
      <div className="mt-6 flex w-full flex-col items-center justify-between sm:mt-10">
        <div className="mt-4 mb-16 flex flex-col space-y-10">
          <div className="flex flex-col sm:flex-row sm:space-x-8">
            <div>
              <h3 className="mb-1 text-lg font-medium">Original Room</h3>
              <Image
                alt="Original photo of a room with snapstager.com"
                src="/original-pic.jpg"
                className="h-96 w-full rounded-2xl object-cover"
                width={400}
                height={400}
              />
            </div>
            <div className="mt-8 sm:mt-0">
              <h3 className="mb-1 text-lg font-medium">Generated Room</h3>
              <Image
                alt="Generated photo of a room with snapstager.com"
                width={400}
                height={400}
                src="/generated-pic-2.jpg"
                className="mt-2 h-96 w-full rounded-2xl object-cover sm:mt-0"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default HomePage;
