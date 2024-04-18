import { Component } from './Component';

const Page: React.FC = async () => {
  return (
    <section>
      <h1>/user/me</h1>
      <h3>Me Page</h3>
      <h5>마이 페이지</h5>
      <Component />
    </section>
  );
};

export default Page;
