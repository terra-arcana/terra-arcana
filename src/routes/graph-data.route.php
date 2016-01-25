<?php

namespace terraarcana {
	if (class_exists('WP_REST_Controller') && class_exists('WP_REST_Server')) {

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
				$energyGraphData = DataController::getInstance()->getCPT('energy-node')->get_graph_data();

				// Exit early if no skills are found
				if (empty($skillGraphData) && empty($energyGraphData)) {
					return new \WP_Error('terraarcana_no_field_data', 'Aucun champ trouvé', array('status' => 404));
				}

				$result['nodes'] = array_merge($skillGraphData['nodes'], $energyGraphData['nodes']);

				$links = array_merge($skillGraphData['links'], $energyGraphData['links']);
				foreach($links as $link) {
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

				foreach($params['nodes'] as $node) {					
					// Skill nodes
					if ($node['type'] == 'skill') {
						DataController::getInstance()->getCPT('skill')->update_skill_graph_data($node);
					}

					// Upgrade nodes
					else if ($node['type'] == 'upgrade') {
						DataController::getInstance()->getCPT('skill')->update_upgrade_graph_data($node);
					}

					// Energy nodes
					else if ($node['type'] == 'perk' || $node['type'] == 'energy') {
						DataController::getInstance()->getCPT('energy-node')->update_graph_data($node);
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
		}
	}
}
