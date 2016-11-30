import React from 'react';

import packageInfo from '../../../package.json';

export default class Footer extends React.Component {
	render() {
		return (
			<div>
				<div className="ta-version-notice">
					<a href={packageInfo.releases.url}>v{packageInfo.version}</a>
				</div>
			</div>
		);
	}
}
