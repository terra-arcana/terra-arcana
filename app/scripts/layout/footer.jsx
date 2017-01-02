import React from 'react';
import {Link, IndexLink} from 'react-router';

import packageInfo from '../../../package.json';

require('../../styles/layout/footer.scss');
require('../../images/terra-logo-blanc.png');

export default class Footer extends React.Component {
	render() {
		var linkData = [
			{
				link: '/codex/',
				caption: 'Codex Arcanum'
			},
			{
				link: '/systeme/',
				caption: 'Système de jeu'
			},
			{
				link: '/zodiaque/',
				caption: 'Zodiaque'
			}
		];

		return (
			<div className="ta-footer">
				<div className="container">
					<div className="col-xs-12 col-sm-4 col-lg-2">
						<IndexLink to="/" className="ta-navbar-logo">
							<img src={WP_Theme_Settings.imageRoot + 'terra-logo-blanc.png'} />
						</IndexLink>
						<p className="text-xs-center">Grandeur Nature médiéval fantastique</p>
					</div>

					<nav className="ta-footer-nav col-xs-12 col-sm-4 col-sm-offset-4 col-lg-2 col-lg-offset-8">
						<ul className="list-unstyled">
							{linkData.map(function(link) {
								return (
									<li key={link.link}>
										<Link
											to = {link.link}
											onClick = {this.onNavLinkClick}
										>
											{link.caption}
										</Link>
									</li>
								);
							}.bind(this))}
							<li><hr /></li>
							<li><a href="https://www.facebook.com/groups/terraarcana/">Facebook</a></li>
						</ul>
					</nav>
				</div>
				<div className="container">
					<p className="ta-opensource-disclaimer col-xs-12 text-center">
						Le code source de ce site est entièrement libre de droits et disponible sur <a href="https://github.com/terra-arcana/terra-arcana">GitHub</a>.<br />
						<a className="ta-version" href={packageInfo.releases.url}>v{packageInfo.version}</a>
					</p>
				</div>
			</div>
		);
	}
}
