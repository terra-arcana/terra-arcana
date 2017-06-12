
/**
 * Returns the primary character class from a set of skills.
 * @param {Array} skills An array of skill info objects. The only required field is `character_class`.
 * @return {Promise} A promise containing the character class info
 */
export function getPrimaryCharacterClassFromSkills(skills) {
	var classMap = {},
		deferred = jQuery.Deferred();

	if (!skills) {
		deferred.reject();
		return deferred.promise();
	}

	for (let i = 0, len = skills.length; i < len; ++i) {
		let buildNode = skills[i];

		if (!classMap.hasOwnProperty(buildNode['character_class'])) {
			classMap[buildNode['character_class']] = 0;
		}
		classMap[buildNode['character_class']]++;

		// Count all picked upgrades as being part of the character class
		if (buildNode.upgrades && buildNode.upgrades.length) {
			classMap[buildNode['character_class']] += buildNode.upgrades.length;
		}
	}

	// Get key of highest rated character class
	var highestClassId = Object.keys(classMap).reduce((a, b) => { return (classMap[a] > classMap[b]) ? a : b; });

	jQuery.get(WP_API_Settings.root + 'wp/v2/character-class/' + highestClassId, function(result) {
		deferred.resolve(result);
	}.bind(this));

	return deferred.promise();
}
