<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller') && class_exists('WP_REST_Server')) {

		/**
		 * The GraphDataRoute lists the entire contents of the Zodiac graph in a easily parsable
		 * format. It is accessible at `terraarcana/v1/graph-data`.
		 */
		class GraphDataRoute extends \WP_REST_Controller {

			public function register_routes() {
				register_rest_route(API_PREFIX . '/v1', '/graph-data', array(
					array(
						'methods' => \WP_REST_Server::READABLE,
						'callback' => array($this, 'get_items')
					),
					array(
						'methods' => \WP_REST_Server::EDITABLE,
						'callback' => array($this, 'update_items'),
						'args' => $this->get_endpoint_args_for_item_schema(false)
					)
				));
			}

			/**
			 * Get all graph data items
			 * @param WP_REST_Request $request The current request
			 * @return Array|WP_Error
			 */
			public function get_items($request) {
				$result = array(
					'nodes' => array(),
					'links' => array()
				);

				$skillGraphData = DataController::getInstance()->getCPT('skill')->get_graph_data();
				$pointGraphData = DataController::getInstance()->getCPT('point-node')->get_graph_data();

				// Exit early if no skills are found
				if (empty($skillGraphData) && empty($pointGraphData)) {
					return new \WP_Error('terraarcana_no_field_data', 'Aucun champ trouvé', array('status' => 404));
				}

				$result['nodes'] = array_merge($skillGraphData['nodes'], $pointGraphData['nodes']);

				$links = array_merge($skillGraphData['links'], $pointGraphData['links']);
				foreach ($links as $link) {
					$this->push_unique_link($result['links'], $link[0], $link[1]);
				}

				return $result;
			}

			/**
			 * Save new graph data to WordPress
			 * @param WP_REST_Request $request The request containing the updated data
			 * @return WP_REST_Response
			 */
			public function update_items(\WP_REST_Request $request) {
				$params = $request->get_params();

				// First pass to create all new nodes and replace their temp ID with their true ID
				if (is_array($params['newNodeIndexes'])) {
					foreach ($params['newNodeIndexes'] as $nodeIndex) {
						$postID = '';
						$oldPostID = $params['nodes'][$nodeIndex]['id'];

						switch($params['nodes'][$nodeIndex]['type']) {
						case 'life':
						case 'perk':
							$postID = DataController::getInstance()->getCPT('point-node')->create($params['nodes'][$nodeIndex]);
							break;
						}

						$params['nodes'][$nodeIndex]['id'] = $postID;

						// Replace all instances of the temp ID with the newly inserted one in link data
						if (is_array($params['links'])) {
							foreach ($params['links'] as &$link) {
								if ($link[0] == $oldPostID) $link[0] = $postID;
								if ($link[1] == $oldPostID) $link[1] = $postID;
							}
						}
					}
				}

				// Update all data on all nodes
				foreach($params['nodes'] as $node) {
					$links = $this->get_linked_nodes_from_id($node['id'], $params['links']);

					switch($node['type']) {
					// Skill nodes
					case 'skill':
						DataController::getInstance()
							->getCPT('skill')
							->update_skill_graph_data($node, $links);
						break;

					// Upgrade nodes
					case 'upgrade':
						DataController::getInstance()
							->getCPT('skill')
							->update_upgrade_graph_data($node, $links);
						break;

					// Point nodes
					case 'life':
					case 'perk':
						DataController::getInstance()
							->getCPT('point-node')
							->update_graph_data($node, $links);
						break;
					}
				}

				// Delete removed nodes
				if (is_array($params['deletedNodes'])) {
					foreach ($params['deletedNodes'] as $node) {
						wp_delete_post($node, true);
					}
				}

				return new \WP_REST_Response('Zodiaque sauvegardé avec succès!', 200);
			}

			/**
			 * Adds a skill link to a link array, ensuring there are no duplicates.
			 * @param &array $linkArray The link array containing all current links
			 * @param string $from The first link element
			 * @param string $to The second link element
			 * @return array The new link array
			 */
			private function push_unique_link(array &$linkArray, $from, $to) {
				foreach ($linkArray as $link) {
					// If we find a duplicate, exit early before pushing the new link
					if (($link[0] == $from && $link[1] == $to) ||
						($link[0] == $to && $link[1] == $from)) {
						return $linkArray;
					}
				}

				// Push the new link as they were no duplicates
				array_push($linkArray, array($from, $to));
				return $linkArray;
			}

			/**
			 * Returns all linked nodes to a given node ID
			 * @param string $from The origin node ID
			 * @param array $linkData The entire link data array
			 * @return array An arrays of all node IDs linked to $from
			 */
			private function get_linked_nodes_from_id($from, array $linkData) {
				$resultLinks = array();

				foreach ($linkData as $link) {
					if ($link[0] == $from) {
						$resultLinks[] = $link[1];
					} else if ($link[1] == $from) {
						$resultLinks[] = $link[0];
					}
				}

				return $resultLinks;
			}
		}
	}
}
