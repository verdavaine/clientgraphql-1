import { h } from 'hyperapp';
import htm from './htm.js';
import { RequestGraphql } from './effects';

const postPhotoMutation = `
	mutation postPhoto($input: PostPhotoInput!) {
		postPhoto(input:$input) {
			id
			name
			url
		}
	}
`;

const UpdatePhotos = (state, result) => ({
	...state,
	allPhotos: [...state.allPhotos, result.postPhoto]
});

const ErrorResponse = (state, error) => ({ ...state, error });

const postPhoto = (state, event) => {
	event.preventDefault();
	const postPhoto = state.postPhoto;
	history.replaceState('', 'title', '/');
	return [
		{
			...state,
			error: null,
			postPhoto: { name: '', description: '', category: 'PORTRAIT', file: null },
		},
		RequestGraphql({query: postPhotoMutation, variables:{ input: postPhoto }, action:UpdatePhotos, error:ErrorResponse})
		//<RequestGraphql query={postPhotoMutation} variables={{ input: postPhoto }} action={UpdatePhotos} error={ErrorResponse} />
	];
};

const setNameValue = (state, ev) => ({
	...state,
	postPhoto: {
		...state.postPhoto,
		name: ev.target.value
	}
});

const setDescriptionValue = (state, ev) => ({
	...state,
	postPhoto: {
		...state.postPhoto,
		description: ev.target.value
	}
});

const setCategoryValue = (state, ev) => ({
	...state,
	postPhoto: {
		...state.postPhoto,
		category: ev.target.value
	}
});

const setFileValue = (state, ev) => {
	const file = ev.target.files && ev.target.files.length ? ev.target.files[0] : '';
	return {
		...state,
		postPhoto: {
			...state.postPhoto,
			file
		}
	};
};


const historyBack = (state, event) => {
	event.preventDefault();
	history.back();
};

export default ({ postPhoto: { name, description, category }, error }) => {
	const html = htm.bind(h);
	return html`
		<html>
			<body>
	<form onSubmit=${postPhoto} style=${{ display: 'flex' , flexDirection: 'column' , justifyContent: 'flex-start' , alignItems: 'flex-start' }}>
		${error ? htm`<h4>${`Error: ${error.message}`}</h4>` : ''}
		<h1>Post a Photo</h1>
		<input type="text" style=${{ margin: '10px' }} placeholder="photo name..." value=${name} onChange=${setNameValue} />
		<textarea style=${{ margin: '10px' }} placeholder="photo description..." value=${description} onChange=${setDescriptionValue} />
		<select value=${category}
			style=${{ margin: '10px' }}
			onChange=${setCategoryValue}>
			<option value="PORTRAIT">PORTRAIT</option>
			<option value="LANDSCAPE">LANDSCAPE</option>
			<option value="ACTION">ACTION</option>
			<option value="GRAPHIC">GRAPHIC</option>
		</select>
		<input type="file"
			style=${{ margin: '10px' }}
			accept="image/jpeg"
			onChange=${setFileValue} />
		<div style=${{ margin: '10px' }}>
			<button type="submit">
				Post Photo
			</button>
			<button onClick=${historyBack}>
				Cancel
			</button>
		</div>
	</form>
      </body>
			</html>
		`;
};