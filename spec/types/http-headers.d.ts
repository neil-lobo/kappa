declare module "http.headers" {
  const http_headers: {
    new: () => HTTPHeaders;
  };
  export = http_headers;
}
