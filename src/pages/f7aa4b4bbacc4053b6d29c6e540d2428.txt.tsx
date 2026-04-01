import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/plain');
  res.write('f7aa4b4bbacc4053b6d29c6e540d2428');
  res.end();
  return { props: {} };
};

export default function IndexNowKey() {
  return null;
}
