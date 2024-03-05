import { read } from "to-vfile";
import { remark } from "remark";
import remarkHtml from "remark-html";

const TermsOfServicePage = async () => {
  const { mdFile } = await getContent();
  return (
    <main className="mx-8 flex items-center justify-center">
      <article
        className="prose lg:prose-xl text-xl"
        dangerouslySetInnerHTML={{ __html: mdFile }}
      />
    </main>
  );
};

const getContent = async () => {
  const mdFile = await remark()
    .use(remarkHtml)
    .process(await read("src/content/termsOfService.md"));

  return {
    mdFile: String(mdFile),
  };
};

export default TermsOfServicePage;
