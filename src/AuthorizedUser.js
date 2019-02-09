import { h } from 'hyperapp';
import { refetch } from './Users';
import CurrentUser from './CurrentUser';
import { SetLocation, SetlocalStorage, RequestGraphql } from './effects';

const githubAuthMutation = `
	mutation githubAuth($code:String!) {
		githubAuth(code:$code) { token }
	}
`;

const authorizationComplete = (state, result) => {
	history.replaceState('', 'title', '/');
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

const RequestCode = (state) => [
	state,
	<SetLocation location='https://github.com/login/oauth/authorize?client_id=da0d9e8948ca42fa121e&scope=user' />
];

export const testCode = (init) => {
	if (window.location.search.match(/code=/)) {
		const code = window.location.search.replace('?code=', '');
		return [
			{...init, signingIn: true },
			<RequestGraphql query={githubAuthMutation} variables={{ code }} action={authorizationComplete} error={authorizationError}/>
		];
	} else
		return refetch(init);
};

export default ({ signingIn, me, loadingUsers }) =>
	me ?
		<CurrentUser {...me} logout={removeToken}/> :
		loadingUsers ?
			<p>loading... </p> :
			<div id='#auth'>
				<button onClick={RequestCode} disabled={signingIn}>
					Sign In with GitHub
				</button>
			</div>;




