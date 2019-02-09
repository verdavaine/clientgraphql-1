import {  h } from 'hyperapp';
import { link } from './router';

export default ({ name, avatar, logout }) =>
	<div>
		<img src={avatar} width={48} height={48} alt="" />
		<h1>{name}</h1>
		<button onClick={logout}>logout</button>
		{link({href:'/newPhoto'},'Post Photo')}
	</div>;