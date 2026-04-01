import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write('bff40acd9ec64594aca72899213b6784');
  res.end();
  return { props: {} };
};

export default function IndexNowKey() {
  return null;
}
