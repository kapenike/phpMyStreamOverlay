<?php

class overlay {
	
	function getRegistry($project_uid) {
		return json_decode(file_get_contents(getBasePath().'/data/'.$project_uid.'/overlay_registry.json'));
	}
	
	function saveRegistry($project_uid, $data) {
		file_put_contents(getBasePath().'/data/'.$project_uid.'/overlay_registry.json', json_encode($data));
	}
	
	function export($post, $project_uid) {
		foreach ($post['changed'] as $slug) {
			// file_get_contents auto converts base64 png to image, write to overlay_output/project_uid/slug path
			file_put_contents(getBasePath().'/overlay_output/'.$project_uid.'/'.$slug.'.png', file_get_contents($post[$slug]));
		}
		app('respond')->json(true, 'Overlay export successful.');
	}
	
	function getAll($project_uid) {
		
		// return all overlays as master object
		$registry = $this->getRegistry($project_uid);
		
		$overlay_object = (object)[];
		
		foreach ($registry as $entry) {
			$overlay_object->{$entry} = json_decode(file_get_contents(getBasePath().'/data/'.$project_uid.'/overlays/'.$entry.'.json'));
		}
		
		return $overlay_object;
	}
	
	function createUpdate($post) {
		
		$project_uid = $_POST['project_id'];
		
		if ($_POST['overlay_registration_type'] == 'create') {
			
			// add slug to registry
			$registry = $this->getRegistry($project_uid);
			$registry[] = $post['overlay_slug'];
			$this->saveRegistry($project_uid, $registry);
			
			$overlay = (object)[
				'title' => $post['overlay_name'],
				'slug' => $post['overlay_slug'],
				'dimensions' => [
					'width' => 1920,
					'height' => 1080
				],
				'layers' => []
			];
			
			// create new overlay file
			file_put_contents(getBasePath().'/data/'.$project_uid.'/overlays/'.$post['overlay_slug'].'.json', json_encode($overlay));
			
			// return current data object
			app('respond')->json(true, $overlay);
			
		} else {
			
			$overlay = json_decode(file_get_contents(getBasePath().'/data/'.$project_uid.'/overlays/'.$post['overlay_registration_type'].'.json'));
			$overlay->title = $post['overlay_name'];
			$overlay->slug = $post['overlay_slug'];
			
			// slug change, change file name and update registry
			if ($post['overlay_registration_type'] != $post['overlay_slug']) {
				$registry = $this->getRegistry($project_uid);
				for ($i=0; $i<count($registry); $i++) {
					if ($registry[$i] == $post['overlay_registration_type']) {
						$registry[$i] = $post['overlay_slug'];
						break;
					}
				}
				$this->saveRegistry($project_uid, $registry);
				
				// rename overlay file
				rename(getBasePath().'/data/'.$project_uid.'/overlays/'.$post['overlay_registration_type'].'.json', getBasePath().'/data/'.$project_uid.'/overlays/'.$post['overlay_slug'].'.json');
			}
			
			// return current data object
			app('respond')->json(true, $overlay);
		}
		
	}
	
	function updateLayers($post) {
		file_put_contents(getBasePath().'/data/'.$post['uid'].'/overlays/'.$post['slug'].'.json', $post['overlay']);
		app('respond')->json(true, 'Overlay layers updated successfully.');
	}
	
	function remove($project_uid, $slug) {
		unlink(getBasePath().'/data/'.$project_uid.'/overlays/'.$slug.'.json');
		if (file_exists(getBasePath().'/overlay_output/'.$project_uid.'/'.$slug.'.png')) {
			unlink(getBasePath().'/overlay_output/'.$project_uid.'/'.$slug.'.png');
		}
		$registry = $this->getRegistry($project_uid);
		for ($i=0; $i<count($registry); $i++) {
			if ($registry[$i] == $slug) {
				array_splice($registry, $i, 1);
				break;
			}
		}
		$this->saveRegistry($project_uid, $registry);
	}
	
}

?>