function isServer() {
  return !(typeof window != 'undefined' && window.document);
}

const serverOnlyCreateClient = () => {
  if (!isServer()) return;

  // const client = new ApolloClient({
  //   link: authLink.concat(httpLink),
  //   cache: new InMemoryCache(),
  // });
  // return client;
};

export const client = serverOnlyCreateClient();
