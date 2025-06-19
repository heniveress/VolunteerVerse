export default function swrFetcher(path: string, query: string | undefined) {
  const url: string = query ? `${path}${query}` : path;

  const header = new Headers();
  header.append('Content-type', 'application/json');
  const token = window.localStorage.getItem('token');

  if (token) {
    header.append('Authorization', `Bearer ${token}`);
  }

  const fetchConfigs = {
    method: 'GET',
    headers: header,
  };

  return (
    fetch(url, fetchConfigs)
      .then((res) => res.json())
      // eslint-disable-next-line no-console
      .catch((err) => console.log(err))
  );
}
