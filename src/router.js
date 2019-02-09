import { h } from 'hyperapp';
import { pages } from './index';

const cache = {};
let started = false;

export const router = routes => ({ effect, action, routes });
export const route = state =>
	(state.route &&
		cache[state.route.match] &&
		cache[state.route.match](state)) ||
	h('html', {}, '');

export const link = (props, children) =>
	h(
		'a',
		{
			href: props.href,
			onclick: (state, e) =>
				e.preventDefault() || history.pushState(null, null, props.href)
		},
		children
	);

// -----------------------------------------
// Router utility functions
// -----------------------------------------

const action = (state, route) => ({ ...state, route });
const effect = (props, dispatch) => {
	// Run any actions or fx for matched routes
	const go = () => {
		console.log('Route changed', window.location.pathname);
		const route = Object.entries(props.routes).find(([path, ]) =>
			match(path)
		);
		if (route) {
			const [path, { file, onenter, redirect }] = route;
			const shouldRedirect =
				redirect && Object.entries(redirect).find(([, v]) => v);
			if (shouldRedirect) {
				history.replaceState(null, null, shouldRedirect[0]);
				return;
			}
			const data = {
				match: path,
				param: extractParams(path),
				query: extractQuery(location.search)
			};
			// dispatch(props.action, { match: path, ...window.location })
			onenter && dispatch(onenter(data));
			if (!cache[path]) {
				console.log('Importing', file);
				pages[file].then(module => {
					cache[path] = module.default;
					console.log('Imported', file, 'running onenter', onenter);
					dispatch(props.action, data);
				}).catch(e => {
					console.log('error : ' + e);
				});
			} else {
				console.log('Using cached', file);
				dispatch(props.action, data);
			}
		}
	};

	// Update url when a pushState occurs
	const pushState = history.pushState;
	history.pushState = function () {
		pushState.apply(history, arguments);
		go();
	};
	// Update url when a replaceState occurs
	const replaceState = history.replaceState;
	history.replaceState = function () {
		replaceState.apply(history, arguments);
		go();
	};
	// Update url when ever the window url changes
	addEventListener('popstate', go);

	// Update the url on page load
	!started && ((started = true), go());

	// Check if any redirects apply
	const route = Object.entries(props.routes).find(([path, ]) =>
		match(path)
	);
	if (route) {
		let [, { redirect }] = route;
		redirect && Object.entries(redirect).find(([, v]) => v) && go();
	}

	return () => {
		history.pushState = pushState;
		history.replaceState = replaceState;
		removeEventListener('popstate', go);
	};
};

const match = path =>
	!path.startsWith('*')
		? location.pathname === path
		: location.pathname.match(
			path
				.replace('*', '')
				.replace(/\//g, '\\/')
				.replace(/:([\w]+)/g, '([-\\.%\\w\\(\\)]+)')
		);

const extractParams = route => {
	var params = {};
	var keys = [];
	route !== '*' &&
		location.pathname.replace(
			RegExp(
				'^' +
				route
					.replace('*', '')
					.replace(/\//g, '\\/')
					.replace(/:([\w]+)/g, function (_, key) {
						keys.push(key);
						return '([-\\.%\\w\\(\\)]+)';
					}) +
				'/?$',
				'g'
			),
			function () {
				for (var j = 1; j < arguments.length - 2;) {
					var value = arguments[j++];
					try {
						value = decodeURI(value);
					} catch (e) {console.log(e);}
					params[keys.shift()] = value;
				}
			}
		);
	return params;
};

const extractQuery = search => {
	let hashes = search.slice(search.indexOf('?') + 1).split('&');
	let params = {};
	hashes.map(hash => {
		let [key, val] = hash.split('=');
		key && (params[key] = decodeURIComponent(val));
	});

	return params;
};
