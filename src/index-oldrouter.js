import { app, h, } from 'hyperapp';
import Users, { listen_for_users, addUser } from './Users';
import { testCode } from './AuthorizedUser';
import { SubscribeGraphql } from './effects';
import Photos from './Photos';
import PostPhoto from './PostPhoto';
import NotFound  from './NotFound';
import AuthorizedUser from './AuthorizedUser';
import { Route, location, history } from '@hyperapp/router';


const container = document.body;

app({
	init: testCode({ ...location(), ...{signingIn: false, error: null, totalUsers: 0, allUsers: [], allPhotos: [], loadingUsers: true, me: null, postPhoto: { name: '', description: '', category: 'PORTRAIT', file: null }} }),
	view: (state) => (
		<div>
			<Route location={state.location} render={Route => [
				<Route path="/" render={() => 
					<div>
						<AuthorizedUser
							signingIn={state.signingIn}
							me={state.me}
							loadingUsers={state.loadingUsers}
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
				} />,
				<Route path="/newPhoto" render={() => 
					<PostPhoto
						postPhoto={state.postPhoto}
						error={state.error}
					/>					
				} />,
				<Route render={() => 
					<NotFound/>					
				} />,				
			]} />
		</div>
	),
	subscriptions: state => {
		console.log(state); 
		history(state.location);
		return [
			state.me && <SubscribeGraphql query={listen_for_users} action={addUser} />,
		];
	},	
	container
});
