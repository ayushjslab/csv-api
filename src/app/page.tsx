import Script from "next/script";

const Page = () => {
  return (
    <div>
      <Script
        src="http://localhost:3000/supportbeing.js"
        data-website-id="69be64ba21034886836653ef"
        data-secret-key="sb_062946884a360c023a530aadb07d056b5a4255c2da370d755d0d2f3d71d3a869"
      />
    </div>
  );
};

export default Page;