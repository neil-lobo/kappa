declare module "http.request" {
  const http_request: {
    new_from_uri: (uri: string) => HTTPRequest;
  };
  export = http_request;
}
