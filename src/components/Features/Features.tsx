import {
  BoltIcon,
  CurrencyDollarIcon,
  EyeIcon,
  TvIcon,
} from "@heroicons/react/24/outline";
import { FunctionComponent } from "react";

const features = [
  {
    name: "Realistic",
    description:
      "Our AI model filled the room considering the lighting and the original structure of the room. This is the most realistic virtual staging you can get!",
    icon: EyeIcon,
  },
  {
    name: "Lightning Fast",
    description: "Virtual staging now can be done in seconds.",
    icon: BoltIcon,
  },
  {
    name: "Original Resolution",
    description:
      "We generate the original resolution of the image that you uploaded, up to 4k!",
    icon: TvIcon,
  },
  {
    name: "Cheap",
    description: "Pay $1 instead of $25 for virtual staging",
    icon: CurrencyDollarIcon,
  },
];

export const Features: FunctionComponent = () => {
  return (
    <div className="isolate bg-white">
      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:whitespace-nowrap">
            The only solution you need for virtual staging
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};
