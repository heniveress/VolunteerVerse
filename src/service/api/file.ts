export function fetchFileGet(apiEndpoint: string) {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token as string}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };
  return fetch(apiEndpoint, requestOptions).then((response) => {
    if (response.ok) {
      return response.blob();
    }
    throw response;
  });
}

export default fetchFileGet;
