const faqs = [
  {
    id: 1,
    question: "Why does it takes longer for some images to generate?",
    answer:
      "GPU that is used at Replicate has Cold Boot time. It takes longer for the first image to generate. After the first image is generated, the next images will be generated faster. In the future we might rent a dedicated GPU to solve this problem once we have more users",
  },
  {
    id: 2,
    question: "Who should I contact for support?",
    answer: "Email me at robert@snapstager.com",
  },
];
export const FAQ = () => {
  return (
    <div className="isolate mx-auto max-w-2xl divide-y divide-gray-900/10 px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:pb-32">
      <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
        Frequently asked questions
      </h2>
      <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
        {faqs.map((faq) => (
          <div key={faq.id} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
            <dt className="text-base font-semibold leading-7 text-gray-900 lg:col-span-5">
              {faq.question}
            </dt>
            <dd className="mt-4 lg:col-span-7 lg:mt-0">
              <p className="text-base leading-7 text-gray-600">{faq.answer}</p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
