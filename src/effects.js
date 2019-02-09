import { gql, ApolloClient, ApolloLink, split, InMemoryCache } from 'apollo-boost';
import  { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { GraphQLClient } from 'graphql-request';

const appolo = true;
const url = 'http://localhost:4000/graphql';
const httpLink = createUploadLink({uri:url});
const wsAuthLink = new WebSocketLink({
	uri: 'ws://localhost:4000/graphql',
	options: {
		reconnect: true,
		connectionParams: () => ({
			Authorization: localStorage.getItem('token')
		})
	}
});

const authLink = new ApolloLink((operation, forward) => {
	operation.setContext(context => ({
		headers: {
			...context.headers,
			authorization: localStorage.getItem('token')
		}
	}));
	return forward(operation);
});
const httpAuthLink = authLink.concat(httpLink);
const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query);
		return kind === 'OperationDefinition' && operation === 'subscription';
	},
	wsAuthLink,
	httpAuthLink
);

const cache = new InMemoryCache();
const client = appolo ?
	new ApolloClient({ cache, link }) :
	() =>
		new GraphQLClient(url, {
			headers: {
				authorization: localStorage.getItem('token'),
			},
		});

const clientRequest = (query, variables) => appolo ?
	query.indexOf('mutation') !== -1 ?
		client.mutate({ mutation: gql(query), variables }) :
		client.query({ query: gql(query), variables, fetchPolicy: 'no-cache' })
	: client().request(query, variables);

const requestGraphqlEffect = ({ query, variables, action, error }, dispatch) =>
	clientRequest(query, variables)
		.then(result => dispatch(action, appolo ? result.data : result))
		.catch(err => dispatch(error, err));

export const RequestGraphql = (props) =>
	({ effect: requestGraphqlEffect, ...props });

const subscribeGraphqlEffect = ({ query, action }, dispatch) => {
	// Réinitilise la connexion pour récupérer le token 
	if (!wsAuthLink.subscriptionClient.connectionParams.authToken)
		wsAuthLink.subscriptionClient.close();
	const listen = client
		.subscribe({ query: gql(query) })
		.subscribe(({ data }) => dispatch(action, data));
	return () => listen.unsubscribe();
};

export const SubscribeGraphql = (props) =>
	({ effect: subscribeGraphqlEffect, ...props });

const setLocationEffect = ({ location }) =>
	window.location = location;

export const SetLocation = (props) =>
	({ effect: setLocationEffect, ...props });

const setlocalStorageEffect = ({ action, key, value }, dispatch) => {
	value ? localStorage.setItem(key, value) : localStorage.removeItem(key);
	dispatch(action);
};

export const SetlocalStorage = (props) =>
	({ effect: setlocalStorageEffect, ...props });	