import { read } from "to-vfile";
import { remark } from "remark";
import remarkHtml from "remark-html";

const PrivacyPolicy = async () => {
  const { mdFile } = await getContent();
  return (
    <div className="flex flex-row justify-center py-8 px-4 md:px-0">
      <main className="w-3/4 md:w-1/2 mx-8 flex-col items-center justify-center">
        <article
          className="prose lg:prose-xl text-xl"
          dangerouslySetInnerHTML={{ __html: mdFile }}
        />
      </main>
    </div>
  );
};

const getContent = async () => {
  const mdFile = await remark()
    .use(remarkHtml)
    .process(await read("src/content/privacyPolicy.md"));

  return {
    mdFile: String(mdFile),
  };
};

export default PrivacyPolicy;
