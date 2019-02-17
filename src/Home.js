import {  h } from 'hyperapp';
import Users from './Users';
import Photos from './Photos';
import AuthorizedUser from './AuthorizedUser';

export default (state) => (
	<div>
		<AuthorizedUser
			signingIn={state.signingIn}
			me={state.me}
			loadingUsers={state.loadingUsers}
			auth={state.auth}
		/>
		<Users
			totalUsers={state.totalUsers}
			allUsers={state.allUsers}
			loadingUsers={state.loadingUsers}
		/>
		<Photos
			allPhotos={state.allPhotos}
			loadingUsers={state.loadingUsers}
		/>
	</div>
);