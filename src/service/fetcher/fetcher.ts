import { ErrorResponse } from '../../models/error';

export const fetchWithMethod = async <TDto>(
  method: string,
  url: string,
  data?: TDto,
): Promise<TDto | ErrorResponse | null> => {
  const token = window.localStorage.getItem('token');
  const fetchOptions: {
    headers: Record<string, string>;
    method: string;
    body?: string;
  } = {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${token || ''}`,
    },
    method,
    body: data
      ? JSON.stringify(data, <TValue>(_key: string, value: TValue) => value)
      : undefined,
  };

  return fetch(url, fetchOptions).then((response) => {
    if (response.ok) {
      if (response.status === 204) {
        return null;
      }
      return response.json() as TDto;
    }
    throw response;
  });
};

export function fetchGet(apiEndpoint: string) {
  return fetchWithMethod('GET', apiEndpoint);
}

export function fetchPost<TDto>(apiEndpoint: string, data: TDto) {
  return fetchWithMethod('POST', apiEndpoint, data);
}

export function fetchPut<TDto>(apiEndpointWithParams: string, data: TDto) {
  return fetchWithMethod('PUT', apiEndpointWithParams, data);
}

export function fetchPatch<TDto>(apiEndpointWithParams: string, data: TDto) {
  return fetchWithMethod('PATCH', apiEndpointWithParams, data);
}

export function fetchDelete(apiEndpointWithParams: string) {
  return fetchWithMethod('DELETE', apiEndpointWithParams);
}

export function fetchFormDataPost(formData: FormData, endpoint: string) {
  const token = localStorage.getItem('token');
  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token as string}`);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formData,
  };

  return fetch(endpoint, requestOptions).then((response) => {
    if (response.ok) {
      return response.json() as unknown;
    }
    throw response;
  });
}
