export interface ImageUrl {
  url: string;
}

export default async function pictureFetch(file: File, endpoint: string) {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token as string}`);

  const formData = new FormData();
  formData.append('imageFile', file);

  const requestOptions = {
    method: 'PATCH',
    headers: myHeaders,
    body: formData,
  };

  return fetch(endpoint, requestOptions).then((respone) => {
    if (respone.ok) {
      return respone.json() as unknown as ImageUrl;
    }
    throw respone;
  });
}
