import { app, h, } from 'hyperapp';
import { listen_for_users, addUser } from './Users';
import { testCode } from './AuthorizedUser';
import { SubscribeGraphql } from './effects';
import { route, router } from './router';

const container = document.body;
export const pages = {
  Home: import('./Home'),
	PostPhoto: import('./PostPhoto'),
	NotFound: import('./NotFound')
}

app({
	init: testCode({ 
		signingIn: false, 
		error: null, 
		totalUsers: 0, 
		allUsers: [], 
		allPhotos: [], 
		loadingUsers: true, 
		me: null, 
		postPhoto: { 
			name: '', 
			description: '', 
			category: 'PORTRAIT', 
			file: null, 
			route:{} 
		} 
	}),
	subscriptions: state => console.log (state) || [
		state.me && <SubscribeGraphql query={listen_for_users} action={addUser} />,
		router({
			'/': {
				file: 'Home'
			},
			'/newPhoto': {
				file: 'PostPhoto',
				redirect: { '/': !state.me },
			},
			'*': { file: 'NotFound' },
			onenter: route => setData
		})
	],
	view: route,
	container
});