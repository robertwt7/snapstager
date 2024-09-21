import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import { PresentationVideo } from "src/components/PresentationVideo";
import { Features } from "src/components/Features";
import { FAQ } from "src/components/faq";

const HomePage: NextPage = () => {
  return (
    <main className="relative mt-20 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mt-20">
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FF48FC] to-[#4438FF] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <h1 className="font-display mx-auto max-w-4xl text-5xl text-blue-700 font-bold tracking-normal sm:text-7xl">
        AI-Driven Staging for {" "}
        <span className="relative whitespace-nowrap">
          <span className="relative">the Perfect Look</span>
        </span>
      </h1>
      <h2 className="mx-auto mt-12 max-w-xl text-lg leading-7 text-blue-700">
        Simply upload a photo of your empty space, apply our intuitive masking
        tool, and watch as our AI transforms it into a beautifully staged room
        in mere seconds.
      </h2>
      <Link
        className="mt-8 rounded-xl bg-blue-700 px-4 py-3 font-medium text-white transition hover:bg-primary/80 sm:mt-10"
        href="/dashboard"
      >
        Get 2 Free Credits
      </Link>
      <div className="mt-32 flex w-full flex-col items-center justify-center space-y-8 ">
        <h2 className="mx-auto mt-12 text-5xl font-bold text-blue-700">How it works</h2>
        <PresentationVideo />
      </div>

      <div className="mt-32">
        <Features />
      </div>
      <div className="mt-56 flex w-full flex-col items-center justify-between sm:mt-10">
        <h2 className="mx-auto mt-12 text-3xl font-bold tracking-tight text-blue-700 sm:text-4xl">
          Result
        </h2>

        <div className="mb-16 mt-4 flex flex-col space-y-10" data-nosnippet>
          <div className="flex flex-col sm:flex-row sm:space-x-8">
            <div>
              <h3 className="mb-1 text-lg font-medium text-blue-700">ORIGINAL</h3>
              <Image
                alt="Original photo of a room with spaceshift.com"
                src="/original-pic.jpg"
                className="h-96 w-full rounded-2xl object-cover"
                width={400}
                height={400}
              />
            </div>
            <div className="mt-8 sm:mt-0">
              <h3 className="mb-1 text-lg font-medium text-blue-700">GENERATED</h3>
              <Image
                alt="Generated photo of a room with spaceshift"
                width={400}
                height={400}
                src="/generated-pic-2.png"
                className="mt-2 h-96 w-full rounded-2xl object-cover sm:mt-0"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-32">
        <FAQ />
      </div>
    </main>
  );
};
export default HomePage;
