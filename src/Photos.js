import {  h } from 'hyperapp';

export default ({loadingUsers, allPhotos}) => 
	<div>
		{loadingUsers ? 
			<p>loading photos...</p> :
			<PhotosList photos={allPhotos} />
		}
	</div>;

const PhotosList = ({ photos }) => 
	photos.map(photo =>
		<img
			key={photo.id}
			src={`http://localhost:4000${photo.url}`}
			alt={photo.name}
			width={350} 
		/>
	);