export type HTTPResponse = {
  data: string;
  error: string;
  status: number | null;
};

export type FetchOptions = {
  method: c2.HTTPMethod;
  headers?: { [k: string]: string };
  timeout?: number;
  body?: string;
};

const DEFAULT_OPTIONS: FetchOptions = {
  method: c2.HTTPMethod.Get,
};

export async function fetch(
  url: string,
  options?: Partial<FetchOptions>,
): Promise<HTTPResponse> {
  const _options = Object.assign(DEFAULT_OPTIONS, options);

  const req = c2.HTTPRequest.create(_options.method, url);

  for (const [k, v] of Object.entries(_options.headers ?? {})) {
    req.set_header(k, v);
  }

  if (_options.timeout) {
    req.set_timeout(_options.timeout);
  }

  if (_options.body) {
    req.set_payload(_options.body);
  }

  return new Promise((res) => {
    req.on_error((response) =>
      res({
        data: response.data(),
        error: response.error(),
        status: response.status(),
      }),
    );
    req.on_success((response) =>
      res({
        data: response.data(),
        error: response.error(),
        status: response.status(),
      }),
    );
    req.execute();
  });
}
