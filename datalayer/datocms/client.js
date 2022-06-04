import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

function isServer() {
  return !(typeof window != 'undefined' && window.document);
}

const serverOnlyCreateClient = () => {
  if (!isServer()) return;
  const token = process.env.DATOCMS_READ_ONLY_TOKEN;
  const httpLink = createHttpLink({
    uri: process.env.DATOCMS_GRAPHQL_ENDPOINT,
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: Object.assign(headers || {}, {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return client;
};

export const client = serverOnlyCreateClient();
