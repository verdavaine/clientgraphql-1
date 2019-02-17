import {  h } from 'hyperapp';
import { RequestGraphql } from './effects';

const listUsers = `
	query listUsers {
		totalUsers
		allUsers {...userInfo}
		me {...userInfo}
		allPhotos {
			id
			name
			url
		}
	}

	fragment userInfo on User {
		githubLogin
		name
		avatar
		}	
`;

const addFake = `
	mutation addFakeUsers($count: Int!) {
		addFakeUsers(count:$count) {
			githubLogin
			avatar
			name
		}
	}
`;

export const listen_for_users = `
	subscription {
		newUser {
			githubLogin
			name
			avatar
		}
	}
`;

export default ({loadingUsers, totalUsers, allUsers}) => 
	<div>
		{loadingUsers ? 
			<p>loading users...</p> :
			<UserList count={totalUsers} users={allUsers} />
		}
	</div>;

const UserList = ({ count, users }) => 
	<div>
		<p>{count} Users</p>
		<button onClick={refetch}>Refetch Users</button>
		<ul>
			{users.map(user =>
				<UserListItem key={user.githubLogin}
					name={user.name}
					avatar={user.avatar} />
			)}
		</ul>
		<button onClick={addFakeUser}>Add Fake Users</button>
	</div>;

const UserListItem = ({ name, avatar }) => 
	<li>
		<img src={avatar} width={48} height={48} alt="" />
		{name}
	</li>;

export const refetch = (state) => [
	{...state, loadingUsers: true},
	<RequestGraphql query={listUsers} action={populate} />
];

const addFakeUser = (state) => [
	state,
	<RequestGraphql query={addFake} variables={{ count: 1 }} action={populateFakeUsers} />
];

export const addUser = (state, data) => ({
	...state,
	totalUsers: state.allUsers.length + 1,
	allUsers: [...state.allUsers, data.newUser]
});

const populate = (state, result) => ({
	...state,
	loadingUsers: false,
	totalUsers: result.totalUsers,
	allUsers: result.allUsers,
	allPhotos: result.allPhotos,
	me: result.me
});

//inutile si subscription
const populateFakeUsers = (state, result) => ({
	...state,
	totalUsers: state.allUsers.length + result.addFakeUsers.length,
	allUsers: [...state.allUsers, ...result.addFakeUsers]
});