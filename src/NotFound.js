import { h } from 'hyperapp';
import { link } from './router';

export default ()  =>
	<div>
		<p>{`${window.location.pathname} Not found`}</p>
		{link({href:'/'},'Go Back Home')}
	</div>;

