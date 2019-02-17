import { h } from 'hyperapp';
import { refetch } from './Users';
import CurrentUser from './CurrentUser';
import { SetLocation, SetlocalStorage, RequestGraphql } from './effects';

const githubAuthMutation = `
	mutation githubAuth($code:String!) {
		githubAuth(code:$code) { token }
	}
`;
const facebookAuthMutation = `
	mutation facebookAuth($code:String!) {
		facebookAuth(code:$code) { token }
	}
`;
const signupMutation = `
	mutation signup($input:SignupInput!) {
		signup(input: $input) { token }
	}
`;
const loginMutation = `
mutation login($input:LoginInput!) {
	login(input: $input) { token }
}
`;

const authorizationComplete = (state, result) => {
	history.replaceState('', '', '/');
	return [
		{ ...state, signingIn: false },
		<SetlocalStorage key='token' value={result.githubAuth.token} action={refetch} />
	];
};

const authorizationError = (state, result) => {
	console.log(result);
};

const removeToken = (state) => [
	{
		...state,
		me: null
	},
	<SetlocalStorage key='token' />
];

const RequestGithubCode = (state) => [
	state,
	<SetLocation location='https://github.com/login/oauth/authorize?client_id=da0d9e8948ca42fa121e&scope=user' />
];

const RequestFacebookCode = (state) => {
	const st = Math.random();
	localStorage.setItem('st', st);
	return [
		state,
		<SetLocation location={'https://www.facebook.com/v3.2/dialog/oauth?client_id=553813528451746&redirect_uri=http://localhost:3000/&state='+st} />
	];
};

export const testCode = (init) => {
	let stateindex = 0;
	if (window.location.search.match(/code=/)) {
		let code = window.location.search.replace('?code=', '');
		if ((stateindex = code.indexOf('&state'))!=-1){
			const st = code.substring (stateindex+7);
			code = code.substring (0, stateindex);
			if (st===localStorage.getItem('st'))
				return [
					{ ...init, signingIn: true },
					<RequestGraphql query={facebookAuthMutation} variables={{ code }} action={authorizationComplete} error={authorizationError} />
				];
			else return { ...init, error: 'states not equal'};
		}
		else return [
			{ ...init, signingIn: true },
			<RequestGraphql query={githubAuthMutation} variables={{ code }} action={authorizationComplete} error={authorizationError} />
		];
	} else
		return refetch(init);
};

const setNameValue = (state, ev) => ({
	...state,
	auth: {
		...state.auth,
		name: ev.target.value
	}
});

const setEmailValue = (state, ev) => ({
	...state,
	auth: {
		...state.auth,
		email: ev.target.value
	}
});

const setPasswordValue = (state, ev) => ({
	...state,
	auth: {
		...state.auth,
		password: ev.target.value
	}
});

const signupComplete = (state, result) => [
	{ ...state, signingIn: false },
	<SetlocalStorage key='token' value={result.signup.token} action={refetch} />
];

const loginComplete = (state, result) => [
	{ ...state, signingIn: false },
	<SetlocalStorage key='token' value={result.login.token} action={refetch} />
];

const ErrorResponse = (state, error) => ({ ...state, error });

const signup = (state) => {
	event.preventDefault();
	const auth = state.auth;
	return [
		{
			...state,
			error: null,
			auth: { name: '', email: '', password: '' },
		},
		<RequestGraphql query={signupMutation} variables={{ input: auth }} action={signupComplete} error={ErrorResponse} />
	];
};

const login = (state) => {
	event.preventDefault();
	const auth = state.auth;
	return [
		{
			...state,
			error: null,
			auth: { email: '', password: '' },
		},
		<RequestGraphql query={loginMutation} variables={{ input: auth }} action={loginComplete} error={ErrorResponse} />
	];
};

export default ({ signingIn, me, loadingUsers, auth: { name, email, password } }) =>
	me ?
		<CurrentUser {...me} logout={removeToken} /> :
		loadingUsers ?
			<p>loading... </p> :
			<div id='#auth'>
				<form onSubmit={signup} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
					<input type="text" style={{ margin: '10px' }} placeholder="user name..." value={name} onChange={setNameValue} />
					<input type="text" style={{ margin: '10px' }} placeholder="email..." value={email} onChange={setEmailValue} />
					<input type="text" style={{ margin: '10px' }} placeholder="password..." value={password} onChange={setPasswordValue} />
					<div style={{ margin: '10px' }}>
						<button type="submit">
							Sign In with Email
						</button>
					</div>
				</form>
				<form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
					<input type="text" style={{ margin: '10px' }} placeholder="email..." value={email} onChange={setEmailValue} />
					<input type="text" style={{ margin: '10px' }} placeholder="password..." value={password} onChange={setPasswordValue} />
					<div style={{ margin: '10px' }}>
						<button type="submit">
							Login
						</button>
					</div>
				</form>
				<button onClick={RequestGithubCode} disabled={signingIn}>
					Sign In with GitHub
				</button>
				<button onClick={RequestFacebookCode} disabled={signingIn}>
					Sign In with Facebook
				</button>
			</div>;




