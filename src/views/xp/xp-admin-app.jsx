import React from 'react';
import ReactDOM from 'react-dom';

export default class XpAdminApp extends React.Component {
	render() {
		return (
			<div className="alert alert-warning">
				À venir!
			</div>
		);
	}
}

ReactDOM.render(<XpAdminApp />, document.getElementById('main'));
